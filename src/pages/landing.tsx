import { ArrowRight, Sparkles } from "lucide-react"
import { benefits, features, useCases } from "@/data/landingPageData"
import { useNavigate, Link } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  const handleJoin = () => {
    // is logged in
    if (localStorage.getItem("username") != undefined) {
      navigate("/subscribe")
    } else {
      navigate("/auth")
    }
  }

  return (
    <>
      <img src="/Logo.png" alt="Logo" className="rounded-lg shadow-2xl mx-auto mt-10 w-[70vw] max-w-[400px] mx-auto" />
      <div className="text-center max-w-4xl mx-auto px-4 pt-20">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-purple-400">Think Personalized Digital Automation. Think YOU.</span>
          <br />
          {/* The automation that is not app-to-app integration-focused and it's definitely not built for enterprises. */}
        </h1>
        <p className="text-xl text-purple-200/60 mb-8">
          The automation that is not app-to-app integration-focused and it's definitely not built for enterprises
        </p>

        <>
          <div className="m-10">
            <button
              onClick={handleJoin}
              className="px-6 py-3 mb-5 m-auto bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              Join the Digital Autonomy Movement
              <ArrowRight className="h-4 w-4" />
            </button>
            {localStorage.getItem("username") == undefined && (
              <>
                {/* <b>Not sure?</b>
                      <button
                          onClick={()=> navigate('/create/0')}
                          className="px-6 m-auto mt-5 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                          Try our editor
                          <TestTube2 className="h-4 w-4" />
                      </button> */}
              </>
            )}
          </div>
        </>
      </div>
      <div className="w-full h-fit flex items-center justify-center mb-10">
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 h-10 bottom-0"></div> */}
        {/* <img
          src="/landingimage.png"
          alt="Code editor interface"
          className="rounded-lg shadow-2xl mb-16"
        /> */}
        <iframe
          width="1000"
          height="500"
          src="https://www.youtube-nocookie.com/embed/HOZVhS-7k10?si=t7qyQ7O5WTXypnR2&amp;controls=2&color=white&fs=0&modestbranding=1&rel=0&showinfo=0&vq=hd1080p"
          title="YouTube video player"
          frameborder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>

      {/* Features Section */}
      <div className="bg-purple-950/20 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold">Key Features</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-purple-950/30 flex items-start">
                <feature.icon className="h-12 w-12 text-purple-400 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-purple-200/60">
                    {feature.title === "Personalized Digital Automation" ? (
                      <>
                        <Link href="/personalized-digital-automation" className="text-purple-400 hover:underline">
                          Personalized Digital Automation
                        </Link>
                        {" " + feature.description}
                      </>
                    ) : (
                      feature.description
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Autonomia?</h2>
            <p className="text-purple-200/60">
              Powerful features that make personalized automation accessible to Virtual Assistants.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-lg bg-purple-950/30 hover:bg-purple-950/40 transition-colors">
                <benefit.icon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-purple-200/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-purple-950/20 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
            <p className="text-purple-200/60">Check How it works?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase, index) => (
              <div key={index} className="p-4 bg-purple-950/30 rounded-lg flex items-center">
                <useCase.icon className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0" />
                <p className="text-purple-200">{useCase.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-purple-500 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the digital autonomy movement!</h2>
            <p className="text-xl mb-8">
              {" "}
              Personalized Digital Automation is about putting YOU at the centre, giving you full autonomy to control
              your computer on your way and quickly create powerful automation for any digital task effortlessly. You
              spend a few minutes once, just dragging and dropping blocks, to gain many hours forever!
            </p>
            {localStorage.getItem("debug") == "false" ? (
              <button
                onClick={() => {
                  document.querySelector("#waitlist-input")?.scrollIntoView({ behavior: "smooth", block: "center" })
                }}
                className="inline-flex items-center gap-2 bg-white text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join Waitlist
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="inline-flex items-center gap-2 bg-white text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join the Digital Autonomy Movement
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

