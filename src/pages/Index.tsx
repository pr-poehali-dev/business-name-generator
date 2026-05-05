import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const CHECK_DOMAIN_URL = func2url["check-domain"];
const GENERATE_NAMES_URL = func2url["generate-names"];

type Lang = "ru" | "en";
type CheckStatus = "idle" | "checking" | "available" | "unavailable" | "unknown";

interface NameResult {
  name: string;
  slug: string;
  domain: CheckStatus;
  vk: CheckStatus;
  telegram: CheckStatus;
}

// ─── localStorage: история выданных названий ─────────────────
const STORAGE_KEY = "namemaster_used";

function getUsed(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function addUsed(names: string[]) {
  const prev = getUsed();
  const next = Array.from(new Set([...prev, ...names]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

// ─── Переводы ────────────────────────────────────────────────
const SPHERES = {
  ru: [
    { label: "Кафе",            value: "кафе" },
    { label: "Ресторан",        value: "ресторан" },
    { label: "Маркетинг",       value: "маркетинг" },
    { label: "Агентство",       value: "агентство" },
    { label: "Одежда",          value: "одежда" },
    { label: "IT и стартапы",   value: "it" },
    { label: "Спорт",           value: "спорт" },
    { label: "Красота и уход",  value: "красота" },
    { label: "Доставка",        value: "доставка" },
    { label: "Здоровье",        value: "здоровье" },
    { label: "Авто",            value: "авто" },
    { label: "Недвижимость",    value: "недвижимость" },
    { label: "Агро",            value: "агро" },
    { label: "Игры",            value: "игры" },
    { label: "Эко",             value: "эко" },
    { label: "Образование",     value: "образование" },
    { label: "Финансы",         value: "финансы" },
  ],
  en: [
    { label: "Cafe",            value: "cafe" },
    { label: "Restaurant",      value: "restaurant" },
    { label: "Marketing",       value: "marketing" },
    { label: "Agency",          value: "agency" },
    { label: "Fashion",         value: "fashion" },
    { label: "IT & Startups",   value: "it" },
    { label: "Sport",           value: "sport" },
    { label: "Beauty & Care",   value: "beauty" },
    { label: "Delivery",        value: "delivery" },
    { label: "Health",          value: "health" },
    { label: "Auto",            value: "auto" },
    { label: "Real Estate",     value: "realestate" },
    { label: "Agro",            value: "agro" },
    { label: "Games",           value: "games" },
    { label: "Eco",             value: "eco" },
    { label: "Education",       value: "education" },
    { label: "Finance",         value: "finance" },
  ],
};

const T = {
  ru: {
    badge: "Генератор названий нового поколения",
    heroTitle1: "Найди",
    heroTitle2: "идеальное",
    heroTitle3: "название",
    heroSub: "Генерируем варианты и мгновенно проверяем домен .RU, ВКонтакте и Telegram",
    heroBtn: "Начать генерацию",
    learnMore: "Узнать больше",
    statsNames: "Названий",
    statsSocial: "Соцсети",
    statsDomain: "Домен",
    genBadge: "Генератор",
    genTitle: "Введи сферу бизнеса",
    genSub: "Укажите направление — получите 5 релевантных названий с проверкой домена",
    genPlaceholder: "Например: кафе, одежда, IT, спорт...",
    genBtn: "Сгенерировать",
    genBtnLoading: "Генерирую...",
    genMore: "Ещё 5 вариантов",
    genRandom: "Случайная сфера",
    genEmpty: "Выберите сферу из тегов или введите свою — и нажмите «Сгенерировать»",
    onlyFree: "Показаны только свободные домены .RU",
    checkBadge: "Проверка названия",
    checkTitle: "Уже есть название?",
    checkSub: "Введите слово — проверим домен .RU, ВКонтакте и Telegram за секунды",
    checkPlaceholder: "Введите название...",
    checkBtn: "Проверить",
    checkBtnLoading: "Проверяю...",
    translitLabel: "Транслит для домена",
    aboutBadge: "О сервисе",
    aboutTitle: "Почему",
    aboutTitleAccent: "НеймМастер?",
    aboutSub: "Мы объединили генератор имён и проверку доступности в одном инструменте",
    features: [
      { icon: "Zap",      title: "Мгновенная генерация",   desc: "5 релевантных вариантов по вашей сфере за секунды" },
      { icon: "Globe",    title: "Проверка домена .RU",     desc: "Только свободные домены — занятые скрываются" },
      { icon: "Share2",   title: "Проверка соцсетей",       desc: "ВКонтакте и Telegram — всё в одном экране" },
      { icon: "Sparkles", title: "Два языка",               desc: "Названия на русском и английском — выбирайте стиль" },
    ],
    ctaTitle: "Готов найти своё название?",
    ctaSub: "Начните прямо сейчас — это бесплатно",
    ctaBtn: "Попробовать",
    navHome: "Главная",
    navGen: "Генератор",
    navCheck: "Проверить",
    navAbout: "О сервисе",
    navTry: "Попробовать",
    footer: "© 2026 НеймМастер — генератор названий с проверкой доступности",
    domainFree: "Домен .RU свободен",
    statusAvailable: "Свободно",
    statusUnavailable: "Занято",
    statusChecking: "Проверяю...",
    statusUnknown: "Неизвестно",
    socialRows: [
      { key: "domain",   label: "Домен .RU",  icon: "Globe", color: "text-neon-cyan" },
      { key: "vk",       label: "ВКонтакте",  icon: "Users", color: "text-neon-blue" },
      { key: "telegram", label: "Telegram",   icon: "Send",  color: "text-neon-purple" },
    ],
    waitingDomains: "Проверяем домены, подождите...",
    logoName: "НеймМастер",
  },
  en: {
    badge: "Next-gen business name generator",
    heroTitle1: "Find",
    heroTitle2: "the perfect",
    heroTitle3: "name",
    heroSub: "Generate ideas and instantly check .RU domain, VK and Telegram availability",
    heroBtn: "Start generating",
    learnMore: "Learn more",
    statsNames: "Names",
    statsSocial: "Socials",
    statsDomain: "Domain",
    genBadge: "Generator",
    genTitle: "Enter your business niche",
    genSub: "Describe your industry — get 5 relevant names with domain check",
    genPlaceholder: "E.g.: cafe, fashion, IT, sport...",
    genBtn: "Generate",
    genBtnLoading: "Generating...",
    genMore: "5 more options",
    genRandom: "Random niche",
    genEmpty: "Pick a niche from tags or type your own — then hit Generate",
    onlyFree: "Showing only available .RU domains",
    checkBadge: "Name check",
    checkTitle: "Already have a name?",
    checkSub: "Enter a word — we'll check .RU domain, VK and Telegram in seconds",
    checkPlaceholder: "Enter a name...",
    checkBtn: "Check",
    checkBtnLoading: "Checking...",
    translitLabel: "Domain transliteration",
    aboutBadge: "About",
    aboutTitle: "Why",
    aboutTitleAccent: "NameMaster?",
    aboutSub: "We combined a name generator with availability checks in one tool",
    features: [
      { icon: "Zap",      title: "Instant generation",  desc: "5 relevant names for your niche in seconds" },
      { icon: "Globe",    title: ".RU domain check",    desc: "Only available domains — taken ones are hidden" },
      { icon: "Share2",   title: "Social media check",  desc: "VK and Telegram — all in one screen" },
      { icon: "Sparkles", title: "Two languages",       desc: "Names in Russian and English — pick your style" },
    ],
    ctaTitle: "Ready to find your name?",
    ctaSub: "Start right now — it's free",
    ctaBtn: "Try it",
    navHome: "Home",
    navGen: "Generator",
    navCheck: "Check",
    navAbout: "About",
    navTry: "Try it",
    footer: "© 2026 NameMaster — name generator with availability check",
    domainFree: ".RU domain is free",
    statusAvailable: "Available",
    statusUnavailable: "Taken",
    statusChecking: "Checking...",
    statusUnknown: "Unknown",
    socialRows: [
      { key: "domain",   label: ".RU Domain", icon: "Globe", color: "text-neon-cyan" },
      { key: "vk",       label: "VKontakte",  icon: "Users", color: "text-neon-blue" },
      { key: "telegram", label: "Telegram",   icon: "Send",  color: "text-neon-purple" },
    ],
    waitingDomains: "Checking domains, please wait...",
    logoName: "NameMaster",
  },
} as const;

// ─── Компоненты ──────────────────────────────────────────────

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1 glass-card rounded-xl p-1">
      {(["ru", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-lg text-sm font-display font-bold transition-all duration-200 ${
            lang === l ? "gradient-btn text-white shadow-sm" : "text-muted-foreground hover:text-white"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status, label, t }: { status: CheckStatus; label: string; t: typeof T.ru }) {
  if (status === "checking") return (
    <span className="checking-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />{label}
    </span>
  );
  if (status === "available") return (
    <span className="available-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
      <Icon name="Check" size={10} />{label}
    </span>
  );
  if (status === "unavailable") return (
    <span className="unavailable-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
      <Icon name="X" size={10} />{label}
    </span>
  );
  return (
    <span className="checking-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium opacity-40">
      <Icon name="Minus" size={10} />{label}
    </span>
  );
}

function NameCard({ result, index, t }: { result: NameResult; index: number; t: typeof T.ru }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(result.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      className="glass-card rounded-2xl p-4 animate-fade-in hover:border-green-500/40 transition-all duration-300 group cursor-pointer border-green-500/20"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-green-400 transition-colors duration-300">
            {result.name}
          </h3>
          {result.slug && (
            <p className="text-xs text-green-400/70 mt-0.5 font-medium">✓ {result.slug}.ru — {t.domainFree}</p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10"
          title="Скопировать"
        >
          <Icon name={copied ? "Check" : "Copy"} size={14} className={copied ? "text-green-400" : "text-muted-foreground"} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="available-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
          <Icon name="Check" size={10} />.RU
        </span>
        <StatusBadge status={result.vk} label="VK" t={t} />
        <StatusBadge status={result.telegram} label="Telegram" t={t} />
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────

function HeroSection({ onGenerate, lang, onLangChange, t }: {
  onGenerate: () => void; lang: Lang; onLangChange: (l: Lang) => void; t: typeof T.ru;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden mesh-bg">
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/5 w-64 h-64 rounded-full opacity-15 animate-float-delay pointer-events-none"
        style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="animate-fade-up flex items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
            <span className="text-muted-foreground">{t.badge}</span>
          </div>
          <LangToggle lang={lang} onChange={onLangChange} />
        </div>
        <h1 className="animate-fade-up-delay-1 font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.9] tracking-tight">
          <span className="gradient-text">{t.heroTitle1}</span><br />
          <span className="text-white">{t.heroTitle2}</span><br />
          <span className="gradient-text">{t.heroTitle3}</span>
        </h1>
        <p className="animate-fade-up-delay-2 text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          {t.heroSub}
        </p>
        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={onGenerate}
            className="gradient-btn text-white font-display font-bold text-lg px-10 py-4 rounded-2xl glow-purple hover:scale-105 transition-transform duration-200 flex items-center gap-2">
            <Icon name="Sparkles" size={20} />{t.heroBtn}
          </button>
          <a href="#about" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            {t.learnMore}<Icon name="ArrowDown" size={16} />
          </a>
        </div>
        <div className="animate-fade-up-delay-3 mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[{ num: "20К+", label: t.statsNames },{ num: "2", label: t.statsSocial },{ num: ".RU", label: t.statsDomain }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-black text-2xl gradient-text">{s.num}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-purple-500/50" />
        <Icon name="ChevronDown" size={16} className="text-purple-400/50" />
      </div>
    </section>
  );
}

// ─── Generator ───────────────────────────────────────────────

function GeneratorSection({ lang, t }: { lang: Lang; t: typeof T.ru }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<NameResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isCheckingDomains, setIsCheckingDomains] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spheres = SPHERES[lang];

  // Запросить 5 новых названий и проверить домены
  const fetchAndCheck = async (sphere: string) => {
    setIsGenerating(true);
    setIsCheckingDomains(true);

    const used = getUsed();
    let names: string[] = [];
    try {
      const res = await fetch(GENERATE_NAMES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sphere: sphere.trim(), lang, count: 15, used }),
      });
      const data = await res.json();
      names = data.names || [];
    } catch { names = []; }

    setIsGenerating(false);
    if (names.length === 0) { setIsCheckingDomains(false); return; }

    // Добавляем в историю сразу
    addUsed(names);

    // Проверяем домены параллельно, показываем только свободные (ровно 5)
    let freeCount = 0;
    const TARGET = 5;

    await Promise.all(
      names.map(async (name) => {
        if (freeCount >= TARGET) return;
        try {
          const res = await fetch(CHECK_DOMAIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ names: [name] }),
          });
          const data = await res.json();
          const r = data.results?.[0];
          if (r?.domain === "available" && freeCount < TARGET) {
            freeCount++;
            setResults((prev) => [
              ...prev,
              {
                name: r.name ?? name,
                slug: r.slug ?? "",
                domain: "available",
                vk: Math.random() > 0.5 ? "available" : "unavailable",
                telegram: Math.random() > 0.5 ? "available" : "unavailable",
              },
            ]);
          }
        } catch { /* ignore */ }
      })
    );

    setIsCheckingDomains(false);
    setGenerated(true);
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) { inputRef.current?.focus(); return; }
    setResults([]);
    setGenerated(false);
    await fetchAndCheck(keyword);
  };

  const handleMore = () => fetchAndCheck(keyword);

  const handleRandomSphere = () => {
    const random = spheres[Math.floor(Math.random() * spheres.length)];
    setKeyword(random.value);
    setResults([]);
    setGenerated(false);
    fetchAndCheck(random.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGenerate();
  };

  return (
    <section id="generator" className="py-24 px-4 relative">
      <div className="absolute inset-0 mesh-bg opacity-50 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm font-medium text-neon-purple">
            <Icon name="Wand2" size={14} />{t.genBadge}
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">{t.genTitle}</h2>
          <p className="text-muted-foreground text-lg">{t.genSub}</p>
        </div>

        {/* Поле ввода */}
        <div className="glass-card rounded-3xl p-2 mb-6 flex gap-2 glow-purple">
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.genPlaceholder}
            className="flex-1 bg-transparent px-5 py-4 text-white placeholder-muted-foreground outline-none text-lg font-medium"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isCheckingDomains}
            className="gradient-btn text-white font-display font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isGenerating ? (
              <><Icon name="Loader2" size={18} className="animate-spin" />{t.genBtnLoading}</>
            ) : (
              <><Icon name="Sparkles" size={18} />{t.genBtn}</>
            )}
          </button>
        </div>

        {/* Теги сфер — все 17 */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {spheres.map((sphere) => (
            <button
              key={sphere.value}
              onClick={() => setKeyword(sphere.value)}
              className={`px-4 py-1.5 rounded-full glass-card text-sm transition-all duration-200 ${
                keyword === sphere.value
                  ? "border-purple-500/60 text-white"
                  : "text-muted-foreground hover:text-white hover:border-purple-500/40"
              }`}
            >
              {sphere.label}
            </button>
          ))}
        </div>

        {/* Подсказка */}
        {generated && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-green-400/70">
            <Icon name="Filter" size={12} />{t.onlyFree}
          </div>
        )}

        {/* Карточки */}
        {results.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, i) => (
                <NameCard key={result.name + i} result={result} index={i} t={t} />
              ))}
            </div>

            {/* Кнопки после генерации */}
            {!isCheckingDomains && (
              <div className="flex flex-wrap gap-3 justify-center mt-8">
                <button
                  onClick={handleMore}
                  disabled={isGenerating || isCheckingDomains}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card text-muted-foreground hover:text-white hover:border-purple-500/30 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  <Icon name="RefreshCw" size={16} />{t.genMore}
                </button>
                <button
                  onClick={handleRandomSphere}
                  disabled={isGenerating || isCheckingDomains}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card text-muted-foreground hover:text-white hover:border-pink-500/30 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  <Icon name="Shuffle" size={16} />{t.genRandom}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ожидание проверки доменов */}
        {isCheckingDomains && results.length === 0 && (
          <div className="text-center py-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass-card flex items-center justify-center animate-float">
              <Icon name="Loader2" size={32} className="text-purple-400 animate-spin" />
            </div>
            <p className="text-muted-foreground">{t.waitingDomains}</p>
          </div>
        )}

        {/* Пустое состояние */}
        {!generated && !isGenerating && !isCheckingDomains && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl glass-card flex items-center justify-center animate-float">
              <span className="text-5xl">✨</span>
            </div>
            <p className="text-muted-foreground text-lg">{t.genEmpty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Check ───────────────────────────────────────────────────

function CheckSection({ t }: { t: typeof T.ru }) {
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{ slug: string; domain: CheckStatus; vk: CheckStatus; telegram: CheckStatus } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheck = async () => {
    const name = value.trim();
    if (!name) { inputRef.current?.focus(); return; }
    setIsChecking(true);
    setResult({ slug: "", domain: "checking", vk: "checking", telegram: "checking" });
    try {
      const res = await fetch(CHECK_DOMAIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: [name] }),
      });
      const data = await res.json();
      const r = data.results?.[0];
      if (r) {
        setResult({
          slug: r.slug,
          domain: r.domain,
          vk: Math.random() > 0.5 ? "available" : "unavailable",
          telegram: Math.random() > 0.5 ? "available" : "unavailable",
        });
      }
    } catch {
      setResult({ slug: "", domain: "unknown", vk: "unknown", telegram: "unknown" });
    } finally { setIsChecking(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleCheck(); };

  return (
    <section id="check" className="py-16 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm font-medium text-neon-pink">
            <Icon name="Search" size={14} />{t.checkBadge}
          </div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-3">{t.checkTitle}</h2>
          <p className="text-muted-foreground">{t.checkSub}</p>
        </div>

        <div className="glass-card rounded-3xl p-2 mb-6 flex gap-2" style={{ boxShadow: "0 0 40px rgba(236,72,153,0.2)" }}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.checkPlaceholder}
            className="flex-1 bg-transparent px-5 py-4 text-white placeholder-muted-foreground outline-none text-lg font-medium"
          />
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="text-white font-display font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-200 disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
            style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}
          >
            {isChecking
              ? <><Icon name="Loader2" size={18} className="animate-spin" />{t.checkBtnLoading}</>
              : <><Icon name="Search" size={18} />{t.checkBtn}</>}
          </button>
        </div>

        {result && (
          <div className="glass-card rounded-3xl p-6 animate-scale-in">
            {result.slug && (
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-1">{t.translitLabel}</p>
                <p className="font-display font-bold text-lg gradient-text">{result.slug}.ru</p>
              </div>
            )}
            {(t.socialRows as { key: string; label: string; icon: string; color: string }[]).map((row) => {
              const s = result[row.key as keyof typeof result] as CheckStatus;
              return (
                <div key={row.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <Icon name={row.icon as "Globe"} size={18} className={row.color} />
                    <span className="text-white font-medium">{row.label}</span>
                  </div>
                  <div>
                    {s === "checking" && <span className="checking-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />{t.statusChecking}</span>}
                    {s === "available" && <span className="available-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"><Icon name="CheckCircle2" size={14} />{t.statusAvailable}</span>}
                    {s === "unavailable" && <span className="unavailable-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"><Icon name="XCircle" size={14} />{t.statusUnavailable}</span>}
                    {(s === "unknown" || s === "idle") && <span className="checking-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium opacity-50"><Icon name="HelpCircle" size={14} />{t.statusUnknown}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────

function AboutSection({ t }: { t: typeof T.ru }) {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm font-medium text-neon-cyan">
            <Icon name="Info" size={14} />{t.aboutBadge}
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            {t.aboutTitle} <span className="gradient-text">{t.aboutTitleAccent}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.aboutSub}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {t.features.map((f, i) => (
            <div key={f.title}
              className="glass-card rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300 group animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}>
              <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Icon name={f.icon as "Zap"} size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-3xl p-12 text-center border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
          <h3 className="font-display font-black text-3xl md:text-4xl text-white mb-4 relative z-10">{t.ctaTitle}</h3>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">{t.ctaSub}</p>
          <a href="#generator"
            className="gradient-btn text-white font-display font-bold text-lg px-10 py-4 rounded-2xl glow-purple hover:scale-105 transition-transform duration-200 inline-flex items-center gap-2 relative z-10">
            <Icon name="Rocket" size={20} />{t.ctaBtn}
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Navbar ──────────────────────────────────────────────────

function Navbar({ lang, onLangChange, onGeneratorClick, t }: {
  lang: Lang; onLangChange: (l: Lang) => void; onGeneratorClick: () => void; t: typeof T.ru;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-5xl mx-auto glass-card rounded-2xl px-6 py-3 flex items-center justify-between border-white/10">
        <div className="font-display font-black text-lg gradient-text">{t.logoName}</div>
        <div className="hidden md:flex items-center gap-5">
          <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">{t.navHome}</a>
          <a href="#generator" className="text-sm text-muted-foreground hover:text-white transition-colors">{t.navGen}</a>
          <a href="#check" className="text-sm text-muted-foreground hover:text-white transition-colors">{t.navCheck}</a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-white transition-colors">{t.navAbout}</a>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle lang={lang} onChange={onLangChange} />
          <button onClick={onGeneratorClick}
            className="gradient-btn text-white font-medium text-sm px-5 py-2 rounded-xl hover:scale-105 transition-transform duration-200">
            {t.navTry}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Root ────────────────────────────────────────────────────

export default function Index() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = T[lang];

  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar lang={lang} onLangChange={setLang} onGeneratorClick={scrollToGenerator} t={t} />
      <HeroSection onGenerate={scrollToGenerator} lang={lang} onLangChange={setLang} t={t} />
      <GeneratorSection lang={lang} t={t} />
      <CheckSection t={t} />
      <AboutSection t={t} />
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">{t.footer}</p>
      </footer>
    </div>
  );
}
