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

  // Window #2 (3D Bridge) state
  const state3D = {
    mode: "trampoline", // 'trampoline' | 'bezier3d'
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
    lastX: 0,
    lastY: 0
  };

  // Window #3 (4D Hyperspace) state
  const state4D = {
    preset: 0,
    deg: 5.0,
    torsion: 1.25,
    fold: 0.35,
    disp: 0.45,
    yaw: 0.5,
    pitch: 0.3,
    zoom: 3.1,
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

  // Active polynomial coefficients [a0, a1, a2, a3, a4]
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
      state3D.c0 = coeffs[0];
      state3D.c2 = Math.abs(coeffs[2]) > 0.05 ? coeffs[2] : 1.0;
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
      state4D.deg = Math.max(2, Math.min(8, activeDeg + Math.abs(coeffs[4]) * 0.8));
      state4D.torsion = Math.max(0.1, Math.min(3.5, 0.75 + coeffEnergy * 0.45 + imagEnergy * 0.35));
      state4D.fold = Math.max(0.0, Math.min(1.0, 0.22 + Math.abs(coeffs[0]) * 0.22));

      const slDeg = document.getElementById("sl4dDeg");
      const slTor = document.getElementById("sl4dTorsion");
      const slFold = document.getElementById("sl4dFold");
      const vDeg = document.getElementById("val4dDeg");
      const vTor = document.getElementById("val4dTorsion");
      const vFold = document.getElementById("val4dFold");
      const hudDeg = document.getElementById("hud4dDegVal");

      if (slDeg) slDeg.value = state4D.deg.toFixed(1);
      if (slTor) slTor.value = state4D.torsion.toFixed(2);
      if (slFold) slFold.value = state4D.fold.toFixed(2);
      if (vDeg) vDeg.textContent = state4D.deg.toFixed(1);
      if (vTor) vTor.textContent = state4D.torsion.toFixed(2);
      if (vFold) vFold.textContent = state4D.fold.toFixed(2);
      if (hudDeg) hudDeg.textContent = "n = " + Math.round(state4D.deg);
    }

    updateFormulaBanner();
    updateRootTelemetry();
  }

  function propagateFrom3D() {
    if (isWindowCoupled("w2") && isWindowCoupled("w1")) {
      polyState.mode2d = "anatomy";
      activate2DTab("anatomy");
      polyState.c[0] = state3D.c0;
      polyState.c[1] = 0;
      polyState.c[2] = state3D.c2;
      polyState.c[3] = 0;
      polyState.c[4] = 0;
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
      ctx.lineWidth = 3.2;
      ctx.shadowColor = theme.accent;
      ctx.shadowBlur = 10;
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
          ctx.arc(rx, ry, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = theme.bg;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    } else if (mode === "taylor") {
      ctx.strokeStyle = theme.accent2;
      ctx.lineWidth = 2.2;
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
      ctx.lineWidth = 3.0;
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
        ctx.lineWidth = 1.2;
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
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(toX(q0.x), toY(q0.y)); ctx.lineTo(toX(q1.x), toY(q1.y)); ctx.lineTo(toX(q2.x), toY(q2.y));
        ctx.moveTo(toX(r0.x), toY(r0.y)); ctx.lineTo(toX(r1.x), toY(r1.y));
        ctx.stroke();

        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 3.2;
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
        ctx.arc(toX(s0.x), toY(s0.y), 6.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = theme.danger;
        ctx.lineWidth = 3.0;
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
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = theme.text;
        ctx.font = "bold 11px monospace";
        ctx.fillText(`P${idx}`, px + 9, py - 7);
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
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
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

    const camDist = 7.2 / zoom;
    const fov = Math.min(w, h) * 0.68;
    const depth = camDist + cy * 0.42;
    const s = fov / Math.max(1.2, depth);

    return {
      sx: w * 0.5 + rx * s * 0.42,
      sy: h * 0.62 - cz * s * 0.42,
      depth
    };
  }

  function eval3DHeight(x, y) {
    const re = state3D.c2 * (x * x - y * y) + state3D.c0;
    const im = state3D.c2 * (2 * x * y);
    const mod = Math.hypot(re, im);
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
        ctx.lineWidth = 4.0;
        ctx.shadowColor = theme.warn;
        ctx.shadowBlur = 12;
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
      }

      if (state3D.showPillars) {
        const c2 = Math.abs(state3D.c2) < 0.05 ? 0.05 : state3D.c2;
        const ratio = -state3D.c0 / c2;
        const roots3D =
          ratio >= 0
            ? [
                { x: -Math.sqrt(ratio), y: 0, real: true },
                { x: Math.sqrt(ratio), y: 0, real: true }
              ]
            : [
                { x: 0, y: -Math.sqrt(-ratio), real: false },
                { x: 0, y: Math.sqrt(-ratio), real: false }
              ];

        roots3D.forEach((rt, idx) => {
          const pFloor = project3D(rt.x, rt.y, 0, w, h, yaw, pitch, zoom);
          const pTop = project3D(rt.x, rt.y, 1.8, w, h, yaw, pitch, zoom);
          const col = rt.real ? theme.accent3 : theme.danger;

          ctx.strokeStyle = col;
          ctx.lineWidth = 2.2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(pFloor.sx, pFloor.sy);
          ctx.lineTo(pTop.sx, pTop.sy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(pFloor.sx, pFloor.sy, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = theme.text;
          ctx.font = "bold 11px monospace";
          const lbl = rt.real
            ? `z${idx + 1}=${rt.x.toFixed(2)}`
            : `z${idx + 1}=${rt.y >= 0 ? "+" : ""}${rt.y.toFixed(2)}i`;
          ctx.fillText(lbl, pFloor.sx + 9, pFloor.sy - 6);
        });
      }
    } else {
      const gridN = 18;
      const range = 2.0;
      const arch = state3D.c0 * -0.55;
      const twist = state3D.c2 * 0.45;

      const evalWingZ = (u, v) => {
        const bellU = 1 - u * u * 0.35;
        const waveV = Math.sin(v * 1.3) * twist * u;
        return 0.9 + arch * bellU * (1 - v * v * 0.25) + waveV;
      };

      for (let i = 0; i <= gridN; i++) {
        const u = -range + (2 * range * i) / gridN;
        ctx.strokeStyle = i === Math.floor(gridN / 2) ? theme.warn : theme.accent;
        ctx.lineWidth = i === Math.floor(gridN / 2) ? 3.0 : 1.2;
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

      mat2 rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      float map4D(vec3 p) {
        // 1. Tilt around camera's horizontal screen axis X_cam FIRST (Pitch)
        // Negative sign maps DOM clientY (down = +) to WebGL NDC Y (up = +)
        p.yz *= rot(-uRot.y);
        // 2. Orbit around world vertical axis Y_world SECOND (Yaw)
        p.xz *= rot(uRot.x);

        float r2 = dot(p, p);
        vec4 z4 = vec4(2.0 * p, 1.0 - r2) / (1.0 + r2);

        float wPhase = uTime * 0.35 + uFold * 3.14159;
        z4.xy *= rot(wPhase);
        z4.zw *= rot(wPhase * 0.7 + uTorsion * 0.5);

        float rad1 = length(z4.xy);
        float rad2 = length(z4.zw);
        float ang1 = atan(z4.y, z4.x);
        float ang2 = atan(z4.w, z4.z);

        float n = max(2.0, uDeg);
        float polyWave = cos(n * ang1 + uTorsion * ang2) * 0.18;

        float dTorus = length(vec2(length(p.xz) - (1.15 + polyWave), p.y)) - (0.34 + 0.08 * sin(n * ang1));
        float dHopf = abs(rad1 - rad2 * (0.85 + 0.25 * sin(uTorsion))) - 0.18 + polyWave * 0.35;

        return mix(dTorus, dHopf * 1.4, 0.45 + 0.12 * float(uPreset));
      }

      void main() {
        vec2 uv = (vUv * uRes) / min(uRes.x, uRes.y);
        vec3 ro = vec3(0.0, 0.0, -uZoom);
        vec3 rd = normalize(vec3(uv, 1.65));

        float t = 0.0;
        vec3 accum = vec3(0.0);
        for (int i = 0; i < 68; i++) {
          vec3 p = ro + rd * t;
          float d = map4D(p);
          float glow = exp(-abs(d) * 14.0);
          vec3 col = 0.5 + 0.5 * cos(vec3(0.0, 2.1, 4.2) + uDeg * 0.45 + length(p) * 1.6 + uDisp * float(i) * 0.06);
          accum += col * glow * 0.038;
          t += max(0.028, abs(d) * 0.52);
          if (t > 7.5) break;
        }

        vec3 bg = vec3(0.03, 0.04, 0.08);
        vec3 finalCol = bg + pow(accum, vec3(0.88));
        fragColor = vec4(finalCol, 1.0);
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
      uPreset: gl4d.getUniformLocation(prog4d, "uPreset")
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
      gl4d.uniform2f(uLocs4d.uRot, state4D.yaw + timeSec * 0.15, state4D.pitch);
      gl4d.uniform1f(uLocs4d.uZoom, state4D.zoom);
      gl4d.uniform1i(uLocs4d.uPreset, state4D.preset);
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
      c2d.addEventListener("pointerdown", e => {
        if (polyState.mode2d !== "bezier") return;
        const rect = c2d.getBoundingClientRect();
        const x = -3.2 + ((e.clientX - rect.left) / rect.width) * 6.4;
        const y = 3.2 - ((e.clientY - rect.top) / rect.height) * 6.4;
        polyState.ctrlPts.forEach((p, idx) => {
          if (Math.hypot(p.x - x, p.y - y) < 0.38) polyState.draggingPt = idx;
        });
      });
      window.addEventListener("pointermove", e => {
        if (polyState.draggingPt < 0) return;
        const rect = c2d.getBoundingClientRect();
        const x = Math.max(-2.9, Math.min(2.9, -3.2 + ((e.clientX - rect.left) / rect.width) * 6.4));
        const y = Math.max(-2.9, Math.min(2.9, 3.2 - ((e.clientY - rect.top) / rect.height) * 6.4));
        polyState.ctrlPts[polyState.draggingPt] = { x, y };
        drawWindow1();
      });
      window.addEventListener("pointerup", () => {
        polyState.draggingPt = -1;
      });
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
      c3d.addEventListener("pointerdown", e => {
        state3D.dragging = true;
        state3D.targetYaw = null;
        state3D.targetPitch = null;
        state3D.lastX = e.clientX;
        state3D.lastY = e.clientY;
      });
      window.addEventListener("pointermove", e => {
        if (!state3D.dragging) return;
        const dx = e.clientX - state3D.lastX;
        const dy = e.clientY - state3D.lastY;
        state3D.lastX = e.clientX;
        state3D.lastY = e.clientY;
        state3D.yaw += dx * 0.008;
        state3D.pitch = Math.max(-0.2, Math.min(1.35, state3D.pitch + dy * 0.008));
      });
      window.addEventListener("pointerup", () => {
        state3D.dragging = false;
      });
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

    document.querySelectorAll("[data-preset4d]").forEach(btn => {
      btn.addEventListener("click", () => {
        state4D.preset = parseInt(btn.getAttribute("data-preset4d"), 10);
        document.querySelectorAll("[data-preset4d]").forEach(b => b.classList.toggle("active", b === btn));
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
          state4D.zoom = Math.max(1.8, Math.min(5.2, state4D.zoom * (e.deltaY < 0 ? 0.92 : 1.08)));
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
