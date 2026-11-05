"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Draft = {
  id:string;
  kind:"audit"|"proposal";
  status:"draft"|"reviewed"|"rejected";
  payload_hash:string;
  created_at:string;
  reviewed_at?:string|null;
  artifact?: {
    summary?:string;
    sources?:Array<{id:string;url:string;provenance:string;independent_verification:boolean}>;
    findings?:Array<{id:string;observation:string;recommendation:string;priority:string;evidence_status:string;evidence_refs?:string[]}>;
    limitations?:string[];
    priority_actions?:Array<{finding_id:string;recommendation:string;evidence_status:string}>;
    title?:string;
    price?:null;
  };
  events?:Array<{event_type:string;created_at:string;review_note?:string|null}>;
};
type Summary = { drafts?:Draft[]; status?:string; code?:string };
type Process = { id?:string; code?:string; status?:string };

async function api<T>(path:string,body?:unknown):Promise<T>{
  const response = await fetch(path,{
    method:body===undefined?"GET":"POST",
    headers:body===undefined?undefined:{"content-type":"application/json"},
    body:body===undefined?undefined:JSON.stringify(body),
    credentials:"same-origin",cache:"no-store"
  });
  const result=await response.json().catch(()=>({code:"DEPENDENCY_UNAVAILABLE"}));
  if(!response.ok) throw new Error(typeof result.code==="string"?result.code:"REQUEST_FAILED");
  return result as T;
}

const inputStyle="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus-visible:outline-2";
const primaryButton="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-50";
const secondaryButton="rounded-md border border-border px-4 py-2 text-sm font-medium text-text disabled:opacity-50";

