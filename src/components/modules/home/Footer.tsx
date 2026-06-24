// components/Footer.tsx

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Twitter, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white px-8 lg:px-10">
      <Container>
        <div className="py-16 md:py-20 lg:py-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Logo & Description + Contact Button */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/sakk.png" // public/sakk-logo.png রাখুন (আপনার লোগো)
                  alt="Sakk The Digital Seal"
                  width={60}
                  height={64}
                  className=""
                />
                <h3 className="text-xl font-bold">Sakk The Digital Seal</h3>
              </div>

              <p className="text-sm text-zinc-500">
                Smart Real Estate Investment Platform
              </p>

              <Link href={"/#contact-us"}>
                <Button
                  variant="outline"
                  className="cursor-pointer h-9 px-6 rounded-lg border-white/10 bg-stone-900 hover:bg-white/5 text-gray-300"
                >
                  Contact us
                </Button>
              </Link>
            </div>

            {/* Investment Links */}
            <div className="space-y-6">
              <h4 className="text-base font-normal text-white">Investment</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Golden Visa Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    High Yield Investments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Giga-Projects
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h4 className="text-base font-normal text-white">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/#about-us"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact-us"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-condition"
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Terms & Condition
                  </a>
                </li>
              </ul>
            </div>

            {/* Support & Social Links */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-normal text-white mb-6">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/#faq"
                      className="text-sm text-zinc-500 hover:text-white transition"
                    >
                      FAQs
                    </a>
                  </li>
                  
                </ul>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Linkedin className="w-5 h-5 text-zinc-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Twitter className="w-5 h-5 text-zinc-500" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-stone-900 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                >
                  <Instagram className="w-5 h-5 text-zinc-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Trusted By + Copyright */}
        <div className="py-4 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-zinc-500 mb-4 md:mb-0">Trusted By</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-9 px-4 bg-stone-900 rounded-lg border border-white/10 flex items-center gap-2">
                  <Image
                    className="mt-1.5"
                    src={"/verified-badge.svg"}
                    alt="rega"
                    height={25}
                    width={25}
                  />
                  <span className="text-sm text-gray-400">REGA</span>
                </div>
                {/* <Image
                                src={"/verified-badge.svg"}
                                alt="verified-badge"
                                height={60}
                                width={60}
                              /> */}
                <div className="h-9 px-4 bg-stone-900 rounded-lg border border-white/10 flex items-center gap-2">
                  <Image
                    src={"/justice.svg"}
                    alt="justice"
                    height={20}
                    width={20}
                  />
                  <span className="text-sm text-gray-400">
                    Ministry of Justice
                  </span>
                </div>
                <div className="h-9 px-4 bg-stone-900 rounded-lg border border-white/10 flex items-center gap-2">
                  <Image
                    src={"/vision.svg"}
                    alt="vision"
                    height={20}
                    width={20}
                  />
                  <span className="text-sm text-gray-400">Vision 2030</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-500 text-center md:text-right">
              © 2024 REGA Investment. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
