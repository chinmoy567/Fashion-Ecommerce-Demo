---
name: premium-frontend
description: Build production-quality, premium frontend experiences that feel handcrafted by experienced product designers and frontend engineers—not generic AI-generated interfaces.Every feature should prioritize thoughtful UX, strong visual hierarchy, refined typography, spacing consistency, tasteful animation, accessibility, and high performance.The default quality target should resemble products from companies like Apple, Linear, Stripe, Vercel, Notion, Arc Browser, and Airbnb rather than typical template or AI-generated designs.
---

# Premium Frontend

Build frontend work that looks like a senior engineer at a top design-driven company shipped it. Two workflows share one core loop: **explore → architect → implement → visually review → iterate**. Never skip the review loop — code that compiles is not the bar; code that *looks* premium is.

## Step 0: Detect the mode

- **Scaffold mode** — the user wants a new project ("build me a portfolio site", "start a new landing page", empty or near-empty directory). Read `references/scaffold-workflow.md` and follow it, then return here for the review loop.
- **Feature mode** — the user wants a feature/section/change in an existing codebase. Continue below.

## Step 1: Explore the codebase first (feature mode)

Never write code into a codebase you haven't mapped. Before architecting:

1. If subagents are available, spawn one (or more, in parallel for large repos) to explore and report back: folder structure, routing setup, existing shadcn components already installed, Tailwind config and design tokens (colors, fonts, spacing), existing GSAP/Framer Motion patterns, existing R3F scenes, state management, and any conventions (naming, file placement).
2. If subagents are unavailable, do this exploration yourself with targeted reads — package.json, tailwind.config, the components/ and app or src/pages directories, one or two existing features as pattern references.
3. Summarize findings in 5–10 lines before proceeding. New code must match existing conventions, not fight them.

## Step 2: Architecture before code

Do not write implementation code yet. Produce a short architecture plan (in the response, not a throwaway file unless the user wants one):

1. Component tree for the feature — every component named, with its folder path.
2. Which shadcn/ui components will be used and which need `npx shadcn@latest add <name>`.
3. Where the 3D lives (section-level Canvas), what's in the scene, and how it lazy-loads.
4. Which animations are GSAP ScrollTrigger vs Framer Motion (see the split rule in `references/stack-rules.md`).
5. Data/props flow and any new hooks.
6. Packages to add, each with a one-line justification.

Sanity-check the plan against `references/stack-rules.md` before implementing. If the user is present and the feature is large, show the plan and get a nod first; for small features, state it briefly and proceed.

## Step 3: Implement, one feature slice at a time

- TypeScript, functional components, small files. Never one huge file.
- Follow every rule in `references/stack-rules.md` — it is the law of this skill: shadcn/ui for all UI primitives, real R3F (never CSS-fake 3D), GSAP ScrollTrigger for scroll animations, Framer Motion for UI micro-interactions, dark premium theme.
- Reusable hooks for repeated logic (e.g., `useScrollReveal`, `useReducedMotion` gate).
- Lazy-load heavy pieces: `React.lazy` + `Suspense` for the Canvas and below-the-fold sections; dynamic import for GSAP plugins if bundle size matters.

## Step 4: Visual review loop (mandatory — do not self-certify)

Reading your own code and declaring it beautiful is a self-graded exam. Run the real check:

1. **Checklist pass**: read `references/design-checklist.md` and audit the code against every item. Fix violations before rendering anything.
2. **Screenshot pass**: read `references/visual-review.md` and follow it — start the dev server, capture Playwright screenshots at mobile/tablet/desktop widths, actually open and look at the images.
3. **Judge honestly** against the checklist: spacing rhythm, type hierarchy, contrast, gradient quality, glass effects, 3D lighting and composition, animation presence.
4. If anything fails, fix the code and re-screenshot. Repeat up to 3 iterations. If it still fails after 3, tell the user exactly what's unresolved and why instead of silently shipping it.
5. Report the result: what was checked, what was fixed, and (if the environment allows) show or link the final screenshots.

If the environment truly cannot run a browser (no Playwright possible), say so explicitly, do the checklist pass with extra rigor, and recommend the user run the dev server and report back — never pretend the visual check happened.

## Step 5: Performance gate before finishing

- Canvas and models lazy-loaded; `<Suspense>` fallbacks in place.
- `frameloop="demand"` or visibility-paused rendering for 3D where the scene is static between interactions.
- No layout-thrashing animations (animate transform/opacity, not width/top).
- Route/section-level code splitting on scaffolds.
- `prefers-reduced-motion` respected — gate GSAP timelines and heavy motion behind it.

## Reference files

- `references/stack-rules.md` — the non-negotiable stack rules: shadcn component map, R3F scene standards, GSAP vs Framer Motion split. Read during Step 2 and keep it in mind through Step 3.
- `references/scaffold-workflow.md` — new-project setup: exact init commands, folder structure, section order for portfolio-style sites. Read only in scaffold mode.
- `references/design-checklist.md` — the concrete definition of "looks premium". Read in Step 4 (and skim during Step 2 so you design toward it).
- `references/visual-review.md` — the Playwright screenshot loop, exact commands. Read in Step 4.
