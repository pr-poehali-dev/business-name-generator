import json
import random

# ─────────────────────────────────────────────────────────────
#  Словари по сферам (RU + EN), по 40 вариантов каждый
# ─────────────────────────────────────────────────────────────

NAMES_DB = {
    "ru": {
        "кафе": [
            "Аромат","Уют","Зерно","Пауза","Крема","Утро","Купол","Латте","Брю","Фреш",
            "Эспрессо","Терраса","Глоток","Кружка","Обжарка","Смак","Привал","Кофеин",
            "Зефир","Бодрость","Капля","Хауз","Фильтр","Ложка","Сливки","Паровой",
            "Обжиг","Сито","Зёрна","Молоко","Пенка","Тягучка","Завтрак","Термос",
            "Чашка","Ристретто","Капучино","Макиато","Флэт","Доппио",
        ],
        "ресторан": [
            "Очаг","Застолье","Ярмарка","Трапеза","Гурман","Скатерть","Самовар",
            "Лукошко","Усадьба","Горница","Изба","Хлебный","Пироги","Меню","Соус",
            "Рецепт","Угощение","Поварня","Тарелка","Блюдо","Аппетит","Трактир",
            "Бистро","Жаркое","Вкусовщина","Ступка","Мельница","Бочонок","Каравай",
            "Кулеш","Котёл","Шампур","Мангал","Духовка","Поднос","Соломка",
            "Наварка","Кастрюля","Поварёшка","Тесто",
        ],
        "маркетинг": [
            "Клик","Охват","Буст","Тренд","Лид","Пульс","Питч","Вектор","Канал",
            "Импульс","Медиа","Промо","Нексус","Формат","Дрейф","Сигнал","Волна",
            "Радар","Мощь","Таргет","Контент","Посев","Ключ","Охотник","Фронт",
            "Акцент","Мегафон","Трансляция","Аудит","Конверт","Реакция","Бриф",
            "Стратег","Инсайт","Пиар","Кампейн","Воронка","Ретаргет","Гипер","Фокус",
        ],
        "агентство": [
            "Альянс","Лига","Штаб","Форпост","Бюро","Союз","Эгида","Консул","Арсенал",
            "Кредо","Атлас","Мастерская","Студия","Лаборатория","Группа","Партнёр",
            "Платформа","Ресурс","Базис","Гильдия","Компас","Маяк","Формула",
            "Концепт","Рычаг","Архив","Реестр","Нотариус","Синдикат","Консорциум",
            "Команда","Отдел","Цех","Управа","Бригада","Корпус","Дивизия","Эскадра",
            "Пулемёт","Экипаж",
        ],
        "одежда": [
            "Стиль","Силуэт","Фасон","Кутюр","Образ","Линия","Мода","Контур","Эскиз",
            "Вуаль","Крой","Ткань","Нить","Шов","Манжет","Полотно","Узор","Коллекция",
            "Сезон","Подиум","Ателье","Лекало","Выкройка","Пуговица","Застёжка",
            "Лацкан","Капюшон","Бортик","Оборка","Декольте","Рукав","Мерка","Примерка",
            "Сборка","Отделка","Бахрома","Вышивка","Аппликация","Строчка","Петля",
        ],
        "it": [
            "Нексора","Синапс","Квазар","Битрон","Логика","Модуль","Протон","Байт",
            "Алго","Матрица","Скрипт","Флюид","Апекс","Коддекс","Ядро","Поток",
            "Сервер","Нейро","Дата","Облако","Прокси","Стек","Нода","Пайплайн",
            "Фреймворк","Дашборд","Репо","Контейнер","Кластер","Микросервис",
            "Токен","Хэш","Лямбда","Функция","Бинарий","Компилятор","Парсер",
            "Рефакторинг","Деплой","Девопс",
        ],
        "спорт": [
            "Форс","Ритм","Искра","Зенит","Темп","Спринт","Старт","Финиш","Трек",
            "Победа","Сила","Атлет","Скорость","Прыжок","Разгон","Движение","Мышца",
            "Удар","Рекорд","Пьедестал","Чемпион","Арена","Спарринг","Энергия",
            "Натиск","Рывок","Выносливость","Гонка","Марафон","Триатлон","Кросс",
            "Базовый","Стартовый","Подъём","Выпад","Присед","Тяга","Жим","Бег","Кардио",
        ],
        "красота": [
            "Люмен","Флора","Нюанс","Сияние","Глянец","Аура","Амбре","Блеск","Эклат",
            "Велюр","Эстет","Тон","Персик","Роза","Жемчуг","Зеркало","Румяна","Пудра",
            "Кисть","Палитра","Гламур","Шарм","Флюид","Ботокс","Серум","Пилинг",
            "Маска","Бьюти","Визаж","Стилист","Салон","Уход","Спа","Ногти","Брови",
            "Реснички","Макияж","Перманент","Ламинат","Кератин",
        ],
        "доставка": [
            "Экспресс","Маршрут","Курьер","Привоз","Молния","Ход","Посылка","Стрела",
            "Лёт","Порыв","Рывок","Гонец","Вестник","Бегун","Ракета","Дрон","Логист",
            "Спедитор","Трансфер","Транзит","Борт","Фура","Рейс","Накладная","Адрес",
            "Получатель","Отправитель","Склад","Хаб","Сортировка","Пункт","Пакет",
            "Коробка","Контейнер","Паллет","Погрузка","Выгрузка","Трекинг","Маркировка","Декларация",
        ],
        "здоровье": [
            "Пульс","Виталис","Санус","Здравия","Исцеление","Забота","Сердце","Дыхание",
            "Жизнь","Витамин","Иммун","Аптека","Рецепт","Диагноз","Доктор","Терапия",
            "Клиника","Лаборатория","Анализ","Медик","Баланс","Тонус","Реабилитация",
            "Профилактика","Оздоровление","Восстановление","Детокс","Ремиссия","Ресурс",
            "Вакцина","Иглоукалывание","Мануал","Физио","Массаж","Остеопат","Диетолог",
            "Нутрициолог","Фитнес-терапия","Психосоматика","Ароматерапия",
        ],
        "авто": [
            "Колесо","Движок","Турбо","Поршень","Вал","Ось","Кузов","Зажигание",
            "Старт","Газ","Сцепление","Тормоз","Капот","Багажник","Руль","Фара",
            "Бампер","Дорога","Трасса","Магистраль","Автопарк","Гараж","Пит-стоп",
            "Сервис","Диагностика","Полировка","Шиномонтаж","Мойка","Аккумулятор",
            "Прокладка","Антифриз","Форсунка","Коробка","Трансмиссия","Подвеска",
            "Амортизатор","Тюнинг","Детейлинг","Автосалон","Каршеринг",
        ],
        "недвижимость": [
            "Метраж","Ключ","Порог","Квадрат","Фасад","Дом","Квартира","Этаж",
            "Балкон","Двор","Гнездо","Очаг","Кровля","Фундамент","Застройка","Адрес",
            "Планировка","Риэлт","Хаус","Эстейт","Постройка","Ипотека","Аренда",
            "Сделка","Договор","Право","Собственник","Кадастр","Перепланировка",
            "Ремонт","Интерьер","Дизайн","Проект","Смета","Подряд","Новостройка",
            "Вторичка","Таунхаус","Пентхаус","Коттедж",
        ],
        "агро": [
            "Поле","Колос","Росток","Урожай","Нива","Пашня","Зерно","Стебель","Борозда",
            "Плуг","Комбайн","Трактор","Сенокос","Стог","Амбар","Ферма","Теплица",
            "Мульча","Компост","Гумус","Агроном","Севооборот","Орошение","Дренаж",
            "Пестицид","Фитосанитар","Фермер","Хозяйство","Агрохолдинг","Агростарт",
            "Агропром","Агробизнес","Семена","Рассада","Саженец","Прополка","Сортировка",
            "Хранилище","Силос","Зернохранилище",
        ],
        "игры": [
            "Квест","Раунд","Левел","Скор","Лут","Боссфайт","Гильдия","Арена","Клан",
            "Матч","Скилл","Крит","Дамаг","Спавн","Респ","Патч","Апдейт","Моб",
            "Геймер","Стример","Тактика","Стратегия","Загрузка","Сохранение","Режим",
            "Сезон","Баттл","Роялти","Катка","Рейтинг","Ачивка","Разблок","Скин",
            "Персонаж","Инвентарь","Фракция","Лобби","Дуэль","Одиночка","Кооп",
        ],
        "эко": [
            "Лист","Росток","Родник","Чистота","Баланс","Природа","Биом","Гумус",
            "Зелень","Лесная","Берег","Ветер","Солнце","Дождь","Почва","Корень",
            "Крона","Мох","Папоротник","Клевер","Колос","Луговой","Разнотравье",
            "Биота","Флора","Экосистема","Устойчивый","Переработка","Компост","Органик",
            "Биопродукт","Нулевой","Локальный","Сезонный","Живой","Натуральный",
            "Экологичный","Зелёный","Чистый","Вечный",
        ],
        "образование": [
            "Знания","Академия","Учёба","Курс","Лекция","Диплом","Навык","Урок","Школа",
            "Кампус","Факультет","Институт","Мудрость","Практика","Теория","Мастер",
            "Ступень","Разум","Идея","Метод","Учитель","Знаток","Эрудит","Грант",
            "Дисциплина","Программа","Модуль","Семинар","Воркшоп","Хакатон","Олимпиада",
            "Конкурс","Стипендия","Менторство","Наставник","Тьютор","Коуч","Прокачка",
            "Апгрейд","Рост",
        ],
        "финансы": [
            "Капитал","Актив","Депозит","Профит","Рост","Дивиденд","Инвест","Портфель",
            "Ставка","Процент","Биржа","Фонд","Банк","Кредит","Залог","Доход","Прибыль",
            "Монета","Казна","Сейф","Резерв","Ликвид","Баланс","Бюджет","Аудит",
            "Брокер","Трейдер","Фьючерс","Опцион","Дивиденды","Эмитент","Листинг",
            "Клиринг","Кастодиан","Депозитарий","Хедж","Кэш","Потоки","Рентабельность","Маржа",
        ],
    },

    "en": {
        "cafe": [
            "Aroma","Brewly","Grindly","Steamco","Sippify","Roastly","Beanhaus","Cupify",
            "Dripco","Latteo","Pressly","Grainco","Freshly","Pauseco","Morningco","Brewhaus",
            "Coffix","Cuppie","Driplux","Steamhaus","Roastify","Grindco","Blendr","Barsco",
            "Shotly","Pourco","Filtro","Grindhub","Steepco","Brewpoint","Vapour","Siphon",
            "Percofy","Espressly","Cortado","Lungo","Ristretto","Coldbrew","Nitrofy","Flatco",
        ],
        "restaurant": [
            "Feastly","Tableco","Savoury","Dishhaus","Forkly","Plateco","Bitehaus","Tastify",
            "Chefco","Menufy","Spoonly","Grillco","Flavourly","Recipeco","Servify","Dinery",
            "Gourmetly","Kitchenco","Cravingly","Platehaus","Forkhaus","Dishco","Bistrofy",
            "Naply","Crunchly","Zestco","Scorch","Braiseco","Sauteco","Cauldron","Skillet",
            "Wokhaus","Embers","Searing","Marinate","Pickle","Brineco","Simmer","Glazeco","Crust",
        ],
        "marketing": [
            "Reachly","Clickhaus","Boostify","Leadco","Pulsify","Pitchly","Waveco","Signalco",
            "Targetly","Contentco","Funnelco","Radarly","Engagely","Brandify","Craftco",
            "Growthly","Adhaus","Campco","Viewsco","Tapco","Hitsify","Promoly","Launchco",
            "Scalify","Draftco","Converty","Splitco","Tracko","Attributeco","Cohortly",
            "Segmentco","Nurtureco","Heatmap","Sessionco","Scrollco","Clickmap","A-Btest",
            "Persona","Journeyco","Touchpoint",
        ],
        "agency": [
            "Agentify","Hubco","Crewly","Vaultco","Nexusco","Studiohaus","Labify","Forgeco",
            "Guildco","Batchco","Crafthaus","Teamco","Allianx","Grouply","Systemco","Nethaus",
            "Pillar","Sourceco","Partnerco","Frameco","Fusionco","Linkco","Bridgely","Zonify",
            "Collective","Bureau","Forge","Foundry","Atelier","Division","Bloc","Corps",
            "Outfit","Assembly","Unit","Consortium","Coalition","Alliance","Federation","Syndicate",
        ],
        "fashion": [
            "Stylco","Silhouette","Sewhaus","Couturly","Lookco","Wearify","Stitchly","Labelco",
            "Threadco","Fabrichaus","Patternco","Formco","Linehaus","Seamco","Colorly",
            "Collectionco","Seasonco","Brandhaus","Modafy","Trendco","Veilco","Drafthaus",
            "Knitto","Sewify","Clothco","Drape","Tuck","Pleat","Dart","Seam","Bias","Grain",
            "Weave","Warp","Weft","Nap","Felt","Serge","Twill","Voile",
        ],
        "it": [
            "Nexora","Synapse","Quasar","Bitronic","Logicore","Moduleio","Protonix","Byteco",
            "Algoly","Matrixco","Scriptly","Fluidco","Apexio","Codehaus","Coreco","Streamco",
            "Servify","Cloudly","Neuro","Dataco","Sysify","Proxyco","Nethaus","Nodeio","Stackly",
            "Pipelineco","Containerco","Clusterco","Microco","Tokenco","Hashly","Lambdaco",
            "Compileco","Parseco","Deployco","Devopsco","Repofly","Branchco","Commitly","Mergeco",
        ],
        "sport": [
            "Forcely","Rhythmco","Sparkco","Zenithco","Tempofy","Sprintly","Startco","Finishco",
            "Trackly","Victoryco","Powerco","Athletix","Speedco","Leapco","Thrustco","Motionco",
            "Muscleco","Strikefix","Recordco","Arenafy","Stadiumco","Sparringco","Energyco",
            "Rushco","Paceco","Endureco","Grindco","Maxout","Gainco","Repco","Setco","Liftco",
            "Pressco","Pullco","Pushco","Cardiofy","Runco","Cycleco","Rowco","Swimco",
        ],
        "beauty": [
            "Lumenly","Floraco","Nuanceco","Glowify","Glossco","Aurahub","Ambreco","Shinely",
            "Velvety","Esthetico","Notehaus","Toneco","Blushco","Peachly","Roseco","Pearlco",
            "Mirrorco","Brushco","Paletteco","Beautyco","Glamco","Charmly","Sheerco","Dewco",
            "Blissco","Tintco","Hueco","Pigmentco","Shaderco","Glossify","Blendco","Layerco",
            "Finishco","Primefy","Setco","Meltco","Bakeco","Buffco","Stippleco","Smokeco",
        ],
        "delivery": [
            "Expressly","Routeco","Curierco","Flashco","Zapco","Arrowly","Dashify","Swiftco",
            "Parcelco","Rocketco","Droneco","Runnerco","Haulco","Movingly","Shipify","Cargofly",
            "Trackco","Rushco","Fetchco","Portco","Bringco","Quickco","Liftco","Jetco","Speedco",
            "Porterly","Hopco","Relayco","Zipco","Zoomco","Whoshco","Flyco","Slingco","Launchco",
            "Dropco","Pickco","Sortco","Hubco","Crossco","Lastmileco",
        ],
        "health": [
            "Vitalis","Pulseco","Wellco","Healify","Careco","Vitalco","Medica","Lifeco",
            "Breathco","Heartco","Immunico","Cureco","Clinicly","Diagno","Laborco","Docco",
            "Therapyco","Sanusco","Healthco","Medihaus","Vitafly","Remedyco","Curafly","Medhub",
            "Balmco","Tonicco","Doseify","Herbco","Natureco","Bloomco","Thriveco","Zenco",
            "Harmonyco","Balanceco","Restoreco","Renewco","Reviveco","Rechargefly","Detoxco","Boostco",
        ],
        "auto": [
            "Wheelco","Engineco","Turbofy","Pistonco","Drively","Gearco","Bodyco","Sparkco",
            "Throttleco","Clutchco","Brakeco","Hoodco","Trunkco","Steerco","Beamco","Bumperco",
            "Roadco","Trackco","Motorco","Garagefly","Pitco","Serviceco","Diagnoauto","Polishco",
            "Tireco","Washco","Battco","Sealco","Nozzleco","Gearboxco","Suspendco","Shockco",
            "Tuneco","Detailco","Dealerco","Carshare","Revco","Driftco","Launchco","Raceco",
        ],
        "realestate": [
            "Squareco","Keyhaus","Threshco","Facadeco","Homely","Flatco","Floorco","Balconyco",
            "Nestvo","Roofco","Foundco","Housify","Addressco","Planly","Realtco","Estateco",
            "Propco","Dwellco","Nestify","Placeco","Zoneco","Suiteco","Residco","Villaco",
            "Lotco","Plotco","Titleco","Deedco","Leaseco","Rentco","Mortgageco","Escrowco",
            "Appraiseco","Inspectco","Stageco","Listco","Offerco","Closingco","Ownco","Tenantco",
        ],
        "agro": [
            "Fieldco","Harvestly","Seedco","Cropco","Grainco","Soilco","Rootco","Sproutco",
            "Bloomco","Yieldco","Farmco","Barnco","Silofly","Tractorco","Plowco","Rowco",
            "Furrowco","Mulchco","Compostco","Humusco","Agroco","Rotateco","Irrigateco",
            "Drainco","Orchardco","Groveco","Meadowco","Pastурeco","Rangeco","Tillageco",
            "Fertco","Pestco","Herbco","Fungico","Insectco","Bioagro","Organicco","Localco",
            "Seasonalco","Freshfarm",
        ],
        "games": [
            "Questco","Roundco","Levelup","Scoreco","Lootco","Bossfly","Guildco","Arenaco",
            "Clanco","Matchco","Skillco","Critco","Damageco","Spawnco","Respco","Patchco",
            "Updateco","Mobco","Gamerco","Streamco","Tacticco","Stratco","Loadco","Saveco",
            "Modefly","Seasonco","Battleco","Royalco","Rankco","Achieveco","Unlockco","Skinco",
            "Charco","Invco","Factionco","Lobbyco","Duelco","Solofly","Coopco","Arcadeco",
        ],
        "eco": [
            "Leafco","Sproutco","Springco","Cleanly","Balanceco","Natureco","Biomeco","Humusco",
            "Greenco","Shoreco","Windco","Solarco","Rainco","Soilco","Rootco","Crownco",
            "Mossco","Fernco","Cloverco","Meadowco","Biota","Florafly","Ecosysco","Sustainco",
            "Recycleco","Compostco","Organicco","Zeroco","Localco","Seasonco","Lively","Purico",
            "Cleaneco","Greenify","Clearco","Fresheco","Naturify","Renew","Eterne","Vivideco",
        ],
        "education": [
            "Learnly","Acadify","Courseco","Skillhaus","Lessonly","Gradly","Campusco","Teachify",
            "Mastery","Stepco","Mindco","Wisdomco","Practify","Theoryco","Methodco","Expertly",
            "Erudite","Grantco","Studyco","Clasfly","Lecturely","Mentorco","Ideafly","Insightco",
            "Tracko","Quizco","Testify","Markco","Gradeco","Creditco","Certify","Diplomaco",
            "Scholarco","Fellowco","Residency","Bootcamp","Hackco","Sprintco","Workshopco","Labco",
        ],
        "finance": [
            "Capitalco","Assetco","Depositco","Profitly","Growthco","Investco","Portfolioco",
            "Rateco","Percentco","Exchangeco","Fundco","Bankly","Creditco","Incomely","Earnco",
            "Coinco","Treasuryco","Safelyco","Reserveco","Liquidco","Balanceco","Budgetco",
            "Auditco","Yieldco","Brokerco","Tradeco","Futureco","Optionco","Clearchco","Custodyco",
            "Hedgeco","Cashco","Flowco","Marginco","Leverageco","Divisco","Emitco","Listco",
            "Settleco","Custodian",
        ],
    },
}

