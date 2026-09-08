import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { verifyStripeWebhook } from "@/lib/integrations/stripe-webhook";
import { recordProviderEvent, recordValueLedgerEntry, resolveTenantByProviderAccount, stableCorrelationKey } from "@/lib/revenue-capture/runtime";
import { resolveStripeTenant, stripeEconomicEntry } from "@/lib/revenue-capture/stripe-evidence";
type StripeObject = { id?:string; amount?:number; amount_received?:number; amount_total?:number; currency?:string; status?:string; customer_email?:string; receipt_email?:string; client_reference_id?:string; metadata?:Record<string,string> };
type StripeEvent = { id:string; type:string; account?:string; created?:number; data?:{object?:StripeObject} };
export async function POST(request:NextRequest){
  const rawBody=await request.text();
  if(!verifyStripeWebhook(rawBody,request.headers.get("stripe-signature")).valid)return NextResponse.json({error:"Invalid Stripe webhook signature."},{status:403});
  let event:StripeEvent;
  try{event=JSON.parse(rawBody) as StripeEvent;}catch{return NextResponse.json({error:"Invalid Stripe event JSON."},{status:400});}
  if(!event.id||!event.type)return NextResponse.json({error:"Missing Stripe event identity."},{status:400});
  const object=event.data?.object??{};
  try{
    // Connect events bind to their signed account. Direct webhooks require an explicit
    // deployment account binding. Untrusted metadata never selects a tenant.
    const accountId=event.account??process.env.MAXX_STRIPE_ACCOUNT_ID??null;
    const tenant=await resolveStripeTenant(accountId,object.metadata?.maxx_organization_id??null,(id)=>resolveTenantByProviderAccount("stripe",id));
    if(!tenant)return NextResponse.json({error:"Stripe account is not bound to a connected MAXX tenant."},{status:404});
    const economic=stripeEconomicEntry(event.type,object);
    const supabase=getSupabaseClient();
    let opportunityId:string|null=null;
    const requestedOpportunity=object.metadata?.maxx_opportunity_id;
    if(requestedOpportunity){
      const {data,error}=await supabase.from("maxx_opportunities").select("id").eq("organization_id",tenant.organizationId).eq("id",requestedOpportunity).maybeSingle();
      if(error)throw new Error(error.message);
      opportunityId=data?.id??null;
    }
    let contactId:string|null=null;
    const email=object.customer_email??object.receipt_email??null;
    if(email){const {data,error}=await supabase.from("maxx_contacts").select("id").eq("organization_id",tenant.organizationId).ilike("email",email).limit(1).maybeSingle();if(error)throw new Error(error.message);contactId=data?.id??null;}
    const occurredAt=event.created?new Date(event.created*1000).toISOString():new Date().toISOString();
    const providerEvent=await recordProviderEvent({organizationId:tenant.organizationId,provider:"stripe",providerEventId:event.id,eventType:event.type,direction:"inbound",contactId,opportunityId,connectionId:tenant.connectionId,correlationKey:stableCorrelationKey([tenant.organizationId,opportunityId,object.id??event.id]),occurredAt,payload:{objectId:object.id??null,amountCents:economic?.amountCents??null,currency:object.currency??null,hasCustomerEmail:Boolean(email)},evidence:{provider:"stripe",stripeEventId:event.id,stripeObjectId:object.id??null,signatureValidated:true},evidenceState:"VERIFIED",processingStatus:"processed"});
    if(economic){await recordValueLedgerEntry({organizationId:tenant.organizationId,contactId,opportunityId,providerEventId:providerEvent.id,entryType:economic.entryType,amountCents:economic.amountCents,currency:economic.currency,confidence:"VERIFIED",sourceProvider:"stripe",sourceRef:economic.sourceRef,attributionModel:opportunityId?"explicit_opportunity_metadata":"provider_payment_only",attributionReason:opportunityId?"The signed provider event references an opportunity belonging to this tenant.":"Provider economic evidence is verified; opportunity-level attribution is not established.",evidence:{stripeEventId:event.id,stripeObjectId:economic.sourceRef,signatureValidated:true},occurredAt});}
    return NextResponse.json({received:true,providerEventId:providerEvent.id});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Stripe evidence processing failed."},{status:500});}
}
