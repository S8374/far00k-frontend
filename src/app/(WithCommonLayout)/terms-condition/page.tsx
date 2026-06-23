"use client";

import Footer from "@/components/modules/home/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing" },
  { id: "data-security", title: "Data Security" },
  { id: "document-retention", title: "Document Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <div className="text-white bg-background mt-8">
      <div className="max-w-7xl mx-auto">
        {/* মেইন হেডিং */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sakk – The Digital Seal
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-300">
            Privacy Policy
          </p>
        </div>

        {/* ইন্ট্রো */}
        <div className="prose prose-invert max-w-none mb-10">
          <p className="text-lg text-gray-300 leading-relaxed px-2 md:px-20">
            At Sakk, we are committed to protecting the privacy of investors and
            agents. This Privacy Policy outlines how we handle your information
            in compliance with Saudi Arabian Real Estate General Authority
            (REGA) laws and international data protection standards.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Sidebar - Table of Contents */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8">
              <Card className="bg-[#181316]">
                {/* <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Contents
                  </CardTitle>
                </CardHeader> */}
                <CardContent>
                  <nav className="flex flex-col space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={cn(
                          "px-4 py-2 rounded-md text-gray-300 hover:bg-emerald-800 hover:text-white transition-colors",
                          "text-sm font-medium",
                        )}
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-10">
            {/* Overview */}
            <section id="overview">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <p>
                    Welcome to{" "}
                    <strong className="text-emerald-400">
                      Sakk The Digital Seal
                    </strong>
                    . Your privacy is important to us, and we are committed to
                    protecting the personal information you share with us. This
                    Privacy Policy explains how we collect, use, and safeguard
                    your information when you visit our website or use our
                    services.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 marker:text-emerald-400">
                    <li>
                      <strong>Identity Information:</strong> Full name, National
                      ID (Iqama), Passport details for Nafath verification.
                    </li>
                    <li>
                      <strong>Financial Data:</strong> Your target districts
                      (e.g., Riyadh, Makkah), property preferences, and purchase
                      timeline.
                    </li>
                    <li>
                      <strong>Investment Intent Professional Data:</strong> For
                      agents, we collect Licenses and KYC (Know Your Business)
                      documentation.
                    </li>
                    <li>
                      <strong>Security Details:</strong> The measures taken to
                      protect user information from breaches or unauthorized
                      access.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <ul className="list-disc pl-6 space-y-2 marker:text-emerald-400">
                    <li>
                      <strong>Match Making:</strong> Align your profile with the
                      top REGA-licensed agents for your chosen properties.
                    </li>
                    <li>
                      <strong>Legal Verification:</strong> Cross-check your
                      eligibility for Foreign Ownership and verify REGA progress
                      via API.
                    </li>
                    <li>
                      <strong>Market Intelligence:</strong> Generate anonymous
                      Market Sentiment Graphs to help agents understand
                      district-wise buyer trends.
                    </li>
                    <li>
                      <strong>Priority Tagging:</strong> Identify “ASAP” buyers
                      to ensure high-speed service for urgent investments.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Data Sharing */}
            <section id="data-sharing">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Data Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <ul className="list-disc pl-6 space-y-2 marker:text-emerald-400">
                    <li>
                      <strong>Government Integration:</strong> We share
                      necessary data with the Ministry of Justice and REGA only
                      for legal title transfers and government sealing.
                    </li>
                    <li>
                      <strong>Encryption:</strong> All financial data and
                      personal reports are protected using high-level
                      encryption: “Verify, Seal, Own” trust model.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Data Security */}
            <section id="data-security">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    We implement strong security measures to protect your
                    personal information from unauthorized access, alteration,
                    disclosure, or destruction.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Document Retention */}
            <section id="document-retention">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Document Retention
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    Supporting documents, such as Payment Plans, Engineer
                    Certifications, and Site Photos, are stored securely within
                    your account as long as your investment project is active.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Your Rights */}
            <section id="your-rights">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <ul className="list-disc pl-6 space-y-2 marker:text-emerald-400">
                    <li>Access and request a copy of your personal data.</li>
                    <li>Request corrections to inaccurate information.</li>
                    <li>Request deletion of your data, where applicable.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Changes to This Policy */}
            <section id="changes">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Changes to This Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p>
                    We may update this Privacy Policy from time to time. Changes
                    will be posted on this page with an updated revision date.
                  </p>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
