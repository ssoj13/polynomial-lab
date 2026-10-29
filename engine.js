// ============================================================================
// POLYNOMIAL LAB (2D -> 3D -> 4D) — INTERACTIVE ENGINE
// Includes:
// 1. Durand-Kerner Complex Root Solver (2D + Complex Radar + 3D Funnels)
// 2. JVC 1980s Hardware Clutch System (Master + Per-Window Red/Green LED)
// 3. Bug-Free Fullscreen Expand / Collapse Controller (Scroll + Canvas Reset)
// 4. Window #1: 2D Canvas + Complex Plane Radar (Anatomy, Roots, Taylor, Bezier)
// 5. Window #2: 3D Bridge Canvas (Modular Trampoline |P(x+iy)| + 3D Bezier Wing)
// 6. Window #3: 4D WebGL2 Volumetric Raymarcher (Hopf Fibration & Calabi-Yau)
// 7. 100% SSOT Language Switcher (RU / EN / MN) + [?] Help Modal + Glossary
// ============================================================================

(function () {
  "use strict";

  // --- GLOBAL STATE ---
  let currentLang = localStorage.getItem("poly_lang") || "ru";
  let currentTheme = localStorage.getItem("poly_theme") || "synthwave";

  // Polynomial state: P(x) = c0 + c1*x + c2*x^2 + c3*x^3 + c4*x^4
  const polyState = {
    mode2d: "anatomy", // 'anatomy' | 'roots' | 'taylor' | 'bezier'
    c: [-1.0, 0.0, 1.0, 0.0, 0.0],
    roots: [-1.5, 0.2, 1.6],
    rootScale: 0.5,
    taylorDeg: 5,
    curveMode: "bezier", // 'bezier' | 'lagrange'
    bezierT: 0.45,
    ctrlPts: [
      { x: -2.2, y: -1.4 },
      { x: -0.9, y: 2.3 },
      { x: 0.9, y: -2.1 },
      { x: 2.2, y: 1.6 }
    ],
    draggingPt: -1,
    complexRoots: [] // Array of {re, im}
  };

  // Clutch state (Green LED = engaged, Red LED = disengaged)
  const clutchState = {
    master: true,
    w1: true,
    w2: true,
    w3: true
  };

  // Window #2 (3D Bridge) state — stores full [a0, a1, a2, a3, a4] polynomial!
  const state3D = {
    mode: "trampoline", // 'trampoline' | 'bezier3d'
    coeffs: [-1.0, 0.0, 1.0, 0.0, 0.0],
    c0: -1.0,
    c2: 1.0,
    sliceY: 0.0,
    showSlice: true,
    showPillars: true,
    yaw: -0.62,
    pitch: 0.48,
    targetYaw: null,
    targetPitch: null,
    zoom: 1.0,
    dragging: false,
    dragHandle: null,
    projectedHandles: [],
    lastX: 0,
    lastY: 0
  };

  // Window #3 (4D Hyperspace) state — matches grand volumetric shader from 890e135
  const state4D = {
    preset: 0,
    deg: 5.0,
    torsion: 1.4,
    fold: 0.65,
    disp: 1.15,
    yaw: 0.45,
    pitch: 0.32,
    zoom: 1.0,
    dragging: false,
    lastX: 0,
    lastY: 0
  };

  // --- THEME HELPER (Matches styles.css CSS Variables) ---
  function getThemeColors() {
    const cs = getComputedStyle(document.documentElement);
    const g = (v, fb) => cs.getPropertyValue(v).trim() || fb;
    return {
      bg: g("--bg-crust", "#11111b"),
      grid: g("--grid-line", "rgba(166,173,200,0.09)"),
      axis: g("--axis-line", "rgba(205,214,244,0.38)"),
      text: g("--fg", "#cdd6f4"),
      muted: g("--muted", "#7f849c"),
      accent: g("--mauve", "#cba6f7"),
      accent2: g("--accent", "#89b4fa"),
      accent3: g("--green", "#a6e3a1"),
      warn: g("--yellow", "#f9e2af"),
      danger: g("--red", "#f38ba8")
    };
  }

  // --- COMPLEX ARITHMETIC & DURAND-KERNER ROOT SOLVER ---
  function cSub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
  function cMul(a, b) {
    return {
      re: a.re * b.re - a.im * b.im,
      im: a.re * b.im + a.im * b.re
    };
  }
  function cDiv(a, b) {
    const d = b.re * b.re + b.im * b.im + 1e-18;
    return {
      re: (a.re * b.re + a.im * b.im) / d,
      im: (a.im * b.re - a.re * b.im) / d
    };
  }

  // Active polynomial coefficients [a0, a1, a2, a3, a4] across all 2D tabs
  function getActiveCoeffs() {
    if (polyState.mode2d === "roots") {
      const r1 = polyState.roots[0];
      const r2 = polyState.roots[1];
      const r3 = polyState.roots[2];
      const a = polyState.rootScale;
      const c0 = -a * r1 * r2 * r3;
      const c1 = a * (r1 * r2 + r2 * r3 + r1 * r3);
      const c2 = -a * (r1 + r2 + r3);
      const c3 = a;
      return [c0, c1, c2, c3, 0];
    }
    if (polyState.mode2d === "taylor") {
      const k = 1.45;
      const c1 = k;
      const c3 = polyState.taylorDeg >= 3 ? -(k * k * k) / 6.0 : 0.0;
      return [0.0, c1, 0.0, c3, 0.0];
    }
    if (polyState.mode2d === "bezier") {
      const pts = polyState.ctrlPts;
      const c0 = (pts[1].y + pts[2].y) * 0.35;
      const c1 = (pts[3].y - pts[0].y) * 0.22;
      const c2 = ((pts[0].y + pts[3].y) - (pts[1].y + pts[2].y)) * 0.18;
      const c3 = ((pts[3].y - pts[0].y) - 3 * (pts[2].y - pts[1].y)) * 0.06;
      return [c0, c1, c2, c3, 0.0];
    }
    return polyState.c.slice();
  }

  function evalPolyReal(coeffs, x) {
    let acc = 0;
    for (let i = coeffs.length - 1; i >= 0; i--) {
      acc = acc * x + coeffs[i];
    }
    return acc;
  }

  function evalPolyComplex(coeffs, z) {
    let acc = { re: 0, im: 0 };
    for (let i = coeffs.length - 1; i >= 0; i--) {
      acc = cMul(acc, z);
      acc.re += coeffs[i];
    }
    return acc;
  }

  function solveComplexRoots(coeffs) {
    let deg = coeffs.length - 1;
    while (deg > 0 && Math.abs(coeffs[deg]) < 1e-5) deg--;
    if (deg <= 0) return [];

    const lead = coeffs[deg];
    const norm = coeffs.slice(0, deg + 1).map(v => v / lead);

    if (deg === 1) {
      return [{ re: -norm[0], im: 0 }];
    }
    if (deg === 2) {
      const b = norm[1];
      const c = norm[0];
      const disc = b * b - 4 * c;
      if (disc >= 0) {
        const s = Math.sqrt(disc);
        return [
          { re: (-b - s) * 0.5, im: 0 },
          { re: (-b + s) * 0.5, im: 0 }
        ];
      } else {
        const s = Math.sqrt(-disc);
        return [
          { re: -b * 0.5, im: -s * 0.5 },
          { re: -b * 0.5, im: s * 0.5 }
        ];
      }
    }

    // Durand-Kerner iteration for degree 3 or 4
    const roots = [];
    for (let k = 0; k < deg; k++) {
      const ang = (2 * Math.PI * k) / deg + 0.37;
      const rad = 0.85 + 0.12 * k;
      roots.push({ re: rad * Math.cos(ang), im: rad * Math.sin(ang) });
    }

    for (let iter = 0; iter < 48; iter++) {
      for (let i = 0; i < deg; i++) {
        const zi = roots[i];
        const pVal = evalPolyComplex(norm, zi);
        let denom = { re: 1, im: 0 };
        for (let j = 0; j < deg; j++) {
          if (i !== j) {
            denom = cMul(denom, cSub(zi, roots[j]));
          }
        }
        const delta = cDiv(pVal, denom);
        roots[i] = cSub(zi, delta);
      }
    }

    for (let i = 0; i < roots.length; i++) {
      if (Math.abs(roots[i].im) < 1e-3) roots[i].im = 0;
    }
    roots.sort((a, b) => a.re - b.re || a.im - b.im);
    return roots;
  }

  // --- CLUTCH COUPLING SYSTEM ---
  function isWindowCoupled(winKey) {
    return clutchState.master && clutchState[winKey];
  }

  function updateClutchButtonsUI() {
    const dict = (window.POLY_I18N && window.POLY_I18N[currentLang]) || window.POLY_I18N.ru;
    const syncBtn = (el, engaged) => {
      if (!el) return;
      el.classList.toggle("engaged", engaged);
      el.classList.toggle("disengaged", !engaged);
    };

    syncBtn(document.getElementById("btnMasterClutch"), clutchState.master);
    document.querySelectorAll("[data-clutch]").forEach(btn => {
      const key = btn.getAttribute("data-clutch");
      const eff = clutchState.master && clutchState[key];
      syncBtn(btn, eff);
    });

    const hudClutch = document.getElementById("hud4dClutchState");
    if (hudClutch) {
      const eff3 = isWindowCoupled("w3");
      hudClutch.textContent = eff3 ? dict.hud_clutch_on : dict.hud_clutch_off;
      hudClutch.style.color = eff3 ? "var(--green)" : "var(--red)";
    }
  }

  function propagateFrom2D() {
    const coeffs = getActiveCoeffs();
    polyState.complexRoots = solveComplexRoots(coeffs);

    if (isWindowCoupled("w2") && isWindowCoupled("w1")) {
      state3D.coeffs = coeffs.slice();
      state3D.c0 = coeffs[0];
      state3D.c2 = coeffs[2];
      const sl3dC0 = document.getElementById("sl3dC0");
      const sl3dC2 = document.getElementById("sl3dC2");
      const val3dC0 = document.getElementById("val3dC0");
      const val3dC2 = document.getElementById("val3dC2");
      if (sl3dC0) sl3dC0.value = state3D.c0.toFixed(2);
      if (sl3dC2) sl3dC2.value = state3D.c2.toFixed(2);
      if (val3dC0) val3dC0.textContent = state3D.c0.toFixed(2);
      if (val3dC2) val3dC2.textContent = state3D.c2.toFixed(2);
    }

    if (isWindowCoupled("w3") && isWindowCoupled("w1")) {
      let activeDeg = 2;
      for (let i = 4; i >= 1; i--) {
        if (Math.abs(coeffs[i]) > 0.08) {
          activeDeg = i + 2;
          break;
        }
      }
      const imagEnergy = polyState.complexRoots.reduce((acc, r) => acc + Math.abs(r.im), 0);
      const coeffEnergy = Math.hypot(coeffs[0], coeffs[1], coeffs[2], coeffs[3], coeffs[4]);
      state4D.deg = Math.max(2, Math.min(8, activeDeg + Math.abs(coeffs[3]) * 0.4 + Math.abs(coeffs[4]) * 0.8));
      state4D.torsion = Math.max(
        0.2,
        Math.min(3.5, 0.95 + coeffEnergy * 0.38 + coeffs[1] * 0.3 + imagEnergy * 0.35)
      );
      state4D.fold = Math.max(0.05, Math.min(1.5, 0.65 + coeffs[0] * 0.22));
      state4D.disp = Math.max(0.2, Math.min(2.0, 1.05 + coeffs[1] * 0.18 + coeffs[3] * 0.22));

      const slDeg = document.getElementById("sl4dDeg");
      const slTor = document.getElementById("sl4dTorsion");
      const slFold = document.getElementById("sl4dFold");
      const slDisp = document.getElementById("sl4dDisp");
      const vDeg = document.getElementById("val4dDeg");
      const vTor = document.getElementById("val4dTorsion");
      const vFold = document.getElementById("val4dFold");
      const vDisp = document.getElementById("val4dDisp");
      const hudDeg = document.getElementById("hud4dDegVal");

      if (slDeg) slDeg.value = state4D.deg.toFixed(1);
      if (slTor) slTor.value = state4D.torsion.toFixed(2);
      if (slFold) slFold.value = state4D.fold.toFixed(2);
      if (slDisp) slDisp.value = state4D.disp.toFixed(2);
      if (vDeg) vDeg.textContent = state4D.deg.toFixed(1);
      if (vTor) vTor.textContent = state4D.torsion.toFixed(2);
      if (vFold) vFold.textContent = state4D.fold.toFixed(2);
      if (vDisp) vDisp.textContent = state4D.disp.toFixed(2);
      if (hudDeg) hudDeg.textContent = "n = " + Math.round(state4D.deg);
    }

    updateFormulaBanner();
    updateRootTelemetry();
  }

  function propagateFrom3D() {
    state3D.coeffs[0] = state3D.c0;
    state3D.coeffs[2] = state3D.c2;
    if (isWindowCoupled("w2") && isWindowCoupled("w1")) {
      polyState.mode2d = "anatomy";
      activate2DTab("anatomy");
      polyState.c[0] = state3D.c0;
      polyState.c[2] = state3D.c2;
      state3D.coeffs = polyState.c.slice();
      sync2DSlidersFromState();
      propagateFrom2D();
    } else {
      updateRootTelemetry();
    }
  }

  function sync2DSlidersFromState() {
    for (let i = 0; i <= 4; i++) {
      const sl = document.getElementById("slC" + i);
      const vl = document.getElementById("valC" + i);
      if (sl) sl.value = polyState.c[i];
      if (vl) vl.textContent = Number(polyState.c[i]).toFixed(2);
    }
  }

  // --- FORMULA & TELEMETRY UPDATES ---
  function formatTerm(coeff, pow, isFirst) {
    if (Math.abs(coeff) < 1e-3 && pow > 0) return "";
    const sign = coeff < 0 ? " − " : isFirst ? "" : " + ";
    const absC = Math.abs(coeff).toFixed(2);
    const sups = ["", "x", "x²", "x³", "x⁴"];
    return `${sign}${absC}${sups[pow]}`;
  }

  function updateFormulaBanner() {
    const coeffs = getActiveCoeffs();
    let s = "P(x) = ";
    let first = true;
    for (let i = 0; i < coeffs.length; i++) {
      if (Math.abs(coeffs[i]) < 1e-3 && i > 0) continue;
      s += formatTerm(coeffs[i], i, first);
      first = false;
    }
    if (first) s += "0.00";
    const banner = document.getElementById("formulaReadout2D");
    if (banner) banner.textContent = s;

    const expandedBox = document.getElementById("rootsExpandedFormula");
    if (expandedBox) {
      const dict = (window.POLY_I18N && window.POLY_I18N[currentLang]) || window.POLY_I18N.ru;
      expandedBox.textContent = `${dict.expanded_prefix} ${s}`;
    }

    const hornerEl = document.getElementById("hornerStepsBox");
    if (hornerEl) {
      const c = polyState.c;
      const x0 = 1.5;
      const v = evalPolyReal(c, x0);
      hornerEl.innerHTML =
        `P(x) = (${c[0].toFixed(1)}) + x·(${c[1].toFixed(1)} + x·(${c[2].toFixed(1)} + x·(${c[3].toFixed(1)} + x·(${c[4].toFixed(1)}))))<br>` +
        `<span style="color:var(--green)">x = ${x0.toFixed(1)} ⇒ P(${x0.toFixed(1)}) = ${v.toFixed(3)} (4 MUL + 4 ADD)</span>`;
    }
  }

  function updateRootTelemetry() {
    const dict = (window.POLY_I18N && window.POLY_I18N[currentLang]) || window.POLY_I18N.ru;
    const roots = polyState.complexRoots;
    const realRoots = roots.filter(r => Math.abs(r.im) < 0.02);

    const badge = document.getElementById("realRootsBadge2D");
    if (badge) {
      if (realRoots.length > 0) {
        badge.textContent = `${dict.real_roots_prefix} ${realRoots.map(r => r.re.toFixed(2)).join(", ")}`;
        badge.style.color = "var(--green)";
      } else {
        badge.textContent = dict.real_roots_none;
        badge.style.color = "var(--red)";
      }
    }

    const listEl = document.getElementById("complexRootList");
    if (listEl) {
      if (roots.length === 0) {
        listEl.innerHTML = `<span class="mono">deg = 0</span>`;
      } else {
        listEl.innerHTML = roots
          .map((r, idx) => {
            const isReal = Math.abs(r.im) < 0.02;
            const sign = r.im >= 0 ? "+" : "−";
            const col = isReal ? "var(--green)" : "var(--mauve)";
            const txt = isReal
              ? `z<sub>${idx + 1}</sub>=${r.re.toFixed(2)} (${dict.root_real_tag})`
              : `z<sub>${idx + 1}</sub>=${r.re.toFixed(2)}${sign}${Math.abs(r.im).toFixed(2)}i (${dict.root_imag_tag})`;
            return `<span class="mono" style="color:${col};font-size:11.5px;margin-right:8px;">${txt}</span>`;
          })
          .join("");
      }
    }

    const w2Live = document.getElementById("w2LiveRootStatus");
    if (w2Live) {
      const ratio = -state3D.c0 / (Math.abs(state3D.c2) < 0.05 ? 0.05 : state3D.c2);
      if (ratio >= 0) {
        const rx = Math.sqrt(ratio).toFixed(2);
        w2Live.innerHTML = dict.w2_live_real.replace("{r1}", (-rx).toString()).replace("{r2}", rx.toString());
        w2Live.style.borderColor = "var(--green)";
      } else {
        const iy = Math.sqrt(-ratio).toFixed(2);
        w2Live.innerHTML = dict.w2_live_complex.replace("{im}", iy.toString());
        w2Live.style.borderColor = "var(--mauve)";
      }
    }
  }

  // --- WINDOW #1: 2D CANVAS + COMPLEX RADAR RENDERER ---
  function drawWindow1() {
    const canvas = document.getElementById("plot2dCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    if (w < 10 || h < 10) return;

    const theme = getThemeColors();
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    const xMin = -3.2, xMax = 3.2;
    const yMin = -3.2, yMax = 3.2;
    const toX = x => ((x - xMin) / (xMax - xMin)) * w;
    const toY = y => h - ((y - yMin) / (yMax - yMin)) * h;

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    for (let gx = -3; gx <= 3; gx++) {
      const px = toX(gx);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let gy = -3; gy <= 3; gy++) {
      const py = toY(gy);
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }

    ctx.strokeStyle = theme.axis;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, toY(0)); ctx.lineTo(w, toY(0));
    ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), h);
    ctx.stroke();

    ctx.fillStyle = theme.muted;
    ctx.font = "11px monospace";
    for (let gx = -3; gx <= 3; gx++) {
      if (gx === 0) continue;
      ctx.fillText(gx.toString(), toX(gx) - 6, toY(0) + 15);
    }

    const mode = polyState.mode2d;
    const coeffs = getActiveCoeffs();

    if (mode === "anatomy" || mode === "roots") {
      const showMono = document.getElementById("chkShowMonomials")?.checked;
      if (mode === "anatomy" && showMono) {
        const monoColors = [theme.warn, theme.accent2, theme.accent, theme.accent3, theme.danger];
        for (let m = 0; m <= 4; m++) {
          const cm = polyState.c[m];
          if (Math.abs(cm) < 0.02) continue;
          ctx.strokeStyle = monoColors[m];
          ctx.lineWidth = 1.4;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          for (let px = 0; px <= w; px += 3) {
            const x = xMin + (px / w) * (xMax - xMin);
            const y = cm * Math.pow(x, m);
            const py = toY(y);
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.0;
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = xMin + (px / w) * (xMax - xMin);
        const y = evalPolyReal(coeffs, x);
        const py = toY(y);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      polyState.complexRoots.forEach(r => {
        if (Math.abs(r.im) < 0.025) {
          const rx = toX(r.re);
          const ry = toY(0);
          ctx.fillStyle = theme.accent3;
          ctx.beginPath();
          ctx.arc(rx, ry, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      });

      // Draw interactive curve-bending grab handles so user knows they can grab & bend the curve directly
      if (mode === "anatomy") {
        const handleXs = [-1.8, -1.0, 0.0, 1.0, 1.8];
        handleXs.forEach(hx => {
          const hy = evalPolyReal(coeffs, hx);
          if (hy >= yMin + 0.15 && hy <= yMax - 0.15) {
            const px = toX(hx);
            const py = toY(hy);
            ctx.fillStyle = hx === 0 ? theme.warn : theme.accent2;
            ctx.beginPath();
            ctx.arc(px, py, 3.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = theme.bg;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        });
      } else if (mode === "roots") {
        // Draw amplitude handle at midpoint between r1 and r2
        const midX = 0.5 * (polyState.roots[0] + polyState.roots[1]);
        const midY = evalPolyReal(coeffs, midX);
        if (midY >= yMin + 0.15 && midY <= yMax - 0.15) {
          const px = toX(midX);
          const py = toY(midY);
          ctx.fillStyle = theme.warn;
          ctx.beginPath();
          ctx.arc(px, py, 4.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }
    } else if (mode === "taylor") {
      ctx.strokeStyle = theme.accent2;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (xMin + (px / w) * (xMax - xMin)) * 1.45;
        const y = Math.sin(x);
        const py = toY(y);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      const maxDeg = polyState.taylorDeg;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (xMin + (px / w) * (xMax - xMin)) * 1.45;
        let sum = 0;
        let term = x;
        let sign = 1;
        for (let k = 1; k <= maxDeg; k += 2) {
          if (k === 1) term = x;
          else term *= (x * x) / ((k - 1) * k);
          sum += sign * term;
          sign = -sign;
        }
        const py = toY(sum);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else if (mode === "bezier") {
      const pts = polyState.ctrlPts;
      if (polyState.curveMode === "bezier") {
        ctx.strokeStyle = theme.muted;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        pts.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(toX(p.x), toY(p.y));
          else ctx.lineTo(toX(p.x), toY(p.y));
        });
        ctx.stroke();
        ctx.setLineDash([]);

        const t = polyState.bezierT;
        const lerpPt = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u });
        const q0 = lerpPt(pts[0], pts[1], t);
        const q1 = lerpPt(pts[1], pts[2], t);
        const q2 = lerpPt(pts[2], pts[3], t);
        const r0 = lerpPt(q0, q1, t);
        const r1 = lerpPt(q1, q2, t);
        const s0 = lerpPt(r0, r1, t);

        ctx.strokeStyle = theme.accent2;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(toX(q0.x), toY(q0.y)); ctx.lineTo(toX(q1.x), toY(q1.y)); ctx.lineTo(toX(q2.x), toY(q2.y));
        ctx.moveTo(toX(r0.x), toY(r0.y)); ctx.lineTo(toX(r1.x), toY(r1.y));
        ctx.stroke();

        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const u = step / 100;
          const b0 = Math.pow(1 - u, 3);
          const b1 = 3 * u * Math.pow(1 - u, 2);
          const b2 = 3 * u * u * (1 - u);
          const b3 = u * u * u;
          const bx = b0 * pts[0].x + b1 * pts[1].x + b2 * pts[2].x + b3 * pts[3].x;
          const by = b0 * pts[0].y + b1 * pts[1].y + b2 * pts[2].y + b3 * pts[3].y;
          if (step === 0) ctx.moveTo(toX(bx), toY(by));
          else ctx.lineTo(toX(bx), toY(by));
        }
        ctx.stroke();

        ctx.fillStyle = theme.accent3;
        ctx.beginPath();
        ctx.arc(toX(s0.x), toY(s0.y), 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = theme.danger;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let px = 0; px <= w; px += 2) {
          const x = xMin + (px / w) * (xMax - xMin);
          let y = 0;
          for (let i = 0; i < pts.length; i++) {
            let li = 1;
            for (let j = 0; j < pts.length; j++) {
              if (i !== j) {
                const denom = pts[i].x - pts[j].x;
                li *= (x - pts[j].x) / (Math.abs(denom) < 1e-3 ? 1e-3 : denom);
              }
            }
            y += pts[i].y * li;
          }
          const py = toY(Math.max(-10, Math.min(10, y)));
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      pts.forEach((p, idx) => {
        const px = toX(p.x);
        const py = toY(p.y);
        ctx.fillStyle = theme.warn;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = theme.text;
        ctx.font = "bold 11px monospace";
        ctx.fillText(`P${idx}`, px + 7, py - 6);
      });
    }

    drawComplexRadar(theme);
  }

  function drawComplexRadar(theme) {
    const radar = document.getElementById("complexRadarCanvas");
    if (!radar) return;
    const ctx = radar.getContext("2d");
    const w = radar.width;
    const h = radar.height;
    if (w < 10 || h < 10) return;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const scale = Math.min(w, h) / 5.4;

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    [1, 2].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.strokeStyle = theme.axis;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.stroke();

    ctx.fillStyle = theme.muted;
    ctx.font = "10px monospace";
    ctx.fillText("Re (X)", w - 44, cy - 4);
    ctx.fillText("Im (iY)", cx + 5, 11);

    polyState.complexRoots.forEach(r => {
      const px = cx + r.re * scale;
      const py = cy - r.im * scale;
      const isReal = Math.abs(r.im) < 0.025;
      ctx.fillStyle = isReal ? theme.accent3 : theme.accent;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(px, py, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  // --- WINDOW #2: 3D MODULAR SURFACE & 3D BEZIER WING RENDERER ---
  function project3D(x, y, z, w, h, yaw, pitch, zoom) {
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

    const rx = x * cosY - y * sinY;
    const ry = x * sinY + y * cosY;
    const rz = z;

    const cy = ry * cosP - rz * sinP;
    const cz = ry * sinP + rz * cosP;

    const camDist = 5.0 / zoom;
    const fov = Math.min(w, h) * 0.96;
    const depth = camDist + cy * 0.35;
    const s = fov / Math.max(1.2, depth);

    return {
      sx: w * 0.5 + rx * s * 0.88,
      sy: h * 0.64 - cz * s * 0.88,
      depth
    };
  }

  function get3DCoeffs() {
    if (Array.isArray(state3D.coeffs) && state3D.coeffs.length === 5) {
      return state3D.coeffs;
    }
    return [state3D.c0, 0, state3D.c2, 0, 0];
  }

  function eval3DHeight(x, y) {
    const val = evalPolyComplex(get3DCoeffs(), { re: x, im: y });
    const mod = Math.hypot(val.re, val.im);
    return Math.min(3.3, Math.log1p(mod) * 1.15);
  }

  function drawWindow2() {
    const canvas = document.getElementById("plot3dCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    if (w < 10 || h < 10) return;

    if (state3D.targetYaw !== null && state3D.targetPitch !== null) {
      const dy = state3D.targetYaw - state3D.yaw;
      const dp = state3D.targetPitch - state3D.pitch;
      if (Math.hypot(dy, dp) < 0.008) {
        state3D.yaw = state3D.targetYaw;
        state3D.pitch = state3D.targetPitch;
        state3D.targetYaw = null;
        state3D.targetPitch = null;
      } else {
        state3D.yaw += dy * 0.14;
        state3D.pitch += dp * 0.14;
      }
    }

    const theme = getThemeColors();
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    const yaw = state3D.yaw;
    const pitch = state3D.pitch;
    const zoom = state3D.zoom;
    state3D.projectedHandles = [];

    if (state3D.mode === "trampoline") {
      const range = 2.1;
      const floorSteps = 12;
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= floorSteps; i++) {
        const u = -range + (2 * range * i) / floorSteps;
        const p1 = project3D(u, -range, 0, w, h, yaw, pitch, zoom);
        const p2 = project3D(u, range, 0, w, h, yaw, pitch, zoom);
        ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy); ctx.lineTo(p2.sx, p2.sy); ctx.stroke();

        const q1 = project3D(-range, u, 0, w, h, yaw, pitch, zoom);
        const q2 = project3D(range, u, 0, w, h, yaw, pitch, zoom);
        ctx.beginPath(); ctx.moveTo(q1.sx, q1.sy); ctx.lineTo(q2.sx, q2.sy); ctx.stroke();
      }

      const axX = project3D(range + 0.25, 0, 0, w, h, yaw, pitch, zoom);
      const axY = project3D(0, range + 0.25, 0, w, h, yaw, pitch, zoom);
      const axZ = project3D(0, 0, 2.8, w, h, yaw, pitch, zoom);
      ctx.fillStyle = theme.muted;
      ctx.font = "bold 11px monospace";
      ctx.fillText("Real X", axX.sx - 18, axX.sy + 4);
      ctx.fillText("Imag iY", axY.sx - 20, axY.sy + 4);
      ctx.fillText("Height |P(z)|", axZ.sx - 30, axZ.sy - 6);

      const N = 26;
      const quads = [];
      for (let ix = 0; ix < N; ix++) {
        const x0 = -range + (2 * range * ix) / N;
        const x1 = -range + (2 * range * (ix + 1)) / N;
        for (let iy = 0; iy < N; iy++) {
          const y0 = -range + (2 * range * iy) / N;
          const y1 = -range + (2 * range * (iy + 1)) / N;

          const z00 = eval3DHeight(x0, y0);
          const z10 = eval3DHeight(x1, y0);
          const z11 = eval3DHeight(x1, y1);
          const z01 = eval3DHeight(x0, y1);

          const p00 = project3D(x0, y0, z00, w, h, yaw, pitch, zoom);
          const p10 = project3D(x1, y0, z10, w, h, yaw, pitch, zoom);
          const p11 = project3D(x1, y1, z11, w, h, yaw, pitch, zoom);
          const p01 = project3D(x0, y1, z01, w, h, yaw, pitch, zoom);

          const avgZ = (z00 + z10 + z11 + z01) * 0.25;
          const avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) * 0.25;
          quads.push({ p00, p10, p11, p01, avgZ, avgDepth });
        }
      }

      quads.sort((a, b) => b.avgDepth - a.avgDepth);

      for (let i = 0; i < quads.length; i++) {
        const q = quads[i];
        const tNorm = Math.min(1, q.avgZ / 2.6);
        const hue = 155 + tNorm * 125;
        ctx.fillStyle = `hsla(${hue}, 78%, ${48 + tNorm * 14}%, 0.34)`;
        ctx.strokeStyle = `hsla(${hue}, 82%, 66%, 0.42)`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(q.p00.sx, q.p00.sy);
        ctx.lineTo(q.p10.sx, q.p10.sy);
        ctx.lineTo(q.p11.sx, q.p11.sy);
        ctx.lineTo(q.p01.sx, q.p01.sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      if (state3D.showSlice) {
        const sy = state3D.sliceY;
        ctx.fillStyle = "rgba(137, 180, 250, 0.08)";
        const cA = project3D(-range, sy, 0, w, h, yaw, pitch, zoom);
        const cB = project3D(range, sy, 0, w, h, yaw, pitch, zoom);
        const cC = project3D(range, sy, 2.7, w, h, yaw, pitch, zoom);
        const cD = project3D(-range, sy, 2.7, w, h, yaw, pitch, zoom);
        ctx.beginPath();
        ctx.moveTo(cA.sx, cA.sy); ctx.lineTo(cB.sx, cB.sy);
        ctx.lineTo(cC.sx, cC.sy); ctx.lineTo(cD.sx, cD.sy);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = theme.warn;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = theme.warn;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        const sliceSteps = 80;
        for (let s = 0; s <= sliceSteps; s++) {
          const x = -range + (2 * range * s) / sliceSteps;
          const z = eval3DHeight(x, sy);
          const pt = project3D(x, sy, z, w, h, yaw, pitch, zoom);
          if (s === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Interactive 3D curve-bending handles on the glowing slice seam:
        // 1) Central apex handle (lifts/lowers a0 directly in 3D)
        const zApex = eval3DHeight(0, sy);
        const pApex = project3D(0, sy, zApex, w, h, yaw, pitch, zoom);
        ctx.fillStyle = theme.warn;
        ctx.beginPath();
        ctx.arc(pApex.sx, pApex.sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.bg;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        state3D.projectedHandles.push({
          kind: "apex3d",
          sx: pApex.sx,
          sy: pApex.sy,
          x: 0,
          y: sy,
          z: zApex
        });

        // 2) Left & right wing handles on the slice seam (bends a2 bowl & a1 slope directly in 3D)
        [-1.35, 1.35].forEach(wx => {
          const wz = eval3DHeight(wx, sy);
          const pWing = project3D(wx, sy, wz, w, h, yaw, pitch, zoom);
          ctx.fillStyle = theme.accent2;
          ctx.beginPath();
          ctx.arc(pWing.sx, pWing.sy, 4.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          state3D.projectedHandles.push({
            kind: "wing3d",
            side: wx < 0 ? -1 : 1,
            sx: pWing.sx,
            sy: pWing.sy,
            x: wx,
            y: sy,
            z: wz
          });
        });
      }

      if (state3D.showPillars) {
        const roots3D = solveComplexRoots(get3DCoeffs());

        roots3D.forEach((rt, idx) => {
          const isReal = Math.abs(rt.im) < 0.025;
          const pFloor = project3D(rt.re, rt.im, 0, w, h, yaw, pitch, zoom);
          const pTop = project3D(rt.re, rt.im, 1.8, w, h, yaw, pitch, zoom);
          const col = isReal ? theme.accent3 : theme.danger;

          ctx.strokeStyle = col;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(pFloor.sx, pFloor.sy);
          ctx.lineTo(pTop.sx, pTop.sy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pFloor.sx, pFloor.sy, 4.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          state3D.projectedHandles.push({
            kind: "root3d",
            idx,
            sx: pFloor.sx,
            sy: pFloor.sy,
            x: rt.re,
            y: rt.im,
            z: 0
          });

          ctx.fillStyle = theme.text;
          ctx.font = "bold 11px monospace";
          const lbl = isReal
            ? `z${idx + 1}=${rt.re.toFixed(2)}`
            : `z${idx + 1}=${rt.re.toFixed(1)}${rt.im >= 0 ? "+" : ""}${rt.im.toFixed(1)}i`;
          ctx.fillText(lbl, pFloor.sx + 7, pFloor.sy - 5);
        });
      }
    } else {
      const gridN = 18;
      const range = 2.0;
      const c3d = get3DCoeffs();
      const arch = c3d[0] * -0.55;
      const tilt = (c3d[1] || 0) * 0.28;
      const twist = (c3d[2] || 1.0) * 0.45;
      const wave3 = (c3d[3] || 0) * 0.18;

      const evalWingZ = (u, v) => {
        const bellU = 1 - u * u * 0.35;
        const waveV = Math.sin(v * 1.3) * twist * u;
        return 0.9 + arch * bellU * (1 - v * v * 0.25) + tilt * u + wave3 * (u * u * u * 0.3) + waveV;
      };

      for (let i = 0; i <= gridN; i++) {
        const u = -range + (2 * range * i) / gridN;
        ctx.strokeStyle = i === Math.floor(gridN / 2) ? theme.warn : theme.accent;
        ctx.lineWidth = i === Math.floor(gridN / 2) ? 2.0 : 1.0;
        ctx.beginPath();
        for (let j = 0; j <= gridN; j++) {
          const v = -range + (2 * range * j) / gridN;
          const pt = project3D(u, v, evalWingZ(u, v), w, h, yaw, pitch, zoom);
          if (j === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }
      for (let j = 0; j <= gridN; j++) {
        const v = -range + (2 * range * j) / gridN;
        ctx.strokeStyle = theme.accent2;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let i = 0; i <= gridN; i++) {
          const u = -range + (2 * range * i) / gridN;
          const pt = project3D(u, v, evalWingZ(u, v), w, h, yaw, pitch, zoom);
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();
      }

      // Draw interactive 3D Bézier wing control handles
      const wingCtrl = [
        { u: 0.0, v: 0.0, col: theme.warn, lbl: "B0(a₀)", role: "arch" },
        { u: 1.45, v: 0.0, col: theme.accent3, lbl: "B1(a₁)", role: "tiltPos" },
        { u: -1.45, v: 0.0, col: theme.accent3, lbl: "B2(a₁)", role: "tiltNeg" },
        { u: 1.25, v: 1.25, col: theme.danger, lbl: "B3(a₂)", role: "twist" }
      ];
      wingCtrl.forEach(wc => {
        const wz = evalWingZ(wc.u, wc.v);
        const pt = project3D(wc.u, wc.v, wz, w, h, yaw, pitch, zoom);
        ctx.fillStyle = wc.col;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 4.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.bg;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.fillStyle = theme.text;
        ctx.font = "bold 11px monospace";
        ctx.fillText(wc.lbl, pt.sx + 6, pt.sy - 5);
        state3D.projectedHandles.push({
          kind: "bezierWing3d",
          role: wc.role,
          sx: pt.sx,
          sy: pt.sy,
          x: wc.u,
          y: wc.v,
          z: wz
        });
      });
    }
  }

  // --- WINDOW #3: 4D WEBGL2 VOLUMETRIC RAYMARCHER & HUD ---
  let gl4d = null;
  let prog4d = null;
  let vao4d = null;
  let uLocs4d = {};

  function initWebGL4D() {
    const canvas = document.getElementById("glManifoldCanvas");
    if (!canvas) return;
    gl4d = canvas.getContext("webgl2", { antialias: true });
    if (!gl4d) return;

    const vsSrc = `#version 300 es
      in vec2 aPos;
      out vec2 vUv;
      void main() {
        vUv = aPos;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const fsSrc = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;

      uniform vec2 uRes;
      uniform float uTime;
      uniform float uDeg;
      uniform float uTorsion;
      uniform float uFold;
      uniform float uDisp;
      uniform vec2 uRot;
      uniform float uZoom;
      uniform int uPreset;
      uniform vec4 uPoly;

      mat2 rot2(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      vec4 rotSO4(vec4 p, float alpha, float beta) {
        float ca = cos(alpha), sa = sin(alpha);
        float cb = cos(beta),  sb = sin(beta);
        vec4 q = vec4(
          ca * p.x - sa * p.y,
          sa * p.x + ca * p.y,
          cb * p.z - sb * p.w,
          sb * p.z + cb * p.w
        );
        float cw = cos(alpha * 0.5), sw = sin(alpha * 0.5);
        q.xz = mat2(cw, -sw, sw, cw) * q.xz;
        return q;
      }

      vec2 polynomialManifoldField(vec3 p, float t) {
        float polyMod = 0.12 * (uPoly.x + uPoly.y * p.x + uPoly.z * (p.x * p.x - p.y * p.y) + uPoly.w * p.z);
        p += (uFold * 0.28 + polyMod) * sin(p.yzx * uDeg + t * 0.65);

        float r2 = dot(p, p);
        float invDenom = 1.0 / (1.0 + r2);
        vec4 z = vec4(2.0 * p, r2 - 1.0) * invDenom;
        z = rotSO4(z, t * 0.33 + uFold * 0.6, t * 0.21 * uTorsion);

        float phi1 = atan(z.y, z.x);
        float phi2 = atan(z.w, z.z);
        float eta = atan(length(z.zw), length(z.xy));

        float knotPhase = uDeg * phi1 - floor(uTorsion * 2.0 + 0.5) * phi2 + t * 0.95;
        float targetEta = 0.785398 + (0.32 + 0.08 * uPoly.w) * sin(knotPhase);

        float conformal = (1.0 + r2) * 0.5;
        float dShell = abs(eta - targetEta) * conformal * 0.55;

        float dualPhase = sin(uDeg * phi1 + uTorsion * phi2 * 2.0 - t * 0.75);
        float dWeb = length(vec2(eta - 0.785398, dualPhase * 0.25)) * conformal * 0.52;

        float dQuintic = abs(length(p) - 0.85 - 0.16 * cos(uDeg * phi1 + 4.0 * phi2)) * 0.58;
        float d = min(dShell, dWeb);
        float quinticMix = clamp(uFold * 0.65 + (uPreset == 1 ? 0.35 : 0.0), 0.0, 1.0);
        d = mix(d, min(d, dQuintic), quinticMix);

        float spectralAngle = phi1 * 1.5 - phi2 * 1.5 + eta * 3.0 + polyMod * 4.0;
        return vec2(d, spectralAngle);
      }

      vec3 palette(float x) {
        vec3 a = vec3(0.50, 0.52, 0.58);
        vec3 b = vec3(0.48, 0.45, 0.48);
        vec3 c = vec3(1.00, 1.00, 1.00);
        vec3 d = vec3(0.05, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * x + d));
      }

      void main() {
        vec2 uv = (vUv * uRes) / min(uRes.x, uRes.y);
        float t = uTime;

        vec3 ro = vec3(0.0, 0.0, -3.35 / uZoom);
        vec3 rd = normalize(vec3(uv, 1.45));

        // 1. Pitch around camera horizontal axis FIRST (no vertical inversion)
        mat2 rx = rot2(-uRot.y);
        // 2. Yaw around world vertical axis SECOND
        mat2 ry = rot2(-uRot.x - t * 0.1);
        ro.yz = rx * ro.yz;
        rd.yz = rx * rd.yz;
        ro.xz = ry * ro.xz;
        rd.xz = ry * rd.xz;

        vec3 col = vec3(0.01, 0.015, 0.038);
        float dist = 0.2;
        vec3 accum = vec3(0.0);

        for (int i = 0; i < 68; i++) {
          vec3 pos = ro + rd * dist;
          vec2 res = polynomialManifoldField(pos, t);
          float d = res.x;
          float phase = res.y;

          vec3 fiberCol = palette(phase * 0.15915 + uDisp * dist * 0.22 + t * 0.07);
          float stepDist = max(abs(d) * 0.54, 0.016);
          float density = exp(-abs(d) * 19.0) / (1.0 + dist * dist * 0.14);
          float fringe = 0.65 + 0.35 * sin(phase * 4.0 + dist * 6.0 - t * 2.8);
          accum += fiberCol * density * fringe * 0.058;

          dist += stepDist;
          if (dist > 7.6) break;
        }

        col += accum * (1.2 + uDisp * 0.42);
        col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
        col *= 1.0 - 0.22 * dot(vUv, vUv);
        fragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(0.9)), 1.0);
      }
    `;

    const compile = (type, src) => {
      const sh = gl4d.createShader(type);
      gl4d.shaderSource(sh, src);
      gl4d.compileShader(sh);
      return sh;
    };

    const vs = compile(gl4d.VERTEX_SHADER, vsSrc);
    const fs = compile(gl4d.FRAGMENT_SHADER, fsSrc);
    prog4d = gl4d.createProgram();
    gl4d.attachShader(prog4d, vs);
    gl4d.attachShader(prog4d, fs);
    gl4d.linkProgram(prog4d);

    vao4d = gl4d.createVertexArray();
    gl4d.bindVertexArray(vao4d);
    const buf = gl4d.createBuffer();
    gl4d.bindBuffer(gl4d.ARRAY_BUFFER, buf);
    gl4d.bufferData(gl4d.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl4d.STATIC_DRAW);
    const loc = gl4d.getAttribLocation(prog4d, "aPos");
    gl4d.enableVertexAttribArray(loc);
    gl4d.vertexAttribPointer(loc, 2, gl4d.FLOAT, false, 0, 0);

    uLocs4d = {
      uRes: gl4d.getUniformLocation(prog4d, "uRes"),
      uTime: gl4d.getUniformLocation(prog4d, "uTime"),
      uDeg: gl4d.getUniformLocation(prog4d, "uDeg"),
      uTorsion: gl4d.getUniformLocation(prog4d, "uTorsion"),
      uFold: gl4d.getUniformLocation(prog4d, "uFold"),
      uDisp: gl4d.getUniformLocation(prog4d, "uDisp"),
      uRot: gl4d.getUniformLocation(prog4d, "uRot"),
      uZoom: gl4d.getUniformLocation(prog4d, "uZoom"),
      uPreset: gl4d.getUniformLocation(prog4d, "uPreset"),
      uPoly: gl4d.getUniformLocation(prog4d, "uPoly")
    };
  }

  function drawWindow3(timeSec) {
    const canvas = document.getElementById("glManifoldCanvas");
    if (canvas && gl4d && prog4d) {
      gl4d.viewport(0, 0, canvas.width, canvas.height);
      gl4d.useProgram(prog4d);
      gl4d.bindVertexArray(vao4d);
      gl4d.uniform2f(uLocs4d.uRes, canvas.width, canvas.height);
      gl4d.uniform1f(uLocs4d.uTime, timeSec);
      gl4d.uniform1f(uLocs4d.uDeg, state4D.deg);
      gl4d.uniform1f(uLocs4d.uTorsion, state4D.torsion);
      gl4d.uniform1f(uLocs4d.uFold, state4D.fold);
      gl4d.uniform1f(uLocs4d.uDisp, state4D.disp);
      gl4d.uniform2f(uLocs4d.uRot, state4D.yaw, state4D.pitch);
      gl4d.uniform1f(uLocs4d.uZoom, state4D.zoom);
      gl4d.uniform1i(uLocs4d.uPreset, state4D.preset);
      if (isWindowCoupled("w3") && isWindowCoupled("w1")) {
        const c = getActiveCoeffs();
        gl4d.uniform4f(uLocs4d.uPoly, c[0] || 0, c[1] || 0, c[2] || 0, c[3] || 0);
      } else {
        gl4d.uniform4f(uLocs4d.uPoly, 0, 0, 0, 0);
      }
      gl4d.drawArrays(gl4d.TRIANGLE_STRIP, 0, 4);
    }

    const theme = getThemeColors();
    const spinCanvas = document.getElementById("spinorHudCanvas");
    if (spinCanvas) {
      const ctx = spinCanvas.getContext("2d");
      const w = spinCanvas.width, h = spinCanvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.5, r = Math.min(w, h) * 0.36;
      ctx.strokeStyle = theme.grid;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      const ang = timeSec * 0.9 + state4D.fold * Math.PI;
      ctx.strokeStyle = theme.accent2;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      ctx.stroke();
    }

    const poinCanvas = document.getElementById("poincareHudCanvas");
    if (poinCanvas) {
      const ctx = poinCanvas.getContext("2d");
      const w = poinCanvas.width, h = poinCanvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5, cy = h * 0.5, r = Math.min(w, h) * 0.34;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const n = Math.round(state4D.deg);
      for (let i = 0; i <= 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        const rad = r * (0.72 + 0.25 * Math.cos(n * a + timeSec + state4D.torsion));
        const px = cx + rad * Math.cos(a);
        const py = cy + rad * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // --- BUG-FREE EXPAND / COLLAPSE CONTROLLER ---
  let savedScrollY = 0;

  function resizeAllCanvases() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ["plot2dCanvas", "plot3dCanvas", "glManifoldCanvas", "complexRadarCanvas"].forEach(id => {
      const c = document.getElementById(id);
      if (!c) return;
      const parent = c.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const targetW = Math.max(60, Math.floor(rect.width * dpr));
      const targetH = Math.max(60, Math.floor(rect.height * dpr));
      if (c.width !== targetW || c.height !== targetH) {
        c.width = targetW;
        c.height = targetH;
      }
    });
    drawWindow1();
    drawWindow2();
  }

  function toggleExpandCard(cardId, btnEl) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const isExpanding = !card.classList.contains("expanded");

    if (isExpanding) {
      savedScrollY = window.scrollY;
      document.querySelectorAll(".widget-card.expanded").forEach(other => {
        other.classList.remove("expanded");
      });
      card.classList.add("expanded");
      if (btnEl) btnEl.innerHTML = "<span>🗗</span>";
    } else {
      card.classList.remove("expanded");
      if (btnEl) btnEl.innerHTML = "<span>⛶</span>";
      window.scrollTo({ top: savedScrollY, behavior: "instant" });
    }

    resizeAllCanvases();
    requestAnimationFrame(() => {
      resizeAllCanvases();
    });
  }

  // --- 100% SSOT LANGUAGE & THEME APPLICATION ---
  function applyLanguage(lang) {
    if (!window.POLY_I18N || !window.POLY_I18N[lang]) lang = "ru";
    currentLang = lang;
    localStorage.setItem("poly_lang", lang);

    const dict = window.POLY_I18N[lang];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });

    const dictGrid = document.getElementById("dictCardsContainer");
    if (dictGrid && Array.isArray(dict.dict)) {
      dictGrid.innerHTML = dict.dict
        .map(
          item => `
          <article class="dict-card">
            <div class="dict-card-title">${item.title}</div>
            <div class="dict-card-sub">${item.sub}</div>
            <p>${item.body}</p>
          </article>
        `
        )
        .join("");
    }

    updateClutchButtonsUI();
    updateFormulaBanner();
    updateRootTelemetry();
  }

  function applyTheme(theme) {
    const sel = document.getElementById("themeSelect");
    if (sel) {
      const valid = Array.from(sel.options).some(opt => opt.value === theme);
      if (!valid) theme = "synthwave";
      if (sel.value !== theme) sel.value = theme;
    }
    currentTheme = theme;
    localStorage.setItem("poly_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    drawWindow1();
    drawWindow2();
  }

  // --- [?] POPUP MODAL SYSTEM ---
  function openHelpModal(helpKey) {
    const dict = (window.POLY_I18N && window.POLY_I18N[currentLang]) || window.POLY_I18N.ru;
    const item = dict.popups && dict.popups[helpKey];
    if (!item) return;

    const backdrop = document.getElementById("helpModalBackdrop");
    const titleEl = document.getElementById("helpModalTitle");
    const b1El = document.getElementById("helpModalB1");
    const b2El = document.getElementById("helpModalB2");
    const b3El = document.getElementById("helpModalB3");

    if (titleEl) titleEl.innerHTML = item.title;
    if (b1El) b1El.innerHTML = item.b1;
    if (b2El) b2El.innerHTML = item.b2;
    if (b3El) b3El.innerHTML = item.b3;
    if (backdrop) backdrop.classList.remove("hidden");
  }

  function closeHelpModal() {
    const backdrop = document.getElementById("helpModalBackdrop");
    if (backdrop) backdrop.classList.add("hidden");
  }

  // --- UI WIRING & INTERACTIVE QUESTS ---
  function activate2DTab(tabName) {
    polyState.mode2d = tabName;
    document.querySelectorAll("[data-tab2d]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab2d") === tabName);
    });
    ["anatomy", "roots", "taylor", "bezier"].forEach(t => {
      const panel = document.getElementById("panel2d_" + t);
      if (panel) panel.classList.toggle("hidden", t !== tabName);
    });
  }

  function runQuestStep(stepNum) {
    clutchState.master = true;
    clutchState.w1 = true;
    clutchState.w2 = true;
    clutchState.w3 = true;
    updateClutchButtonsUI();
    activate2DTab("anatomy");

    document.querySelectorAll("[data-quest]").forEach(btn => {
      btn.classList.toggle("active", parseInt(btn.getAttribute("data-quest"), 10) === stepNum);
    });

    if (stepNum === 1) {
      polyState.c = [-1.0, 0.0, 1.0, 0.0, 0.0];
      state3D.mode = "trampoline";
      state3D.targetYaw = -0.58;
      state3D.targetPitch = 0.46;
    } else if (stepNum === 2) {
      polyState.c = [1.0, 0.0, 1.0, 0.0, 0.0];
      state3D.mode = "trampoline";
      state3D.targetYaw = -0.75;
      state3D.targetPitch = 0.55;
    } else if (stepNum === 3) {
      polyState.c = [0.4, -0.3, -1.6, 0.2, 0.8];
      state3D.mode = "trampoline";
      state4D.preset = 1;
    }

    sync2DSlidersFromState();
    propagateFrom2D();
    drawWindow1();
    drawWindow2();
  }

  function bindEvents() {
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang-btn")));
    });

    const themeSel = document.getElementById("themeSelect");
    if (themeSel) {
      themeSel.addEventListener("change", () => applyTheme(themeSel.value));
    }

    const masterClutch = document.getElementById("btnMasterClutch");
    if (masterClutch) {
      masterClutch.addEventListener("click", () => {
        clutchState.master = !clutchState.master;
        updateClutchButtonsUI();
        if (clutchState.master) propagateFrom2D();
      });
    }

    document.querySelectorAll("[data-clutch]").forEach(btn => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-clutch");
        clutchState[k] = !clutchState[k];
        updateClutchButtonsUI();
        if (isWindowCoupled(k)) propagateFrom2D();
      });
    });

    document.querySelectorAll("[data-expand]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleExpandCard(btn.getAttribute("data-expand"), btn);
      });
    });

    document.querySelectorAll("[data-help]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        openHelpModal(btn.getAttribute("data-help"));
      });
    });

    document.getElementById("btnCloseHelpModal")?.addEventListener("click", closeHelpModal);
    document.getElementById("helpModalBackdrop")?.addEventListener("click", e => {
      if (e.target.id === "helpModalBackdrop") closeHelpModal();
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeHelpModal();
        const exp = document.querySelector(".widget-card.expanded");
        if (exp) {
          const btn = exp.querySelector("[data-expand]");
          toggleExpandCard(exp.id, btn);
        }
      }
    });

    document.querySelectorAll("[data-quest]").forEach(card => {
      card.addEventListener("click", () => {
        runQuestStep(parseInt(card.getAttribute("data-quest"), 10));
      });
    });

    document.querySelectorAll("[data-tab2d]").forEach(btn => {
      btn.addEventListener("click", () => {
        activate2DTab(btn.getAttribute("data-tab2d"));
        propagateFrom2D();
        drawWindow1();
        drawWindow2();
      });
    });

    for (let i = 0; i <= 4; i++) {
      const sl = document.getElementById("slC" + i);
      if (sl) {
        sl.addEventListener("input", () => {
          polyState.c[i] = parseFloat(sl.value);
          const vl = document.getElementById("valC" + i);
          if (vl) vl.textContent = polyState.c[i].toFixed(2);
          propagateFrom2D();
          drawWindow1();
          drawWindow2();
        });
      }
    }

    document.getElementById("chkShowMonomials")?.addEventListener("change", drawWindow1);

    document.querySelectorAll("[data-preset2d]").forEach(btn => {
      btn.addEventListener("click", () => {
        const p = btn.getAttribute("data-preset2d");
        if (p === "pdown") polyState.c = [-1.0, 0.0, 1.0, 0.0, 0.0];
        else if (p === "pup") polyState.c = [1.0, 0.0, 1.0, 0.0, 0.0];
        else if (p === "cubic") polyState.c = [0.0, -1.5, 0.0, 0.6, 0.0];
        else if (p === "quartic") polyState.c = [0.4, 0.0, -1.7, 0.0, 0.7];
        sync2DSlidersFromState();
        propagateFrom2D();
        drawWindow1();
        drawWindow2();
      });
    });

    ["R1", "R2", "R3"].forEach((rk, idx) => {
      const sl = document.getElementById("sl" + rk);
      if (sl) {
        sl.addEventListener("input", () => {
          polyState.roots[idx] = parseFloat(sl.value);
          const vl = document.getElementById("val" + rk);
          if (vl) vl.textContent = polyState.roots[idx].toFixed(2);
          propagateFrom2D();
          drawWindow1();
          drawWindow2();
        });
      }
    });

    const slRA = document.getElementById("slRA");
    if (slRA) {
      slRA.addEventListener("input", () => {
        polyState.rootScale = parseFloat(slRA.value);
        const vl = document.getElementById("valRA");
        if (vl) vl.textContent = polyState.rootScale.toFixed(2);
        propagateFrom2D();
        drawWindow1();
        drawWindow2();
      });
    }

    const slTaylor = document.getElementById("slTaylorDeg");
    if (slTaylor) {
      slTaylor.addEventListener("input", () => {
        polyState.taylorDeg = parseInt(slTaylor.value, 10);
        const vl = document.getElementById("valTaylorDeg");
        if (vl) vl.textContent = polyState.taylorDeg.toString();
        drawWindow1();
      });
    }

    document.querySelectorAll("[data-curvemode]").forEach(btn => {
      btn.addEventListener("click", () => {
        polyState.curveMode = btn.getAttribute("data-curvemode");
        document.querySelectorAll("[data-curvemode]").forEach(b =>
          b.classList.toggle("active", b === btn)
        );
        const expEl = document.getElementById("curveExplainBox");
        const dict = (window.POLY_I18N && window.POLY_I18N[currentLang]) || window.POLY_I18N.ru;
        if (expEl) {
          expEl.innerHTML =
            polyState.curveMode === "bezier" ? dict.bezier_explain : dict.lagrange_explain;
        }
        drawWindow1();
      });
    });

    const slBezT = document.getElementById("slBezierT");
    if (slBezT) {
      slBezT.addEventListener("input", () => {
        polyState.bezierT = parseFloat(slBezT.value);
        const vl = document.getElementById("valBezierT");
        if (vl) vl.textContent = polyState.bezierT.toFixed(2);
        drawWindow1();
      });
    }

    const c2d = document.getElementById("plot2dCanvas");
    if (c2d) {
      let drag2D = null; // { kind: 'anatomy'|'root'|'rootScale'|'taylor'|'bezierPt'|'bezierT', idx: number }

      const getWorld2D = e => {
        const rect = c2d.getBoundingClientRect();
        const x = -3.2 + ((e.clientX - rect.left) / Math.max(1, rect.width)) * 6.4;
        const y = 3.2 - ((e.clientY - rect.top) / Math.max(1, rect.height)) * 6.4;
        return {
          x: Math.max(-3.0, Math.min(3.0, x)),
          y: Math.max(-3.0, Math.min(3.0, y)),
          hitRadius: e.pointerType === "touch" ? 0.58 : 0.40
        };
      };

      const applyDrag2D = e => {
        if (!drag2D) return;
        const { x, y } = getWorld2D(e);
        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

        if (drag2D.kind === "anatomy") {
          // Direct curve bending: P(x) = c0 + c1*x + c2*x^2 + c3*x^3 + c4*x^4
          if (Math.abs(x) < 0.34) {
            // Grabbing near center X=0 directly lifts/lowers a0
            const rest =
              polyState.c[1] * x +
              polyState.c[2] * x * x +
              polyState.c[3] * Math.pow(x, 3) +
              polyState.c[4] * Math.pow(x, 4);
            polyState.c[0] = clamp(y - rest, -2.5, 2.5);
          } else {
            // Weighted minimum-norm monomial bend at grabbed x so the curve bends right to the finger/cursor!
            const curY = evalPolyReal(polyState.c, x);
            const dy = y - curY;
            const weights = [0.20, 0.55, 0.95, 0.48, 0.30];
            const basis = [1, x, x * x, x * x * x, x * x * x * x];
            let denom = 0;
            for (let k = 0; k <= 4; k++) {
              const wk = weights[k] * basis[k];
              denom += wk * wk;
            }
            if (denom > 1e-6) {
              const limits = [2.5, 2.5, 2.5, 2.0, 1.5];
              for (let k = 0; k <= 4; k++) {
                const delta = (dy * (weights[k] * weights[k]) * basis[k]) / denom;
                polyState.c[k] = clamp(polyState.c[k] + delta * 0.85, -limits[k], limits[k]);
              }
            }
          }
          sync2DSlidersFromState();
          propagateFrom2D();
          drawWindow1();
          drawWindow2();
        } else if (drag2D.kind === "root") {
          polyState.roots[drag2D.idx] = clamp(x, -2.5, 2.5);
          const rk = ["R1", "R2", "R3"][drag2D.idx];
          const sl = document.getElementById("sl" + rk);
          const vl = document.getElementById("val" + rk);
          if (sl) sl.value = polyState.roots[drag2D.idx].toFixed(2);
          if (vl) vl.textContent = polyState.roots[drag2D.idx].toFixed(2);
          propagateFrom2D();
          drawWindow1();
          drawWindow2();
        } else if (drag2D.kind === "rootScale") {
          const denom =
            (x - polyState.roots[0]) *
            (x - polyState.roots[1]) *
            (x - polyState.roots[2]);
          if (Math.abs(denom) > 0.12) {
            polyState.rootScale = clamp(y / denom, -1.5, 1.5);
            const slRA = document.getElementById("slRA");
            const vlRA = document.getElementById("valRA");
            if (slRA) slRA.value = polyState.rootScale.toFixed(2);
            if (vlRA) vlRA.textContent = polyState.rootScale.toFixed(2);
            propagateFrom2D();
            drawWindow1();
            drawWindow2();
          }
        } else if (drag2D.kind === "taylor") {
          const norm = clamp((Math.abs(x) - 0.3) / 2.3, 0, 1);
          const deg = 1 + 2 * Math.round(norm * 6);
          polyState.taylorDeg = deg;
          const slT = document.getElementById("slTaylorDeg");
          const vlT = document.getElementById("valTaylorDeg");
          if (slT) slT.value = String(deg);
          if (vlT) vlT.textContent = String(deg);
          updateHornerTelemetry();
          drawWindow1();
        } else if (drag2D.kind === "bezierPt") {
          polyState.ctrlPts[drag2D.idx] = {
            x: clamp(x, -2.9, 2.9),
            y: clamp(y, -2.9, 2.9)
          };
          drawWindow1();
        } else if (drag2D.kind === "bezierT") {
          const tVal = clamp((x + 2.4) / 4.8, 0, 1);
          polyState.bezierT = tVal;
          const slB = document.getElementById("slBezierT");
          const vlB = document.getElementById("valBezierT");
          if (slB) slB.value = tVal.toFixed(2);
          if (vlB) vlB.textContent = tVal.toFixed(2);
          drawWindow1();
        }
      };

      c2d.addEventListener("pointerdown", e => {
        const { x, y, hitRadius } = getWorld2D(e);
        if (polyState.mode2d === "bezier") {
          let hitIdx = -1;
          polyState.ctrlPts.forEach((p, idx) => {
            if (Math.hypot(p.x - x, p.y - y) < hitRadius) hitIdx = idx;
          });
          if (hitIdx >= 0) {
            drag2D = { kind: "bezierPt", idx: hitIdx };
          } else {
            drag2D = { kind: "bezierT", idx: 0 };
          }
        } else if (polyState.mode2d === "roots") {
          let hitRoot = -1;
          polyState.roots.forEach((r, idx) => {
            if (Math.hypot(r - x, y) < hitRadius * 1.15) hitRoot = idx;
          });
          if (hitRoot >= 0) {
            drag2D = { kind: "root", idx: hitRoot };
          } else {
            drag2D = { kind: "rootScale", idx: 0 };
          }
        } else if (polyState.mode2d === "taylor") {
          drag2D = { kind: "taylor", idx: 0 };
        } else {
          drag2D = { kind: "anatomy", idx: 0 };
        }
        try { c2d.setPointerCapture(e.pointerId); } catch (_) {}
        applyDrag2D(e);
      });

      c2d.addEventListener("pointermove", e => {
        if (!drag2D) return;
        applyDrag2D(e);
      });

      const endDrag2D = () => {
        drag2D = null;
        polyState.draggingPt = -1;
      };
      c2d.addEventListener("pointerup", endDrag2D);
      c2d.addEventListener("pointercancel", endDrag2D);
    }

    // Two-way interactive dragging on the Complex Plane Radar (ℂ)
    const cRadar = document.getElementById("complexRadarCanvas");
    if (cRadar) {
      let draggingRadar = false;
      const updateFromRadarPointer = e => {
        const rect = cRadar.getBoundingClientRect();
        const scale = Math.min(rect.width, rect.height) / 5.4;
        const re = (e.clientX - (rect.left + rect.width * 0.5)) / Math.max(1, scale);
        const im = ((rect.top + rect.height * 0.5) - e.clientY) / Math.max(1, scale);
        const c2 = Math.abs(polyState.c[2]) < 0.2 ? 1.0 : polyState.c[2];
        // If dragging horizontally near real axis -> real roots (a0 <= 0); if dragging vertically -> imaginary roots (a0 > 0)
        const signedR2 = Math.abs(im) > Math.abs(re) ? (im * im) : -(re * re);
        const newC0 = Math.max(-2.5, Math.min(2.5, signedR2 * c2));
        if (polyState.mode2d !== "anatomy") activate2DTab("anatomy");
        polyState.c[0] = newC0;
        sync2DSlidersFromState();
        propagateFrom2D();
        drawWindow1();
        drawWindow2();
      };
      cRadar.addEventListener("pointerdown", e => {
        draggingRadar = true;
        try { cRadar.setPointerCapture(e.pointerId); } catch (_) {}
        updateFromRadarPointer(e);
      });
      cRadar.addEventListener("pointermove", e => {
        if (!draggingRadar) return;
        updateFromRadarPointer(e);
      });
      cRadar.addEventListener("pointerup", () => { draggingRadar = false; });
      cRadar.addEventListener("pointercancel", () => { draggingRadar = false; });
    }

    document.querySelectorAll("[data-tab3d]").forEach(btn => {
      btn.addEventListener("click", () => {
        state3D.mode = btn.getAttribute("data-tab3d");
        document.querySelectorAll("[data-tab3d]").forEach(b => b.classList.toggle("active", b === btn));
        drawWindow2();
      });
    });

    document.getElementById("btnProfile3D")?.addEventListener("click", () => {
      state3D.sliceY = 0.0;
      const slSlice = document.getElementById("sl3dSlice");
      const vlSlice = document.getElementById("val3dSlice");
      if (slSlice) slSlice.value = "0.00";
      if (vlSlice) vlSlice.textContent = "0.00";
      state3D.targetYaw = 0.0;
      state3D.targetPitch = 0.04;
    });

    document.getElementById("btnResetCam3D")?.addEventListener("click", () => {
      state3D.targetYaw = -0.62;
      state3D.targetPitch = 0.48;
      state3D.zoom = 1.0;
    });

    const sl3dC0 = document.getElementById("sl3dC0");
    if (sl3dC0) {
      sl3dC0.addEventListener("input", () => {
        state3D.c0 = parseFloat(sl3dC0.value);
        const vl = document.getElementById("val3dC0");
        if (vl) vl.textContent = state3D.c0.toFixed(2);
        propagateFrom3D();
        drawWindow1();
        drawWindow2();
      });
    }

    const sl3dC2 = document.getElementById("sl3dC2");
    if (sl3dC2) {
      sl3dC2.addEventListener("input", () => {
        state3D.c2 = parseFloat(sl3dC2.value);
        const vl = document.getElementById("val3dC2");
        if (vl) vl.textContent = state3D.c2.toFixed(2);
        propagateFrom3D();
        drawWindow1();
        drawWindow2();
      });
    }

    const sl3dSlice = document.getElementById("sl3dSlice");
    if (sl3dSlice) {
      sl3dSlice.addEventListener("input", () => {
        state3D.sliceY = parseFloat(sl3dSlice.value);
        const vl = document.getElementById("val3dSlice");
        if (vl) vl.textContent = state3D.sliceY.toFixed(2);
        drawWindow2();
      });
    }

    document.getElementById("chk3dSlice")?.addEventListener("change", e => {
      state3D.showSlice = e.target.checked;
      drawWindow2();
    });

    document.getElementById("chk3dPillars")?.addEventListener("change", e => {
      state3D.showPillars = e.target.checked;
      drawWindow2();
    });

    const c3d = document.getElementById("plot3dCanvas");
    if (c3d) {
      const findHitHandle3D = e => {
        const rect = c3d.getBoundingClientRect();
        const scaleX = c3d.width / Math.max(1, rect.width);
        const scaleY = c3d.height / Math.max(1, rect.height);
        const px = (e.clientX - rect.left) * scaleX;
        const py = (e.clientY - rect.top) * scaleY;
        const hitR = (e.pointerType === "touch" ? 28 : 16) * Math.max(scaleX, scaleY);
        let best = null;
        let bestDist = hitR;
        for (const h of state3D.projectedHandles) {
          const d = Math.hypot(h.sx - px, h.sy - py);
          if (d < bestDist) {
            bestDist = d;
            best = h;
          }
        }
        return best;
      };

      const sync3DSlidersUI = () => {
        const sl0 = document.getElementById("sl3dC0");
        const vl0 = document.getElementById("val3dC0");
        const sl2 = document.getElementById("sl3dC2");
        const vl2 = document.getElementById("val3dC2");
        if (sl0) sl0.value = state3D.c0.toFixed(2);
        if (vl0) vl0.textContent = state3D.c0.toFixed(2);
        if (sl2) sl2.value = state3D.c2.toFixed(2);
        if (vl2) vl2.textContent = state3D.c2.toFixed(2);
      };

      c3d.addEventListener("pointerdown", e => {
        const hit = findHitHandle3D(e);
        state3D.targetYaw = null;
        state3D.targetPitch = null;
        state3D.lastX = e.clientX;
        state3D.lastY = e.clientY;
        try { c3d.setPointerCapture(e.pointerId); } catch (_) {}
        if (hit) {
          state3D.dragHandle = hit;
          state3D.dragging = false;
        } else {
          state3D.dragHandle = null;
          state3D.dragging = true;
        }
      });

      window.addEventListener("pointermove", e => {
        if (!state3D.dragging && !state3D.dragHandle) return;
        const dx = e.clientX - state3D.lastX;
        const dy = e.clientY - state3D.lastY;
        state3D.lastX = e.clientX;
        state3D.lastY = e.clientY;
        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

        if (state3D.dragHandle) {
          const h = state3D.dragHandle;
          if (h.kind === "apex3d") {
            // Vertical drag on central 3D apex lifts/lowers a0
            state3D.c0 = clamp(state3D.c0 - dy * 0.018, -2.5, 2.5);
            state3D.coeffs[0] = state3D.c0;
            sync3DSlidersUI();
            propagateFrom3D();
            drawWindow1();
            drawWindow2();
          } else if (h.kind === "wing3d") {
            // Dragging side wing handle on 3D slice adjusts a2 (bowl curvature) & a1 (slope)
            state3D.c2 = clamp(state3D.c2 - dy * 0.015, -2.5, 2.5);
            state3D.coeffs[2] = state3D.c2;
            const newC1 = clamp((state3D.coeffs[1] || 0) + dx * 0.012 * h.side, -2.5, 2.5);
            state3D.coeffs[1] = newC1;
            if (isWindowCoupled("w2") && isWindowCoupled("w1")) {
              polyState.c[1] = newC1;
            }
            sync3DSlidersUI();
            propagateFrom3D();
            drawWindow1();
            drawWindow2();
          } else if (h.kind === "root3d") {
            // Unproject screen delta onto 3D floor basis vectors (Real X and Imag iY)
            const w = c3d.width, ch = c3d.height;
            const p0 = project3D(h.x, h.y, 0, w, ch, state3D.yaw, state3D.pitch, state3D.zoom);
            const px1 = project3D(h.x + 0.5, h.y, 0, w, ch, state3D.yaw, state3D.pitch, state3D.zoom);
            const py1 = project3D(h.x, h.y + 0.5, 0, w, ch, state3D.yaw, state3D.pitch, state3D.zoom);
            const vx = { x: (px1.sx - p0.sx) * 2, y: (px1.sy - p0.sy) * 2 };
            const vy = { x: (py1.sx - p0.sx) * 2, y: (py1.sy - p0.sy) * 2 };
            const rect = c3d.getBoundingClientRect();
            const sdx = dx * (w / Math.max(1, rect.width));
            const sdy = dy * (ch / Math.max(1, rect.height));
            const dRe = (sdx * vx.x + sdy * vx.y) / Math.max(40, vx.x * vx.x + vx.y * vx.y);
            const dIm = (sdx * vy.x + sdy * vy.y) / Math.max(40, vy.x * vy.x + vy.y * vy.y);
            h.x = clamp(h.x + dRe, -2.2, 2.2);
            h.y = clamp(h.y + dIm, -2.2, 2.2);
            const c2 = Math.abs(state3D.c2) < 0.2 ? 1.0 : state3D.c2;
            const signedR2 = Math.abs(h.y) > Math.abs(h.x) ? (h.y * h.y) : -(h.x * h.x);
            state3D.c0 = clamp(signedR2 * c2, -2.5, 2.5);
            state3D.coeffs[0] = state3D.c0;
            sync3DSlidersUI();
            propagateFrom3D();
            drawWindow1();
            drawWindow2();
          } else if (h.kind === "bezierWing3d") {
            if (h.role === "arch") {
              state3D.c0 = clamp(state3D.c0 + dy * 0.018, -2.5, 2.5);
              state3D.coeffs[0] = state3D.c0;
            } else if (h.role === "tiltPos" || h.role === "tiltNeg") {
              const sgn = h.role === "tiltPos" ? 1 : -1;
              const nextC1 = clamp((state3D.coeffs[1] || 0) - dy * 0.018 * sgn, -2.5, 2.5);
              state3D.coeffs[1] = nextC1;
              if (isWindowCoupled("w2") && isWindowCoupled("w1")) polyState.c[1] = nextC1;
            } else if (h.role === "twist") {
              state3D.c2 = clamp(state3D.c2 - dy * 0.018, -2.5, 2.5);
              state3D.coeffs[2] = state3D.c2;
            }
            sync3DSlidersUI();
            propagateFrom3D();
            drawWindow1();
            drawWindow2();
          }
          return;
        }

        state3D.yaw += dx * 0.008;
        state3D.pitch = Math.max(-0.2, Math.min(1.35, state3D.pitch + dy * 0.008));
      });

      const end3D = () => {
        state3D.dragging = false;
        state3D.dragHandle = null;
      };
      window.addEventListener("pointerup", end3D);
      window.addEventListener("pointercancel", end3D);
      c3d.addEventListener(
        "wheel",
        e => {
          e.preventDefault();
          state3D.zoom = Math.max(0.6, Math.min(2.0, state3D.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
          drawWindow2();
        },
        { passive: false }
      );
    }

    const presets4D = [
      { deg: 3.0, torsion: 2.0, fold: 0.25, disp: 0.85 },
      { deg: 5.0, torsion: 1.4, fold: 0.65, disp: 1.15 },
      { deg: 7.0, torsion: 0.8, fold: 1.25, disp: 1.75 }
    ];
    document.querySelectorAll("[data-preset4d]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-preset4d"), 10);
        state4D.preset = idx;
        const p = presets4D[idx] || presets4D[1];
        state4D.deg = p.deg;
        state4D.torsion = p.torsion;
        state4D.fold = p.fold;
        state4D.disp = p.disp;
        const sDeg = document.getElementById("sl4dDeg");
        const sTor = document.getElementById("sl4dTorsion");
        const sFold = document.getElementById("sl4dFold");
        const sDisp = document.getElementById("sl4dDisp");
        const vDeg = document.getElementById("val4dDeg");
        const vTor = document.getElementById("val4dTorsion");
        const vFold = document.getElementById("val4dFold");
        const vDisp = document.getElementById("val4dDisp");
        const hd = document.getElementById("hud4dDegVal");
        if (sDeg) sDeg.value = p.deg.toFixed(1);
        if (sTor) sTor.value = p.torsion.toFixed(2);
        if (sFold) sFold.value = p.fold.toFixed(2);
        if (sDisp) sDisp.value = p.disp.toFixed(2);
        if (vDeg) vDeg.textContent = p.deg.toFixed(1);
        if (vTor) vTor.textContent = p.torsion.toFixed(2);
        if (vFold) vFold.textContent = p.fold.toFixed(2);
        if (vDisp) vDisp.textContent = p.disp.toFixed(2);
        if (hd) hd.textContent = "n = " + Math.round(p.deg);
        document.querySelectorAll("[data-preset4d]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    const bind4DSlider = (id, valId, key, decimals) => {
      const sl = document.getElementById(id);
      if (!sl) return;
      sl.addEventListener("input", () => {
        state4D[key] = parseFloat(sl.value);
        const vl = document.getElementById(valId);
        if (vl) vl.textContent = state4D[key].toFixed(decimals);
        if (key === "deg") {
          const hd = document.getElementById("hud4dDegVal");
          if (hd) hd.textContent = "n = " + Math.round(state4D.deg);
        }
      });
    };

    bind4DSlider("sl4dDeg", "val4dDeg", "deg", 1);
    bind4DSlider("sl4dTorsion", "val4dTorsion", "torsion", 2);
    bind4DSlider("sl4dFold", "val4dFold", "fold", 2);
    bind4DSlider("sl4dDisp", "val4dDisp", "disp", 2);

    const c4d = document.getElementById("glManifoldCanvas");
    if (c4d) {
      c4d.addEventListener("pointerdown", e => {
        state4D.dragging = true;
        state4D.lastX = e.clientX;
        state4D.lastY = e.clientY;
      });
      window.addEventListener("pointermove", e => {
        if (!state4D.dragging) return;
        const dx = e.clientX - state4D.lastX;
        const dy = e.clientY - state4D.lastY;
        state4D.lastX = e.clientX;
        state4D.lastY = e.clientY;
        state4D.yaw += dx * 0.007;
        state4D.pitch = Math.max(-1.4, Math.min(1.4, state4D.pitch + dy * 0.007));
      });
      window.addEventListener("pointerup", () => {
        state4D.dragging = false;
      });
      c4d.addEventListener(
        "wheel",
        e => {
          e.preventDefault();
          state4D.zoom = Math.max(0.45, Math.min(2.8, state4D.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
        },
        { passive: false }
      );
    }

    window.addEventListener("resize", resizeAllCanvases);
  }

  // --- MAIN LOOP & INIT ---
  function startLoop() {
    const t0 = performance.now();
    function frame(now) {
      const timeSec = (now - t0) * 0.001;
      if (state3D.targetYaw !== null || state3D.dragging) {
        drawWindow2();
      }
      drawWindow3(timeSec);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("DOMContentLoaded", () => {
    initWebGL4D();
    bindEvents();
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    propagateFrom2D();
    resizeAllCanvases();
    startLoop();
  });
})();
