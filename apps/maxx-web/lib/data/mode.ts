export function isSeedMode(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_CONFIGURED !== "true";
}

export function isIntegrationConfigured(envVar: string): boolean {
  const value = process.env[envVar];
  return typeof value === "string" && value.trim().length > 0;
}

export function mockIntegrationsEnabled(): boolean {
  return process.env.MOCK_INTEGRATIONS !== "false";
}
