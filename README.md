# `polynomial-lab` — Interactive Polynomial & Algebraic Manifold Laboratory

**Live Demo (GitHub Pages):** [https://ssoj13.github.io/polynomial-lab/](https://ssoj13.github.io/polynomial-lab/)

---

## 🇬🇧 English

An interactive computational laboratory and visual lesson on **Polynomials**, **Horner's CPU Evaluation Scheme**, **Bézier / Lagrange Splines**, and **3D/4D Algebraic Manifolds & Hopf Fibrations** (`WebGL2`).

### Features
- **Trilingual UI (`EN` | `RU` | `MN`)** with instant switching in the top-right corner.
- **5 Visual Themes**: *Obsidian Dark*, *Daylight Paper*, *Cyber Neon*, *Blueprint CAD*, and *Steppe Amber*.
- **Full-Window Expand Toggle (`⛶` / `F` key)**: expand either Visualizer #1, Visualizer #2, or the entire laboratory to 100% of the viewport.
- **Visualizer #1 — 2D Polynomial Workbench**:
  1. **Anatomy (Monomials)**: $P(x) = \sum a_k x^k$ with dashed monomial harmonics and live derivative $P'(x)$.
  2. **Roots & Factorization**: $P(x) = a(x - r_1)(x - r_2)(x - r_3)$ with draggable root handles along the $X$-axis.
  3. **Taylor Series & Horner's Scheme**: see how CPUs approximate $\sin(x), \cos(x), e^x$ via nested FMA pipelines.
  4. **Bézier Curves vs Lagrange Interpolation**: draggable control points $P_0..P_3$ with De Casteljau subdivision.
- **Visualizer #2 — 3D/4D Algebraic Manifold & Complex Roots (`WebGL2`)**:
  - 68-step volumetric raymarcher visualizing $SO(4)$ Hopf fibrations ($\pi: S^3 \to S^2$) and Calabi–Yau quintic polynomial perturbations coupled in real time to the polynomial coefficients of Visualizer #1, plus a live Complex Gauss Root Plane ($\mathbb{C}$) HUD.

---

## 🇷🇺 Русский

Интерактивная вычислительная лаборатория и наглядный урок по **полиномам (многочленам)**, **схеме Горнера**, **кривым Безье и Лагранжа**, а также **3D/4D алгебраическим многообразиям и расслоению Хопфа** (`WebGL2`).

### Возможности
- **Трёхъязычный интерфейс (`EN` | `RU` | `MN`)** с переключателем в правом верхнем углу.
- **5 визуальных тем**: *Obsidian Dark*, *Daylight Paper*, *Cyber Neon*, *Blueprint CAD*, *Steppe Amber*.
- **Кнопка разворота на всё окно (`⛶` / клавиша `F`)**: разворачивает Визуализатор #1 или Визуализатор #2 на весь экран.
- **Визуализатор #1 — 2D Конструктор полиномов**:
  1. **Анатомия (Мономы)**: $P(x) = \sum a_k x^k$ с отображением отдельных степенных гармоник и производной $P'(x)$.
  2. **Корни и факторизация**: перетаскиваемые мышкой корни $r_1, r_2, r_3$ прямо по оси $X$.
  3. **Ряд Тейлора и схема Горнера**: как процессор считает $\sin(x), \cos(x), e^x$ только через сложение и умножение.
  4. **Кривые Безье vs Полином Лагранжа**: 4 опорные точки $P_0..P_3$ с визуализацией алгоритма де Кастельжо.
- **Визуализатор #2 — 3D/4D Алгебраическое Многообразие и Комплексные Корни (`WebGL2`)**:
  - Объёмный реймарчер расслоения Хопфа и квинтики Калаби—Яу, связанный в реальном времени с коэффициентами полинома из первого виджета, и радар комплексных корней в плоскости Гаусса ($\mathbb{C}$).

---

## 🇲🇳 Монгол (Кирилл)

**Олон гишүүнт (Полином)**, **Горнерийн схем**, **Безье ба Лагранжийн сплайн**, мөн **3D/4D Алгебрийн олон янз байдал ба Хопфын багцлалыг** (`WebGL2`) судлах интерактив тооцооллын лаборатори.

- **3 хэлний интерфэйс (`EN` | `RU` | `MN`)** — баруун дээд буланд байрлах товчлуураар шууд солигдоно.
- **5 өнгөний загвар (Themes)**: *Obsidian Dark*, *Daylight Paper*, *Cyber Neon*, *Blueprint CAD*, *Steppe Amber*.
- **Бүтэн дэлгэцээр томруулах товч (`⛶` / `F`)**: Визуализатор #1 болон #2-ыг цонхны хэмжээнд тултал томруулна.
