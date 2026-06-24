"use client";

import Image from "next/image";
import Container from "@/components/shared/Container";
import { Target, ShieldCheck } from "lucide-react";

export default function AboutUs() {
    return (
        <section id="about-us" className="py-24 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/20  blur-[120px] pointer-events-none" />

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left Side: Text & Cards */}
                    <div className="flex-1 space-y-10">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                Pioneering the Digital Standard of <span className="text-emerald-500">Saudi Real Estate</span>
                            </h2>
                            <p className="text-lg text-stone-400 leading-relaxed">
                                Diyar Estate merges cutting-edge technology with luxury property investments to bring you unparalleled security, transparency, and high-yield returns in the heart of Saudi Arabia.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors">
                                <Target className="w-10 h-10 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
                                <p className="text-stone-400 leading-relaxed text-sm">
                                    To digitize and secure the market leveraging blockchain technology, ensuring every transaction is immutable and completely secure.
                                </p>
                            </div>
                            
                            <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors">
                                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-bold mb-3 text-white">Why Choose Us?</h3>
                                <p className="text-stone-400 leading-relaxed text-sm">
                                    We are REGA-certified and partnered with the most trusted developers, guiding you through a seamless digital investment journey.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Side: Image */}
                    <div className="flex-1 w-full">
                        <div className="relative w-full h-[500px] lg:h-[650px] rounded overflow-hidden shadow-2xl border border-stone-800/50 group">
                            <Image
                                src="/hero-riyadh-day.png"
                                alt="About Diyar Estate"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
