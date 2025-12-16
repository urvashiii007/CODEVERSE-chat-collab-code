/*
import illustration from "@/assets/04.jpeg"
import bgImage from "@/assets/9.png"      // ya 10.jpeg jo bhi use karna ho
import FormComponent from "@/components/forms/FormComponent"
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center gap-16 bg-black bg-cover bg-center bg-no-repeat text-white"
            style={{ backgroundImage: `url(${bgImage})` }}   // yahan se background lagega
        >
            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full animate-up-down justify-center sm:w-1/2 sm:pl-4">
                    <img
                        src={illustration}
                        alt="CodeVerse Collaboration Illustration"
                        className="mx-auto w-[250px] sm:w-[400px]"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2">
                    <FormComponent />
                </div>
            </div>

            {/* <Footer /> *///}
//         </div>
//     )
// }

// export default HomePage

import illustration from "@/assets/04.jpeg"
import bgImage from "@/assets/9.png"
import FormComponent from "@/components/forms/FormComponent"

function HomePage() {
    return (
        <div className="relative min-h-[100svh] w-full overflow-hidden bg-black">
            {/* Background image layer */}
            <img
                src={bgImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
            />

            {/* Content layer */}
            <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center text-white">
                <div
                    className="
                        mx-auto
                        flex 
                        w-full 
                        max-w-7xl
                        flex-col 
                        items-center 
                        justify-between 
                        gap-12
                        px-6
                        sm:flex-row
                    "
                >
                    {/* Left Illustration */}
                    <div className="flex w-full justify-center sm:w-1/2">
                        <img
                            src={illustration}
                            alt="CodeVerse Collaboration Illustration"
                            className="w-[260px] sm:w-[420px]"
                        />
                    </div>

                    {/* Right Form */}
                    <div className="flex w-full justify-center sm:w-1/2">
                        <FormComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
