import { NextRequest, NextResponse } from "next/server";
import { isIntegrationConfigured } from "@/lib/data/mode";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectUrl = new URL("/app/settings/integrations", request.url);

  if (!code) {
    redirectUrl.searchParams.set("oauth_status", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  if (!isIntegrationConfigured("META_APP_ID") || !isIntegrationConfigured("META_APP_SECRET")) {
    redirectUrl.searchParams.set("oauth_status", "setup_required");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", process.env.META_APP_ID ?? "");
    tokenUrl.searchParams.set("client_secret", process.env.META_APP_SECRET ?? "");
    tokenUrl.searchParams.set("redirect_uri", `${url.origin}/api/social/oauth/callback`);
    tokenUrl.searchParams.set("code", code);

    const response = await fetch(tokenUrl.toString());
    if (!response.ok) {
      redirectUrl.searchParams.set("oauth_status", "error");
      return NextResponse.redirect(redirectUrl);
    }

    redirectUrl.searchParams.set("oauth_status", "connected");
    return NextResponse.redirect(redirectUrl);
  } catch {
    redirectUrl.searchParams.set("oauth_status", "error");
    return NextResponse.redirect(redirectUrl);
  }
}
