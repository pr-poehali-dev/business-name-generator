import json
import re
import random

# Словари по сферам: ключевые слова -> названия на двух языках
# Каждая запись: список вариантов (достаточно длинный для случайного выбора)

NAMES_DB = {
    # ──── РУС ────────────────────────────────────────────────
    "ru": {
        "кафе": [
            "Аромат", "Уют", "Зерно", "Пауза", "Крема", "Утро", "Купол", "Латте",
            "Брю", "Фреш", "Эспрессо", "Терраса", "Глоток", "Кружка", "Обжарка",
            "Смак", "Привал", "Кофеин", "Зефир", "Бодрость", "Капля", "Хауз",
            "Фильтр", "Ложка", "Сливки",
        ],
        "ресторан": [
            "Очаг", "Застолье", "Ярмарка", "Трапеза", "Гурман", "Скатерть",
            "Самовар", "Лукошко", "Усадьба", "Горница", "Привал", "Изба",
            "Вкусно", "Хлебный", "Пироги", "Тавро", "Меню", "Соус", "Рецепт",
            "Угощение", "Поварня", "Кухня", "Тарелка", "Блюдо", "Аппетит",
        ],
        "маркетинг": [
            "Клик", "Охват", "Буст", "Тренд", "Лид", "Пульс", "Питч",
            "Вектор", "Канал", "Импульс", "Медиа", "Промо", "Нексус", "Формат",
            "Дрейф", "Сигнал", "Волна", "Радар", "Мощь", "Таргет", "Контент",
            "Посев", "Ключ", "Охотник", "Фронт",
        ],
        "агентство": [
            "Альянс", "Лига", "Штаб", "Форпост", "Бюро", "Союз", "Эгида",
            "Консул", "Арсенал", "Кредо", "Атлас", "Мастерская", "Студия",
            "Лаборатория", "Центр", "Группа", "Клуб", "Партнёр", "Система",
            "Платформа", "Сеть", "Ресурс", "Базис", "Основа", "Гильдия",
        ],
        "одежда": [
            "Стиль", "Силуэт", "Фасон", "Кутюр", "Образ", "Линия", "Мода",
            "Контур", "Эскиз", "Вуаль", "Крой", "Бренд", "Ткань", "Форма",
            "Лук", "Нить", "Шов", "Манжет", "Полотно", "Узор", "Цвет",
            "Коллекция", "Сезон", "Подиум", "Ателье",
        ],
        "технологии": [
            "Нексора", "Синапс", "Квазар", "Битрон", "Логика", "Модуль",
            "Протон", "Байт", "Алго", "Матрица", "Скрипт", "Флюид", "Апекс",
            "Коддекс", "Ядро", "Поток", "Сервер", "Нейро", "Бит", "Дата",
            "Система", "Платформа", "Облако", "Прокси", "Сеть",
        ],
        "спорт": [
            "Форс", "Ритм", "Искра", "Зенит", "Темп", "Спринт", "Старт",
            "Финиш", "Трек", "Победа", "Сила", "Атлет", "Скорость", "Прыжок",
            "Разгон", "Движение", "Мышца", "Удар", "Рекорд", "Пьедестал",
            "Чемпион", "Арена", "Стадион", "Спарринг", "Энергия",
        ],
        "красота": [
            "Люмен", "Флора", "Нюанс", "Сияние", "Глянец", "Аура", "Амбре",
            "Блеск", "Эклат", "Велюр", "Эстет", "Сенс", "Нота", "Тон",
            "Персик", "Роза", "Жемчуг", "Зеркало", "Румяна", "Пудра",
            "Кисть", "Палитра", "Бьюти", "Гламур", "Шарм",
        ],
        "доставка": [
            "Экспресс", "Маршрут", "Курьер", "Привоз", "Мгновение", "Молния",
            "Быстро", "Ход", "Посылка", "Трек", "Стрела", "Лёт", "Порыв",
            "Рывок", "Гонец", "Вестник", "Бегун", "Спешка", "Скорость", "Ракета",
            "Дрон", "Грузик", "Доставим", "Доставка", "Логист",
        ],
        "медицина": [
            "Медика", "Виталис", "Пульс", "Здравия", "Клиника", "Лечебник",
            "Исцеление", "Помощь", "Забота", "Здоровье", "Сердце", "Дыхание",
            "Жизнь", "Витамин", "Иммун", "Аптека", "Рецепт", "Диагноз",
            "Центр", "Лаборатория", "Анализ", "Доктор", "Медик", "Терапия", "Санус",
        ],
        "образование": [
            "Знания", "Академия", "Учёба", "Курс", "Лекция", "Диплом",
            "Навык", "Урок", "Школа", "Кампус", "Факультет", "Институт",
            "Лаборатория", "Мудрость", "Практика", "Теория", "Мастер",
            "Ступень", "Разум", "Идея", "Метод", "Учитель", "Знаток", "Эрудит", "Грант",
        ],
        "недвижимость": [
            "Метраж", "Ключ", "Порог", "Квадрат", "Фасад", "Жилплощадь",
            "Дом", "Квартира", "Этаж", "Балкон", "Двор", "Уют", "Гнездо",
            "Очаг", "Кровля", "Фундамент", "Застройка", "Жилфонд", "Адрес",
            "Прописка", "Планировка", "Риэлт", "Хаус", "Эстейт", "Метра",
        ],
        "финансы": [
            "Капитал", "Актив", "Депозит", "Профит", "Рост", "Дивиденд",
            "Инвест", "Портфель", "Ставка", "Процент", "Биржа", "Фонд",
            "Банк", "Кредит", "Залог", "Доход", "Прибыль", "Монета", "Казна",
            "Сейф", "Резерв", "Ликвид", "Баланс", "Бюджет", "Аудит",
        ],
    },

    # ──── ENG ────────────────────────────────────────────────
    "en": {
        "cafe": [
            "Aroma", "Brewly", "Grindly", "Steamco", "Sippify", "Roastly",
            "Beanhaus", "Cupify", "Dripco", "Latteo", "Pressly", "Grainco",
            "Freshly", "Pauseco", "Morningco", "Brewhaus", "Sippco", "Coffix",
            "Cuppie", "Driplux", "Steamhaus", "Roastify", "Grindco", "Blendr", "Barsco",
        ],
        "restaurant": [
            "Feastly", "Tableco", "Savoury", "Dishhaus", "Forkly", "Plateco",
            "Bitehaus", "Tastify", "Chefco", "Menufy", "Spoonly", "Grillco",
            "Flavourly", "Recipeco", "Naplyco", "Servify", "Dinery", "Gourmetly",
            "Kitchenco", "Cravingly", "Platehaus", "Forkhaus", "Dishco", "Napco", "Bistrofy",
        ],
        "marketing": [
            "Reachly", "Clickhaus", "Boostify", "Leadco", "Pulsify", "Pitchly",
            "Waveco", "Signalco", "Targetly", "Contentco", "Funnelco", "Radarly",
            "Engagely", "Brandify", "Craftco", "Growthly", "Adhaus", "Campco",
            "Viewsco", "Tapco", "Hitsify", "Promoly", "Launchco", "Scalify", "Draftco",
        ],
        "agency": [
            "Agentify", "Hubco", "Crewly", "Vaultco", "Nexusco", "Studiohaus",
            "Labify", "Forgeco", "Guildco", "Batchco", "Crafthaus", "Basecamp",
            "Teamco", "Allianx", "Grouply", "Systemco", "Nethaus", "Pillar",
            "Sourceco", "Partnerco", "Frameco", "Fusionco", "Linkco", "Bridgely", "Zonify",
        ],
        "fashion": [
            "Stylco", "Silhouette", "Sewhaus", "Couturly", "Lookco", "Wearify",
            "Stitchly", "Labelco", "Threadco", "Fabrichaus", "Patternco", "Formco",
            "Linehaus", "Seamco", "Colorly", "Collectionco", "Seasonco", "Brandhaus",
            "Modafy", "Trendco", "Veilco", "Drafthaus", "Knitto", "Sewify", "Clothco",
        ],
        "tech": [
            "Nexora", "Synapse", "Quasar", "Bitronic", "Logicore", "Moduleio",
            "Protonix", "Byteco", "Algoly", "Matrixco", "Scriptly", "Fluidco",
            "Apexio", "Codehaus", "Coreco", "Streamco", "Servify", "Cloudly",
            "Neuro", "Dataco", "Sysify", "Proxyco", "Nethaus", "Nodeio", "Stackly",
        ],
        "sport": [
            "Forcely", "Rhythmco", "Sparkco", "Zenithco", "Tempofy", "Sprintly",
            "Startco", "Finishco", "Trackly", "Victoryco", "Powerco", "Athletix",
            "Speedco", "Leapco", "Thrustco", "Motionco", "Muscleco", "Strikefix",
            "Recordco", "Arenafy", "Stadiumco", "Sparringco", "Energyco", "Rushco", "Paceco",
        ],
        "beauty": [
            "Lumenly", "Floraco", "Nuanceco", "Glowify", "Glossco", "Aurahub",
            "Ambreco", "Shinely", "Velvety", "Esthetico", "Notehaus", "Toneco",
            "Blushco", "Peachly", "Roseco", "Pearlco", "Mirrorco", "Brushco",
            "Paletteco", "Beautyco", "Glamco", "Charmly", "Sheerco", "Dewco", "Blissco",
        ],
        "delivery": [
            "Expressly", "Routeco", "Curierco", "Flashco", "Zapco", "Arrowly",
            "Dashify", "Swiftco", "Parcelco", "Rocketco", "Droneco", "Runnerco",
            "Haulco", "Movingly", "Shipify", "Cargofly", "Trackco", "Rushco",
            "Fetchco", "Portco", "Bringco", "Quickco", "Liftco", "Jetco", "Speedco",
        ],
        "health": [
            "Vitalis", "Pulseco", "Wellco", "Healify", "Careco", "Vitalco",
            "Medica", "Lifeco", "Breathco", "Heartco", "Immunico", "Dispensary",
            "Cureco", "Clinicly", "Diagno", "Laborco", "Docco", "Therapyco",
            "Sanusco", "Healthco", "Medihaus", "Vitafly", "Remedyco", "Curafly", "Medhub",
        ],
        "education": [
            "Learnly", "Acadify", "Courseco", "Skillhaus", "Lessonly", "Gradly",
            "Campusco", "Teachify", "Mastery", "Stepco", "Mindco", "Wisdomco",
            "Practify", "Theoryco", "Methodco", "Knowledgeco", "Expertly", "Erudite",
            "Grantco", "Studyco", "Clasfly", "Lecturely", "Mentorco", "Ideafly", "Insightco",
        ],
        "realestate": [
            "Squareco", "Keyhaus", "Threshco", "Facadeco", "Homely", "Flatco",
            "Floorco", "Balconyco", "Nestvo", "Roofco", "Foundco", "Housify",
            "Addressco", "Planly", "Realtco", "Estateco", "Metrico", "Propco",
            "Dwellco", "Nestify", "Placeco", "Zoneco", "Suiteco", "Residco", "Villaco",
        ],
        "finance": [
            "Capitalco", "Assetco", "Depositco", "Profitly", "Growthco", "Dividentco",
            "Investco", "Portfolioco", "Rateco", "Percentco", "Exchangeco", "Fundco",
            "Bankly", "Creditco", "Incomely", "Earnco", "Coinco", "Treasuryco",
            "Safelyco", "Reserveco", "Liquidco", "Balanceco", "Budgetco", "Auditco", "Yieldco",
        ],
    },
}

