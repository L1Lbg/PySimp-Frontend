import type React from "react"
import {
  ArrowRight,
  Zap,
  Puzzle,
  BotIcon as Robot,
  PersonStanding,
  MousePointer,
  Keyboard,
  FileSearch,
  Workflow,
  FileText,
  FormInput,
  Globe,
  Mail,
  Cpu,
  PlayCircle,
  CheckCircle,
} from "lucide-react"
import { Link } from "react-router-dom";

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-purple-950 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">How It Works</h1>

        {/* Video Section
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">See Personalized Digital Automation in Action</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/YOUR_VIDEO_ID"
              title="Personalized Digital Automation Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div> */}

        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Most people think automation is either:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-900 p-6 rounded-lg">
              <Puzzle className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">App integrations</h3>
              <p>Great for simple workflows but limited to apps that support APIs.</p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Robot className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">RPA</h3>
              <p>Powerful but expensive, complex, and built for enterprises.</p>
            </div>
          </div>
        </div>

        {/* Personalized Digital Automation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">But there's a third option—Personalized Digital Automation.</h2>
          <div className="bg-purple-900 p-6 rounded-lg">
            <PersonStanding className="h-8 w-8 mb-2 text-purple-400" />
            <ul className="list-none space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                It works anywhere (even on software without APIs).
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                It's flexible—you decide what gets automated.
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                It's for individuals and small teams, not just big enterprises.
              </li>
            </ul>
            <p className="mt-4">
              With Personalized Digital Automation, your computer works for you, handling repetitive tasks without the
              limits of integration tools or the complexity of enterprise automation.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            How Personalized Digital Automation Works: Building Blocks of Automation
          </h2>
          <p className="mb-4">
            Think of Personalized Digital Automation like Lego for automation. Instead of writing scripts, you assemble
            actions like:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-purple-900 p-6 rounded-lg">
              <MousePointer className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Clicking & Typing</h3>
              <p>Automate any repetitive task by making your computer click, type, and interact like a human.</p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <FileSearch className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Reading & Extracting Data</h3>
              <p>Pull text from websites without needing an API.</p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Zap className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Logic & Decisions</h3>
              <p>Set up conditions like "If spreadsheet cell contains X, do Y."</p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Workflow className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Multi-Step Workflows</h3>
              <p>
                Chain actions together, like logging into a portal, downloading reports, and emailing them—all
                hands-free.
              </p>
            </div>
          </div>
          <p className="mt-4">
            You don't need coding. You just stack these building blocks to create workflows that work exactly how you
            want.
          </p>
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7 Ways You Can Use Personalized Digital Automation Today</h2>
          <div className="space-y-6">
            <div className="bg-purple-900 p-6 rounded-lg">
              <MousePointer className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Automate Your Clicks, Keystrokes, and Navigation</h3>
              <p>
                Tired of clicking the same buttons every day? Personalized Digital Automation can move your mouse, type
                text, and navigate menus automatically. No need to install complex software—just use our editor, download your project,
                and the tool will repeat them.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> A Virtual Assistant (VA) updates 50 spreadsheets daily. Instead of clicking
                through each one, Personalized Digital Automation does it in seconds.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Keyboard className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Copy, Paste, and Transfer Data Between Apps</h3>
              <p>
                Most automation tools can't work outside of specific apps, but Personalized Digital Automation copies
                and pastes across any software—Excel, web browsers, CRMs, email… anything.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> You receive customer inquiries via email and need to log them into a database.
                Personalized Digital Automation can extract the info and enter it automatically, no manual work needed.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <FileText className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Automate File and Document Handling</h3>
              <p>
                Personalized Digital Automation can rename, organize, move, or delete files automatically—great for
                anyone drowning in documents.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> A freelancer organizes client invoices every month. Instead of dragging and
                renaming files one by one, Personalized Digital Automation sorts and labels them instantly.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <FormInput className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Fill Out Online Forms Instantly</h3>
              <p>
                If you type the same information over and over, Personalized Digital Automation can auto-fill forms for
                you—saving hours.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> A VA applies for jobs on behalf of clients. Instead of manually filling out 20
                forms, Personalized Digital Automation enters all details in seconds.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Globe className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Scrape and Collect Data From Any Website</h3>
              <p>
                Need information from a website but don't want to copy it by hand? Personalized Digital Automation can
                grab text, numbers, and links from any page—even ones that don't offer downloads.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> A researcher collects prices from competitors' websites. Personalized Digital
                Automation does it automatically and updates a spreadsheet.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Mail className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Automate Emails</h3>
              <p>
                Personalized Digital Automation can help with email outreach, customer support, or sending personalized
                follow-ups.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> A VA needs to send weekly reports to 30 clients. Personalized Digital
                Automation writes and sends the emails automatically, attaching the right files for each person.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Cpu className="h-8 w-8 mb-2 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Combine With AI for Smart Workflows</h3>
              <p>
                Personalized Digital Automation isn't just about simple tasks. You can connect it with AI tools to create even smarter automations.
              </p>
              <p className="mt-2">
                <strong>Example:</strong> Instead of manually summarizing long emails, Personalized Digital Automation
                can send the text to an AI, get a summary, and paste it where you need it.
              </p>
            </div>
          </div>
        </div>

        {/* How it Works (Simplified) */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">How Personalized Digital Automation Works (Simplified)</h2>
          <div className="bg-purple-900 p-6 rounded-lg">
            <ol className="list-decimal list-inside space-y-4">
              <li className="flex items-center">
                <PlayCircle className="h-6 w-6 mr-2 text-purple-400" />
                <span>
                  <strong>Specify your actions in the editor</strong> – Clicking, typing, moving files, browsing, asking an AI.
                </span>
              </li>
              <li className="flex items-center">
                <PlayCircle className="h-6 w-6 mr-2 text-purple-400" />
                <span>
                  <strong>Download a file and run it</strong> – Personalized Digital Automation does the work while you focus
                  on more important tasks.
                </span>
              </li>
            </ol>
            <p className="mt-4">
              No coding. No complicated setups. Just automation that works exactly how you need it.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
            <Link className="text-center"
            to='/auth'
        >
            <h2 className="text-2xl font-semibold mb-4">Start Using Personalized Digital Automation Today</h2>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            </Link>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks;

