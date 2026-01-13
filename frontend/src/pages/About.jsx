import React from "react"
import { Mail, Users, Target, Globe, Award, Heart } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-slate-50 pt-16">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 mb-5 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Independent climate journalism from Nepal
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
            About  <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                Climate Khabar
              </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted source for climate news, environmental insights, and practical, people-first solutions.
            We’re committed to a greener, more informed world.
          </p>

          {/* quick pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {["Editorial independence", "Bilingual access", "Community reporting"].map((x) => (
              <span
                key={x}
                className="rounded-full bg-white/80 text-slate-700 text-xs font-medium px-3 py-1 ring-1 ring-slate-200"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Mission */}
            <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl group-hover:scale-110 transition-transform" />
              <div className="relative">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl grid place-items-center mb-6">
                  <Target className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                  Deliver accurate, timely, and impactful climate reporting that empowers individuals,
                  organizations, and policymakers to make informed decisions for a sustainable future.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl group-hover:scale-110 transition-transform" />
              <div className="relative">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl grid place-items-center mb-6">
                  <Globe className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Vision</h2>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                  A world where climate awareness drives positive action—and everyone has access to reliable,
                  local environmental information that sparks meaningful change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What We Do</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              We bridge the gap between complex climate science and public understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="h-7 w-7 text-emerald-600" />,
                title: "Quality Journalism",
                description:
                  "In-depth reporting on climate impacts, adaptation, policy, and practical innovations."
              },
              {
                icon: <Users className="h-7 w-7 text-blue-600" />,
                title: "Community Building",
                description:
                  "Platforms for dialogue and collaboration among readers, reporters, and local experts."
              },
              {
                icon: <Heart className="h-7 w-7 text-rose-600" />,
                title: "Climate Advocacy",
                description:
                  "Amplifying voices and solutions that drive equitable, evidence-based environmental progress."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-xl grid place-items-center mb-5">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Team */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Passionate people dedicated to climate journalism and environmental stewardship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
  image: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
  name: "Dr. Shreeram K.C.",
  role: "Founder & Chief Editor",
  bio: "Senior climate journalist with 15+ years of environmental reporting experience."
},
{
  image: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
  name: "Samyog K.C.",
  role: "IT Officer",
  bio: "Manages platform development, data integration, and technical infrastructure."
},
{
  image: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png",
  name: "Shova Bogati",
  role: "Sales & Public Relations",
  bio: "Leads partnerships, outreach, and public engagement initiatives."
}

            ].map((m, i) => (
              <article
                key={i}
                className="group bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="mx-auto mb-6 h-32 w-32 rounded-full p-[2px] bg-gradient-to-r from-emerald-400 to-blue-500">
                  <div className="h-full w-full rounded-full bg-white grid place-items-center overflow-hidden">
                    <img src={m.image} alt={m.name} className="h-28 w-28 object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                <p className="text-emerald-700 font-medium mb-3">{m.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Join Our Mission</h2>
          <p className="text-base md:text-lg mb-8/">
            Interested in working with us to make a difference? We’re always looking for contributors
            who share our commitment to climate action and quality journalism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <a
              href="mailto:careers@climatekhabar.com?subject=Job%20Application&body=Please%20find%20my%20CV%20attached."
              className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              <Mail className="h-5 w-5" />
              Email Us Your CV
            </a>
            <p className="text-emerald-100 text-sm">careers@climatekhabar.com</p>
          </div>
        </div>
      </section>

      {/* FAQ (native, accessible, no extra deps) */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">FAQ</h2>
            <p className="text-slate-600 mt-2">A few quick answers about how we work.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is Climate Khabar free to read?",
                a: "Yes. Our stories are free to access. You can support us by sharing articles, sending field tips, or collaborating on community reporting."
              },
              {
                q: "How do you ensure accuracy?",
                a: "We cite sources, interview subject-matter experts, and clearly distinguish news, analysis, and opinion. Corrections are published transparently."
              },
              {
                q: "Do you publish in Nepali and English?",
                a: "Yes. Major stories appear in both languages to reach broader audiences. We’re working to expand simple-language and audio formats for accessibility."
              },
              {
                q: "Can I pitch a story or republish your work?",
                a: "We welcome pitches on local climate issues and solutions. Limited republication is possible with attribution—email hello@climatekhabar.com."
              }
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm transition-all"
              >
                <summary className="list-none cursor-pointer flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 pr-6">{item.q}</h3>
                  <span className="ml-4 h-6 w-6 grid place-items-center rounded-full bg-slate-100 text-slate-700 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3 text-slate-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