# Маппинг ключевых слов -> канонический ключ словаря
KEYWORD_MAP = {
    "ru": {
        "кафе": "кафе", "кофе": "кафе", "кофейня": "кафе", "чай": "кафе",
        "ресторан": "ресторан", "еда": "ресторан", "кухня": "ресторан", "питание": "ресторан", "столовая": "ресторан",
        "маркетинг": "маркетинг", "реклама": "маркетинг", "продвижение": "маркетинг", "smm": "маркетинг",
        "агентство": "агентство", "студия": "агентство", "бюро": "агентство",
        "одежда": "одежда", "мода": "одежда", "fashion": "одежда", "одеяло": "одежда", "текстиль": "одежда",
        "технологии": "технологии", "it": "технологии", "программирование": "технологии", "разработка": "технологии", "софт": "технологии",
        "спорт": "спорт", "фитнес": "спорт", "тренажёр": "спорт", "тренировка": "спорт",
        "красота": "красота", "салон": "красота", "косметика": "красота", "уход": "красота",
        "доставка": "доставка", "курьер": "доставка", "логистика": "доставка",
        "медицина": "медицина", "клиника": "медицина", "здоровье": "медицина", "аптека": "медицина",
        "образование": "образование", "школа": "образование", "обучение": "образование", "курсы": "образование",
        "недвижимость": "недвижимость", "аренда": "недвижимость", "жильё": "недвижимость",
        "финансы": "финансы", "банк": "финансы", "инвестиции": "финансы", "деньги": "финансы",
    },
    "en": {
        "cafe": "cafe", "coffee": "cafe", "tea": "cafe", "brew": "cafe",
        "restaurant": "restaurant", "food": "restaurant", "dining": "restaurant", "kitchen": "restaurant",
        "marketing": "marketing", "ads": "marketing", "advertising": "marketing", "smm": "marketing",
        "agency": "agency", "studio": "agency", "bureau": "agency",
        "fashion": "fashion", "clothes": "fashion", "clothing": "fashion", "apparel": "fashion",
        "tech": "tech", "it": "tech", "software": "tech", "programming": "tech", "development": "tech",
        "sport": "sport", "sports": "sport", "fitness": "sport", "gym": "sport",
        "beauty": "beauty", "cosmetics": "beauty", "salon": "beauty", "skincare": "beauty",
        "delivery": "delivery", "courier": "delivery", "logistics": "delivery", "shipping": "delivery",
        "health": "health", "medical": "health", "clinic": "health", "pharmacy": "health",
        "education": "education", "school": "education", "learning": "education", "courses": "education",
        "realestate": "realestate", "real estate": "realestate", "property": "realestate", "housing": "realestate",
        "finance": "finance", "bank": "finance", "investment": "finance", "money": "finance",
    },
}

