import {
  MousePointer2,
  Clock,
  Zap,
  Shield,
  Code2,
  Workflow,
  BotIcon as Robot,
  PersonStanding,
  FileIcon as FileOrganizer,
  FormInput,
  FileSpreadsheet,
  Search,
  Key,
  Database,
  BadgePlus,
} from "lucide-react"

export const features = [
  {
    title:"Integration Automation",
    description:
    "Integration Automation focuses on connecting different software applications to work together seamlessly. It enables data transfer between tools, automates routine workflows, and reduces manual input by using APIs.",
    icon:BadgePlus
  },
  {
    title: "Robotic Process Automation (RPA)",
    description:
      "Robotic Process Automation (RPA) is designed to automate repetitive tasks typically performed by humans within digital environments. RPA bots can interact with user interfaces, extract data, and perform rule-based tasks across multiple applications. RPA is powerful for large-scale or enterprise automation.",
    icon: Robot,
  },
  {
    title: "Personalized Digital Automation",
    description:
      "Personalized Digital Automation automates actions directly on a computer, and can interact with any software. It replicates human actions in your computer, across any software environment, including apps without APIs, browser-based workflows, and desktop applications. From moving, organising and renaming files, Auto-Filling Online Forms and managing spreadsheets to handling customer support tasks.",
    icon: PersonStanding,
  },
]

export const benefits = [
  {
    title: "Save Time & Increase Productivity",
    description: "Automate repetitive tasks and free up your time to focus on more important things.",
    icon: Clock,
  },
  {
    title: "Reduce Errors & Improve Accuracy",
    description: "Eliminate human error and ensure consistent results.",
    icon: Shield,
  },
  {
    title: "Increase Efficiency & Streamline Workflows",
    description: "Automate your workflows and improve your overall efficiency.",
    icon: Workflow,
  },
  {
    title: "Easy to Use & No Coding Required",
    description: "Our intuitive interface makes it easy to create automations without any coding experience.",
    icon: Code2,
  },
  {
    title: "Powerful & Flexible",
    description: "Our platform is powerful and flexible enough to handle any automation task.",
    icon: Zap,
  },
  {
    title: "Affordable & Accessible",
    description: "Our platform is affordable and accessible to everyone.",
    icon: MousePointer2,
  },
]

export const useCases = [
  {
    title: "Automating File Organization & Renaming",
    icon: FileOrganizer,
  },
  {
    title: "Auto-Filling Online Forms & Repetitive Applications",
    icon: FormInput,
  },
  {
    title: "Automating Client Report Generation & Formatting With Spreadsheets",
    icon: FileSpreadsheet,
  },
  {
    title: "Automating Online Research & Data Scraping (Without Code)",
    icon: Search,
  },
  {
    title: "Auto-Logging Into Client Accounts & Managing Password-Protected Sites",
    icon: Key,
  },
  {
    title: "Automating Repetitive Data Entry in Web Portals & CRMs",
    icon: Database,
  },
]

