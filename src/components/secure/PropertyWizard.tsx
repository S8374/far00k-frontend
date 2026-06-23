"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import Step1PropertyType from "./Step1PropertyType";
import Step2TargetDistrict from "./Step2TargetDistrict";
import Step3InvestmentRange from "./Step3InvestmentRange";
import Step4ContactInfo from "./Step4ContactInfo";
import Step5Timeline from "./Step5Timeline";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const TOTAL_STEPS = 5;

interface WizardState {
  propertyType: string;
  district: string;
  nearbyToggle: boolean;
  rangeValue: number;
  funding: string;
  name: string;
  mobile: string;
  email: string;
  timeline: string;
}

export default function PropertyWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({
    propertyType: "residential",
    district: "Al-Malqa",
    nearbyToggle: false,
    rangeValue: 5000000,
    funding: "Cash",
    name: "",
    mobile: "",
    email: "",
    timeline: "asap",
  });

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));
const router = useRouter();
  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else {
      // Final submit
      console.log("Wizard complete:", state);
      toast.success("Submitted! Check console for data.");
      router.push("/");
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !state.propertyType) return true;
    if (step === 2 && !state.district) return true;
    if (step === 3 && !state.funding) return true;
    if (step === 4 && (!state.name || !state.mobile || !state.email)) return true;
    if (step === 5 && !state.timeline) return true;
    return false;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 30% 30%, #0d2b1a 0%, #0a1a0f 40%, #060d0a 100%)",
      }}
    >
      {/* Outer card */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Progress */}
        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        {/* Main card */}
        <div
          className="relative rounded-2xl border border-white/8 p-8 flex flex-col gap-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Step content */}
          <div className="min-h-55 flex flex-col justify-center">
            {step === 1 && (
              <Step1PropertyType
                selected={state.propertyType}
                onSelect={(v) => update("propertyType", v)}
              />
            )}
            {step === 2 && (
              <Step2TargetDistrict
                district={state.district}
                onDistrictChange={(v) => update("district", v)}
                nearbyToggle={state.nearbyToggle}
                onNearbyToggle={(v) => update("nearbyToggle", v)}
              />
            )}
            {step === 3 && (
              <Step3InvestmentRange
                rangeValue={state.rangeValue}
                onRangeChange={(v) => update("rangeValue", v)}
                funding={state.funding}
                onFundingChange={(v) => update("funding", v)}
              />
            )}
            {step === 4 && (
              <Step4ContactInfo
                name={state.name}
                mobile={state.mobile}
                email={state.email}
                onChange={(field, value) => update(field, value)}
                onSecure={handleNext}
              />
            )}
            {step === 5 && (
              <Step5Timeline
                selected={state.timeline}
                onSelect={(v) => update("timeline", v)}
              />
            )}
          </div>

          {/* Next Step button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`
                px-12 py-3.5 rounded-full font-semibold text-base transition-all duration-200
                ${
                  isNextDisabled()
                    ? "bg-green-700/40 text-white/40 cursor-not-allowed"
                    : "bg-linear-to-r from-green-500 to-green-400 text-white shadow-[0_4px_24px_rgba(34,197,94,0.4)] hover:shadow-[0_4px_32px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95"
                }
              `}
            >
              {step === TOTAL_STEPS ? "Finish" : "Next Step"}
            </button>
            <span className="text-white/30 text-xs">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-green-400/70 text-sm tracking-widest font-light">
          Cyber-Riyadh
        </p>
      </div>
    </div>
  );
}
