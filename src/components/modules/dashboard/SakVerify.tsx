import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleCheckBig, Shield } from "lucide-react";

function SakVerify() {
    return (<>
        {/* Sak Number + Verify */}
        <div className="space-y-2 border p-4 bg-[#3D3D3D]/60 rounded-lg">
            {/* Label with green circle checkbox */}
            <Label className="flex items-center gap-1 text-emerald-400">
                <Shield size={16} />
                Title Deed (Sak) Number
            </Label>

            {/* Description */}
            <p className="text-sm text-white/80 leading-relaxed">
                Enter the property Sak number for automatic verification with Ministry of Justice
            </p>

            {/* Input + Verify Button */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    // {...register("sakNumber")}
                    placeholder="4301234567890"
                    className="flex-1 bg-stone-900 border-stone-700 text-white placeholder:text-white/70 h-10 rounded-lg focus:ring-emerald-600 focus:border-emerald-600"
                />
                <Button
                    type="button"
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-6 h-10 rounded-lg transition-colors"
                >
                    <CircleCheckBig />
                    Verify Sak
                </Button>
            </div>
        </div>
    </>);
}

export default SakVerify;