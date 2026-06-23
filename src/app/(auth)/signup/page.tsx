"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";
import SignupBanner from "@/components/modules/auth/signup/SignupBanner";
import SignupHeader from "@/components/modules/auth/signup/SignupHeader";
import BuyerSignup from "@/components/modules/auth/signup/BuyerSignup";
import AgentSignup from "@/components/modules/auth/signup/AgentSignup";
import SignupDivider from "@/components/modules/auth/signup/SignupDivider";
import SignupFooter from "@/components/modules/auth/signup/SignupFooter";
import Link from "next/link";

function SignupPage() {
  const [role, setRole] = useState<"buyer" | "agent">("agent");
  return (
    <div  className="container mx-auto min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 p-4">
        <SignupBanner />
        <div className="col-span-1 border p-4 rounded-2xl overflow-y-auto max-h-[96vh] pr-2 scrollbar-hide">
          <div>
            <SignupHeader />
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v as "buyer" | "agent")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-neutral-800 h-14 rounded-xl p-1">
                <TabsTrigger
                  value="buyer"
                  className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                >
                  Investor/Buyer
                </TabsTrigger>
                <TabsTrigger
                  value="agent"
                  className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white rounded-lg"
                >
                  Licensed Agent
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {role === "agent" && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-400/90">
                <ShieldCheck className="h-4 w-4" />
                <span>REGA verification required for licensed agents</span>
              </div>
            )}
            <div className="mt-4">
              {role === "buyer" ? <BuyerSignup /> : <AgentSignup />}
            </div>
          </div>
          {/* Login Option */}
          <p className="text-center mt-4 text-sm text-gray-400">
            Already Account?{" "}
            <Link href={"/login"} className="text-emerald-400 hover:underline">
              Login
            </Link>
          </p>
          <div>
            <SignupDivider />
            <SignupFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignupPage;
