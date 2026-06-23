import Container from "@/components/shared/Container";
import Image from "next/image";

const services = [
  {
    icon: "/ai-intelligence.svg",
    title: "Precision Through AI Intelligence.",
    description:
      "Navigate Saudi Arabia's evolution with AI-driven insights. We transform market data into foresight, ensuring every investment is backed by mathematical certainty.",
  },
  {
    icon: "/transparancy.svg",
    title: "Uncompromising Transparency",
    description:
      "We replace speculation with verification. By syncing directly with the Kingdom’s legal registries, Sakk guarantees that every asset is authenticated at the source.",
  },
  {
    icon: "/digital-seal.svg",
    title: 'The "Digital Seal"',
    description:
      "Verify. Seal. Secure. Our digital infrastructure employs legal-grade authentication and advanced protocols to lock your interests, safeguarding every step of your journey to ownership.",
  },
];

export default function Services() {
  return (
    <div className="py-4 md:py-8 lg:py-12 bg-neutral-800 mt-8 lg:mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
        {services.map((service, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-2 max-w-sm mx-auto"
            >
              {/* Icon Circle */}
              <div className="w-20 h-20 bg-linear-to-b from-green-400 to-green-800 rounded-full flex items-center justify-center shadow-lg">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={40}
                  height={40}
                />
              </div>

              {/* Title */}
              <h3 className="text-white text-lg md:text-xl font-medium leading-relaxed">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
