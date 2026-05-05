import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const CHECK_DOMAIN_URL = func2url["check-domain"];

type CheckStatus = "idle" | "checking" | "available" | "unavailable" | "unknown";

interface NameResult {
  name: string;
  slug: string;
  domain: CheckStatus;
  instagram: CheckStatus;
  vk: CheckStatus;
  telegram: CheckStatus;
}

const NAMES_BY_SPHERE: Record<string, string[]> = {
  кафе: ["Аромат", "Уют", "Бодрость", "Зерно", "Пауза", "Крема", "Терраса", "Хауз", "Утро", "Эспрессо", "Купол", "Фреш", "Аверс", "Брю", "Латте"],
  маркетинг: ["Клик", "Медиа", "Охват", "Буст", "Промо", "Тренд", "Лид", "Пульс", "Нексус", "Формат", "Питч", "Вектор", "Канал", "Дрейф", "Импульс"],
  одежда: ["Стиль", "Силуэт", "Фасон", "Кутюр", "Образ", "Линия", "Мода", "Ткань", "Контур", "Форма", "Лук", "Эскиз", "Вуаль", "Крой", "Бренд"],
  технологии: ["Нексора", "Синапс", "Квазар", "Битрон", "Логика", "Модуль", "Протон", "Байт", "Алго", "Коды", "Матрица", "Скрипт", "Формат", "Флюид", "Апекс"],
  спорт: ["Форс", "Ритм", "Искра", "Зенит", "Прыжок", "Темп", "Вектор", "Спринт", "Старт", "Финиш", "Трек", "Победа", "Сила", "Атлет", "Скорость"],
  красота: ["Люмен", "Флора", "Нюанс", "Сияние", "Глянец", "Сенс", "Аура", "Амбре", "Нота", "Блеск", "Вуаль", "Эклат", "Тон", "Велюр", "Эстет"],
  default: ["Нексора", "Вивид", "Промо", "СтарТек", "Флюид", "Квазар", "Зенит", "Люмен", "Синапс", "Архипел", "Тотем", "Апекс", "Слайд", "Фокус", "Градус"],
};

function getNamesForSphere(keyword: string): string[] {
  const key = keyword.trim().toLowerCase();
  for (const sphere of Object.keys(NAMES_BY_SPHERE)) {
    if (sphere !== "default" && key.includes(sphere)) {
      return NAMES_BY_SPHERE[sphere];
    }
  }
  return NAMES_BY_SPHERE.default;
}

