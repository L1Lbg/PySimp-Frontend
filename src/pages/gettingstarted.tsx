import type React from "react"
import { PlusCircle, Edit, Save, Play } from "lucide-react"

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
      title: "Getting Started with Personalized Digital Automation",
      description: "Learn the basics of creating your first automation project in this comprehensive tutorial.",
      position: "left",
    },
    {
      title: "Advanced Techniques for Efficient Workflows",
      description: "Discover powerful strategies to optimize your automation projects and save even more time.",
      position: "right",
    },
    {
      title: "Real-world Applications and Success Stories",
      description: "See how others have transformed their daily tasks with Personalized Digital Automation.",
      position: "left",
    },
  ]

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
                    {/* YouTube video embed would go here */}
                    <div className="flex items-center justify-center text-purple-400">Video Placeholder</div>
                  </div>
                </div>
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default GettingStarted

