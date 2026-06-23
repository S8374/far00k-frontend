import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import Image from "next/image";
import { PiSealCheckLight } from "react-icons/pi";

export default function VerifyHero() {
    const steps = [
        {
            icon: ShieldCheck,
            title: "Verified",
            description: "Title Deed Verification",
        },
        {
            icon: PiSealCheckLight,
            title: "Sealed",
            description: "Immutable Transaction Log",
        },
        {
            icon: Lock,
            title: "Secured",
            description: "Secure your future",
        },
    ];

    return (
        <section className="relative">
            <div className="relative w-full h-screen">
                <Image
                    src="/trust-banner.png"
                    alt="Saudi skyline with digital matrix overlay"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0" />
            </div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-none mb-8 md:mb-10">
                    Verified. Sealed. Secured
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-10 md:mb-16">
                    The Digital Standard of Saudi Real Estate
                </p>

                <Button
                    size="lg"
                    className="px-10 py-7 md:px-12 md:py-8 text-lg md:text-2xl font-semibold rounded-xl 
                     bg-transparent border-2 border-orange-300/70 text-emerald-200 
                     hover:bg-orange-300/10 hover:text-emerald-100 
                     hover:border-orange-300/90 transition-all duration-300"
                >
                    Explore verified properties
                </Button>
            </div>

            <div className="relative">
                <Container>
                    <div className="pt-8 md:py- lg:py-">
                        <h2 className="text-3xl md:text-4xl lg:text-2xl font-semibold text-white mb-4 md:mb-8 text-center">
                            How it works
                        </h2>

                        <div className="flex items-center justify-center gap-x-8">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="relative mb-4">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-orange-400/60 
                                  flex items-center justify-center bg-stone-900/40 backdrop-blur-sm
                                  group-hover:border-orange-400/90 transition-colors duration-300">
                                            <step.icon
                                                className="w-10 h-10 md:w-12 md:h-12 text-white"
                                                strokeWidth={2}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-base md:text-lg text-stone-300 max-w-xs">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
}