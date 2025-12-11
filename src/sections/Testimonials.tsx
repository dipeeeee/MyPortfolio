"use client"
import { useEffect, useRef, memo, useCallback, useState } from "react"

/* ------------------------------------------------------
   Testimonials Data
------------------------------------------------------ */
const testimonials = [
  {
    name: "Vibhanshu Rana",
    role: "SDE-2, Koyal Technologies",
    quote:
      "Dipali Chandele started her journey with us as a software intern and has shown exceptional growth in a short time. From day one, she demonstrated curiosity, dedication, and a strong willingness to learn. She has transformed into a confident and capable developer who consistently delivers high-quality work. Dipali adapts quickly to new challenges, understands requirements clearly, and takes ownership of her tasks. Her problem-solving mindset, attention to detail, and positive attitude make her a valuable member of our team.",
    color: "#06b6d4",
  },
  {
    name: "Aditya Khule",
    role: "Sr. Developer, Ordinet Solutions Pvt. Ltd",
    quote:
      "Working with Dipali has always been inspiring. Her dedication, leadership qualities, and thoughtful approach bring incredible value to every project and initiative she is involved in. She consistently creates a positive environment, motivates the team, and handles challenges with remarkable clarity and confidence. I truly admire her commitment and the impact she creates wherever she contributes.",
    color: "#f59e0b",
  },
  {
    name: "Neelam Vazirani",
    role: "FSD, Koyal Technologies ",
    quote:
      "Dipali is very promising and bright candidate. She’s a self learner and tackles problems with her “out of the box” thinking . She is very soft-spoken and approachable, easy to interact with and I am confident that she will achieve great heights and remarkable success in her career.",
    color: "#a855f7",
  },
  {
    name: "Saurav Mahajan",
    role: "FSD and TL, Connecticus Technology Pvt Ltd ",
    quote:
      "During our time at E-Cell, her supportive and kind demeanor had a positive impact on the team’s morale and productivity. She has a remarkable talent for team building. Her dedication to helping others made a real impact.",
    color: "#ef4444",
  },
  {
    name: "Kshitj Telang",
    role: "Student, GCOEA",
    quote:
      "Dipali has always been a supportive and inspiring senior. She is genuinely creative and brings fresh ideas to everything she works on. Her positive attitude and willingness to guide others make her someone we truly look up to. I am glad to have learned from her during my time in college",
    color: "#f472b6",
  },
  {
    name: "Vedant Dhande",
    role: "Student, GCOEA",
    quote:
      "Dipali ma’am is not just my senior but my biggest mentor. She helped me overcome procrastination and guided me through my lowest phases with resilience. Her dedication and support have shaped both my academic and personal growth, and I feel truly lucky to have her.",
    color: "#22c55e",
  },
]

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Avatar Placeholder Component
const AvatarPlaceholder = memo(({ name, color, size = "md" }: { name: string; color: string; size?: "sm" | "md" }) => {
  const initials = getInitials(name)
  const sizeClasses = size === "sm" ? "w-12 h-12 text-sm" : "w-14 h-14 text-base"
  
  return (
    <div 
      className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white border-2 border-white/20 backdrop-blur-sm shadow-lg`}
      style={{ 
        background: `linear-gradient(135deg, ${color}E6, ${color}80)`,
      }}
    >
      {initials}
    </div>
  )
})
AvatarPlaceholder.displayName = 'AvatarPlaceholder'

/* ------------------------------------------------------
   Testimonials Component
------------------------------------------------------ */
export default function Testimonials() {
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    setHeaderVisible(true)
  }, [])

  return (
    <section
      id="testimonials"
      className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6 md:px-12 py-20 overflow-hidden"
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Section Heading */}
      <h2
        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 md:mb-20 tracking-tight transition-all duration-1000 ${
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          What People Say
        </span>
      </h2>

      {/* Infinite Carousel */}
      <InfiniteCarousel testimonials={testimonials} />

      {/* Testimonial Cards Grid */}
      <div className="mt-20 md:mt-32 w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------
   Infinite Carousel
------------------------------------------------------ */
type Testimonial = {
  name: string
  role: string
  quote: string
  color: string
}

// Memoized carousel item
const CarouselItem = memo(({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-lg min-w-[280px] hover:scale-105 transition-transform duration-300">
    <AvatarPlaceholder name={testimonial.name} color={testimonial.color} size="sm" />
    <div>
      <p className="text-white font-medium">{testimonial.name}</p>
      <p className="text-neutral-400 text-sm">{testimonial.role}</p>
    </div>
  </div>
))
CarouselItem.displayName = 'CarouselItem'

function InfiniteCarousel({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div 
      className="overflow-hidden w-full py-8 md:py-12 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className={`flex gap-8 md:gap-12 ${isPaused ? 'animate-none' : 'animate-scroll'}`}
        style={{
          width: 'max-content',
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
          <CarouselItem key={i} testimonial={t} />
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------
   Testimonial Card with 3D Tilt Effect
------------------------------------------------------ */
const TestimonialCard = memo(({
  name,
  role,
  quote,
  color,
  index,
}: {
  name: string
  role: string
  quote: string
  color: string
  index: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 3D Tilt effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * 8
    const rotateY = ((x - centerX) / centerX) * -8

    setTransform({ rotateX, rotateY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`testimonial-card relative rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ 
        boxShadow: `0 0 40px ${color}40`,
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transitionDelay: `${index * 100}ms`,
        willChange: 'transform',
      }}
    >
      {/* Quote Icon */}
      <div 
        className="text-4xl md:text-5xl mb-6 opacity-80"
        style={{ color }}
      >
        ❝
      </div>

      {/* Quote */}
      <p className="text-base md:text-lg text-neutral-200 leading-relaxed mb-6 md:mb-8">
        {quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <AvatarPlaceholder name={name} color={color} size="md" />
        <div>
          <p className="text-white font-semibold text-base md:text-lg">{name}</p>
          <p className="text-neutral-400 text-sm">{role}</p>
        </div>
      </div>

      {/* Subtle gradient overlay on hover */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />
    </div>
  )
})
TestimonialCard.displayName = 'TestimonialCard'