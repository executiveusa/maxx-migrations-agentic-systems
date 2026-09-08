import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/data/supabase-client";
import { TwilioProvider } from "@/lib/integrations/telephony/twilio-provider";
import { readTwilioForm, validateTwilioWebhook } from "@/lib/integrations/telephony/twilio-webhook";
import { findContactByPhone, recordProviderEvent, resolveTenantByPhoneNumber, stableCorrelationKey } from "@/lib/revenue-capture/runtime";
const MISSED = new Set(["no-answer","busy","failed"]);
function renderTemplate(body:string,values:Record<string,string>){return body.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(_match,key:string)=>values[key]??"");}
export async function POST(request:NextRequest){
  const params=await readTwilioForm(request);
  if(!validateTwilioWebhook(request,params).valid)return NextResponse.json({error:"Invalid Twilio webhook signature."},{status:403});
  const callStatus=String(params.get("CallStatus")??"");const callSid=String(params.get("CallSid")??"");const from=String(params.get("From")??"");const to=String(params.get("To")??"");const duration=Number(params.get("CallDuration")??0);const recordingUrl=String(params.get("RecordingUrl")??"")||null;
  if(!callSid||!from||!to)return NextResponse.json({error:"Missing required Twilio call fields."},{status:400});
  const tenant=await resolveTenantByPhoneNumber(to);
  if(!tenant)return NextResponse.json({error:"Destination number is not bound to a MAXX tenant."},{status:404});
  const supabase=getSupabaseClient();const contact=await findContactByPhone(tenant.organizationId,from);
  const isMissed=MISSED.has(callStatus);const occurredAt=new Date().toISOString();
  const {data:callEvent,error:callError}=await supabase.from("maxx_call_events").upsert({organization_id:tenant.organizationId,from_number:from,to_number:to,direction:"inbound",status:isMissed?"missed":recordingUrl?"voicemail":"completed",duration_seconds:Number.isFinite(duration)?duration:0,occurred_at:occurredAt,provider:"twilio",provider_call_id:callSid,recording_url:recordingUrl,updated_at:occurredAt},{onConflict:"provider,provider_call_id"}).select("id").single();
  if(callError)throw new Error(`Could not persist call event: ${callError.message}`);
  const providerEvent=await recordProviderEvent({organizationId:tenant.organizationId,provider:"twilio",providerEventId:`${callSid}:status:${callStatus||"unknown"}`,eventType:isMissed?"call.missed":"call.status",direction:"inbound",contactId:contact?.id??null,connectionId:tenant.connectionId,correlationKey:stableCorrelationKey([tenant.organizationId,callSid]),payload:{from,to,callStatus,duration,hasRecording:Boolean(recordingUrl)},evidence:{provider:"twilio",callSid,signatureValidated:true},evidenceState:"VERIFIED",processingStatus:"processed"});
  if(!isMissed)return NextResponse.json({recorded:true,missed:false,providerEventId:providerEvent.id});
  const [{data:phone,error:phoneError},{data:rule,error:ruleError},{data:optOut,error:optOutError}]=await Promise.all([
    supabase.from("maxx_phone_numbers").select("mctb_enabled").eq("organization_id",tenant.organizationId).eq("number",to).maybeSingle(),
    supabase.from("maxx_mctb_rules").select("id,template_id,active").eq("organization_id",tenant.organizationId).eq("active",true).limit(1).maybeSingle(),
    supabase.from("maxx_sms_opt_outs").select("id").eq("organization_id",tenant.organizationId).eq("phone_number",from).maybeSingle()]);
  for(const error of [phoneError,ruleError,optOutError])if(error)throw new Error(`Recovery configuration unavailable: ${error.message}`);
  let textBackStatus="not_configured";let textBackSent=false;let claimId:string|null=null;
  if(optOut)textBackStatus="opted_out";
  else if(phone?.mctb_enabled&&rule?.active&&rule.template_id&&tenant.connectionId){
    const {data:template,error:templateError}=await supabase.from("maxx_sms_templates").select("body,active").eq("organization_id",tenant.organizationId).eq("id",rule.template_id).eq("active",true).maybeSingle();
    if(templateError)throw new Error(`Recovery template unavailable: ${templateError.message}`);
    if(template?.body){
      const body=renderTemplate(template.body,{organization_name:tenant.organizationName,first_name:contact?.first_name??"there"});
      const messageHash=createHash("sha256").update(body).digest("hex");
      const {data:claim,error:claimError}=await supabase.rpc("maxx_revenue_claim_missed_call_recovery",{p_organization_id:tenant.organizationId,p_call_sid:callSid,p_from:from,p_to:to,p_message_hash:messageHash});
      if(claimError)throw new Error(`Recovery claim failed: ${claimError.message}`);
      if(!claim?.claim_id)throw new Error("Recovery claim returned incomplete proof");
      claimId=claim.claim_id;
      if(!claim.claimed){textBackStatus=claim.status==="sent"?"sent":"unknown";}
      else{
        let outcome:{success:boolean;status:string;message:string;providerMessageId?:string};
        try{outcome=await new TwilioProvider().sendSms({toNumber:from,fromNumber:to,body});}
        catch(error){outcome={success:false,status:"unknown",message:error instanceof Error?error.message:"Provider outcome unknown"};}
        textBackSent=outcome.success;textBackStatus=outcome.success?"sent":outcome.status==="failed"?"failed":"unknown";
        const {error:finishError}=await supabase.from("maxx_missed_call_recovery_claims").update({status:textBackStatus,provider_message_id:outcome.providerMessageId??null,error_message:outcome.success?null:outcome.message,updated_at:new Date().toISOString()}).eq("id",claimId).eq("organization_id",tenant.organizationId).eq("status","reserved");
        if(finishError)throw new Error(`Recovery receipt failed: ${finishError.message}`);
        const {data:smsRow,error:smsError}=await supabase.from("maxx_sms_messages").insert({organization_id:tenant.organizationId,to_number:from,from_number:to,body,status:outcome.success?"sent":"failed",direction:"outbound",provider:"twilio",provider_message_id:outcome.providerMessageId??null}).select("id").single();
        if(smsError)throw new Error(`SMS receipt failed: ${smsError.message}`);
        await recordProviderEvent({organizationId:tenant.organizationId,provider:"twilio",providerEventId:outcome.providerMessageId??`textback:${callSid}`,eventType:outcome.success?"sms.sent":"sms.send_failed",direction:"outbound",contactId:contact?.id??null,connectionId:tenant.connectionId,correlationKey:stableCorrelationKey([tenant.organizationId,callSid]),payload:{from:to,to:from,smsMessageId:smsRow.id},evidence:{provider:"twilio",providerMessageId:outcome.providerMessageId??null,triggeredByCallSid:callSid},evidenceState:outcome.providerMessageId?"VERIFIED":"UNKNOWN",processingStatus:outcome.success?"processed":"needs_human",errorMessage:outcome.success?null:outcome.message});
      }
    }
  }
  const {data:missed,error:missedError}=await supabase.from("maxx_missed_call_events").upsert({organization_id:tenant.organizationId,call_event_id:callEvent.id,contact_id:contact?.id??null,from_number:from,text_back_sent:textBackSent,text_back_status:textBackStatus,occurred_at:occurredAt},{onConflict:"call_event_id"}).select("id").single();
  if(missedError)throw new Error(`Could not persist missed call: ${missedError.message}`);
  return NextResponse.json({recorded:true,missed:true,missedCallEventId:missed.id,textBackSent,textBackStatus,claimId,providerEventId:providerEvent.id});
}
