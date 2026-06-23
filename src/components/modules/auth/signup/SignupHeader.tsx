import Image from "next/image";

function SignupHeader() {
    return (
        <>
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800">
                        <Image
                            src={"/vision.svg"}
                            alt="derify"
                            height={20}
                            width={20}
                        />
                    </div>
                    <h1 className="text-3xl font-light text-white">VisionEstate</h1>
                </div>
                <p className="text-gray-300 text-base">
                    Exclusive access to Saudi Arabia's premier properties
                </p>
            </div>
        </>
    )
}
export default SignupHeader