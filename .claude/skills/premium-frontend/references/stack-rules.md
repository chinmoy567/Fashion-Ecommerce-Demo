# Stack Rules (non-negotiable)

The stack: React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Three Fiber + Drei + Three.js + GSAP + Framer Motion + React Router. Never Bootstrap, Material UI, Ant Design, AOS, or CSS animation libraries.

Every feature uses the full stack in its lane: shadcn/ui for all UI primitives, Framer Motion for UI micro-interactions, GSAP ScrollTrigger for scroll-driven motion, and R3F for section-level 3D. "I'll just hand-roll this one button" is how premium codebases rot.

## shadcn/ui — mandatory for all UI primitives

Use shadcn/ui for every component it provides. Do not hand-build any of these:

Button, Card, Badge, Dialog, Sheet, Accordion, Tabs, Input, Textarea, Form (with react-hook-form + zod), Navigation Menu, Dropdown Menu, Scroll Area, Tooltip, Sonner (toast), Avatar, Separator, Skeleton, Carousel.

- Install per component: `npx shadcn@latest add button card dialog ...`
- Customize via Tailwind classes and CSS variables in the theme — never fork a component's internals unless shadcn genuinely lacks the feature.
- Only hand-build a component when shadcn has no equivalent (e.g., a bespoke 3D-integrated control) — and note in code comments why.

## React Three Fiber — real 3D, never fake

- No CSS-transform "3D" effects standing in for actual 3D. Section-level showcases (hero, project highlights, skill visualizations) get a real `<Canvas>`.
- 3D lives at the **section level**. Do not embed Canvases inside buttons, cards, tooltips, or list items — one Canvas per showcase section, composed well, beats ten trinket canvases.
- Scene standards:
  - Use Drei helpers: `Environment`, `Float`, `OrbitControls`/`ScrollControls`, `useGLTF`, `PerspectiveCamera`, `ContactShadows`, `MeshTransmissionMaterial` where fitting.
  - Deliberate lighting: an `Environment` preset or a three-point setup (key + fill + rim). Never a single default `ambientLight` and done.
  - Camera motion: animate the camera (GSAP timeline on camera position/rotation tied to ScrollTrigger, or Drei `ScrollControls`) — a static camera reads as a tech demo.
  - Floating/idle motion via Drei `<Float>` or spring-based drift so the scene never looks frozen.
- Performance:
  - `React.lazy` + `<Suspense>` the entire Canvas section; meaningful fallback (skeleton or poster image).
  - `useGLTF.preload` after mount; Draco/meshopt-compressed models; keep models lightweight.
  - `frameloop="demand"` + `invalidate()` for scenes static between interactions; pause rendering when the section is off-screen (`useInView` gate).
  - `dpr={[1, 2]}` cap; avoid full-res post-processing on mobile.

## GSAP vs Framer Motion — the split

One rule decides which library owns an animation:

- **Scroll-driven or timeline-choreographed → GSAP + ScrollTrigger.** Hero reveals, text reveals (SplitText-style stagger), image reveals, section pins/transitions, horizontal scroll sections, scroll-linked camera moves. Always timeline-based (`gsap.timeline()`), never scattered one-off tweens. Register plugins once in a central `lib/gsap.ts`.
- **State/interaction-driven UI → Framer Motion.** Hover/tap effects, presence animations (`AnimatePresence` for dialogs/sheets/route transitions), layout animations, staggered list mounts.
- CSS keyframes only for trivial ambient loops (e.g., a slow gradient shift) where JS animation would be waste.
- Every timeline and motion component respects `prefers-reduced-motion` (GSAP `matchMedia`, Framer `useReducedMotion`).

## Design language

- Dark theme by default: near-black backgrounds (not pure #000 — use e.g. zinc-950/neutral-950), high-contrast type, one restrained accent.
- Premium/minimal/futuristic, Apple/Tesla register: generous whitespace, few words, large confident type, no clutter, no more than one focal point per viewport.
- Gradients: subtle, dark-to-dark or accent-glow radials; never rainbow, never high-saturation banding.
- Glassmorphism where appropriate: `backdrop-blur` + low-opacity fill + 1px subtle border + soft shadow — on floating surfaces (nav, cards over 3D), not on everything.
- Typography: a modern variable font (e.g., Inter, Geist, Space Grotesk via @fontsource or local), tight display tracking, clear scale (e.g., text-sm body → text-7xl display), `text-balance` on headings.
- Smooth scrolling via Lenis (or GSAP ScrollSmoother if licensed) integrated with ScrollTrigger — not `scroll-behavior: smooth` alone.

## Code quality

- TypeScript strict; no `any` without a comment justifying it.
- Functional components only; hooks for all shared logic.
- Modular folders (see scaffold-workflow.md for layout); no file over ~200 lines without good reason.
- No duplicated code — extract on the second occurrence.
