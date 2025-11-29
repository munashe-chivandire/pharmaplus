import Link from "next/link"
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  HeartPulse,
  Building2,
  Sparkles,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">PharmPlus</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Trusted by 500+ Medical Schemes Worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Streamline Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {" "}Medical Scheme{" "}
              </span>
              Administration
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              The all-in-one platform for managing membership applications, processing claims,
              and delivering exceptional healthcare benefits administration.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                Watch Demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. 14-day free trial.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl">
              <div className="bg-gray-100 rounded-xl overflow-hidden">
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-100 rounded-lg px-4 py-1 text-sm text-gray-500">
                      app.pharmplus.com/dashboard
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 min-h-[400px] flex items-center justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 text-sm">Applications</span>
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">1,234</p>
                      <p className="text-green-600 text-sm mt-1">+12% this month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 text-sm">Active Members</span>
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">8,456</p>
                      <p className="text-green-600 text-sm mt-1">+8% this month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-500 text-sm">Approval Rate</span>
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">94.2%</p>
                      <p className="text-green-600 text-sm mt-1">+2.1% this month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-8">
            Trusted by leading healthcare organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {["Quest Vitality", "HealthFirst", "MedCare Plus", "Wellness Co", "CareShield"].map((name) => (
              <div key={name} className="flex items-center gap-2 text-gray-400">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold text-lg">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage medical schemes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your operations and delight your members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Application Management",
                description:
                  "Process membership applications with automated workflows, document verification, and instant approvals.",
                color: "blue",
              },
              {
                icon: Users,
                title: "Member Portal",
                description:
                  "Give members a self-service portal to submit applications, track status, and manage their benefits.",
                color: "green",
              },
              {
                icon: BarChart3,
                title: "Analytics & Reporting",
                description:
                  "Gain insights with real-time dashboards, custom reports, and predictive analytics.",
                color: "purple",
              },
              {
                icon: Shield,
                title: "Compliance & Security",
                description:
                  "HIPAA compliant infrastructure with end-to-end encryption and audit logging.",
                color: "red",
              },
              {
                icon: Zap,
                title: "Automated Workflows",
                description:
                  "Automate repetitive tasks, set up approval chains, and trigger notifications automatically.",
                color: "yellow",
              },
              {
                icon: Globe,
                title: "Multi-Currency Support",
                description:
                  "Process contributions and claims in multiple currencies with real-time conversion.",
                color: "cyan",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${feature.color}-50 mb-6`}
                >
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your organization. Scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99",
                description: "Perfect for small medical schemes",
                features: [
                  "Up to 500 members",
                  "Application management",
                  "Member portal",
                  "Email support",
                  "Basic analytics",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
              {
                name: "Professional",
                price: "$299",
                description: "For growing organizations",
                features: [
                  "Up to 5,000 members",
                  "Everything in Starter",
                  "Advanced workflows",
                  "Custom branding",
                  "Priority support",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Unlimited members",
                  "Everything in Professional",
                  "Custom integrations",
                  "Dedicated support",
                  "SLA guarantee",
                  "On-premise option",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? "border-2 border-blue-500 shadow-xl scale-105"
                    : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 block w-full py-3 rounded-xl font-semibold text-center transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by healthcare administrators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about PharmPlus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "PharmPlus has transformed how we process applications. What used to take days now takes hours.",
                author: "Sarah Johnson",
                role: "Operations Director",
                company: "Quest Vitality",
              },
              {
                quote:
                  "The member portal reduced our support calls by 60%. Members love being able to track their applications online.",
                author: "Michael Chen",
                role: "IT Manager",
                company: "HealthFirst Medical",
              },
              {
                quote:
                  "Best investment we've made. The analytics alone have helped us identify and fix bottlenecks in our process.",
                author: "Emily Williams",
                role: "CEO",
                company: "CareShield Insurance",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200"
              >
                <p className="text-gray-600 text-lg mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your medical scheme administration?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join hundreds of healthcare organizations already using PharmPlus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-400 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">PharmPlus</span>
              </div>
              <p className="text-gray-500">
                The modern platform for medical scheme administration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-500 hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-500 hover:text-gray-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2024 PharmPlus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
