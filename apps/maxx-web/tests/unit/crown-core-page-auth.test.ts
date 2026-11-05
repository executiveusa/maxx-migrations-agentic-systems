import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  notFound: vi.fn((): never => { throw new Error("NEXT_NOT_FOUND"); })
}));
vi.mock("@/lib/auth/supabase-auth", () => ({ getSupabaseAuth: mocks.session }));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/components/ui/PageHeader", () => ({ PageHeader: () => null }));
vi.mock("@/components/crown-core/CrownOfferConsole", () => ({ CrownOfferConsole: () => null }));
import CrownAndCoreInternalPage from "@/app/app/crown-core/page";

function database(options: {user?:string|null; tenant?:string|null; member?:boolean}) {
  return {
    auth: { getUser: vi.fn(async () => ({
      data:{user: options.user?{id:options.user}:null},error:null
    })) },
    from: vi.fn((table:string) => {
      const q = {
        select: () => q,
        eq: () => q,
        maybeSingle: async () =>
          table==="maxx_icm_tenants" ? {data:options.tenant?{id:options.tenant}:null,error:null}
          : {data:options.member?{user_id:options.user}:null,error:null}
      };
      return q;
    })
  };
}

describe("Crown & Core internal page access",()=>{
  beforeEach(()=>{
    mocks.session.mockReset();
    mocks.notFound.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL="https://test.example.com";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY="test-anon-key";
  });
  it("denies missing Supabase configuration without trying a database",async()=>{
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    await expect(CrownAndCoreInternalPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it("denies anonymous browser session",async()=>{
    mocks.session.mockResolvedValue(database({user:null}));
    await expect(CrownAndCoreInternalPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
  it("denies a valid user with no Crown tenant",async()=>{
    mocks.session.mockResolvedValue(database({user:"foreign",tenant:null}));
    await expect(CrownAndCoreInternalPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
  it("denies user without verified Crown membership",async()=>{
    mocks.session.mockResolvedValue(database({user:"foreign",tenant:"crown",member:false}));
    await expect(CrownAndCoreInternalPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
  it("allows only a session user with verified tenant membership",async()=>{
    mocks.session.mockResolvedValue(database({user:"authorized-user",tenant:"crown",member:true}));
    const element=await CrownAndCoreInternalPage();
    expect(element).toBeTruthy();
    expect(mocks.notFound).not.toHaveBeenCalled();
  });
  it("fails closed on unavailable auth provider",async()=>{
    mocks.session.mockRejectedValue(new Error("provider offline"));
    await expect(CrownAndCoreInternalPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
