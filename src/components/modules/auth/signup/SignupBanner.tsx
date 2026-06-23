import Image from "next/image";

function SignupBanner() {
    return (
        <>
        <div className="relative h-full overflow-hidden rounded-2xl">
          {/* Background Image*/}
          <Image
            src="/signup.jpg"
            alt="Saudi Vision 2030 Mega Projects Luxury Architecture"
            fill
            className="object-cover brightness-[0.85]"
            priority
            quality={85}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
            {/* Small tagline */}
            <p className="mb-4 text-lg font-medium tracking-wider text-orange-400 uppercase md:text-xl">
              Investment Starts Here
            </p>

            {/* Main Heading */}
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              The Future of Saudi
              <br className="sm:hidden" />
              <span className="text-orange-400"> Investment</span>
              <br />
              Starts Here
            </h1>

            {/* Description */}
            <p className="mb-4 max-w-3xl text-base leading-relaxed text-gray-200 md:text-lg lg:text-xl">
              Access exclusive <strong>Vision 2030</strong> mega-projects
              through a trusted,
              <br className="hidden sm:inline" />
              REGA-verified platform built for discerning investors and licensed
              professionals.
            </p>

            {/* Security Badges - glassmorphism + shadcn-like style */}
            <div className="flex flex-col gap-4 md:flex-row sm:gap-6">
              <div className="flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 backdrop-blur-md border border-white/10 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800">
                  <Image
                    src={"/verify.svg"}
                    alt="derify"
                    height={20}
                    width={20}
                  />
                </div>
                <span className="text-sm font-semibold md:text-base">
                  Secured by 256-bit Encryption
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 backdrop-blur-md border border-white/10 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800">
                  <Image
                    src={"/verify-2.svg"}
                    alt="derify"
                    height={20}
                    width={20}
                  />
                </div>
                <span className="text-sm font-semibold md:text-base">
                  Verified by REGA Authority
                </span>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}


export default SignupBanner