"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/shared/Container";

export default function FAQ() {
    const faqs = [
        {
            question: "What is Diyar Estate?",
            answer: "Diyar Estate is the premium digital standard for Saudi Real Estate. We provide seamless, transparent, and secure property investments backed by blockchain and REGA certification."
        },
        {
            question: "How do I verify a property?",
            answer: "Every property listed on our platform undergoes a rigorous verification process. You can view the Title Deed Verification and Immutable Transaction Log directly on the property details page."
        },
        {
            question: "Is my investment secure?",
            answer: "Absolutely. We use industry-leading encryption and smart contracts to ensure your transactions are 100% secure, immutable, and fully compliant with Saudi laws."
        },
        {
            question: "Can international investors buy property here?",
            answer: "Yes, subject to local regulations and the specific type of property. Our expert agents will guide you through the legal requirements for international investors."
        },
        {
            question: "How do I contact an agent?",
            answer: "You can reach out to our REGA-certified agents directly through the Contact Us section below, or by clicking 'Inquire' on any specific property listing."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-stone-950 text-white relative">
            <div className="absolute inset-0 bg-stone-950/80 pointer-events-none" />
            
            <Container className="relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto">Everything you need to know about investing with Diyar Estate.</p>
                </div>

                <div className=" mx-auto bg-stone-900/40 border border-stone-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b-stone-800/50 last:border-0">
                                <AccordionTrigger className="text-left text-lg md:text-xl font-semibold hover:text-emerald-400 py-6 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-400 text-base md:text-lg leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Container>
        </section>
    );
}
