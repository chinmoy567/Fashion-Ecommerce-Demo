import { useEffect, useRef } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// Fades/slides children of `containerRef` into view as they scroll in, respecting reduced-motion
export function useScrollReveal({ selector = "[data-reveal]", y = 32, stagger = 0.08 } = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = container.querySelectorAll(selector)
    if (!targets.length) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            once: true,
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [selector, y, stagger])

  return containerRef
}
