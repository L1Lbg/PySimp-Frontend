import type React from "react"
import { PlusCircle, Edit, Save, Play } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

const GettingStarted: React.FC = () => {
  const steps = [
    {
      icon: PlusCircle,
      title: "Create a New Project",
      description: "Begin by clicking the 'New Project' button to start your automation journey.",
    },
    {
      icon: Edit,
      title: "Customize Your Project",
      description: "Tailor your project to your specific needs by editing and configuring the automation steps.",
    },
    {
      icon: Save,
      title: "Save and Download",
      description: "Once you're satisfied with your project, save your work and download it to your computer.",
    },
    {
      icon: Play,
      title: "Execute Your Automation",
      description: "Run the project on your local machine to see your personalized automation in action.",
    },
  ]

  const videos = [
    {
      title: "In Depth Editor Tutorial",
      description: "Learn about our editor with a real life example.",
      position: "left",
      id:'rBFq6Jc0Xss',
      duration:'8m10s',
    },
    {
      title: "No strings attached 35% Referral Program",
      description: "Learn the basics of our referral program, and how easy and un-compromising it is.",
      position: "right",
      id:'FGkDstc897Q',
      duration:'1m35s',
    },
    {
      title: "Copying a community project",
      description: "Find out how to modify a community project you liked, to fit your specific needs.",
      position: "left",
      id:'7ayDXFsFgYY',
      duration:'1m18s',
    },
  ]


  const [searchParams] = useSearchParams()


  return (
    <div className="min-h-screen bg-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center">Welcome to Autonomia</h1>

        {/* Getting Started Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-purple-900 p-6 rounded-lg text-center">
                <step.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-purple-200">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Video Tutorials</h2>
          <div className="space-y-12">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`flex flex-col ${video.position === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-8`}
              >
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold mb-4">{video.title}</h3>
                  <p className="text-purple-200 mb-4">{video.description}</p>
                  <div className="aspect-w-16 aspect-h-9 bg-purple-900 rounded-lg">
                    <iframe className="w-full h-[40vh]" src={`https://www.youtube-nocookie.com/embed/${video.id}?amp;controls=2&color=white&modestbranding=1&rel=0&showinfo=0&vq=hd1080p`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    <div className="flex items-center justify-center text-purple-400">{video.duration}</div>
                  </div>
                </div>
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </section>


        <div className="flex items-center align-middle justify-center">
          <Link 
            to={searchParams.get('signup') == 'true' ? '/subscribe' : '/auth'} 
            className="m-auto mt-20 mb-10 w-md aspect-[9/3] inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white shadow hover:bg-purple-700 rounded-md px-3 text-3xl space-x-2">
            
            <Play className="mr-3"/>
            Get started!
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GettingStarted

