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
                    src="/hero-doha-pano.jpg"
                    alt="Panoramic Sunset Skyline"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Light green vibe overlay (halka green vibe) */}
                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-color pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-emerald-900/10 to-transparent pointer-events-none" />
            </div>
            {/* Added drop shadow to text instead of dark overlay so the image stays 100% bright */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-none mb-8 md:mb-10">
                    Verified. Sealed. Secured
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-10 md:mb-16">
                    The Digital Standard of Saudi Real Estate
                </p>

                <Button
                    size="lg"
                    className="px-10 py-7 md:px-12 md:py-8 text-lg md:text-2xl font-bold rounded 
                     bg-emerald-600 border-none text-white 
                     hover:bg-emerald-500 transition-all duration-300"
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

                        <div className="flex flex-col md:flex-row items-center justify-center gap-y-10 md:gap-x-8">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center group"
                                >
                                    <div className="relative mb-3 md:mb-4">
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl border-4 border-orange-400/60 
                                  flex items-center justify-center bg-stone-900/40 backdrop-blur-sm
                                  group-hover:border-orange-400/90 transition-colors duration-300">
                                            <step.icon
                                                className="w-8 h-8 md:w-12 md:h-12 text-white"
                                                strokeWidth={2}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-3xl font-semibold text-white mb-2 md:mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm md:text-lg text-stone-300 max-w-xs px-4">
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