import test from "node:test";
import assert from "node:assert/strict";
import { syncCrownProject } from "../../../../ops/paperclip/bootstrap.mjs";
import { TASKS } from "../../../../ops/paperclip/crown-core-plan.mjs";

test("bootstrap defaults to no-write preview and reports 12 work packages", async () => {
  const p=await syncCrownProject();
  assert.equal(p.status,"DRY_RUN");
  assert.equal(p.task_count,12);
  assert.equal(p.heartbeat_activation_proven,false);
});

test("bootstrap rejects insecure and missing authenticated endpoints", async () => {
  await assert.rejects(()=>syncCrownProject({apply:true,apiUrl:"http://example.com/",apiKey:"x",companyId:"macs",managerId:"instinct"}),/HTTPS/);
  await assert.rejects(()=>syncCrownProject({apply:true,apiUrl:"https://example.com/"}),/required/);
});

test("bootstrap creates a project and issues once, then reuses them", async () => {
  const projects=[]; const issues=[];let next=0;
  const response=(status,obj)=>new Response(JSON.stringify(obj),{status,headers:{"content-type":"application/json"}});
  const fetchImpl=async(url,init)=>{
    const u=new URL(url);const path=u.pathname;
    assert.equal(init.headers.authorization,"Bearer scoped-board-token");
    if(path==="/api/cli-auth/me")return response(200,{id:"board1",user:{id:"board1"}});
    if(path==="/api/companies/macs")return response(200,{id:"macs",name:"MACS"});
    if(path==="/api/agents/instinct")return response(200,{id:"instinct",companyId:"macs",status:"idle"});
    if(path==="/api/companies/macs/projects"){
      if(init.method==="GET")return response(200,projects);
      const data=JSON.parse(init.body);const p={...data,id:"project1"};projects.push(p);return response(201,p);
    }
    if(path==="/api/companies/macs/issues"){
      if(init.method==="GET") return response(200,issues.filter(x=>x.projectId===u.searchParams.get("projectId")));
      const data=JSON.parse(init.body);const i={...data,id:"issue"+(++next)};
      issues.push(i);return response(201,i);
    }
    throw Error("Unexpected API " + url);
  };
  const input={apply:true,apiUrl:"https://paperclip.example/",apiKey:"scoped-board-token",companyId:"macs",managerId:"instinct",fetchImpl};
  const first=await syncCrownProject(input);
  assert.equal(first.status,"PAPERCLIP_TASKS_CREATED_OR_REUSED");
  assert.equal(first.issues_created,TASKS.length+1);
  assert.equal(projects.length,1);
  assert.equal(issues.length,TASKS.length+1);
  const second=await syncCrownProject(input);
  assert.equal(second.issues_created,0);
  assert.equal(projects.length,1);
  assert.equal(issues.length,TASKS.length+1);
  assert.equal(second.live_timed_worker_proof,false);
});

test("bootstrap rejects wrong-company Instinct identity before creating anything",async()=>{
  let touched=false;
  const fetchImpl=async(url)=>{
    const path=new URL(url).pathname;
    if(path.startsWith("/api/companies/macs/projects"))touched=true;
    const result=path==="/api/companies/macs"?{id:"macs"}:path==="/api/agents/instinct"?{id:"instinct",companyId:"other"}:{id:"board"};
    return new Response(JSON.stringify(result),{status:200});
  };
  await assert.rejects(()=>syncCrownProject({apply:true,apiUrl:"https://paperclip.example/",apiKey:"board",companyId:"macs",managerId:"instinct",fetchImpl}),/not an active agent/);
  assert.equal(touched,false);
});

test("bootstrap refuses duplicate project markers",async()=>{
  const response=(v)=>new Response(JSON.stringify(v),{status:200});
  const fetchImpl=async(url)=>{
    const path=new URL(url).pathname;
    if(path==="/api/companies/macs/projects")return response([
      {id:"a",description:"[project_id:maxx:crown-and-core:paperclip-offer]"},
      {id:"b",description:"[project_id:maxx:crown-and-core:paperclip-offer]"}
    ]);
    if(path==="/api/companies/macs")return response({id:"macs"});
    if(path==="/api/agents/instinct")return response({id:"instinct",companyId:"macs",status:"idle"});
    return response({id:"board"});
  };
  await assert.rejects(()=>syncCrownProject({apply:true,apiUrl:"https://paperclip.example/",apiKey:"board",companyId:"macs",managerId:"instinct",fetchImpl}),/Duplicate Crown project/);
});
