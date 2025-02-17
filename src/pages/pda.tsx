import type React from "react"
import {
  CheckCircle2,
  X,
  Clock,
  Shield,
  Bot,
  MousePointer,
  Settings,
  DollarSign,
  Briefcase,
  AlertCircle,
  CheckSquare,
  Building2,
  ShoppingCart,
  Calculator,
  HeadphonesIcon,
  Search,
  Check,
} from "lucide-react"

const PersonalizedDigitalAutomation: React.FC = () => {
  const comparisonData = [
    {
      feature: "Works Across All Applications",
      pda: { value: true, desc: "Can interact with any app or software" },
      integration: { value: false, desc: "Requires supported apps with APIs" },
      rpa: { value: true, desc: "Works with UI but often for enterprises" },
    },
    {
      feature: "No Coding Required",
      pda: { value: true, desc: "" },
      integration: { value: false, desc: "Usually requires API knowledge" },
      rpa: { value: false, desc: "Often needs programming for setup" },
    },
    {
      feature: "Easy to Set Up",
      pda: { value: true, desc: "Automate actions in minutes" },
      integration: { value: false, desc: "Requires configuring app integrations" },
      rpa: { value: false, desc: "Needs IT team for deployment" },
    },
    {
      feature: "Best for Individuals",
      pda: { value: true, desc: "Automates daily work without IT support" },
      integration: { value: false, desc: "More suited for businesses with structured processes" },
      rpa: { value: false, desc: "Used in large enterprises with strict processes" },
    },
    {
      feature: "Affordable & Scalable",
      pda: { value: true, desc: "Works without expensive enterprise licenses" },
      integration: { value: true, desc: "Pay-per-use pricing" },
      rpa: { value: false, desc: "High costs and infrastructure needed" },
    },
  ]

  return (
    <div className="min-h-screen bg-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-6">What Is Personalized Digital Automation?</h1>
          <p className="text-lg text-purple-200 leading-relaxed">
            Personalized Digital Automation is a new approach to automation that allows individuals to automate their
            daily tasks across multiple applications—without coding or complex integrations. Unlike traditional
            automation tools, which often require programming knowledge or API connections, Personalized Digital
            Automation works directly on your computer, interacting with software just like a human would.
          </p>
          <p className="text-lg text-purple-200 mt-4 leading-relaxed">
            It can click, type, copy, paste, move files, extract data, and perform other digital actions
            automatically—helping you save time and focus on higher-value work.
          </p>
        </section>

        {/* Comparison Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            What Differs Personalized Digital Automation From Other Automation Tools?
          </h2>
          <p className="text-lg text-purple-200 mb-6">
            While automation has existed for years, Personalized Digital Automation stands out because of its
            flexibility, accessibility, and ease of use. Here's how it compares to other automation methods:
          </p>

          <div className="overflow-x-auto bg-purple-900 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-left">Personalized Digital Automation</th>
                  <th className="p-4 text-left">Integration Automation (API-based tools)</th>
                  <th className="p-4 text-left">Robotic Process Automation (RPA)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-purple-700">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {row.pda.value ? (
                          <Check className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <span>
                          {row.pda.value ? "Yes" : "No"}
                          {row.pda.desc && ` – ${row.pda.desc}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {row.integration.value ? (
                          <Check className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <span>
                          {row.integration.value ? "Yes" : "No"}
                          {row.integration.desc && ` – ${row.integration.desc}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {row.rpa.value ? (
                          <Check className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <span>
                          {row.rpa.value ? "Yes" : "No"}
                          {row.rpa.desc && ` – ${row.rpa.desc}`}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-lg text-purple-200 mt-6">
            Personalized Digital Automation gives the power of automation to everyone, not just businesses with
            dedicated IT teams.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">6 Key Benefits of Personalized Digital Automation Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-900 p-6 rounded-lg">
              <Clock className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Saves Hours of Work Per Week</h3>
              <p className="text-purple-200">
                Eliminate repetitive tasks like data entry, form filling, and document handling.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Shield className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reduces Errors & Increases Accuracy</h3>
              <p className="text-purple-200">
                No more copy-paste mistakes or forgotten steps. Personalized Digital Automation follows exact
                instructions.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Bot className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Works With Any Software</h3>
              <p className="text-purple-200">
                Unlike API-based automation, Personalized Digital Automation interacts with all applications, even
                desktop software.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <MousePointer className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Coding Needed</h3>
              <p className="text-purple-200">
                Anyone can set up automation without technical knowledge. Just let Personalized
                Digital Automation handle it.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Settings className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customizable & Adaptable</h3>
              <p className="text-purple-200">
                Automate your unique workflows instead of relying on pre-built integrations.
              </p>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <DollarSign className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cost-Effective Automation</h3>
              <p className="text-purple-200">
                No need for expensive enterprise software—Personalized Digital Automation works for individuals at a
                fraction of the cost.
              </p>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Can Personalized Digital Automation Do?</h2>
          <p className="text-lg text-purple-200 mb-6">
            Personalized Digital Automation is a universal digital assistant that can automate countless tasks,
            including:
          </p>
          <div className="bg-purple-900 p-6 rounded-lg">
            <div className="grid gap-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Clicking, Typing, & Navigating Menus – Automate repetitive actions in any software.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Copying, Pasting, & Transferring Data – Move information between apps without manual effort.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Filling Out Forms & Applications – Save time by automatically inputting data.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Organizing & Managing Files – Rename, move, or sort files automatically.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Extracting Data from Websites & Documents – Scrape data without manual copy-pasting.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Sending Automated Emails & Messages – Send messages without lifting a finger.
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-purple-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Integrating With AI – Use AI tools to summarize text, generate reports, or analyze data automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Personalized Digital Automation Industry Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-purple-900 p-6 rounded-lg">
              <Briefcase className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Virtual Assistants & Freelancers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Automate scheduling, form submissions, and client outreach.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Extract and organize client data from emails and messages.</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Building2 className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Small Business Owners</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Manage invoices and receipts automatically.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Keep databases updated without manual entry.</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">E-Commerce & Marketing</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Automate product listing updates across multiple platforms.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Extract competitor pricing and trends.</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Calculator className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Finance & Accounting</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Process transactions and log financial data.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Generate reports and send automated summaries.</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <HeadphonesIcon className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Support & Service</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Automate responding to frequent customer inquiries.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Log support tickets from different platforms into one system.</span>
                </li>
              </ul>
            </div>
            <div className="bg-purple-900 p-6 rounded-lg">
              <Search className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Research & Data Analysis</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Scrape data from multiple sources for reports.</span>
                </li>
                <li className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-purple-200">Automate formatting and categorization of large datasets.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What Are the Challenges of Personalized Digital Automation?</h2>
          <div className="bg-purple-900 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Requires Initial Setup – Even though it's easy to use, users still need time to understand how to set
                  up automations effectively.
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Requires a Structured Workflow Approach – To get the best results, users must clearly define their
                  automation steps before setting them up.
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  May Need Adjustments Over Time – If software updates change buttons or layouts, your automation may
                  need a quick fix.
                </p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Not Ideal for Large-Scale Enterprise Needs – For complex automation at a corporate level, RPA or
                  API-based solutions may be better.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How To Implement Personalized Digital Automation Successfully?</h2>
          <div className="bg-purple-900 p-6 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Step 1: Identify Repetitive Tasks – Look at your daily routine and note tasks that take too much time.
                </p>
              </div>
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Step 2: Choose Where to Start – Pick a task that is repetitive, time-consuming, and follows a clear
                  pattern.
                </p>
              </div>
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Step 3: Automate – Use the tool to specify your actions and set automation rules.
                </p>
              </div>
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Step 4: Test & Refine – Run your automation, check for errors, and make adjustments if needed.
                </p>
              </div>
              <div className="flex items-start">
                <CheckSquare className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-purple-200">
                  Step 5: Scale Up – Start automating more tasks and combining different workflows for even bigger time
                  savings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center">
          <p className="text-xl mb-4">
            If you're spending hours on repetitive digital tasks, it's time to let Personalized Digital Automation
            handle them for you.
          </p>
          <p className="text-xl text-purple-400 font-semibold">
            Personalized Automation isn't just for big companies anymore—now, it's for you too.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PersonalizedDigitalAutomation

