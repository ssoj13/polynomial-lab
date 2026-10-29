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

## TODO
- [x] M1: Create `styles.css`, `i18n.js`, `engine.js`, and `index.html` with 2D → 3D → 4D bridge, JVC 1980s hardware buttons, and 5 official color themes.
- [x] M2: Bundle self-contained `polynomial_lab.html` artifact and pass automated Inquisitor verification (`91` `data-i18n` nodes, `15` `[?]` help buttons, `63` DOM IDs).
- [x] M3: Push to `ssoj13/polynomial-lab` (`main`) and verify GitHub Pages deployment.

## Changelog
- **2026-10-29 (v2)**: Upgraded to 3-stage `2D → 3D → 4D` visual bridge (`styles.css`, `i18n.js`, `engine.js`, `index.html`), added 5 official themes (`Catppuccin Mocha`, `Tokyo Night`, `Rosé Pine`, `Gruvbox Dark`, `Rosé Pine Dawn`), JVC 1980s hardware buttons (`⛶` icon-only expand, `⚙️` clutch with green/red LED dot, `[?]` popups), fixed expand/collapse sizing bug, and bound 100% of slider labels to `data-i18n` (`RU`/`EN`/`MN`).
- **2026-10-29 (v1)**: Initial creation of `polynomial-lab` repository and GitHub Pages deployment.
