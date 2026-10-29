# `polynomial-lab` — Local Agent Notebook

## Purpose
Standalone zero-dependency interactive web laboratory and tutorial for polynomials, Horner's evaluation scheme, Taylor approximations, Bézier/Lagrange splines, and 3D/4D algebraic polynomial manifolds (`WebGL2` Hopf fibration & Calabi–Yau quintic raymarcher + Complex Gauss Root Plane), featuring a trilingual (`EN` / `RU` / `MN`) HUD, 5 visual themes, and full-window widget expansion.

## Dataflow
```
[Top Bar: Theme Selector (5 Themes) | Language Toggle (EN/RU/MN) | Expand Toggle (⛶ / F)]
       │
       ├──► I18N Dictionary & CSS Variables ──► Live DOM HUD & Guide Modal
       ├──► Visualizer #1 (2D Canvas)       ──► Monomials, Draggable Roots, Taylor/Horner, Bézier/Lagrange
       └──► Visualizer #2 (WebGL2 + 2D HUD) ──► 68-Step Volumetric Algebraic Manifold + Gauss Root Plane (ℂ)
```

## Traps
- Keep `index.html` 100% self-contained with zero external CSS/JS runtime dependencies so GitHub Pages loads instantaneously and never suffers from third-party CDN blocks.
- Always resize both 2D and WebGL2 canvases with `devicePixelRatio` clamping when toggling `.widget-card.expanded` (`100vw × 100vh`).

## TODO
- [x] M1: Create standalone `index.html`, trilingual `README.md` (`EN`/`RU`/`MN`), and `AGENTS.md`.
- [x] M2: Update chat artifact `polynomial_lab.html` with full features.
- [x] M3: Create GitHub repository `ssoj13/polynomial-lab`, push `main`, and enable GitHub Pages.

## Changelog
- **2026-10-29**: Initial creation of `polynomial-lab` with Visualizer #1 (4-mode 2D Polynomial Workbench), Visualizer #2 (WebGL2 3D/4D Algebraic Manifold & Complex Gauss Root HUD), 5 visual themes, full-window expand toggles, and EN/RU/MN switcher.
