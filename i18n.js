/* =========================================================================
 * i18n.js — Single Source of Truth (SSOT) Trilingual Dictionary (RU / EN / MN)
 * Covers 100% of buttons, slider labels, HUD badges, [?] popups & dictionary
 * ========================================================================= */

window.POLY_I18N = {
  ru: {
    brand: "POLYNOMIAL LAB // 2D → 3D → 4D",
    nav_w1: "#1: 2D Лист",
    nav_w2: "#2: 3D Батут",
    nav_w3: "#3: 4D Космос",
    nav_dict: "📖 Словарь «На пальцах»",
    hero_badge: "ИНТЕРАКТИВНОЕ ПУТЕШЕСТВИЕ ПО ИЗМЕРЕНИЯМ (БЕЗ ЗАУМНОГО СНОБИЗМА)",
    btn_how_it_works: "Как устроен этот тренажёр?",
    hero_title: "Как школьная парабола выходит в 3D и сворачивает 4D-пространство",
    hero_lead:
      "В школе говорят: если парабола повисла над осью X, то «корней нет». <b>На самом деле тебя обманули!</b> Корни никуда не исчезают — им просто становится тесно на узкой одномерной линии X, и они делают шаг вбок во второе измерение. Нажми на любую из <b>3 кнопок-экспериментов</b> ниже или двигай ползунки при включённом сцеплении <b>⚙️ (зелёный индикатор)</b>, чтобы увидеть это своими глазами в 2D, 3D и 4D!",
    q1_title: "Шаг 1: Корни на земле (x² − 2)",
    q1_desc: "Парабола пробивает ось X в двух точках. В 3D две воронки стоят прямо на светящемся шве.",
    q2_title: "Шаг 2: Фокус с исчезновением (x² + 1.5)",
    q2_desc: "В 2D парабола взлетела и корни «пропали». Но глянь на Радар и в 3D — воронки просто шагнули вбок!",
    q3_title: "Шаг 3: Рождение Калаби—Яу (W-волна)",
    q3_desc: "Включаем старшие степени: в 3D вырастают 4 воронки, а 4D-тор сворачивается в многолепестковую розетку!",

    // Widget #1
    w1_badge: "ОКНО #1 • 2D",
    w1_title: "Плоский мир: Лист бумаги и школьный график y = P(x)",
    tab_anatomy: "1. Кирпичики (Мономы)",
    tab_roots: "2. Корни на оси X",
    tab_taylor: "3. Тейлор и Горнер",
    tab_bezier: "4. Кривые Безье",
    w1_story:
      "<b>Куда смотреть:</b> Горизонтальная линия — это узкая рельса оси X. Зелёные кружки, где кривая пробивает ось X (высота y = 0) — это <b>корни на оси X</b>. Потяни ползунок <b>a₀ (лифт)</b> в плюс: когда кривая поднимется над осью X, зелёные точки исчезнут с рельсы — и тут же перепрыгнут на вертикальную мнимую ось на <b>Радаре корней ℂ</b> и в <b>3D-Окне #2</b>!",
    anat_title: "Сумма степеней: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀",
    chk_mono: "Слагаемые",
    sl_c0: "a₀ (лифт)",
    sl_c1: "a₁·x (горка)",
    sl_c2: "a₂·x² (чашка)",
    sl_c3: "a₃·x³ (S-волна)",
    sl_c4: "a₄·x⁴ (W-дно)",
    pre_pdown: "x² − 2 (2 корня)",
    pre_pup: "x² + 1.5 (Мнимые!)",
    pre_cubic: "x³ − 1.5x (S-волна)",
    pre_quartic: "0.35x⁴ − 1.5x² + 1 (W)",

    roots_title: "Запись через корни: P(x) = a(x − r₁)(x − r₂)(x − r₃)",
    roots_desc: "Тяни оранжевые точки прямо по оси X на графике! Когда два корня сливаются в одну точку, кривая касается оси (кратный корень).",
    sl_r1: "Корень r₁",
    sl_r2: "Корень r₂",
    sl_r3: "Корень r₃",
    sl_ra: "Масштаб a",
    expanded_prefix: "Раскрытая форма: ",

    taylor_title: "Как процессор считает sin(x) и eˣ через полиномы",
    sl_taylor_deg: "Степень N:",
    horner_title: "Матрёшка Горнера (только + и ×):",

    bezier_title: "Кривая Безье (магниты) vs Лагранж (прокол точек)",
    mode_bezier: "Кривая Безье (Бернштейн)",
    mode_lagrange: "Полином Лагранжа",
    sl_bezier_t: "Параметр t",
    bezier_explain: "Точки P₁ и P₂ работают как мягкие магниты (полиномы Бернштейна). Зелёные линии показывают схему де Кастельжо.",
    lagrange_explain: "Полином Лагранжа обязан проткнуть все 4 точки насквозь, из-за чего по краям возникают сильные выбросы (феномен Рунге).",

    radar_title: "🎯 Радар корней: Комплексная плоскость (ℂ)",
    real_roots_prefix: "Корней на оси X: ",
    real_roots_none: "На оси X: 0 (ушли в ℂ!)",
    root_real_tag: "на оси X",
    root_imag_tag: "в мнимой ℂ!",

    // Widget #2 (3D Bridge)
    w2_badge: "ОКНО #2 • 3D-МОСТ",
    w2_title: "Трёхмерный батут |P(x + iy)|: Куда уходят корни с оси X?",
    tab_3d_tramp: "1. 3D-Батут корней |P(z)|",
    tab_3d_bezier: "2. 3D-Крыло Безье (Сплайн)",
    btn_profile_3d: "👁 Сбоку (2D-срез)",
    btn_reset_cam: "1:1 Камера",
    w2_story:
      "<b>Как это связано с Окном #1:</b> Мы расширили узкую дорожку оси X в квадратный стеклянный пол (добавили боковую мнимую ось <b>iY</b>). Над полом натянут 3D-рельеф высоты <b>|P(x + iy)|</b>. <b>Яркий светящийся шов посредине</b> — это ровно твой 2D-график из Окна #1! А <b>острые воронки, колющие пол</b> — это корни. Когда ты поднимаешь параболу в Окне #1, центральный шов взлетает в воздух, а воронки просто шагают с него вбок на стеклянный пол!",
    badge_3d_info: "Неоновый шов = 2D график (y=0) • Воронки на полу = Корни",
    hint_3d_mouse: "ЛКМ — вращение 3D • Колесо — зум",
    w2_ctrl_title: "Управление 3D-рельефом и разрезом",
    w2_ctrl_desc:
      "Когда <b>⚙️ Сцепление включено (зелёный диод)</b>, этот 3D-батут строится ровно по формуле из Окна #1. Двигай высоту <b>a₀</b> прямо здесь и смотри, как воронки корней съезжают с центрального шва в мнимую область!",
    sl_3d_c0: "a₀ (высота)",
    sl_3d_c2: "a₂·x² (чашка)",
    sl_3d_slice: "Масштаб высоты",
    chk_slice: "Неоновый 2D-шов (y=0)",
    chk_pillars: "Маяки корней на полу",
    w2_tip_box:
      "💡 Нажми кнопку <b>«👁 Сбоку (2D-срез)»</b> вверху этого окна — камера встанет вдоль пола, и ты увидишь, что светящийся шов в 3D полностью совпадает с плоским графиком из Окна #1!",
    w2_live_real: "Сейчас корни стоят прямо на центральном шве (на обычной оси X).",
    w2_live_complex: "Эврика! Центральный шов взлетел над полом, а воронки корней шагнули вбок по мнимой оси iY!",

    // Widget #3 (4D Manifold)
    w3_badge: "ОКНО #3 • 4D ГИПЕРПРОСТРАНСТВО",
    w3_title: "Четырёхмерное оригами: Расслоение Хопфа и Квинтика Калаби—Яу [WebGL2]",
    mp0: "Квинтика Калаби—Яу (deg 5)",
    mp1: "Тор Хопфа S³ → S²",
    mp2: "Узел комплексных корней",
    w3_story:
      "<b>Откуда берётся 4D и что здесь происходит:</b> В комплексном полиноме 2 координаты на входе (x, y) и 2 на выходе (u, v) — всего <b>4 измерения</b>! Если свернуть бесконечные края 3D-батута из Окна #2 в четырёхмерную сферу S³ и посветить на неё фонариком, мы увидим эту 3D-тень из светящихся колец. Когда <b>⚙️ Сцепление включено</b>, корни и коэффициенты из Окна #1 напрямую скручивают и расщепляют эти кольца!",
    hud_spinor: "🧭 SO(4) МАТРИЦА ВРАЩЕНИЯ 4D",
    hud_poincare: "🎯 СЕЧЕНИЕ ПУАНКАРЕ ∂Ω",
    hud_inv: "🔒 ТОПОЛОГИЧЕСКИЕ ИНВАРИАНТЫ",
    hud_deg_lbl: "Степень: n = ",
    hud_clutch_on: "Сцепление: ВКЛ",
    hud_clutch_off: "Сцепление: ВЫКЛ",
    inv_eq_lbl: "Уравнение:",
    inv_ricci_lbl: "Кривизна Риччи:",
    inv_ricci_val: "R_μν = 0 (Плоская)",
    inv_slice_lbl: "Экватор 2D/3D:",
    inv_slice_val: "Подсвечен",
    sl_4d_deg: "🍩 Лепестки / Степень (Ψ)",
    sl_4d_torsion: "🌀 Двойной винт 4D (Ξ)",
    sl_4d_fold: "🛸 Выворот по оси W (Λ)",
    sl_4d_disp: "🌈 Спектр фазы (Ω)",

    // Dictionary section
    dict_heading: "📖 Толковый словарь «Без снобизма»: Все страшные слова на пальцах",
    dict_sub: "Понятные объяснения для людей — от одночлена до «Калаби—Яу» и расслоения Хопфа",
    btn_close_popup: "✕ Закрыть (ESC)",
    popup_b1: "1. Что здесь нарисовано?",
    popup_b2: "2. Куда смотреть?",
    popup_b3: "3. Что меняется, когда крутишь ползунки?",

    popups: {
      clutch: {
        title: "⚙️ Кнопка «Сцепление» (Clutch) с зелёным/красным индикатором",
        b1: "Это механическая муфта сцепления (как в автомобиле или кассетной деке JVC 1980 года), соединяющая все три мира — 2D, 3D и 4D — единым валом.",
        b2: "На круглый светодиод внутри кнопки ⚙️: когда он горит <b>зелёным</b> — окно подключено к общему полиному; когда <b>красным</b> — окно на свободном ходу.",
        b3: "При включённом сцеплении (зелёный диод) любое движение ползунка в Окне #1 мгновенно перестраивает 3D-батут в Окне #2 и скручивает 4D-тор в Окне #3!"
      },
      overview: {
        title: "💡 Как устроен этот тренажёр за 30 секунд",
        b1: "Здесь показан один и тот же полином P(x) сразу в трёх измерениях: на плоском листе (#1), на трёхмерном батуте комплексных чисел (#2) и в свёрнутом четырёхмерном пространстве (#3).",
        b2: "Начни с трёх больших кнопок «Шаг 1 → Шаг 2 → Шаг 3» вверху страницы и следи, как меняется картинка во всех трёх окнах одновременно.",
        b3: "На любой панели и у каждого сложного слова есть кнопка [?] — нажимай её, чтобы получить простое объяснение на пальцах!"
      },
      w1: {
        title: "📈 Окно #1: Плоский лист бумаги и школьный график y = P(x)",
        b1: "Обычный двумерный график: влево-вправо откладывается число x, а вверх-вниз — результат вычисления полинома P(x).",
        b2: "На зелёные точки, где кривая пересекает горизонтальную ось X. В этих точках высота равна нулю: P(x) = 0. Это действительные корни.",
        b3: "Потяни ползунок a₀ (лифт) вверх: парабола взлетит над осью X, и зелёные точки исчезнут. А теперь посмотри на Радар ℂ и в Окно #2 — ты увидишь, что корни просто шагнули вбок во второе измерение!"
      },
      radar: {
        title: "🎯 Радар корней: Комплексная плоскость (ℂ)",
        b1: "Вид строго сверху на стеклянный пол из 3D-окна! Горизонтальная линия — обычная школьная ось X. Вертикальная линия — боковая «мнимая» улица iY.",
        b2: "На яркие цветные точки r₁, r₂... — это точное положение ВСЕХ корней твоего полинома прямо сейчас, вычисленное настоящим математическим решателем.",
        b3: "Когда ты поднимаешь параболу a₀ вверх к нулю, две точки на горизонтальной линии разгоняются навстречу друг другу, врезаются в центре (0,0) и под углом 90° разлетаются вверх и вниз по вертикальной мнимой оси!"
      },
      w2: {
        title: "🏔 Окно #2: Трёхмерный батут |P(x + iy)| и 3D-сплайн Безье",
        b1: "Промежуточный 3D-мостик! Мы разрешили числу x шагнуть вбок на плоский пол (x + iy), а вверх отложили высоту |P(x + iy)|. Получился упругий 3D-тент.",
        b2: "1) На яркий светящийся шов посредине — это ровно твой 2D-график из Окна #1! 2) На острые воронки, которые колют стеклянный пол (высота = 0) — это корни полинома.",
        b3: "Подними параболу ползунком a₀: центральный неоновый шов оторвётся от пола и повиснет в воздухе, но две воронки корней НЕ исчезнут — они просто съедут со шва налево и направо по стеклянному полу!"
      },
      w3: {
        title: "🌌 Окно #3: Четырёхмерное оригами (Хопф и Калаби—Яу)",
        b1: "Трёхмерная светящаяся тень от четырёхмерной фигуры! У комплексного полинома 2 числа на входе и 2 на выходе (2 + 2 = 4 измерения). Мы свернули бесконечный 3D-батут в 4D-сферу S³ и посветили на неё фонариком.",
        b2: "На вложенные светящиеся бублики (кольца Хопфа) и число лепестков внутри.",
        b3: "Когда включено Сцепление ⚙️, степень полинома задаёт число лепестков (при 5-й степени рождается розетка Калаби—Яу), а разбегающиеся в мнимую ось корни закручивают кольца винтом!"
      },
      spinor: {
        title: "🧭 Матрица вращений 4D-пространства SO(4)",
        b1: "Приборная панель четырёхмерного вращения. В обычном 3D-мире у юлы 3 оси вращения, а в 4D-пространстве можно крутиться сразу в 6 плоскостях!",
        b2: "На текущую степень полинома (deg) и показатели закрутки CS(A) и ∮ω.",
        b3: "Когда корни полинома уходят с оси X в комплексную плоскость, симметрия нарушается и 4D-вращение начинает закручивать тор в двойную спираль."
      },
      poincare: {
        title: "🎯 Сечение Пуанкаре ∂Ω (След от струн на стекле)",
        b1: "Представь, что мы поставили невидимую стеклянную пластинку поперёк 4D-бублика и ставим светящуюся точку каждый раз, когда виток струны пролетает сквозь стекло.",
        b2: "На узор из точек в маленьком чёрном окошке.",
        b3: "При гладких степенях точки ложатся аккуратными кольцами (порядок), а при сильной полиномиальной складке рассыпаются в сложный орнамент."
      },
      invariants: {
        title: "🔒 Топологические инварианты (То, что нельзя сломать)",
        b1: "Инвариант — это свойство фигуры, которое не меняется, как бы ты ни мял её как пластилин (пока не порвёшь). Например, у бублика всегда 1 дырка.",
        b2: "На строку R_μν = 0 (нулевая кривизна Риччи — главное свойство пространств Калаби—Яу) и формулу Σ zₖⁿ + P(z) = 0.",
        b3: "При переключении пресетов и степеней полинома меняется топологический класс расслоения."
      },
      sl_genus: {
        title: "🍩 Ползунок «Лепестки / Степень (Ψ)»",
        b1: "Отвечает за степень полинома n в четырёхмерном уравнении z₁ⁿ + z₂ⁿ + ... = 0.",
        b2: "На количество симметричных складок и лепестков внутри 4D-розы.",
        b3: "При Ψ = 1 получается гладкий тор, при Ψ = 3 — трилистник, при Ψ = 5 — знаменитая квинтика (полином 5-й степени) Калаби—Яу!"
      },
      sl_torsion: {
        title: "🌀 Ползунок «Двойной винт 4D (Ξ)»",
        b1: "Изоклинное кручение — уникальное свойство 4D-мира, где можно одновременно крутиться в двух перпендикулярных плоскостях.",
        b2: "На то, как световые нити наматываются вокруг горловины тора.",
        b3: "Увеличиваешь Ξ — струны туго закручиваются в спираль; уменьшаешь — ложатся спокойными параллельными кольцами."
      },
      sl_wshift: {
        title: "🛸 Ползунок «Выворот по 4-й оси W (Λ)»",
        b1: "Сдвиг и складка вдоль четвёртой пространственной координаты W.",
        b2: "На центральную горловину бублика в Окне #3.",
        b3: "Бублик начинает плавно выворачиваться наизнанку: внешнее кольцо ныряет в центр и становится внутренним!"
      }
    },

    dict: [
      {
        title: "1. Моном (Одночлен)",
        sub: "На пальцах: «Один кирпичик с моторчиком»",
        body: "Одиночная степень числа x с весом, например 3x². Число a₀ — это просто лифт вверх-вниз; a₁x — прямая горка; a₂x² — чашка-парабола; a₃x³ — S-образная волна; a₄x⁴ — двугорбая буква W."
      },
      {
        title: "2. Полином (Многочлен)",
        sub: "На пальцах: «Команда кирпичиков»",
        body: "Сумма нескольких мономов: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀. Около нуля всем заправляют младшие кирпичики (a₀ + a₁x), а вдалеке от нуля старшая степень (x⁴) всегда побеждает и уносит график в космос."
      },
      {
        title: "3. Комплексные числа (z = x + iy)",
        sub: "На пальцах: «Разрешение сойти с рельсов на газон»",
        body: "Обычные числа ходят только вперёд-назад по одной рельсе X. Мнимая единица i (√−1) — это просто команда «поверни на 90° вбок». Поэтому когда парабола поднимается над осью X, её корни не исчезают, а делают шаг вбок на газон комплексной плоскости!"
      },
      {
        title: "4. Схема Горнера",
        sub: "На пальцах: «Русская матрёшка для процессора»",
        body: "Процессор умеет только складывать и умножать. Чтобы не возводить x в степени много раз, полином прячут в матрёшку: ((a₃x + a₂)x + a₁)x + a₀. Всего одно умножение и одно сложение на каждый шаг! Так видеокарты считают sin(x) и физику."
      },
      {
        title: "5. Кривые Безье и Бернштейн",
        sub: "На пальцах: «Шёлковая струна и точки-магниты»",
        body: "Обычный полином капризен. Поэтому инженер Пьер Безье (на заводе Renault) и математик Сергей Бернштейн сделали опорные точки магнитами, которые мягко тянут к себе кривую. Из полиномов Безье сделаны все шрифты, логотипы и кузова авто."
      },
      {
        title: "6. Феномен Рунге (Лагранж)",
        sub: "На пальцах: «Истерика полинома на краях»",
        body: "Если заставить один полином высокой степени пройти строго насквозь через все точки (интерполяция Лагранжа), в середине он пройдёт ровно, а по краям начнёт дико биться в конвульсиях и улетать за экран. Поэтому в 3D-графике используют сплайны Безье!"
      },
      {
        title: "7. Манифолд (Многообразие)",
        sub: "На пальцах: «Фигура, которая кажется плоской муравью»",
        body: "Любая гладкая изогнутая поверхность (шар, бублик, 4D-сфера). Если посадить на огромный шар маленького муравья, ему покажется, что пол под лапками плоский. Земля — это двумерный манифолд, свёрнутый в шар в 3D."
      },
      {
        title: "8. Что за «Калаби—Яу»?",
        sub: "На пальцах: «Микро-оригами для скрытых измерений Вселенной»",
        body: "В теории струн у нашего мира кроме длины, ширины и высоты есть ещё 6 скрытых измерений. Мы их не замечаем, потому что в каждой точке комнаты они свёрнуты в крошечный узелок, заданный полиномом 5-й степени (квинтикой Калаби—Яу из Окна #3)!"
      },
      {
        title: "9. Расслоение Хопфа (S³ → S²)",
        sub: "На пальцах: «4D-клубок из сцепленных бубликов»",
        body: "Математик Хайнц Хопф открыл, что четырёхмерную сферу S³ можно целиком сложить из замкнутых колец, которые продеты друг сквозь друга как звенья одной цепи и нигде не пересекаются. Их 3D-тень мы и крутим в Окне #3!"
      }
    ]
  },

  en: {
    brand: "POLYNOMIAL LAB // 2D → 3D → 4D",
    nav_w1: "#1: 2D Sheet",
    nav_w2: "#2: 3D Trampoline",
    nav_w3: "#3: 4D Cosmos",
    nav_dict: "📖 Plain-English Glossary",
    hero_badge: "INTERACTIVE JOURNEY ACROSS DIMENSIONS (ZERO ACADEMIC SNOBBERY)",
    btn_how_it_works: "How does this lab work?",
    hero_title: "How a School Parabola Steps into 3D and Folds 4D Space",
    hero_lead:
      "In school they tell you: when a parabola floats above the X-axis, it has 'no roots'. <b>They lied to you!</b> The roots never vanish — they simply step sideways off the narrow 1D X-track into a second dimension. Click any of the <b>3 experiments</b> below or drag sliders while <b>⚙️ Clutch (green LED)</b> is engaged to see it live across 2D, 3D, and 4D!",
    q1_title: "Step 1: Roots on the Ground (x² − 2)",
    q1_desc: "The parabola crosses the X-axis at two points. In 3D, two funnels touch the floor right on the glowing seam.",
    q2_title: "Step 2: The Vanishing Act (x² + 1.5)",
    q2_desc: "In 2D the parabola lifts off and roots 'disappear'. Look at the Radar and 3D — the funnels simply stepped sideways!",
    q3_title: "Step 3: Birth of Calabi–Yau (W-Wave)",
    q3_desc: "Higher powers awaken: 4 funnels appear in 3D, while the 4D torus folds into a multi-petal rosette!",

    w1_badge: "WINDOW #1 • 2D",
    w1_title: "Flat World: Paper Sheet & School Graph y = P(x)",
    tab_anatomy: "1. Building Blocks (Monomials)",
    tab_roots: "2. Roots on X-Axis",
    tab_taylor: "3. Taylor & Horner",
    tab_bezier: "4. Bézier Curves",
    w1_story:
      "<b>Where to look:</b> The horizontal line is the narrow 1D X-track. Green dots where the curve pierces the X-axis (height y = 0) are <b>real roots</b>. Pull slider <b>a₀ (elevator)</b> up into positive numbers: when the curve lifts above X, the green dots leave the rail — and immediately jump onto the vertical imaginary axis on the <b>Complex Radar ℂ</b> and in <b>3D Window #2</b>!",
    anat_title: "Sum of Powers: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀",
    chk_mono: "Monomials",
    sl_c0: "a₀ (lift)",
    sl_c1: "a₁·x (slope)",
    sl_c2: "a₂·x² (bowl)",
    sl_c3: "a₃·x³ (S-wave)",
    sl_c4: "a₄·x⁴ (W-well)",
    pre_pdown: "x² − 2 (2 Real Roots)",
    pre_pup: "x² + 1.5 (Imaginary!)",
    pre_cubic: "x³ − 1.5x (S-Wave)",
    pre_quartic: "0.35x⁴ − 1.5x² + 1 (W)",

    roots_title: "Factored Form: P(x) = a(x − r₁)(x − r₂)(x − r₃)",
    roots_desc: "Drag the orange root handles directly along the X-axis! When two roots merge, the curve kisses the axis tangentially (multiple root).",
    sl_r1: "Root r₁",
    sl_r2: "Root r₂",
    sl_r3: "Root r₃",
    sl_ra: "Scale a",
    expanded_prefix: "Expanded form: ",

    taylor_title: "How CPUs Compute sin(x) & eˣ via Polynomials",
    sl_taylor_deg: "Degree N:",
    horner_title: "Horner's Nesting (only + and ×):",

    bezier_title: "Bézier Curve (Magnets) vs Lagrange (Piercing Points)",
    mode_bezier: "Bézier Curve (Bernstein)",
    mode_lagrange: "Lagrange Polynomial",
    sl_bezier_t: "Parameter t",
    bezier_explain: "Points P₁ and P₂ act like smooth magnets (Bernstein polynomials). Green segments show De Casteljau's algorithm.",
    lagrange_explain: "Lagrange interpolation is forced to pierce all 4 points, causing wild oscillations near the edges (Runge's phenomenon).",

    radar_title: "🎯 Root Radar: Complex Plane (ℂ)",
    real_roots_prefix: "Roots on X-axis: ",
    real_roots_none: "On X-axis: 0 (stepped into ℂ!)",
    root_real_tag: "on X-axis",
    root_imag_tag: "in complex ℂ!",

    w2_badge: "WINDOW #2 • 3D BRIDGE",
    w2_title: "3D Trampoline |P(x + iy)|: Where Do Roots Go When They Leave X?",
    tab_3d_tramp: "1. 3D Root Trampoline |P(z)|",
    tab_3d_bezier: "2. 3D Bézier Wing (Spline Patch)",
    btn_profile_3d: "👁 Side View (2D Slice)",
    btn_reset_cam: "1:1 Camera",
    w2_story:
      "<b>How this connects to Window #1:</b> We widened the narrow X-rail into a square glass floor by adding the sideways imaginary axis <b>iY</b>. Above the floor stretches the 3D surface <b>|P(x + iy)|</b>. The <b>glowing neon seam down the middle</b> is literally your 2D graph from Window #1! And the <b>sharp funnels poking the floor</b> are the roots. Lift the parabola in Window #1: the central seam lifts into the air, while the root funnels simply walk sideways onto the glass floor!",
    badge_3d_info: "Neon Seam = 2D Graph (y=0) • Floor Funnels = Roots",
    hint_3d_mouse: "LMB — 3D Orbit • Wheel — Zoom",
    w2_ctrl_title: "3D Relief & Slice Controls",
    w2_ctrl_desc:
      "When <b>⚙️ Clutch is ON (green LED)</b>, this 3D trampoline is driven directly by Window #1. Move height <b>a₀</b> right here and watch the root funnels slide off the central seam into the imaginary domain!",
    sl_3d_c0: "a₀ (height)",
    sl_3d_c2: "a₂·x² (bowl)",
    sl_3d_slice: "Height Scale",
    chk_slice: "Neon 2D Seam (y=0)",
    chk_pillars: "Root Beacons on Floor",
    w2_tip_box:
      "💡 Click <b>'👁 Side View (2D Slice)'</b> in the header — the camera aligns with the floor so you can see the glowing 3D seam match the 2D graph in Window #1!",
    w2_live_real: "Right now the root funnels sit directly on the central real seam (X-axis).",
    w2_live_complex: "Eureka! The central seam lifted off the floor, and the root funnels stepped sideways along the imaginary iY axis!",

    w3_badge: "WINDOW #3 • 4D HYPERSPACE",
    w3_title: "Four-Dimensional Origami: Hopf Fibration & Calabi–Yau Quintic [WebGL2]",
    mp0: "Calabi–Yau Quintic (deg 5)",
    mp1: "Hopf Torus S³ → S²",
    mp2: "Complex Root Knot",
    w3_story:
      "<b>Where 4D comes from:</b> A complex polynomial has 2 input coordinates (x, y) and 2 output coordinates (u, v) — <b>4 dimensions total</b>! Wrapping the infinite edges of the 3D trampoline from Window #2 into a 4D hypersphere S³ and shining a light casts this 3D shadow of glowing rings. When <b>⚙️ Clutch is ON</b>, the roots and coefficients from Window #1 twist and split these rings live!",
    hud_spinor: "🧭 SO(4) 4D ROTATION MATRIX",
    hud_poincare: "🎯 POINCARÉ SECTION ∂Ω",
    hud_inv: "🔒 TOPOLOGICAL INVARIANTS",
    hud_deg_lbl: "Degree: n = ",
    hud_clutch_on: "Clutch: ENGAGED",
    hud_clutch_off: "Clutch: FREE",
    inv_eq_lbl: "Equation:",
    inv_ricci_lbl: "Ricci Curvature:",
    inv_ricci_val: "R_μν = 0 (Flat)",
    inv_slice_lbl: "2D/3D Equator:",
    inv_slice_val: "Active",
    sl_4d_deg: "🍩 Petals / Degree (Ψ)",
    sl_4d_torsion: "🌀 4D Double Twist (Ξ)",
    sl_4d_fold: "🛸 W-Axis Eversion (Λ)",
    sl_4d_disp: "🌈 Phase Spectrum (Ω)",

    dict_heading: "📖 Plain-English Glossary: Scary Math Words Explained Simply",
    dict_sub: "Human explanations — from monomials to Calabi–Yau manifolds and Hopf fibrations",
    btn_close_popup: "✕ Close (ESC)",
    popup_b1: "1. What is drawn here?",
    popup_b2: "2. Where should I look?",
    popup_b3: "3. What changes when I move the sliders?",

    popups: {
      clutch: {
        title: "⚙️ Clutch Button (Green / Red LED Indicator)",
        b1: "Like a mechanical clutch in a car or a 1980s JVC tape deck, connecting all three worlds — 2D, 3D, and 4D — onto a single drive shaft.",
        b2: "Look at the round LED inside the ⚙️ button: <b>Green</b> means the window is coupled to the master polynomial; <b>Red</b> means free-wheel mode.",
        b3: "When engaged (green LED), dragging any slider in Window #1 immediately morphs the 3D trampoline in Window #2 and twists the 4D manifold in Window #3!"
      },
      overview: {
        title: "💡 How This Simulator Works in 30 Seconds",
        b1: "You are looking at the exact same polynomial P(x) across three dimensions: on a 2D sheet (#1), on a 3D complex trampoline (#2), and folded into 4D space (#3).",
        b2: "Click through 'Step 1 → Step 2 → Step 3' at the top and watch all three windows react together.",
        b3: "Every panel has a [?] button — click any of them for a plain-English explanation!"
      },
      w1: {
        title: "📈 Window #1: Flat Paper Sheet & School Graph y = P(x)",
        b1: "The familiar 2D graph: input x runs left-right, and output P(x) runs up-down.",
        b2: "Look at the green dots where the curve crosses the horizontal X-axis (height y = 0). Those are real roots.",
        b3: "Pull slider a₀ (lift) up: the parabola floats above the X-axis and green dots vanish from the 1D line — jumping onto the vertical imaginary axis on the ℂ Radar and in 3D Window #2!"
      },
      radar: {
        title: "🎯 Root Radar: The Complex Plane (ℂ)",
        b1: "A top-down map of the glass floor from Window #2! Horizontal line = real X-axis. Vertical line = sideways imaginary street iY.",
        b2: "Look at the glowing dots r₁, r₂... — the live positions of ALL roots computed by the Durand–Kerner complex solver.",
        b3: "As you lift parabola a₀ past zero, two roots race toward each other along X, collide at (0,0), and shoot apart at 90° up and down the imaginary axis!"
      },
      w2: {
        title: "🏔 Window #2: 3D Trampoline |P(x + iy)| & 3D Bézier Wing",
        b1: "The 3D bridge! We let x step sideways onto a 2D floor (x + iy) and plot height |P(x + iy)| upward like a rubber tent.",
        b2: "1) The glowing neon seam in the middle is your exact 2D graph from Window #1! 2) The sharp funnels touching the floor (height = 0) are the polynomial's roots.",
        b3: "Lift the parabola with a₀: the central seam lifts into the air, while the two root funnels slide sideways off the seam onto the glass floor!"
      },
      w3: {
        title: "🌌 Window #3: 4D Origami (Hopf Fibration & Calabi–Yau)",
        b1: "A 3D glowing shadow of a 4D object! A complex polynomial has 2 inputs and 2 outputs (4 dimensions). Wrapping the 3D trampoline into a 4D sphere S³ projects into these nested glowing rings.",
        b2: "Look at the nested torus rings and the number of petals inside.",
        b3: "With Clutch ⚙️ ON, the polynomial degree sets the petal count (degree 5 creates a Calabi–Yau quintic), while complex roots twist the rings!"
      },
      spinor: {
        title: "🧭 SO(4) 4D Rotation Matrix",
        b1: "Telemetry for 4D rotations. In 3D there are 3 rotation axes; in 4D there are 6 independent rotation planes!",
        b2: "Look at the active degree (n) and the Chern–Simons / Holonomy invariants.",
        b3: "When roots move into the complex plane, spinor symmetry shifts and twists the fibration."
      },
      poincare: {
        title: "🎯 Poincaré Section ∂Ω",
        b1: "Imagine placing a glass sheet across the 4D torus and marking a dot every time a glowing trajectory pierces the glass.",
        b2: "Look at the dot pattern inside the mini radar.",
        b3: "Smooth degrees form neat concentric rings; high folding scatters them into complex orbits."
      },
      invariants: {
        title: "🔒 Topological Invariants",
        b1: "An invariant is a property that never breaks when you stretch or bend a shape like clay (like the 1 hole in a donut).",
        b2: "Look at R_μν = 0 (Ricci-flat curvature, the defining property of Calabi–Yau spaces).",
        b3: "Changing polynomial degree switches the topological class of the manifold."
      },
      sl_genus: {
        title: "🍩 Slider: Petals / Degree (Ψ)",
        b1: "Controls polynomial degree n in z₁ⁿ + z₂ⁿ + ... = 0.",
        b2: "Watch the number of lobes/petals inside the 4D rosette.",
        b3: "Ψ = 1 gives a smooth torus, Ψ = 3 a trefoil, Ψ = 5 a Calabi–Yau quintic!"
      },
      sl_torsion: {
        title: "🌀 Slider: 4D Double Twist (Ξ)",
        b1: "Isoclinic rotation — rotating in two perpendicular planes simultaneously in 4D.",
        b2: "Watch the glowing fibers wind around the torus throat.",
        b3: "Higher Ξ winds the fibers tighter; lower Ξ relaxes them into parallel rings."
      },
      sl_wshift: {
        title: "🛸 Slider: W-Axis Eversion (Λ)",
        b1: "Shifts and folds along the fourth spatial coordinate W.",
        b2: "Watch the center of the torus in Window #3.",
        b3: "The torus turns inside out: the outer ring dives through the center to become the inner ring!"
      }
    },

    dict: [
      {
        title: "1. Monomial",
        sub: "Plain English: 'A single LEGO power block'",
        body: "A single power of x with a weight, like 3x². Constant a₀ is an elevator; a₁x is a flat ramp; a₂x² is a U-bowl; a₃x³ is an S-wave; a₄x⁴ is a W-shaped well."
      },
      {
        title: "2. Polynomial",
        sub: "Plain English: 'A team of power blocks'",
        body: "A sum of monomials: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀. Near x = 0 the low powers (a₀ + a₁x) dominate; far away from zero the highest power (x⁴) always wins."
      },
      {
        title: "3. Complex Numbers (z = x + iy)",
        sub: "Plain English: 'Stepping off the train track onto the lawn'",
        body: "Real numbers only walk forward and backward on one rail X. The imaginary unit i (√−1) simply means 'turn 90° sideways'. When a parabola lifts above X, its roots step sideways onto the complex plane!"
      },
      {
        title: "4. Horner's Scheme",
        sub: "Plain English: 'Russian nesting dolls for your CPU'",
        body: "CPUs only add and multiply. Instead of computing x⁴, x³, x² separately, Horner nests them: ((a₃x + a₂)x + a₁)x + a₀. Just one multiply-add (FMA) per degree!"
      },
      {
        title: "5. Bézier Curves & Bernstein",
        sub: "Plain English: 'A silk string pulled by magnets'",
        body: "Engineers Pierre Bézier (at Renault) and mathematician Sergei Bernstein turned control points into smooth magnets that gently pull a curve without wild overshoots. Every font and 3D car body uses them."
      },
      {
        title: "6. Runge's Phenomenon (Lagrange)",
        sub: "Plain English: 'Wild oscillations at the edges'",
        body: "If you force a single high-degree polynomial to pierce strictly through many points (Lagrange interpolation), it bucks wildly near the boundaries. That is why graphics uses Bézier splines instead!"
      },
      {
        title: "7. Manifold",
        sub: "Plain English: 'A curved world that looks flat to an ant'",
        body: "Any smooth surface (a sphere, a donut, a 4D hypersphere) that looks like a flat table when you zoom in close enough. Earth is a 2D manifold curved in 3D space."
      },
      {
        title: "8. What is 'Calabi–Yau'?",
        sub: "Plain English: 'Micro-origami hiding extra dimensions'",
        body: "In string theory, the universe has 6 extra spatial dimensions curled up at every point into a microscopic origami shape defined by a degree-5 polynomial (the Calabi–Yau quintic in Window #3)!"
      },
      {
        title: "9. Hopf Fibration (S³ → S²)",
        sub: "Plain English: 'A 4D ball woven from linked rings'",
        body: "Heinz Hopf discovered that a 4D sphere S³ is woven entirely out of closed circles where every pair of circles is linked like a chain without ever touching. Window #3 projects its 3D shadow!"
      }
    ]
  },

  mn: {
    brand: "ОЛОН ГИШҮҮНТИЙН ЛАБОРАТОРИ // 2D → 3D → 4D",
    nav_w1: "#1: 2D Хуудас",
    nav_w2: "#2: 3D Батут",
    nav_w3: "#3: 4D Огторгуй",
    nav_dict: "📖 Энгийн Тайлбар Толь",
    hero_badge: "ХЭМЖЭЭСТҮҮДЭЭР АЯЛАХ ИНТЕРАКТИВ ЛАБОРАТОРИ (ЭНГИЙНЭЭР)",
    btn_how_it_works: "Энэ төхөөрөмж хэрхэн ажилладаг вэ?",
    hero_title: "Ердийн парабол хэрхэн 3D рүү гарч, 4D огторгуйг нугалдаг вэ?",
    hero_lead:
      "Сургуульд парабол X тэнхлэгээс дээш хөөрвөл «язгуур байхгүй» гэж заадаг. <b>Үнэндээ язгуурууд алга болдоггүй!</b> Тэд зүгээр л нарийхан X шугамаас хажуу тийш хоёр дахь хэмжээс рүү алхдаг. Доорх <b>3 туршилтын товчийг</b> дарж эсвэл <b>⚙️ Авцуулах холбоо (ногоон гэрэл)</b> асаалттай үед гулсуурыг хөдөлгөж 2D, 3D, 4D-д шууд хараарай!",
    q1_title: "Алхам 1: Газар дээрх язгуурууд (x² − 2)",
    q1_desc: "Парабол X тэнхлэгийг 2 цэгт огтолно. 3D-д хоёр юүлүүр гэрэлтэх оёдол дээр байна.",
    q2_title: "Алхам 2: Алга болох илбэ (x² + 1.5)",
    q2_desc: "2D-д парабол дээш хөөрч язгуур «алга болсон». Гэвч Радар ба 3D-г хар — юүлүүрүүд хажуу тийш алхсан!",
    q3_title: "Алхам 3: Калаби—Яу үүсэх нь (W-долгион)",
    q3_desc: "Ахлах зэргүүдийг нэмэхэд 3D-д 4 юүлүүр үүсэж, 4D цагираг олон дэлбээт цэцэг болж хувирна!",

    w1_badge: "ЦОНХ #1 • 2D",
    w1_title: "Хавтгай ертөнц: Цаас ба график y = P(x)",
    tab_anatomy: "1. Тоосгонууд (Моном)",
    tab_roots: "2. X тэнхлэгийн язгуур",
    tab_taylor: "3. Тейлор ба Горнер",
    tab_bezier: "4. Безье муруй",
    w1_story:
      "<b>Хаашаа харах вэ:</b> Хэвтээ шугам бол X тэнхлэг. Муруй X тэнхлэгийг огтлох ногоон цэгүүд (y = 0) нь <b>язгуурууд</b> юм. <b>a₀ (өргөгч)</b> гулсуурыг дээш татахад язгуурууд <b>Комплекс Радар ℂ</b> болон <b>3D Цонх #2</b> руу шилжинэ!",
    anat_title: "Зэрэгтүүдийн нийлбэр: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀",
    chk_mono: "Гишүүд",
    sl_c0: "a₀ (өргөгч)",
    sl_c1: "a₁·x (налуу)",
    sl_c2: "a₂·x² (аяга)",
    sl_c3: "a₃·x³ (S-долгион)",
    sl_c4: "a₄·x⁴ (W-ёроол)",
    pre_pdown: "x² − 2 (2 язгуур)",
    pre_pup: "x² + 1.5 (Хуурмаг!)",
    pre_cubic: "x³ − 1.5x (S-долгион)",
    pre_quartic: "0.35x⁴ − 1.5x² + 1 (W)",

    roots_title: "Язгуураар задлах: P(x) = a(x − r₁)(x − r₂)(x − r₃)",
    roots_desc: "Улбар шар цэгүүдийг X тэнхлэг дээр чирээрэй! Хоёр язгуур давхцахад муруй тэнхлэгийг шүргэнэ.",
    sl_r1: "Язгуур r₁",
    sl_r2: "Язгуур r₂",
    sl_r3: "Язгуур r₃",
    sl_ra: "Масштаб a",
    expanded_prefix: "Задарсан хэлбэр: ",

    taylor_title: "Процессор sin(x) ба eˣ-ийг хэрхэн боддог вэ?",
    sl_taylor_deg: "Зэрэг N:",
    horner_title: "Горнерийн схем (зөвхөн + ба ×):",

    bezier_title: "Безье муруй (соронз) ба Лагранж (цэг дайрах)",
    mode_bezier: "Безье муруй (Бернштейн)",
    mode_lagrange: "Лагранжийн полином",
    sl_bezier_t: "Параметр t",
    bezier_explain: "P₁ ба P₂ цэгүүд зөөлөн соронз шиг татна (Бернштейний полином). Ногоон шугамууд де Кастельжогийн схемийг харуулна.",
    lagrange_explain: "Лагранжийн полином бүх 4 цэгийг заавал нэвтлэх тул захаараа хүчтэй савалгаа (Рунгегийн үзэгдэл) үүсгэдэг.",

    radar_title: "🎯 Язгуурын Радар: Комплекс хавтгай (ℂ)",
    real_roots_prefix: "X тэнхлэг дээрх язгуур: ",
    real_roots_none: "X дээр: 0 (ℂ рүү орсон!)",
    root_real_tag: "X тэнхлэгт",
    root_imag_tag: "комплекс ℂ-д!",

    w2_badge: "ЦОНХ #2 • 3D ГҮҮР",
    w2_title: "3D Батут |P(x + iy)|: Язгуурууд хаашаа алга болдог вэ?",
    tab_3d_tramp: "1. 3D Язгуурын батут |P(z)|",
    tab_3d_bezier: "2. 3D Безье далавч (Сплайн)",
    btn_profile_3d: "👁 Хажуугаас (2D огтлол)",
    btn_reset_cam: "1:1 Камер",
    w2_story:
      "<b>Цонх #1-тэй яаж холбогдох вэ:</b> Нарийхан X тэнхлэгийг шилэн шал болгон өргөсгөж (хажуугийн <b>iY</b> тэнхлэг нэмж), дээр нь <b>|P(x + iy)|</b> өндөртэй 3D резинэн батут татлаа. <b>Голын гэрэлтсэн шугам</b> бол Цонх #1-ийн 2D график! Харин <b>шаланд хүрсэн юүлүүрүүд</b> бол язгуурууд юм. Параболыг дээш өргөхөд голын шугам хөөрч, юүлүүрүүд хажуу тийш шилэн шал руу алхана!",
    badge_3d_info: "Неон оёдол = 2D график (y=0) • Юүлүүр = Язгуурууд",
    hint_3d_mouse: "Хулгана — 3D эргүүлэх • Дугуй — томруулах",
    w2_ctrl_title: "3D Гадаргуу ба Огтлолын Удирдлага",
    w2_ctrl_desc:
      "<b>⚙️ Авцуулах холбоо асаалттай (ногоон гэрэл)</b> үед энэ 3D батут Цонх #1-ийн томьёогоор шууд хөдөлнө. <b>a₀</b> өндрийг хөдөлгөж язгуурын юүлүүрүүд хэрхэн хажуу тийш гулсахыг хараарай!",
    sl_3d_c0: "a₀ (өндөр)",
    sl_3d_c2: "a₂·x² (аяга)",
    sl_3d_slice: "Өндрийн масштаб",
    chk_slice: "Неон 2D-оёдол (y=0)",
    chk_pillars: "Язгуурын гэрэлт цамхаг",
    w2_tip_box:
      "💡 Дээрх <b>«👁 Хажуугаас (2D огтлол)»</b> товчийг дарвал камер шалны дагуу эргэж, 3D оёдол нь 2D графиктай яг давхцахыг харуулна!",
    w2_live_real: "Яг одоо язгуурын юүлүүрүүд голын бодит шугам (X тэнхлэг) дээр байна.",
    w2_live_complex: "Эврика! Голын оёдол шалнаас хөөрч, язгуурын юүлүүрүүд хуурмаг iY тэнхлэг дагуу хажуу тийш алхлаа!",

    w3_badge: "ЦОНХ #3 • 4D ОГТОРГУЙ",
    w3_title: "Дөрвөн хэмжээст оригами: Хопфын багцлал ба Калаби—Яу [WebGL2]",
    mp0: "Калаби—Яу Квинтик (deg 5)",
    mp1: "Хопфын Тор S³ → S²",
    mp2: "Комплекс язгуурын зангилаа",
    w3_story:
      "<b>4D хаанаас гардаг вэ:</b> Комплекс олон гишүүнт оролтдоо 2 (x, y), гаралтдаа 2 (u, v) — нийт <b>4 хэмжээстэй</b>! Цонх #2-ын 3D батутын захыг 4D бөмбөрцөг S³ болгон хумихад энэхүү гэрэлтсэн цагиргууд үүснэ.",
    hud_spinor: "🧭 SO(4) 4D ЭРГҮҮЛЭЛТИЙН МАТРИЦ",
    hud_poincare: "🎯 ПУАНКАРЕГИЙН ОГТЛОЛ ∂Ω",
    hud_inv: "🔒 ТОПОЛОГИЙН ИНВАРИАНТУУД",
    hud_deg_lbl: "Зэрэг: n = ",
    hud_clutch_on: "Холбоо: АСААЛТТАЙ",
    hud_clutch_off: "Холбоо: САЛСАН",
    inv_eq_lbl: "Тэгшитгэл:",
    inv_ricci_lbl: "Риччи муруйлт:",
    inv_ricci_val: "R_μν = 0 (Хавтгай)",
    inv_slice_lbl: "2D/3D Экватор:",
    inv_slice_val: "Идэвхтэй",
    sl_4d_deg: "🍩 Дэлбээ / Зэрэг (Ψ)",
    sl_4d_torsion: "🌀 4D Давхар мушгиралт (Ξ)",
    sl_4d_fold: "🛸 W-тэнхлэгийн эргэлт (Λ)",
    sl_4d_disp: "🌈 Фазын спектр (Ω)",

    dict_heading: "📖 Энгийн Тайлбар Толь: Хэцүү нэр томьёог хуруугаараа ойлгох нь",
    dict_sub: "Мономоос эхлээд Калаби—Яу болон Хопфын багцлал хүртэл энгийн үгээр",
    btn_close_popup: "✕ Хаах (ESC)",
    popup_b1: "1. Энд юу зурсан бэ?",
    popup_b2: "2. Хаашаа харах вэ?",
    popup_b3: "3. Гулсуурыг хөдөлгөхөд юу өөрчлөгдөх вэ?",

    popups: {
      clutch: {
        title: "⚙️ Авцуулах холбоо (Clutch — Ногоон / Улаан гэрэл)",
        b1: "Машины авцуулах холбоо эсвэл 1980 оны JVC хөгжмийн товчлуур шиг 2D, 3D, 4D гурван цонхыг нэг голд холбоно.",
        b2: "Товчлуур доторх дугуй гэрлийг хар: <b>Ногоон</b> бол холбогдсон, <b>Улаан</b> бол салсан (чөлөөт горим).",
        b3: "Ногоон гэрэл асаалттай үед Цонх #1-ийн гулсуурыг хөдөлгөхөд 3D батут болон 4D цагираг зэрэг хувирна!"
      },
      overview: {
        title: "💡 30 секундийн дотор хэрхэн ойлгох вэ?",
        b1: "Нэг ижил P(x) олон гишүүнтийг 2D цаасан дээр (#1), 3D батут дээр (#2), мөн 4D огторгуйд (#3) зэрэг харуулж байна.",
        b2: "Дээр байрлах «Алхам 1 → Алхам 2 → Алхам 3» товчнуудыг дараад гурван цонхыг ажиглаарай.",
        b3: "Самбар бүр дээрх [?] товчийг дарж энгийн тайлбарыг уншаарай!"
      },
      w1: {
        title: "📈 Цонх #1: Хавтгай цаас ба график y = P(x)",
        b1: "Сургуулийн танил 2D график: хөндлөн тэнхлэгээр x, босоо тэнхлэгээр P(x).",
        b2: "Муруй X тэнхлэгийг огтлох ногоон цэгүүдийг хар — эдгээр нь бодит язгуурууд (P(x) = 0).",
        b3: "a₀ гулсуурыг дээш татахад парабол X тэнхлэгээс хөөрч, язгуурууд ℂ Радар болон 3D Цонх #2 руу шилжинэ!"
      },
      radar: {
        title: "🎯 Язгуурын Радар: Комплекс хавтгай (ℂ)",
        b1: "3D цонхны шилэн шалыг эгц дээрээс нь харсан зураг! Хэвтээ шугам = бодит X тэнхлэг, босоо шугам = хуурмаг iY тэнхлэг.",
        b2: "Гэрэлтсэн r₁, r₂... цэгүүд бол жинхэнэ тооцоолуураар бодогдсон бүх язгуурууд юм.",
        b3: "Параболыг дээш өргөхөд хоёр язгуур төвд (0,0) мөргөлдөөд 90° өнцгөөр дээш доош босоо тэнхлэг дагуу салж одно!"
      },
      w2: {
        title: "🏔 Цонх #2: 3D Батут |P(x + iy)| ба Безье Сплайн",
        b1: "2D ба 4D-г холбох 3D гүүр! Шалны цэг бүр дээр |P(x + iy)| өндрийг байгуулсан резинэн батут.",
        b2: "1) Голын гэрэлтсэн шугам бол Цонх #1-ийн 2D график! 2) Шаланд хүрсэн хурц юүлүүрүүд бол язгуурууд.",
        b3: "a₀-ийг дээш өргөхөд голын шугам хөөрч, харин хоёр юүлүүр алга бололгүй хажуу тийш шилэн шал руу алхана!"
      },
      w3: {
        title: "🌌 Цонх #3: 4D Оригами (Хопф ба Калаби—Яу)",
        b1: "4 хэмжээст биетийн 3D гэрэлт сүүдэр! Комплекс полином оролтдоо 2, гаралтдаа 2 хэмжээстэй (2+2=4).",
        b2: "Давхарласан гэрэлт цагиргууд болон дэлбээний тоог ажигла.",
        b3: "Холбоо ⚙️ асаалттай үед полиномын зэрэг дэлбээний тоог өөрчилж, язгуурууд цагиргийг мушгина!"
      },
      spinor: {
        title: "🧭 SO(4) 4D Эргүүлэлтийн Матриц",
        b1: "4 хэмжээст огторгуйн 6 хавтгайн эргүүлэлтийн хянах самбар.",
        b2: "Зэрэг (n) болон Черн—Саймонсын инвариантыг хар.",
        b3: "Язгуурууд комплекс хавтгайд шилжихэд эргэлтийн тэнцвэр өөрчлөгдөнө."
      },
      poincare: {
        title: "🎯 Пуанкарегийн Огтлол ∂Ω",
        b1: "4D цагиргийг шилэн хавтгайгаар огтолж, утас нэвтрэх бүрд цэг тавьсан мөр.",
        b2: "Жижиг хар дэлгэц дээрх цэгэн хээг ажигла.",
        b3: "Гулсуурыг өөрчлөхөд цэгүүд тойрог эсвэл сарнисан хээ үүсгэнэ."
      },
      invariants: {
        title: "🔒 Топологийн Инвариантууд",
        b1: "Дүрсийг баримлын шавар шиг нугалахад эвдэрдэггүй шинж чанар (жишээ нь цагирагны 1 нүх).",
        b2: "R_μν = 0 (Калаби—Яу огторгуйн тэг муруйлт).",
        b3: "Полиномын зэрэг өөрчлөгдөхөд топологийн ангилал солигдоно."
      },
      sl_genus: {
        title: "🍩 Гулсуур: Дэлбээ / Зэрэг (Ψ)",
        b1: "z₁ⁿ + z₂ⁿ + ... = 0 тэгшитгэлийн n зэргийг удирдана.",
        b2: "4D сарнайн дэлбээний тоог хар.",
        b3: "Ψ = 5 үед 5 дэлбээт Калаби—Яу квинтик үүснэ!"
      },
      sl_torsion: {
        title: "🌀 Гулсуур: 4D Давхар Мушгиралт (Ξ)",
        b1: "4D огторгуйд хоёр перпендикуляр хавтгайд зэрэг эргэх хөдөлгөөн.",
        b2: "Гэрэлт утаснууд хэрхэн мушгирахыг хар.",
        b3: "Ξ ихсэхэд утаснууд чангарч мушгирна."
      },
      sl_wshift: {
        title: "🛸 Гулсуур: W-Тэнхлэгийн Эргэлт (Λ)",
        b1: "Дөрөв дэх W тэнхлэгийн дагуух шилжилт.",
        b2: "Цагираг дотроосоо гадагш эргэхийг ажигла.",
        b3: "Гаднах цагираг төв нүхээр орж доторх цагираг болно!"
      }
    },

    dict: [
      {
        title: "1. Моном (Нэг гишүүнт)",
        sub: "Энгийнээр: «Мотортой нэг LEGO тоосго»",
        body: "Тоон жинтэй x-ийн зэрэгт, жишээ нь 3x². a₀ бол лифт; a₁x бол налуу зам; a₂x² бол парабол аяга; a₃x³ бол S-долгион; a₄x⁴ бол W-хотгор."
      },
      {
        title: "2. Полином (Олон гишүүнт)",
        sub: "Энгийнээр: «Тоосгонуудын баг»",
        body: "Мономуудын нийлбэр: P(x) = a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀. Тэг орчимд бага зэргүүд (a₀ + a₁x), харин холоос ахлах зэрэг (x⁴) графикийг удирдана."
      },
      {
        title: "3. Комплекс тоо (z = x + iy)",
        sub: "Энгийнээр: «Замаас зүлэг рүү хажуу тийш алхах»",
        body: "Бодит тоо зөвхөн X шугамаар урагш-хойш явна. Хуурмаг нэгж i (√−1) нь «90° хажуу тийш эргэ» гэсэн команд юм. Тиймээс парабол хөөрөхөд язгуурууд хажуугийн зүлэг рүү алхдаг!"
      },
      {
        title: "4. Горнерийн схем",
        sub: "Энгийнээр: «Процессорт зориулсан матрёшка»",
        body: "Процессор зөвхөн нэмж, үржүүлдэг. Зэрэг дэвшүүлэхийн оронд хаалтанд давхарлана: ((a₃x + a₂)x + a₁)x + a₀. Алхам бүрд ганц үржүүлэх ба нэмэх (FMA)!"
      },
      {
        title: "5. Безье муруй ба Бернштейн",
        sub: "Энгийнээр: «Соронзоор татагддаг торгон утас»",
        body: "Инженер Пьер Безье ба математикч Сергей Бернштейн нар тулгуур цэгүүдийг муруйг зөөлөн татдаг соронз болгосон. Бүх фонт ба 3D машины кузов үүгээр бүтдэг."
      },
      {
        title: "6. Рунгегийн үзэгдэл (Лагранж)",
        sub: "Энгийнээр: «Зах хэсгийн хүчтэй савалгаа»",
        body: "Өндөр зэргийн ганц полиномоор олон цэгийг хүчээр дайруулбал (Лагранж) зах руугаа хяналтгүй савалдаг. Тиймээс графикт Безье сплайн ашигладаг!"
      },
      {
        title: "7. Манифолд (Олон янз байдал)",
        sub: "Энгийнээр: «Шоргоолжинд хавтгай мэт санагдах муруй гадаргуу»",
        body: "Ойроос харахад хавтгай ширээ шиг харагддаг аливаа гөлгөр муруй гадаргуу (бөмбөрцөг, цагираг, 4D бөмбөрцөг)."
      },
      {
        title: "8. «Калаби—Яу» гэж юу вэ?",
        sub: "Энгийнээр: «Нууц хэмжээсийг агуулсан микро-оригами»",
        body: "Утасны онолоор орчлон ертөнцөд 6 нууц хэмжээс бий. Тэдгээр нь цэг бүрд 5-р зэргийн полиномоор (Калаби—Яу квинтик) тодорхойлогдох бичил зангилаанд хумигдсан байдаг!"
      },
      {
        title: "9. Хопфын багцлал (S³ → S²)",
        sub: "Энгийнээр: «Хэлхэлдсэн цагиргуудаас бүтсэн 4D бөмбөлөг»",
        body: "Хайнц Хопф 4 хэмжээст S³ бөмбөрцгийг хоорондоо гинж шиг хэлхэлдсэн битүү цагиргуудаар бүрэн дүүргэж болохыг нээсэн. Түүний 3D сүүдрийг Цонх #3 харуулж байна!"
      }
    ]
  }
};
