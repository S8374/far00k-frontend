import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

function SignUpServices(){
    return (
        <>
        <Card className="bg-neutral-800 border-0 p-6">
                <div className="flex gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 mt-1" />
                  <div>
                    <p className="text-white text-sm mb-2">
                      Your data is protected with:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 256-bit SSL Encryption</li>
                      <li>• REGA Authority Verification</li>
                    </ul>
                  </div>
                </div>
              </Card>
        </>
    )
}

export default SignUpServices