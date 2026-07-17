# Design Checklist — the definition of "premium"

"Beautiful" is not a feeling here; it's this list. Audit code against it in the checklist pass, then judge screenshots against it in the visual pass. An item fails if you have to squint or rationalize.

## Layout & spacing
- [ ] Consistent vertical rhythm: section padding from one scale (e.g., py-24/py-32), not ad-hoc values per section.
- [ ] One max-width container system used everywhere; content never touches viewport edges on mobile (min px-4/px-6).
- [ ] Generous whitespace — if a section feels dense, it fails. One focal point per viewport.
- [ ] Grid alignment: cards/columns align to a real grid; no near-aligned edges off by a few pixels.

## Typography
- [ ] Clear hierarchy: display heading ≫ section heading ≫ body ≫ caption, each visually distinct at a glance.
- [ ] Display type is large and confident (hero heading ≥ text-5xl mobile / text-7xl+ desktop), tight tracking on large sizes.
- [ ] Line length for body text ~45–75 characters; headings use `text-balance`.
- [ ] No default-looking system font; the chosen font actually loads (check the screenshot, not the CSS).

## Color, gradients, glass
- [ ] Dark theme: near-black base, comfortable contrast (body text ≥ WCAG AA against its background).
- [ ] One accent color used with restraint; no rainbow gradients, no saturated banding visible in screenshots.
- [ ] Gradients are subtle (dark-to-dark, or a soft accent glow) and look intentional at all three viewport widths.
- [ ] Glass surfaces have all three: backdrop blur, low-opacity fill, subtle 1px border. Glass without blur or border reads as a gray box — fail.

## 3D scene (judge the screenshot, not the code)
- [ ] The scene reads as designed, not default: no flat gray unlit meshes, no obvious default cube energy.
- [ ] Lighting has depth — visible key/rim separation or a proper Environment; materials show highlights and shadow.
- [ ] Composition: the 3D content is framed within the section, balanced against the headline; doesn't collide with text or crop awkwardly at any breakpoint.
- [ ] Motion exists: floating/idle drift and/or camera movement (verify by taking two screenshots a second apart if uncertain).
- [ ] Fallback state (Suspense) is styled — never a blank hole while the model loads.

## Animation (verify presence, not just code)
- [ ] Scroll reveals actually fire: content below the fold animates in (screenshot mid-scroll to verify state differences).
- [ ] Timings feel premium: reveals ~0.6–1.2s with expo/power easing; micro-interactions ~0.15–0.3s. Nothing bounces cartoonishly.
- [ ] Staggers on grouped elements (nav items, card grids, split text) rather than everything popping at once.
- [ ] `prefers-reduced-motion` path exists and doesn't break layout.

## Responsive (all three screenshot widths)
- [ ] Mobile (390px): no horizontal overflow, readable type, tap targets ≥ 44px, 3D scene scaled or simplified sensibly.
- [ ] Tablet (768px): layout uses the width — not just stretched mobile.
- [ ] Desktop (1440px): content doesn't drown in an over-wide container; hero fills the viewport confidently.

## Scoring
Count failures per section. 0 failures = ship. 1–3 = fix and re-screenshot. 4+ = the architecture pass missed something — revisit the plan for that section, don't just patch pixels.