# Маппинг ключевых слов -> ключ словаря
KEYWORD_MAP = {
    "ru": {
        "кафе":"кафе","кофе":"кафе","кофейня":"кафе","чай":"кафе","чайная":"кафе",
        "ресторан":"ресторан","еда":"ресторан","кухня":"ресторан","питание":"ресторан","столовая":"ресторан","бистро":"ресторан","бар":"ресторан",
        "маркетинг":"маркетинг","реклама":"маркетинг","продвижение":"маркетинг","smm":"маркетинг","seo":"маркетинг","таргет":"маркетинг",
        "агентство":"агентство","студия":"агентство","бюро":"агентство",
        "одежда":"одежда","мода":"одежда","fashion":"одежда","текстиль":"одежда","одеяло":"одежда",
        "it":"it","ит":"it","технологии":"it","программирование":"it","разработка":"it","софт":"it","стартап":"it","стартапы":"it",
        "спорт":"спорт","фитнес":"спорт","тренажёр":"спорт","тренировка":"спорт","зал":"спорт",
        "красота":"красота","салон":"красота","косметика":"красота","уход":"красота","бьюти":"красота","красота и уход":"красота",
        "доставка":"доставка","курьер":"доставка","логистика":"доставка","транспорт":"доставка",
        "здоровье":"здоровье","медицина":"здоровье","клиника":"здоровье","аптека":"здоровье","wellness":"здоровье",
        "авто":"авто","автомобиль":"авто","машина":"авто","автосервис":"авто","шиномонтаж":"авто","кар":"авто",
        "недвижимость":"недвижимость","аренда":"недвижимость","жильё":"недвижимость","ипотека":"недвижимость","риэлтор":"недвижимость",
        "агро":"агро","ферма":"агро","сельское хозяйство":"агро","растениеводство":"агро","животноводство":"агро","агробизнес":"агро",
        "игры":"игры","игра":"игры","геймдев":"игры","геймер":"игры","гейм":"игры",
        "эко":"эко","экология":"эко","эко-продукты":"эко","органик":"эко","зелёный":"эко",
        "образование":"образование","школа":"образование","обучение":"образование","курсы":"образование","академия":"образование",
        "финансы":"финансы","банк":"финансы","инвестиции":"финансы","деньги":"финансы","страхование":"финансы","кредит":"финансы",
    },
    "en": {
        "cafe":"cafe","coffee":"cafe","tea":"cafe","brew":"cafe","espresso":"cafe",
        "restaurant":"restaurant","food":"restaurant","dining":"restaurant","kitchen":"restaurant","bistro":"restaurant","bar":"restaurant",
        "marketing":"marketing","ads":"marketing","advertising":"marketing","smm":"marketing","seo":"marketing",
        "agency":"agency","studio":"agency","bureau":"agency",
        "fashion":"fashion","clothes":"fashion","clothing":"fashion","apparel":"fashion","wear":"fashion",
        "it":"it","tech":"it","software":"it","programming":"it","development":"it","startup":"it","startups":"it",
        "sport":"sport","sports":"sport","fitness":"sport","gym":"sport","workout":"sport",
        "beauty":"beauty","cosmetics":"beauty","salon":"beauty","skincare":"beauty","care":"beauty",
        "delivery":"delivery","courier":"delivery","logistics":"delivery","shipping":"delivery",
        "health":"health","medical":"health","clinic":"health","pharmacy":"health","wellness":"health",
        "auto":"auto","car":"auto","automobile":"auto","service":"auto","garage":"auto",
        "realestate":"realestate","real estate":"realestate","property":"realestate","housing":"realestate",
        "agro":"agro","farm":"agro","agriculture":"agro","farming":"agro","crop":"agro",
        "games":"games","game":"games","gaming":"games","gamedev":"games","gamer":"games",
        "eco":"eco","ecology":"eco","organic":"eco","green":"eco","sustainable":"eco",
        "education":"education","school":"education","learning":"education","courses":"education","academy":"education",
        "finance":"finance","bank":"finance","investment":"finance","money":"finance","insurance":"finance",
    },
}

