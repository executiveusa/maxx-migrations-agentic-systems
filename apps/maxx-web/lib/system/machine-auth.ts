import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

function safeMatches(candidate: string | null, expected: string | undefined) {
  if (!candidate || !expected) return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isFederationMachineAuthorized(request: NextRequest) {
  return safeMatches(request.headers.get("x-maxx-migrations-api-key"), process.env.MAXX_MIGRATIONS_API_KEY);
}
