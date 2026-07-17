# Visual Review Loop (Playwright screenshots)

Code review alone cannot judge lighting, spacing, or gradient quality. Render it and look.

## 1. One-time setup (per project)

```bash
npm i -D playwright
npx playwright install chromium --with-deps   # or: npx playwright install chromium
```

If browser install fails in this environment (network/display limits), stop pretending: fall back to checklist-only review and tell the user to run the dev server themselves.

## 2. Start the dev server in the background

```bash
npm run dev -- --port 5173 &
sleep 3
curl -sf http://localhost:5173 > /dev/null && echo "server up" || echo "SERVER FAILED"
```

If the server fails, fix build errors first — screenshots of a crash page are worthless.

## 3. Capture screenshots

Use a small script (save as `scripts/screenshot.mjs` in the project, reuse across iterations):

```js
import { chromium } from 'playwright';

const url = process.env.SHOT_URL ?? 'http://localhost:5173';
const outDir = process.env.SHOT_DIR ?? 'screenshots';
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // let 3D scene + entrance animations settle
  await page.screenshot({ path: `${outDir}/${vp.name}-top.png` });
  // mid-scroll shot to verify scroll reveals fire
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/${vp.name}-mid.png` });
  // full page for layout overview
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/${vp.name}-full.png`, fullPage: true });
  await page.close();
}
await browser.close();
console.log('screenshots done');
```

```bash
mkdir -p screenshots && node scripts/screenshot.mjs
```

For a specific route/section, set `SHOT_URL=http://localhost:5173/route`. To verify motion, take two shots 1s apart and compare — identical pixels in the 3D region means the scene is frozen.

## 4. Actually look at them

Open every image with the file viewer (view tool / Read tool on the .png paths). Judge each against `design-checklist.md`, section by section. Write down concrete failures ("desktop hero: gradient banding in top-right; mobile: h1 wraps to 4 lines; 3D scene unlit from the left").

## 5. Fix and repeat

Fix code → re-run the screenshot script into `screenshots/iter-2/` → re-judge. Maximum 3 iterations. Keep iteration directories so before/after is visible.

## 6. Report

Tell the user: what was captured, what failed on which iteration, what was fixed, what (if anything) remains. Offer the final screenshots as evidence — never a bare "it looks great now."