DEFAULT_NAMES = {
    "ru": ["Нексора","Вивид","Флюид","Квазар","Зенит","Люмен","Синапс","Тотем","Апекс","Слайд",
           "Фокус","Градус","Нюанс","Ритм","Искра","Форс","Аура","Пульс","Вектор","Контур",
           "Маяк","Призма","Куб","Дрейф","Прокси","Ядро","Поток","Сигнал","Имплус","Нексус",
           "Бриз","Кредо","Лига","Атлас","Базис","Радар","Канал","Формат","Модуль","Волна"],
    "en": ["Nexora","Vivid","Fluidco","Quasar","Zenith","Lumen","Synapse","Totem","Apex","Slide",
           "Focus","Gradus","Nuance","Rhythm","Spark","Force","Aura","Pulse","Vector","Contour",
           "Beacon","Prism","Cube","Drift","Proxy","Core","Stream","Signal","Impulse","Nexus",
           "Breeze","Credo","League","Atlas","Basis","Radar","Channel","Format","Module","Wave"],
}


def handler(event: dict, context) -> dict:
    """Генерирует уникальные названия по сфере бизнеса и языку, исключая уже выданные."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    sphere = body.get('sphere', '').strip().lower()
    lang = body.get('lang', 'ru')
    count = min(int(body.get('count', 5)), 20)
    used = set(body.get('used', []))   # уже выданные названия

    if lang not in ('ru', 'en'):
        lang = 'ru'

    pool = resolve_pool(sphere, lang)
    # Исключаем уже использованные
    available = [n for n in pool if n not in used]

    # Если пул исчерпан — сбрасываем (начинаем сначала)
    if len(available) < count:
        available = pool[:]

    random.shuffle(available)
    names = available[:count]

    print(f"[GEN] sphere='{sphere}' lang={lang} pool={len(pool)} used={len(used)} -> {names}")

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'names': names, 'lang': lang, 'sphere': sphere})
    }


def resolve_pool(sphere: str, lang: str) -> list:
    keyword_map = KEYWORD_MAP.get(lang, {})
    db = NAMES_DB.get(lang, {})

    # Поиск через keyword_map
    for kw, canon in keyword_map.items():
        if kw in sphere or sphere in kw:
            if canon in db:
                return db[canon]

    # Прямой поиск по ключу словаря
    for key in db:
        if key in sphere or sphere in key:
            return db[key]

    return DEFAULT_NAMES.get(lang, DEFAULT_NAMES['ru'])