DEFAULT_NAMES = {
    "ru": ["Нексора", "Вивид", "Флюид", "Квазар", "Зенит", "Люмен", "Синапс", "Тотем", "Апекс", "Слайд",
           "Фокус", "Градус", "Нюанс", "Ритм", "Искра", "Форс", "Аура", "Пульс", "Вектор", "Контур"],
    "en": ["Nexora", "Vivid", "Fluidco", "Quasar", "Zenith", "Lumen", "Synapse", "Totem", "Apex", "Slide",
           "Focus", "Gradus", "Nuance", "Rhythm", "Spark", "Force", "Aura", "Pulse", "Vector", "Contour"],
}


def handler(event: dict, context) -> dict:
    """Генерирует названия по сфере бизнеса и языку."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    sphere = body.get('sphere', '').strip().lower()
    lang = body.get('lang', 'ru')
    count = min(int(body.get('count', 15)), 25)

    if lang not in ('ru', 'en'):
        lang = 'ru'

    names = resolve_names(sphere, lang, count)
    print(f"[GEN] sphere='{sphere}' lang={lang} count={count} -> {len(names)} names")

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'names': names, 'lang': lang, 'sphere': sphere})
    }


def resolve_names(sphere: str, lang: str, count: int) -> list:
    """Ищет подходящие названия по ключевому слову и языку."""
    keyword_map = KEYWORD_MAP.get(lang, {})
    db = NAMES_DB.get(lang, {})

    # Ищем точное совпадение через keyword_map
    canonical = None
    for kw, canon in keyword_map.items():
        if kw in sphere or sphere in kw:
            canonical = canon
            break

    if canonical and canonical in db:
        pool = db[canonical]
    else:
        # Пробуем прямой поиск по ключу
        for key in db:
            if key in sphere or sphere in key:
                pool = db[key]
                canonical = key
                break
        else:
            pool = DEFAULT_NAMES.get(lang, DEFAULT_NAMES['ru'])

    # Перемешиваем и возвращаем count штук
    shuffled = pool[:]
    random.shuffle(shuffled)
    return shuffled[:count]
