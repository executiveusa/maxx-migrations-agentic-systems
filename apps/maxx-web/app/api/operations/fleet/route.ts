import { NextResponse } from "next/server";
import { getCurrentUser, getSupabaseAuth } from "@/lib/auth/supabase-auth";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { summarizeValueLedger, moneyByCurrency } from "@/lib/revenue-capture/value-summary";
export async function GET() {
  try {
    const user=await getCurrentUser();if(!user)return NextResponse.json({error:"Not authenticated"},{status:401});
    const auth=await getSupabaseAuth();
    const {data:operator,error:operatorError}=await auth.from("maxx_platform_operators").select("role,active").eq("user_id",user.id).maybeSingle();
    if(operatorError)throw new Error(operatorError.message);
    if(!operator?.active)return NextResponse.json({error:"Operator access required"},{status:403});
    const admin=getSupabaseClient();
    const {data:organizations,error:orgError}=await admin.from("maxx_organizations").select("id,name,slug,plan").order("name");
    if(orgError)throw new Error(orgError.message);
    const fleet=[];
    for(const org of organizations??[]){
      const {data:connections,error:connectionError}=await admin.from("maxx_integration_connections").select("provider,status,last_verified_at,last_event_at,health_message").eq("organization_id",org.id);
      if(connectionError)throw new Error(connectionError.message);
      const ledger=[];const opportunities=[];
      for(let offset=0;;offset+=500){const {data,error}=await admin.from("maxx_value_ledger_entries").select("entry_type,amount_cents,currency,confidence,source_provider,source_ref").eq("organization_id",org.id).order("id").range(offset,offset+499);if(error)throw new Error(error.message);ledger.push(...(data??[]));if(!data?.length||data.length<500)break;}
      for(let offset=0;;offset+=500){const {data,error}=await admin.from("maxx_opportunities").select("id,value_cents,currency,updated_at").eq("organization_id",org.id).order("id").range(offset,offset+499);if(error)throw new Error(error.message);opportunities.push(...(data??[]));if(!data?.length||data.length<500)break;}
      const currencies=summarizeValueLedger(ledger);
      const pipelineByCurrency=moneyByCurrency(opportunities);
      const riskCount=opportunities.filter((row)=>new Date(row.updated_at).getTime()<Date.now()-7*86400000).length;
      fleet.push({organization:org,currencies,pipelineByCurrency,opportunityCount:opportunities.length,riskCount,integrations:{total:connections?.length??0,connected:(connections??[]).filter((row)=>row.status==="connected").length,unhealthy:(connections??[]).filter((row)=>row.status==="error"||Boolean(row.health_message)).length},providers:connections??[]});
    }
    return NextResponse.json({operatorRole:operator.role,organizations:fleet});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Could not load fleet."},{status:500});}
}
