# `polynomial-lab` — Local Agent Notebook

## Purpose
Modular, zero-external-dependency interactive web laboratory and visual lesson on **Polynomials (`2D → 3D → 4D`)**:
1. **Window #1 (`2D Flat World`)**: $y = P(x)$ with 4 modes (Monomials/Anatomy, Factored Roots, Taylor Series & Horner's CPU scheme, Cubic Bézier vs Lagrange splines) + live **Complex Plane Root Radar ($\mathbb{C}$)** driven by a Durand–Kerner complex root solver.
2. **Window #2 (`3D Bridge`)**: 3D modular surface ("rubber trampoline") $h(x, y) = |P(x + iy)|$ over the complex floor $(x, iy)$ with a glowing neon 2D slice at $y = 0$, complex root beacons/funnels touching $h = 0$, a `👁 Side Profile (2D Slice)` camera button, and a 3D Bicubic Bézier Wing mode.
3. **Window #3 (`4D Hyperspace`)**: WebGL2 volumetric raymarcher of $z_1^n + z_2^n = c$, Hopf fibration ($\pi: S^3 \to S^2$), and Calabi–Yau quintic manifold with SO(4) spinor and Poincaré section $\partial\Omega$ HUDs.
4. **1980s JVC Hi-Fi Hardware UI**: Tactile chamfered buttons, icon-only Expand button (`⛶` / `🗗`), Master & Per-Window Clutch (`⚙️`) with recessed emerald-green / ruby-red LED indicator dots (`.jvc-led`), 15 `[?]` help popups, 9 plain-language glossary cards, 5 official themes (`Catppuccin Mocha`, `Tokyo Night`, `Rosé Pine`, `Gruvbox Dark`, `Rosé Pine Dawn`), and 100% SSOT trilingual switching (`RU` / `EN` / `MN`).

## Dataflow
```
[Top Header: Master Clutch ⚙️+LED | 5 Themes | EN / RU / MN Switcher]
       │
       ├──► i18n.js (window.POLY_I18N) ──► 100% data-i18n DOM & Slider Labels + [?] Popups + 9 Glossary Cards
       ├──► Window #1 (2D + ℂ Radar)   ──► Durand–Kerner Root Solver ──┐
       ├──► Window #2 (3D Bridge)      ◄─── Clutch Coupling (⚙️+LED) ◄─┼──► 3-Step Interactive Quest
       └──► Window #3 (4D WebGL2)      ◄─── Clutch Coupling (⚙️+LED) ◄─┘
```