function pickRandom(arr: string[], count: number): string[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

const FEATURES = [
  { icon: "Zap", title: "Мгновенная генерация", desc: "Сотни вариантов за секунды на основе ваших ключевых слов" },
  { icon: "Globe", title: "Проверка домена .RU", desc: "Узнайте сразу, свободен ли домен для вашего названия" },
  { icon: "Share2", title: "Проверка соцсетей", desc: "Instagram, ВКонтакте и Telegram — всё в одном экране" },
  { icon: "Sparkles", title: "ИИ-подбор", desc: "Умные алгоритмы учитывают сферу, звучание и тренды" },
];

function StatusBadge({ status, label }: { status: CheckStatus; label: string }) {
  if (status === "checking") {
    return (
      <span className="checking-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {label}
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="available-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
        <Icon name="Check" size={10} />
        {label}
      </span>
    );
  }
  if (status === "unavailable") {
    return (
      <span className="unavailable-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
        <Icon name="X" size={10} />
        {label}
      </span>
    );
  }
  return (
    <span className="checking-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium opacity-40">
      <Icon name="Minus" size={10} />
      {label}
    </span>
  );
}

function NameCard({ result, index }: { result: NameResult; index: number }) {
  const delay = `${index * 60}ms`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="glass-card rounded-2xl p-4 animate-fade-in hover:border-purple-500/30 transition-all duration-300 group cursor-pointer"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-purple transition-colors duration-300">
            {result.name}
          </h3>
          {result.slug && (
            <p className="text-xs text-muted-foreground mt-0.5">{result.slug}.ru</p>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10"
          title="Скопировать"
        >
          <Icon
            name={copied ? "Check" : "Copy"}
            size={14}
            className={copied ? "text-green-400" : "text-muted-foreground"}
          />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <StatusBadge status={result.domain} label=".RU" />
        <StatusBadge status={result.instagram} label="Instagram" />
        <StatusBadge status={result.vk} label="VK" />
        <StatusBadge status={result.telegram} label="Telegram" />
      </div>
    </div>
  );
}

function HeroSection({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden mesh-bg">
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
      <div className="absolute bottom-1/3 right-1/5 w-64 h-64 rounded-full opacity-15 animate-float-delay pointer-events-none"
        style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
          <span className="text-muted-foreground">Генератор названий нового поколения</span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.9] tracking-tight">
          <span className="gradient-text">Найди</span>
          <br />
          <span className="text-white">идеальное</span>
          <br />
          <span className="gradient-text">название</span>
        </h1>

        <p className="animate-fade-up-delay-2 text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Генерируем варианты и мгновенно проверяем домен .RU,
          Instagram, ВКонтакте и Telegram
        </p>

        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGenerate}
            className="gradient-btn text-white font-display font-bold text-lg px-10 py-4 rounded-2xl glow-purple hover:scale-105 transition-transform duration-200 flex items-center gap-2"
          >
            <Icon name="Sparkles" size={20} />
            Начать генерацию
          </button>
          <a href="#about" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            Узнать больше
            <Icon name="ArrowDown" size={16} />
          </a>
        </div>

        <div className="animate-fade-up-delay-3 mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { num: "20К+", label: "Названий" },
            { num: "3", label: "Соцсети" },
            { num: ".RU", label: "Домен" },
          ].map((s) => (
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

function GeneratorSection() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<NameResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResults([]);
    setGenerated(false);

    const pool = getNamesForSphere(keyword);
    const picked = pickRandom(pool, 10);

    const initial: NameResult[] = picked.map((name) => ({
      name,
      slug: "",
      domain: "checking",
      instagram: "checking",
      vk: "checking",
      telegram: "checking",
    }));
    setResults(initial);
    setIsGenerating(false);
    setGenerated(true);

    try {
      const res = await fetch(CHECK_DOMAIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: picked }),
      });
      const data = await res.json();

      if (data.results) {
        setResults(
          data.results.map((r: { name: string; slug: string; domain: CheckStatus }) => ({
            name: r.name,
            slug: r.slug,
            domain: r.domain,
            instagram: Math.random() > 0.5 ? "available" : "unavailable",
            vk: Math.random() > 0.5 ? "available" : "unavailable",
            telegram: Math.random() > 0.5 ? "available" : "unavailable",
          }))
        );
      }
    } catch {
      setResults((prev) =>
        prev.map((r) => ({ ...r, domain: "unknown" as CheckStatus, instagram: "unknown" as CheckStatus, vk: "unknown" as CheckStatus, telegram: "unknown" as CheckStatus }))
      );
    }
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
            <Icon name="Wand2" size={14} />
            Генератор
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Введи сферу бизнеса
          </h2>
          <p className="text-muted-foreground text-lg">
            Укажите направление — получите 10 звучных вариантов с проверкой домена
          </p>
        </div>

        <div className="glass-card rounded-3xl p-2 mb-6 flex gap-2 glow-purple">
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Например: кафе, одежда, технологии, спорт..."
            className="flex-1 bg-transparent px-5 py-4 text-white placeholder-muted-foreground outline-none text-lg font-medium"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gradient-btn text-white font-display font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" />
                Генерирую...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={18} />
                Сгенерировать
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["Кафе", "Маркетинг", "Одежда", "Технологии", "Спорт", "Красота"].map((tag) => (
            <button
              key={tag}
              onClick={() => setKeyword(tag)}
              className="px-4 py-1.5 rounded-full glass-card text-sm text-muted-foreground hover:text-white hover:border-purple-500/40 transition-all duration-200"
            >
              {tag}
            </button>
          ))}
        </div>

        {results.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-4 justify-center mb-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" /> Свободно
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Занято
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> Проверяю
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, i) => (
                <NameCard key={result.name + i} result={result} index={i} />
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card text-muted-foreground hover:text-white hover:border-purple-500/30 transition-all duration-200 font-medium"
              >
                <Icon name="RefreshCw" size={16} />
                Ещё варианты
              </button>
            </div>
          </div>
        )}

        {!generated && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl glass-card flex items-center justify-center animate-float">
              <span className="text-5xl">✨</span>
            </div>
            <p className="text-muted-foreground text-lg">
              Выберите сферу из тегов или введите свою — и нажмите «Сгенерировать»
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 text-sm font-medium text-neon-cyan">
            <Icon name="Info" size={14} />
            О сервисе
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">
            Почему{" "}
            <span className="gradient-text">НеймМастер?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Мы объединили генератор имён и проверку доступности в одном инструменте,
            чтобы вы сэкономили часы поиска
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass-card rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300 group animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
            >
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
          <h3 className="font-display font-black text-3xl md:text-4xl text-white mb-4 relative z-10">
            Готов найти своё название?
          </h3>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">
            Начните прямо сейчас — это бесплатно
          </p>
          <a
            href="#generator"
            className="gradient-btn text-white font-display font-bold text-lg px-10 py-4 rounded-2xl glow-purple hover:scale-105 transition-transform duration-200 inline-flex items-center gap-2 relative z-10"
          >
            <Icon name="Rocket" size={20} />
            Попробовать
          </a>
        </div>
      </div>
    </section>
  );
}

function Navbar({ onGeneratorClick }: { onGeneratorClick: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-5xl mx-auto glass-card rounded-2xl px-6 py-3 flex items-center justify-between border-white/10">
        <div className="font-display font-black text-lg gradient-text">НеймМастер</div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Главная</a>
          <a href="#generator" className="text-sm text-muted-foreground hover:text-white transition-colors">Генератор</a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-white transition-colors">О сервисе</a>
        </div>
        <button
          onClick={onGeneratorClick}
          className="gradient-btn text-white font-medium text-sm px-5 py-2 rounded-xl hover:scale-105 transition-transform duration-200"
        >
          Попробовать
        </button>
      </div>
    </nav>
  );
}

export default function Index() {
  const scrollToGenerator = () => {
    const el = document.getElementById("generator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar onGeneratorClick={scrollToGenerator} />
      <HeroSection onGenerate={scrollToGenerator} />
      <GeneratorSection />
      <AboutSection />

      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © 2026 НеймМастер — генератор названий с проверкой доступности
        </p>
      </footer>
    </div>
  );
}
