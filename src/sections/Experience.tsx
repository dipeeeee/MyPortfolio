import { useEffect, useRef, memo, useState } from "react"
import { FaReact, FaServer, FaPalette, FaCode, FaUserTie, FaLaptopCode } from "react-icons/fa"

interface ExperienceItem {
  year: string
  role: string
  company: string
  description: string[]
  tech: string[]
  icon: React.ReactNode
}

const experiences: ExperienceItem[] = [
  {
    year: "2024 – 2025",
    role: "Full Stack Developer Intern",
    company: "Koyal Technologies",
    description:[
    "Contributed to the TMC project, a tax management system for the State of Oklahoma, supporting different counties including Canadian, Logan, and Tulsa across modules like bookkeeping, taxation, apportionment, shared lists, and administration.",
"Worked on the Bookkeeping (General Ledger, Miscellaneous Receipts, Warrants, Official Depository) and Shared List modules, focusing mainly on frontend development with partial backend involvement.",
"Tech stack: Java, Spring Boot, Spring MVC, Spring Data JPA, MySQL for backend and API development; Thymeleaf/React for frontend integration.",
"Followed Agile practices using Jira and Azure DevOps; used GitHub for version control and Docker for containerized development and deployments.",
    ],
    tech: ["React", "Java", "Spring Boot", "Spring MVC", "Azure Devops"],
    icon: <FaReact className="text-cyan-400" />,
  },
  // {
  //   year: "2024 – 2024",
  //   role: "Full Stack Developer Intern",
  //   company: "Voltstream Technologies",
  //   description:
  //    [ "Trained in full-stack development using the MERN stack (MongoDB, Express.js, Vue.js, Node.js)",
  //       "Assisted in building and integrating frontend components with RESTful APIs.",
  //       "Collaborated with senior developers in the Agile environment and participated in code reviews."],
  //   tech: ["Javascript","React", "Node", "Express", "MongoDB", "Azure Devops"],
  //   icon: <FaReact className="text-cyan-400" />,
  // },
  {
    year: "2023 – 2024",
    role: "Co-Founder",
    company: "Nayaan",
    description:
    [
      "Co-founded a patented AI assistive device with OCR and object detection capabilities for visually impaired users.",
      "Led OCR engine development, hardware integration, and accessible UI design to support independent navigation and reading."
    ],
    tech: ["Python", "Tensorflow", "paddle OCR", "gtts" , "NLP"],
    icon: <FaUserTie className="text-green-400" />,
  },
  {
    year: "2020 – 2020",
    role: "Web Development Intern",
    company: "Bitlanch Tech Hub Pvt. Ltd",
    description:
      ["Independently developed a Restaurant management system website using web development technologies such as HTML, CSS, JavaScript and python framework Django.",
       "It has a simple interface for users and handles tasks like managing menus, processing orders, and reservations.",
       "Features include user logins, an admin area, and tools for business reports."],
    tech: ["HTML", "CSS", "Javascript" , "Python", "Django"],
    icon: <FaLaptopCode className="text-purple-400" />,
  },
]

const TechTag = memo(({ tech }: { tech: string }) => (
  <span className="px-2.5 py-1 text-xs sm:text-sm rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-neutral-200 whitespace-nowrap">
    {tech}
  </span>
))
TechTag.displayName = 'TechTag'

const ExperienceCard = memo(({
  exp,
  index
}: {
  exp: ExperienceItem
  index: number
}) => {
  const isEven = index % 2 === 0
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`exp-card relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8 pl-12 sm:pl-14 lg:pl-0 ${
        isEven ? "lg:flex-row-reverse" : "lg:flex-row"
      } transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      data-index={index}
    >
      {/* Timeline Dot - With React Icon */}
      <div
        className="absolute left-0 top-0 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 backdrop-blur-sm shadow-lg shadow-cyan-500/20 z-10"
        aria-hidden="true"
      >
        <div className="text-base sm:text-lg lg:text-xl">{exp.icon}</div>
      </div>

      {/* Card - Fixed width to prevent overflow */}
      <div
        className="bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-7 backdrop-blur-md w-full lg:w-[calc(50%-2rem)] transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20"
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm text-cyan-400 font-semibold">{exp.year}</span>
          <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-white leading-tight">{exp.role}</h3>
          <h4 className="text-sm sm:text-base lg:text-lg text-purple-400">{exp.company}</h4>
        </div>

        {/* <p className="text-neutral-300 mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base leading-relaxed">
          {exp.description}
        </p> */}
        <ul className="list-disc ml-6 mt-3 sm:mt-4 space-y-1 text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed">
          {exp.description.map((point, i) => (
           <li key={i}>
             {point}
           </li>
         ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {exp.tech.map((t) => (
            <TechTag key={t} tech={t} />
          ))}
        </div>
      </div>
    </div>
  )
})
ExperienceCard.displayName = 'ExperienceCard'

export default function Experience() {
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    setHeaderVisible(true)
  }, [])

  return (
    <section
      id="experience"
      className="relative w-full min-h-screen bg-gradient-to-b from-black via-[#0f0f1a] to-black text-white overflow-hidden"
    >
      {/* Background Glow - Responsive sizing */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[5%] sm:top-[10%] left-[2%] sm:left-[5%] w-[60vw] sm:w-[40vw] lg:w-[30vw] h-[60vw] sm:h-[40vw] lg:h-[30vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[5%] sm:bottom-[10%] right-[2%] sm:right-[5%] w-[60vw] sm:w-[40vw] lg:w-[30vw] h-[60vw] sm:h-[40vw] lg:h-[30vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Content Container with proper padding */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-12 sm:py-16 lg:py-24">
        {/* Section Heading - Fully responsive */}
        <div
          className={`text-center mb-8 sm:mb-12 lg:mb-20 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <p className="text-neutral-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            A journey through my career — building, breaking, and learning with passion.
          </p>
        </div>

        {/* Timeline - Responsive container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Vertical Line - Responsive positioning */}
          <div
            className="timeline-line absolute top-0 left-4 lg:left-1/2 lg:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-500"
            style={{ zIndex: 1 }}
          />

          {/* Cards Container - Responsive gaps */}
          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-20 xl:gap-24 w-full relative z-[2]">
            {experiences.map((exp, i) => (
              <ExperienceCard key={`${exp.company}-${i}`} exp={exp} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12 lg:h-16" />
      </div>
    </section>
  )
}
