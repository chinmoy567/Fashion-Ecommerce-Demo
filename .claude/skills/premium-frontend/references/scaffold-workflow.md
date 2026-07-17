# Scaffold Workflow (new projects)

Act as a senior frontend engineer starting a greenfield project. Architecture and justification come before any implementation code.

## 1. Present the architecture first

Before writing code, output (concisely, in the response):

1. The folder structure (below, adapted to the project).
2. The package list, each with a one-line "why".
3. The section/page plan and which get 3D.
4. The animation plan: which reveals are GSAP ScrollTrigger, which interactions are Framer Motion.

Then implement **one feature at a time**, in this order: setup → theme/layout shell → hero (with 3D) → remaining sections top-to-bottom → polish pass. Never dump the whole site in one response or one file.

## 2. Setup commands

```bash
npm create vite@latest <name> -- --template react-ts
cd <name>
npm i react-router-dom three @react-three/fiber @react-three/drei gsap framer-motion lenis
npm i -D tailwindcss @tailwindcss/vite
npx shadcn@latest init   # style: default/zinc, dark, CSS variables: yes
npx shadcn@latest add button card badge dialog sheet accordion tabs input textarea form navigation-menu dropdown-menu scroll-area tooltip sonner avatar separator skeleton
```

Verify versions after install (React 19, current shadcn CLI) rather than assuming — ecosystems move.

## 3. Folder structure

```
src/
├── main.tsx / App.tsx        # Router + providers
├── components/
│   ├── ui/                   # shadcn components (CLI-managed, don't hand-edit casually)
│   ├── layout/               # Navbar, Footer, SectionShell
│   └── shared/               # Reusable composed components (SectionHeading, GlassCard...)
├── sections/                 # One folder per page section: Hero/, About/, Skills/, ...
│   └── Hero/
│       ├── Hero.tsx
│       ├── HeroScene.tsx     # the R3F Canvas, lazy-loaded from Hero.tsx
│       └── hero.anim.ts      # GSAP timeline for this section
├── hooks/                    # useScrollReveal, useSectionInView, useReducedMotionSafe...
├── lib/                      # gsap.ts (plugin registration), lenis.ts, utils.ts (cn)
├── styles/                   # globals.css (Tailwind + theme CSS vars)
└── assets/models/            # compressed .glb files
```

## 4. Default section order (portfolio-style sites)

Hero (3D) → About → Skills → Experience → Projects (3D showcase optional) → Services → Testimonials → Contact → Footer.

Each section is a lazy-loaded module below the fold. The hero loads eagerly but its Canvas is Suspense-wrapped with a styled fallback so first paint is instant.

## 5. Scaffold-specific gates

- Lenis smooth scroll wired to GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`).
- Theme tokens defined once in CSS variables; Tailwind reads them — no hardcoded hex scattered in components.
- Route-level code splitting from day one.
- A `SectionShell` layout component enforcing consistent max-width, padding, and vertical rhythm across all sections.

After the scaffold is running (`npm run dev` clean), return to SKILL.md Step 4 — the visual review loop — before calling any section done.
