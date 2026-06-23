import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Container from "@/components/shared/Container";

export default function Subscribe() {
  return (
    <section className="py-16 md:py-16 lg:py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="bg-linear-to-b from-emerald-800 to-green-500 rounded-2xl shadow-2xl p-10 md:p-16 text-center overflow-hidden">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
              Subscribe to get the latest news and updates
            </h2>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-stone-200 mb-10 md:mb-12">
              Get latest property updates directly to your email
            </p>

            {/* Form */}
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              {/* Email Input */}
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 pl-12 pr-6 bg-transparent border border-white text-white placeholder:text-white/70 
                             text-lg rounded-md focus-visible:ring-2 focus-visible:ring-white/50 
                             focus-visible:border-white transition-all"
                  required
                />
              </div>

              {/* Subscribe Button */}
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-lg rounded-md 
                           shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}