export function CrownOfferConsole(){
  const [status,setStatus]=useState<Summary|null>(null);
  const [selection,setSelection]=useState<Draft|null>(null);
  const [site,setSite]=useState("https://crownandcore.com/");
  const [observation,setObservation]=useState("");
  const [recommendation,setRecommendation]=useState("");
  const [priority,setPriority]=useState<"high"|"medium"|"low">("medium");
  const [message,setMessage]=useState("");
  const [reviewNote,setReviewNote]=useState("");
  const [busy,setBusy]=useState(false);

  const refresh=useCallback(async()=>{
    try{
      const result=await api<Summary>("/api/offers/crown-core/status");
      setStatus(result);
      setMessage("");
    }catch(error){setStatus(null);setMessage(error instanceof Error?error.message:"Unable to load drafts.");}
  },[]);
  useEffect(()=>{
    let active=true;
    void api<Summary>("/api/offers/crown-core/status")
      .then((result)=>{ if(active) setStatus(result); })
      .catch((error)=>{ if(active) setMessage(error instanceof Error?error.message:"Unable to load drafts."); });
    return ()=>{ active=false; };
  },[]);

  async function createAudit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setBusy(true);setMessage("");
    try{
      const withSource=site.trim().length>0;
      const input={
        request_id:crypto.randomUUID(),
        idempotency_key:crypto.randomUUID(),
        business_name:"Crown & Core",
        sources:withSource?[{id:"public-website",url:site.trim()}]:[],
        findings:[{observation:observation.trim(),recommendation:recommendation.trim(),priority,
          evidence_refs:withSource?["public-website"]:[]}]
      };
      const receipt=await api<Process>("/api/offers/crown-core/audits",input);
      setObservation("");setRecommendation("");
      await refresh();
      setMessage("Internal audit draft "+String(receipt.id||"")+" created. Evidence remains unverified; independent review required.");
    }catch(error){setMessage(error instanceof Error?error.message:"Could not create audit.");}
    finally{setBusy(false);}
  }

  async function selectDraft(id:string){
    setBusy(true);setMessage("");
    try{setSelection(await api<Draft>("/api/offers/crown-core/drafts/"+encodeURIComponent(id)));}
    catch(error){setMessage(error instanceof Error?error.message:"Unable to read selected draft.");}
    finally{setBusy(false);}
  }

  async function review(decision:"review"|"reject"){
    if(!selection)return;
    setBusy(true);setMessage("");
    try{
      await api<Process>("/api/offers/crown-core/review",{
        draft_id:selection.id,decision,expected_hash:selection.payload_hash,
        review_note:reviewNote.trim()
      });
      await refresh();await selectDraft(selection.id);
      setReviewNote("");
      setMessage(decision==="review"?"Internal evidence review recorded. This does NOT approve a client action or price.":"Rejected with zero external effects.");
    }catch(error){setMessage(error instanceof Error?error.message:"Review failed.");}
    finally{setBusy(false);}
  }

  async function propose(){
    if(!selection||selection.kind!=="audit"||selection.status!=="reviewed")return;
    setBusy(true);setMessage("");
    try{
      const receipt=await api<Process>("/api/offers/crown-core/proposals",{
        request_id:crypto.randomUUID(),idempotency_key:crypto.randomUUID(),source_audit_id:selection.id
      });
      await refresh();
      if(receipt.id) await selectDraft(receipt.id);
      setMessage("Unpriced proposal draft created. Owner pricing, scope and contract approval remain required.");
    }catch(error){setMessage(error instanceof Error?error.message:"Proposal could not be prepared.");}
    finally{setBusy(false);}
  }

  return <div className="space-y-6">
    <section aria-label="Commercial stages" className="grid gap-3 md:grid-cols-4">
      {[
        ["1","Vibe Audit","Internal evidence review"],
        ["2","Vibe Rescue Sprint","Requires approved scope"],
        ["3","Sovereign Launch","Requires client ownership and release"],
        ["4","MAXX Operations","Requires separate recurring approval"]
      ].map(([step,name,detail])=>
        <div key={name} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Stage {step}</p>
          <h2 className="mt-2 font-display text-xl text-text">{name}</h2>
          <p className="mt-2 text-sm text-muted">{detail}</p>
        </div>
      )}
    </section>

    <div className="rounded-lg border border-border p-4 text-sm text-muted" role="note">
      <strong className="text-text">Not client-authorized.</strong> This workspace prepares internal drafts only. Sources are caller-submitted, not independently verified. Price is unset. Clinical claims, advertising, outreach, payment and booking changes are disabled.
    </div>
    {message?<div role="status" aria-live="polite" className="rounded-lg border border-border bg-surface p-4 text-sm text-text">{message}</div>:null}

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={(event)=>void createAudit(event)} className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-2xl">Prepare an internal Vibe Audit</h2>
        <p className="text-sm text-muted">Enter one observation for reviewer consideration. The URL is a reference, not proof that a claim was verified.</p>
        <label className="block space-y-1 text-sm">
          <span>Public website reference (optional)</span>
          <input className={inputStyle} type="url" value={site} onChange={e=>setSite(e.target.value)} placeholder="https://…" maxLength={1200}/>
        </label>
        <label className="block space-y-1 text-sm">
          <span>Observation or hypothesis</span>
          <textarea className={inputStyle} required rows={3} maxLength={800} value={observation} onChange={e=>setObservation(e.target.value)} placeholder="What specifically needs to be validated?" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Recommended validation or next step</span>
          <textarea className={inputStyle} required rows={3} maxLength={800} value={recommendation} onChange={e=>setRecommendation(e.target.value)} placeholder="What measurable step could resolve it?" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Priority</span>
          <select className={inputStyle} value={priority} onChange={e=>setPriority(e.target.value as "high"|"medium"|"low")}>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </label>
        <button className={primaryButton} type="submit" disabled={busy||!observation.trim()||!recommendation.trim()}>
          {busy?"Processing…":"Create reviewable draft"}
        </button>
      </form>

      <section aria-labelledby="drafts-heading" className="space-y-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="drafts-heading" className="font-display text-2xl">Internal records</h2>
          <button type="button" onClick={()=>void refresh()} className={secondaryButton} disabled={busy}>Refresh</button>
        </div>
        {!status?<p className="text-sm text-muted">No authenticated data is available. Sign in to the approved MACS tenant to access this area.</p>:
          (status.drafts||[]).length===0?<p className="text-sm text-muted">No drafts in this tenant yet.</p>:
          <ul className="max-h-[520px] space-y-2 overflow-auto">
            {(status.drafts||[]).map(d=><li key={d.id}>
              <button type="button" onClick={()=>void selectDraft(d.id)}
                className="w-full rounded-lg border border-border bg-bg p-3 text-left text-sm hover:border-accent disabled:opacity-50"
                disabled={busy} aria-pressed={selection?.id===d.id}>
                <span className="block font-medium capitalize">{d.kind} · {d.status}</span>
                <span className="mt-1 block break-all font-mono text-xs text-muted">{d.id}</span>
                <span className="mt-1 block text-xs text-muted">{new Date(d.created_at).toLocaleString()}</span>
              </button>
            </li>)}
          </ul>}
      </section>
    </div>
    {selection?<section aria-labelledby="review-heading" className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs uppercase tracking-widest text-muted">{selection.kind} · {selection.status}</p>
          <h2 id="review-heading" className="mt-1 font-display text-2xl">Read the complete draft</h2>
          <p className="mt-2 text-xs text-muted">Immutable review digest: <code className="break-all">{selection.payload_hash}</code></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selection.status==="draft"?<>
            <button className={secondaryButton} disabled={busy||reviewNote.trim().length<25} onClick={()=>void review("reject")}>Reject draft</button>
            <button className={primaryButton} disabled={busy||reviewNote.trim().length<25} onClick={()=>void review("review")}>Record independent review</button>
          </>:null}
          {selection.kind==="audit"&&selection.status==="reviewed"?
            <button className={primaryButton} disabled={busy} onClick={()=>void propose()}>Prepare unpriced proposal</button>:null}
        </div>
      </div>
      {selection.status==="draft"?<label className="mt-4 block space-y-2 text-sm">
        <span>Reviewer rationale (required, 25–1000 characters)</span>
        <textarea className={inputStyle} maxLength={1000} rows={3}
          value={reviewNote} onChange={e=>setReviewNote(e.target.value)}
          placeholder="What evidence did you inspect, what remains unverified, and why accept or reject this draft?" />
      </label>:null}
      <p className="mt-3 text-sm text-muted">{selection.artifact?.summary||selection.artifact?.title||"Internal artifact, not client-approved"}</p>
      {(selection.artifact?.sources||[]).length>0?<div className="mt-4 rounded-md border border-border bg-bg p-4">
        <h3 className="font-medium">Evidence references — caller-submitted, not independently verified</h3>
        <ul className="mt-2 space-y-2">
          {(selection.artifact?.sources||[]).map(source=><li key={source.id} className="break-all text-sm">
            <span className="mr-2 text-muted">{source.id} · unverified</span>
            <a className="text-accent underline" target="_blank" rel="noopener noreferrer"
              href={source.url}>{source.url}</a>
          </li>)}
        </ul>
      </div>:null}
      <div className="mt-4 space-y-3">
        {(selection.artifact?.findings||[]).map(f=>
          <article key={f.id} className="rounded-md border border-border bg-bg p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{f.priority} priority · {f.evidence_status}</p>
            <h3 className="mt-2 text-base font-medium">{f.observation}</h3>
            <p className="mt-2 text-sm text-muted">Next step: {f.recommendation}</p>
            <p className="mt-2 text-xs text-muted">Source IDs: {(f.evidence_refs||[]).join(", ")||"none — hypothesis"}</p>
          </article>
        )}
        {(selection.artifact?.priority_actions||[]).map(f=>
          <article key={f.finding_id} className="rounded-md border border-border bg-bg p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{f.evidence_status}</p>
            <p className="mt-2 text-sm text-text">{f.recommendation}</p>
          </article>
        )}
      </div>
      <h3 className="mt-6 text-base font-medium">Review trail</h3>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {(selection.events||[]).map((e,i)=><li key={i}>{e.event_type} · {new Date(e.created_at).toLocaleString()}{e.review_note?<> · Rationale: {e.review_note}</>:null}</li>)}
      </ul>
      <p className="mt-4 text-xs text-muted">Internal review is not permission to publish, advertise, change bookings, enter client contracts or spend money. The database enforces independent reviewer identity.</p>
    </section>:null}
  </div>;
}