## Traps
- **4D Raymarcher Camera Orbit Order & Y-Axis Sign Trap**: In GLSL `map4D(vec3 p)`, `p` starts in Camera Space (`ro + rd * t`). Never apply world yaw `p.xz *= rot(uRot.x)` *before* camera pitch `p.yz`, or pitch will rotate around the spinning object's local X-axis (inverting up/down every 180° of yaw/time and turning vertical drag into roll at 90°). Always apply camera pitch first (`p.yz *= rot(-uRot.y)` with `-uRot.y` to map DOM `clientY` down-positive to WebGL NDC `vUv.y` up-positive) and world yaw second (`p.xz *= rot(uRot.x)`).
- **Canvas Expand/Collapse Layout Trap**: Never allow `<canvas>` intrinsic `width`/`height` attributes to dictate flex/grid parent height, or collapsing a fullscreen widget will leave the window stretched. Keep `.canvas-viewport` / `.manifold-stage` at explicit heights (`430px` / `450px` in normal mode, `calc(100vh - ...)` in `.expanded`) and enforce `position: absolute; inset: 0; width: 100% !important; height: 100% !important;` on `<canvas>`.
- **SSOT Language Binding on Sliders**: Every slider label (`sl_c0`..`sl_4d_disp`) must carry `data-i18n="sl_..."` so switching `EN`/`RU`/`MN` updates 100% of slider labels alongside tabs and headings.
- **Widget Header Alignment Trap**: Never apply `justify-content: flex-end; margin-left: auto;` to `.widget-toolbar`, or all mode tabs and text buttons (`👁 Сбоку`, `↺ Камера 3D`) will shift to the right. Isolate only the two small square hardware icon buttons (`[Clutch LED]` and `[⛶ Expand]`) inside `.widget-top-row > .widget-hw-right` (`margin-left: auto`), and keep `.widget-toolbar` left-aligned (`justify-content: flex-start`).
- **Explanatory Copy Tone**: Never use patronizing exclamations like "Не пугайся букв и значков!" or "Don't let symbols scare you!". Use calm, matter-of-fact guidance: "Если встретите незнакомые обозначения — нажмите на иконку «?» рядом."
- **No Internal Widget Scrollbars & Horizontal Slider Cards**: Never squeeze `.controls-box` into a fixed-height right sidebar with `overflow-y: auto` or a `112px` side label column. Place `.controls-box` as a full-width horizontal section below the visual canvas stage (`overflow: visible`), using `.slider-grid` (`repeat(auto-fit, minmax(220px, 1fr))`) where each `.slider-row` puts the full label + value on a top row (`.slider-top`) and the `<input type="range">` slider across 100% width below.
- **3D Projection Double-Shrink Trap**: In `project3D`, never multiply `rx * s` by `0.42` after already dividing `fov` by `camDist`, or the 3D scene shrinks to ~70px (10-cent coin size). Use `camDist = 5.0 / zoom`, `fov = Math.min(w, h) * 0.96`, and `0.88` screen scale so the 3D mesh fills ~78% of the canvas.
- **Full 5-Coefficient 3D Trampoline & 3D Handle Dragging**: Never evaluate only `c2 * z^2 + c0` in `eval3DHeight(x, y)` or changing `a1`, `a3`, `a4` will leave the 3D trampoline static. Always evaluate `evalPolyComplex(get3DCoeffs(), { re: x, im: y })` across all 5 coefficients `[a0..a4]` and project interactive 3D handles (`apex3d`, `wing3d`, `root3d`, `bezierWing3d`) so users can drag points directly in 2D and 3D.
- **Dual Phonetic Transcription Rule (`EN` + `RU`/`MN`)**: Every formula and mathematical symbol (`SO(4)`, `∂Ω`, `R_μν = 0`, `Re(z)`, `Im(z)`, `y = P(x)`, etc.) must include both its English transcription/expansion and its Russian/Mongolian localized phonetic reading side by side (`англ.: '...' / рус.: «...»`).

## TODO
- [x] M1: Create `styles.css`, `i18n.js`, `engine.js`, and `index.html` with 2D → 3D → 4D bridge, JVC 1980s hardware buttons, and 22 daisyUI + Base16 color themes.
- [x] M2: Bundle self-contained `polynomial_lab.html` artifact and pass automated Inquisitor verification (`91` `data-i18n` nodes, `15` `[?]` help buttons, `85` DOM IDs, 2D & 3D point dragging, restored volumetric 4D shader `polynomialManifoldField`).
- [x] M3: Push to `ssoj13/polynomial-lab` (`main`) and verify GitHub Pages deployment.

## Changelog
- **2026-10-29 (v3)**: Restored grand volumetric 4D manifold shader (`polynomialManifoldField` + `rotSO4` + `uPoly` coupling + ACES tonemapping) from `890e135` with non-inverting camera pitch/yaw, wired full 5-coefficient polynomial evaluation `[a0..a4]` into 3D trampoline & root beacons, added direct 2D and 3D point dragging (`apex3d`, `wing3d`, `root3d`, `bezierWing3d`), refined line widths to `2.0px`, added 22 daisyUI/Base16 themes, eliminated internal widget scrollbars, and added dual English + Russian/Mongolian phonetic transcriptions everywhere.
- **2026-10-29 (v2)**: Upgraded to 3-stage `2D → 3D → 4D` visual bridge (`styles.css`, `i18n.js`, `engine.js`, `index.html`), added 5 official themes (`Catppuccin Mocha`, `Tokyo Night`, `Rosé Pine`, `Gruvbox Dark`, `Rosé Pine Dawn`), JVC 1980s hardware buttons (`⛶` icon-only expand, `⚙️` clutch with green/red LED dot, `[?]` popups), fixed expand/collapse sizing bug, and bound 100% of slider labels to `data-i18n` (`RU`/`EN`/`MN`).
- **2026-10-29 (v1)**: Initial creation of `polynomial-lab` repository and GitHub Pages deployment.
