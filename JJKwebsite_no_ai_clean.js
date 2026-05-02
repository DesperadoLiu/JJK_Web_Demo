const ALLOWED_EXTERNAL_HOSTS = new Set(['reurl.cc', 'ddc.ai', 'www.facebook.com', 'lin.ee']);
const ALLOWED_IMAGE_HOSTS = new Set([
    window.location.hostname,
    'formosachangcoltd.wpcomstaging.com',
    'videos.files.wordpress.com',
]);
const CONTENT_API_URL = '/api/content';
const MSG_INVALID_LINK = '連結格式不正確或不在允許清單內。';

function trackEvent(eventName, params = {}) {
    // 直接推送到 GA4 (gtag)
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
    
    // 同時也保留 dataLayer 備用，確保未來 GTM 設定後也能接收到
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName,
        ...params
    });
}


const menuData = [
    { id: 1, name: '香滷牛腱餐盒', price: 170, desc: '精選十三香滷包慢火燉煮牛腱，口感扎實、香氣厚實。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E9%A6%99%E9%AD%AF%E7%89%9B%E7%85%8E%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 512, protein: 35.8, fat: 12.5, carbs: 64.2 },
    { id: 2, name: '焙煎胡麻肉片餐盒', price: 115, desc: '焙煎胡麻醬香濃滑順，搭配豬肉片與均衡配菜，經典耐吃。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E7%84%99%E7%85%8E%E8%83%A1%E9%BA%BB%E8%82%89%E7%89%87%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 435, protein: 21.5, fat: 16.2, carbs: 50.8 },
    { id: 3, name: '蔥鹽雞胸餐盒', price: 135, desc: '蔥香清爽、雞胸鮮嫩，兼顧飽足感與高蛋白，是日常輕盈首選。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E8%94%A5%E9%B9%BD%E9%9B%9E%E8%83%B8-%E5%A4%96%E5%B8%B6.jpg', calories: 480, protein: 32.4, fat: 15.6, carbs: 52.4 },
    { id: 4, name: '烤檸檬鮭魚餐盒', price: 199, desc: '鮭魚蒸烤後外酥內嫩，檸檬提味更清爽，口感層次豐富。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E7%83%A4%E6%AA%B8%E6%AA%AC%E9%AE%AD%E9%AD%9A%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 550, protein: 28.6, fat: 22.4, carbs: 58.5 },
    { id: 5, name: '日式烤雞腿餐盒', price: 170, desc: '去骨雞腿刷上日式鹹甜醬汁，烤到焦香誘人，香氣飽滿。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E6%97%A5%E5%BC%8F%E7%83%A4%E9%9B%9E%E8%85%BF%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 610, protein: 30.2, fat: 28.5, carbs: 58.2 },
    { id: 6, name: '烤雪霜肉餐盒', price: 160, desc: '雪霜肉油花均勻、口感 Q 彈，搭配簡單調味更能吃出肉香。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E7%83%A4%E9%9B%AA%E9%9C%9C%E8%82%89%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 590, protein: 25.8, fat: 30.1, carbs: 53.8 },
    { id: 7, name: '香烤桔汁里肌餐盒', price: 145, desc: '上選里肌刷上獨家桔汁，甜香清爽，適合想吃得輕鬆又有味道。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E9%A6%99%E7%83%A4%E6%A1%94%E6%B1%81%E9%87%8C%E8%82%8C%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 460, protein: 26.5, fat: 12.8, carbs: 59.7 },
    { id: 8, name: '烤挪威鯖魚餐盒', price: 145, desc: '挪威鯖魚油脂飽滿、鹹香鮮明，搭配蔬菜後整體更加平衡。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E7%83%A4%E6%8C%AA%E5%A8%81%E9%AF%96%E9%AD%9A%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 580, protein: 24.2, fat: 32.5, carbs: 47.6 },
    { id: 9, name: '韓式泡菜雞胸餐盒', price: 135, desc: '低溫蒸煮雞胸搭配韓式泡菜，風味鮮明、負擔較低。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E9%9F%93%E5%BC%8F%E6%B3%A1%E8%8F%9C%E9%9B%9E%E8%83%B8%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 420, protein: 30.8, fat: 5.4, carbs: 62.1 },
    { id: 10, name: '壽喜燒豚肉片餐盒', price: 125, desc: '日式壽喜燒風味甘甜下飯，豚肉片柔嫩，是溫和順口的家常選擇。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E5%A3%BD%E5%96%9C%E7%87%92%E8%B1%9A%E8%82%89%E7%89%87%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 490, protein: 20.6, fat: 18.2, carbs: 60.9 },
    { id: 11, name: '黑胡椒嫩雞胸餐盒', price: 135, desc: '黑胡椒提香、雞胸鮮嫩，熱量控制相對友善，適合清爽飲食。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E9%BB%91%E8%83%A1%E6%A4%92%E5%AB%A9%E9%9B%9E%E8%83%B8%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 410, protein: 31.5, fat: 4.8, carbs: 60.2 },
    { id: 12, name: '經典豬雞妙算餐盒', price: 135, desc: '胡麻豬肉與黑胡椒雞胸雙主菜一次滿足，份量與營養都很有存在感。', img: 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E7%B6%93%E5%85%B8%E8%B1%AC%E9%9B%9E%E5%A6%99%E7%AE%97%E9%A4%90%E7%9B%92-%E5%8E%BB%E7%95%AA%E8%8C%84.png', calories: 520, protein: 36.5, fat: 18.4, carbs: 52.1 },
];

const mealTagsById = {
    1: ['高蛋白', '低脂', '人氣'],
    2: ['經典', '均衡', '熱銷'],
    3: ['雞胸', '飽足', '高蛋白'],
    4: ['鮭魚', '主廚推薦', '招牌'],
    5: ['雞腿', '均衡', '人氣'],
    6: ['肉食系', '香氣厚實', '推薦'],
    7: ['低負擔', '清爽', '健身友善'],
    8: ['魚類蛋白', '家常', '推薦'],
    9: ['低脂', '開胃', '輕盈'],
    10: ['日式', '日常', '順口'],
    11: ['高蛋白', '低脂', '輕盈'],
    12: ['雙主菜', '招牌', '人氣'],
};

const DEFAULT_MENU_DATA = menuData.map((meal) => ({ ...meal }));
const DEFAULT_MENU_BY_ID = new Map(DEFAULT_MENU_DATA.map((meal) => [meal.id, meal]));
const TAIPEI_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=25.0375&longitude=121.5637&current=weather_code,is_day,cloud_cover,precipitation,rain,showers,snowfall,temperature_2m,apparent_temperature&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTaipei&forecast_days=1';
const WEATHER_THEME_CLASSES = ['weather-dawn', 'weather-sunny', 'weather-summer', 'weather-dusk', 'weather-mist', 'weather-cloudy', 'weather-rainy', 'weather-night'];
const KANGMEI_MASCOT_IMAGE = 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E4%BA%AC%E7%B0%A1%E5%BA%B7-%E5%85%AC%E4%BB%94-AI%E5%AE%8C%E6%95%B4%E6%AA%94-09.png';
const JINGGE_MASCOT_IMAGE = 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E4%BA%AC%E7%B0%A1%E5%BA%B7-%E5%85%AC%E4%BB%94-AI%E5%AE%8C%E6%95%B4%E6%AA%94-04.png';
const weatherThemeLabel = document.getElementById('weatherThemeLabel');
const weatherThemeIcon = document.getElementById('weatherThemeIcon');
const weatherThemeMascotImage = weatherThemeIcon?.querySelector('.hero-weather-mascot-image') || null;
const weatherGlanceIcon = document.getElementById('weatherGlanceIcon');
const taipeiClock = document.getElementById('taipeiClock');
const taipeiTemperature = document.getElementById('taipeiTemperature');
const taipeiWeatherMeta = document.getElementById('taipeiWeatherMeta');
const themeSwitcher = document.getElementById('themeSwitcher');
const themeSwitcherToggle = document.getElementById('themeSwitcherToggle');
const themeSwitcherPanel = document.getElementById('themeSwitcherPanel');
const themeSwitcherButtons = Array.from(document.querySelectorAll('.theme-switcher-chip'));
let automaticWeatherTheme = null;
let manualWeatherTheme = null;
let taipeiClockTimer = null;

function renderWeatherChipIcon(theme) {
    const iconThemeMap = {
        dawn: 'dawn',
        sunny: 'sunny',
        summer: 'summer',
        dusk: 'dusk',
        mist: 'mist',
        cloudy: 'cloudy',
        rainy: 'rainy',
        night: 'night',
    };
    const weatherIcon = iconThemeMap[theme] || 'sunny';
    [weatherThemeIcon, weatherGlanceIcon].forEach((node) => {
        if (node) node.dataset.weatherIcon = weatherIcon;
    });
    if (weatherThemeMascotImage) {
        const isNightTheme = theme === 'night';
        weatherThemeMascotImage.src = isNightTheme ? JINGGE_MASCOT_IMAGE : KANGMEI_MASCOT_IMAGE;
        weatherThemeMascotImage.alt = isNightTheme ? '京哥' : '康妹';
    }
}

function formatTaipeiClock(now = new Date()) {
    return new Intl.DateTimeFormat('zh-TW', {
        timeZone: 'Asia/Taipei',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(now);
}

function formatTaipeiCalendar(now = new Date()) {
    return new Intl.DateTimeFormat('zh-TW', {
        timeZone: 'Asia/Taipei',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
    }).format(now);
}

function renderTaipeiClock() {
    if (!taipeiClock) return;
    taipeiClock.textContent = formatTaipeiClock();
}

function startTaipeiClock() {
    renderTaipeiClock();
    if (taipeiClockTimer) window.clearInterval(taipeiClockTimer);
    taipeiClockTimer = window.setInterval(renderTaipeiClock, 1000);
}

function updateTaipeiWeatherGlance(current = {}, label = '') {
    const temperature = Number(current?.temperature_2m ?? current?.apparent_temperature);
    if (taipeiTemperature) {
        taipeiTemperature.textContent = Number.isFinite(temperature) ? `${Math.round(temperature)}°C` : '--°C';
    }
    if (taipeiWeatherMeta) {
        taipeiWeatherMeta.textContent = formatTaipeiCalendar();
    }
}

const legacyQuizQuestions = [
    {
        eyebrow: '第 1 題 / 早餐選擇',
        title: '早上趕時間，你會優先選哪一種組合？',
        text: '想像你今天很忙，但還是希望精神穩定、不要太快餓。',
        choices: [
            { label: '無糖豆漿加蛋與全麥吐司', note: '蛋白質加上適量碳水，通常比純甜食更能維持飽足感。', points: 2 },
            { label: '手搖飲加甜麵包', note: '高糖組合容易很快餓，若能補上蛋白質會更穩定。', points: 0 },
        ],
    },
    {
        eyebrow: '第 2 題 / 午餐目標',
        title: '如果今天下午還要開會，你會怎麼選午餐主菜？',
        text: '重點不是吃最少，而是吃得剛剛好、不要過度疲倦。',
        choices: [
            { label: '有蛋白質主菜與蔬菜的餐盒', note: '均衡搭配通常更適合長時間工作與維持專注。', points: 2 },
            { label: '只有炸物和含糖飲', note: '油炸搭配高糖飲容易讓整體負擔偏高。', points: 0 },
        ],
    },
    {
        eyebrow: '第 3 題 / 點餐直覺',
        title: '看到「高蛋白」三個字時，你最在意的是什麼？',
        text: '請選出你覺得最符合健康餐概念的一項。',
        choices: [
            { label: '蛋白質夠，整體熱量也要合理', note: '高蛋白不是唯一條件，整體熱量與搭配也很重要。', points: 2 },
            { label: '只要蛋白質高，其他都不用看', note: '只看單一數值容易忽略油脂、份量與烹調方式。', points: 0 },
        ],
    },
    {
        eyebrow: '第 4 題 / 晚餐補給',
        title: '運動後要吃晚餐，你會先怎麼挑？',
        text: '想兼顧恢復與飽足感，不一定要吃得非常多。',
        choices: [
            { label: '選蛋白質足夠、熱量不過量的主餐', note: '運動後補蛋白質很重要，但還是要看整份餐的平衡。', points: 2 },
            { label: '直接加大炸物和甜飲慰勞自己', note: '偶爾可以放鬆，但若以恢復為目標，通常不是最穩健的搭配。', points: 0 },
        ],
    },
    {
        eyebrow: '第 5 題 / 外食策略',
        title: '外食很多天後，最適合先調整的是哪一步？',
        text: '請選出你認為最容易持續執行的方式。',
        choices: [
            { label: '先把主餐改成蛋白質與蔬菜更均衡的餐盒', note: '先從可持續的替換開始，通常比極端節食更有效。', points: 2 },
            { label: '整天不吃，晚上一次補回來', note: '忽餓忽飽容易打亂節奏，也比較不容易長久維持。', points: 0 },
        ],
    },
];

const quizQuestionSets = [
    [
        {
            eyebrow: '第 1 題 / 早餐選擇',
            title: '趕著出門的早晨，你最可能怎麼吃早餐？',
            text: '先想想哪個選項比較能幫助你穩定精神和飽足感。',
            choices: [
                { label: '茶葉蛋加無糖豆漿', note: '蛋白質和飽足感都比較穩，通常比精緻甜食更能撐住上午精神。', points: 2 },
                { label: '奶油麵包配大冰奶茶', note: '這組合通常糖和精緻澱粉偏高，飽足感也掉得比較快。', points: 0 },
            ],
        },
        {
            eyebrow: '第 2 題 / 宵夜直覺',
            title: '晚上有點餓，哪個宵夜選擇通常比較輕盈？',
            text: '想像你只是嘴饞，不是真的要吃一大餐。',
            choices: [
                { label: '舒肥雞胸沙拉', note: '以蛋白質和蔬菜為主，通常熱量和油脂都比炸物套餐更好控制。', points: 2 },
                { label: '鹹酥雞加甜不辣', note: '油炸點心通常熱量密度高，份量看似不多，累積起來卻很快。', points: 0 },
            ],
        },
        {
            eyebrow: '第 3 題 / 含糖飲料',
            title: '同樣是下午提神，哪一杯通常熱量較低？',
            text: '不用背數字，用生活直覺判斷就好。',
            choices: [
                { label: '無糖美式咖啡', note: '幾乎沒有額外糖分，通常是提神時最不容易多吃進熱量的選項。', points: 2 },
                { label: '全糖珍珠奶茶', note: '珍珠加糖飲很容易一路疊上去，熱量常常比想像中高很多。', points: 0 },
            ],
        },
        {
            eyebrow: '第 4 題 / 便當配菜',
            title: '健康餐盒裡，哪一種搭配通常更適合日常控制？',
            text: '重點是整體比例，不是完全不能吃某一類食物。',
            choices: [
                { label: '雞胸肉配青菜和地瓜', note: '蛋白質、纖維和主食比例比較清楚，通常更容易抓住均衡感。', points: 2 },
                { label: '炸排骨配滷肉飯加香腸', note: '這類組合通常油脂與澱粉都偏高，熱量也會更集中。', points: 0 },
            ],
        },
        {
            eyebrow: '第 5 題 / 運動後補充',
            title: '運動完想補充體力，哪個方向通常更理想？',
            text: '想想身體需要的是恢復，不只是嘴巴想吃。',
            choices: [
                { label: '優格加香蕉和水煮蛋', note: '有蛋白質也有碳水，對運動後恢復來說通常是更平衡的補充。', points: 2 },
                { label: '炸雞配可樂大薯', note: '恢復期如果常這樣吃，熱量和油脂通常會超前很多。', points: 0 },
            ],
        },
    ],
    [
        {
            eyebrow: '第 1 題 / 外食判斷',
            title: '中午想吃飽又不要太負擔，哪個選項更穩？',
            text: '先選出你認為整體最接近日常均衡的搭配。',
            choices: [
                { label: '烤雞腿便當配兩份蔬菜', note: '有蛋白質、主食和蔬菜，通常比重油重炸的組合更容易拿捏。', points: 2 },
                { label: '雙層炸雞漢堡加薯條', note: '這類套餐常把油脂和澱粉都拉高，吃完也容易覺得口渴。', points: 0 },
            ],
        },
        {
            eyebrow: '第 2 題 / 沙拉陷阱',
            title: '哪一份沙拉更可能熱量偏高？',
            text: '不是看到沙拉就一定比較輕，配料也很關鍵。',
            choices: [
                { label: '炸雞塊凱薩沙拉', note: '醬料、起司和炸物疊上去後，熱量不一定比便當低。', points: 0 },
                { label: '雞胸藜麥蔬菜沙拉', note: '如果主體是雞胸和蔬菜，整體通常會比炸物沙拉更穩定。', points: 2 },
            ],
        },
        {
            eyebrow: '第 3 題 / 點心比較',
            title: '下午嘴饞時，哪個點心通常更好控制份量？',
            text: '先挑一個比較不容易一口氣爆量的。',
            choices: [
                { label: '原味堅果一小包', note: '小包裝通常比大桶零食更好控制，適量也比較有飽足感。', points: 2 },
                { label: '洋芋片一大包', note: '脆口零食很容易不知不覺一直吃，熱量累積速度也很快。', points: 0 },
            ],
        },
        {
            eyebrow: '第 4 題 / 麵食選擇',
            title: '兩碗麵放在眼前，哪一碗通常熱量更低？',
            text: '看的是烹調方式，不是只看麵條本身。',
            choices: [
                { label: '清燉牛肉麵', note: '雖然還是有熱量，但通常會比重油拌炒類型好抓一些。', points: 2 },
                { label: '奶油培根義大利麵', note: '奶油、培根和醬汁結合後，整體能量通常更高。', points: 0 },
            ],
        },
        {
            eyebrow: '第 5 題 / 晚餐主食',
            title: '晚餐想吃主食，哪種份量觀念比較合理？',
            text: '不是完全不吃，而是吃得剛好。',
            choices: [
                { label: '保留半碗到一碗飯，搭配蛋白質與菜', note: '主食保留適量通常比完全不吃更容易長期維持。', points: 2 },
                { label: '完全不吃飯，但多點兩份炸物', note: '少了飯不代表總熱量就會低，炸物常常一下就補回去了。', points: 0 },
            ],
        },
    ],
    [
        {
            eyebrow: '第 1 題 / 早餐飲料',
            title: '如果早餐一定要配飲料，哪個通常更清爽？',
            text: '先用少糖、少額外配料的方向想。',
            choices: [
                { label: '無糖拿鐵', note: '仍有奶的熱量，但通常比加糖加料飲品更單純。', points: 2 },
                { label: '焦糖鮮奶油可可', note: '糖漿、鮮奶油和可可疊上去，熱量會比想像中快很多。', points: 0 },
            ],
        },
        {
            eyebrow: '第 2 題 / 火鍋直覺',
            title: '吃火鍋時，哪個選法通常更有利控制熱量？',
            text: '看的是整桌累積，不是只看其中一樣。',
            choices: [
                { label: '多菜盤、豆腐、瘦肉，少加工料', note: '天然食材比例提高後，通常更容易避開隱藏油脂和澱粉。', points: 2 },
                { label: '丸餃類加王子麵和沙茶多沾幾次', note: '加工火鍋料和重醬很容易讓熱量與鈉一起往上堆。', points: 0 },
            ],
        },
        {
            eyebrow: '第 3 題 / 烹調方式',
            title: '同樣是雞肉，哪種做法通常更輕一點？',
            text: '用最直覺的方式判斷就好。',
            choices: [
                { label: '香煎或舒肥雞胸', note: '如果油量控制得宜，通常會比裹粉油炸更單純。', points: 2 },
                { label: '炸雞排', note: '裹粉和油炸會讓整體熱量明顯往上。', points: 0 },
            ],
        },
        {
            eyebrow: '第 4 題 / 超商採買',
            title: '在超商快速挑一餐，哪組通常更平衡？',
            text: '以蛋白質、主食、蔬菜三個方向來看。',
            choices: [
                { label: '茶葉蛋、烤地瓜、無糖豆漿', note: '這種組合通常比全靠零食和甜飲更能撐飽，也更穩定。', points: 2 },
                { label: '夾心餅乾、汽水、巧克力棒', note: '這類通常糖分高、飽足感短，很容易過一下又餓。', points: 0 },
            ],
        },
        {
            eyebrow: '第 5 題 / 聚餐策略',
            title: '聚餐不想吃太失控，哪個做法比較聰明？',
            text: '不是掃興，而是幫自己留一點節奏。',
            choices: [
                { label: '先吃菜和蛋白質，再決定甜點份量', note: '先有飽足感後再選想吃的，通常更不容易一路失手。', points: 2 },
                { label: '先點甜點和炸物，主餐再說', note: '最香的先上很容易直接把食慾打開，後面也更難控制。', points: 0 },
            ],
        },
    ],
    [
        {
            eyebrow: '第 1 題 / 早餐份量',
            title: '下面哪份早餐通常更能兼顧飽足和控制？',
            text: '看起來豐盛不一定比較差，重點在組成。',
            choices: [
                { label: '鮪魚蛋吐司配無糖紅茶', note: '有蛋白質也有主食，通常比純甜麵包更能延長飽足感。', points: 2 },
                { label: '菠蘿麵包配含糖奶茶', note: '這組通常糖和油脂都偏高。', points: 0 },
            ],
        },
        {
            eyebrow: '第 2 題 / 便當配料',
            title: '哪種便當副菜組合通常比較加分？',
            text: '用清楚食材的概念來看。',
            choices: [
                { label: '花椰菜、玉米筍、滷豆腐', note: '蔬菜和豆製品比例高，通常比加工配菜更穩。', points: 2 },
                { label: '炸薯餅、甜不辣、香腸', note: '這組大多是加工或油炸，整體負擔通常更重。', points: 0 },
            ],
        },
        {
            eyebrow: '第 3 題 / 甜點判斷',
            title: '想吃點甜的，哪個通常比較容易控制熱量？',
            text: '不是完全不能吃，而是選擇更簡單的版本。',
            choices: [
                { label: '原味優格加少量水果', note: '甜味來源比較單純，也比較容易控制份量。', points: 2 },
                { label: '厚奶蓋黑糖珍珠', note: '奶蓋、糖漿和配料加起來，熱量通常會衝很快。', points: 0 },
            ],
        },
        {
            eyebrow: '第 4 題 / 麵包陷阱',
            title: '兩款麵包相比，哪個通常熱量更高？',
            text: '觀察內餡和表面配料就有線索。',
            choices: [
                { label: '奶酥厚片', note: '抹醬量多時，奶油和糖會讓整體熱量顯著提高。', points: 0 },
                { label: '全麥餐包', note: '雖然不是零熱量，但通常比厚厚甜醬的麵包更簡單。', points: 2 },
            ],
        },
        {
            eyebrow: '第 5 題 / 睡前嘴饞',
            title: '睡前有點想吃東西，哪個做法比較穩？',
            text: '先想想自己是真的餓，還是只是想咬點東西。',
            choices: [
                { label: '先喝水，若還餓就吃小份高蛋白點心', note: '先辨別需求，再選小份量補充，通常更不容易吃過頭。', points: 2 },
                { label: '直接叫鹽酥雞和含糖飲', note: '夜間高油高鹽又加糖，通常是最容易讓總量爆掉的組合。', points: 0 },
            ],
        },
    ],
    [
        {
            eyebrow: '第 1 題 / 主餐選擇',
            title: '如果只能二選一，哪種主餐通常更適合平日？',
            text: '想像你一週要吃很多次，哪種更容易長期維持。',
            choices: [
                { label: '烤魚配飯和青菜', note: '蛋白質來源清楚，也能兼顧主食與蔬菜，通常較平衡。', points: 2 },
                { label: '起司培根雙層披薩', note: '若以日常控制來看，熱量密度通常更高。', points: 0 },
            ],
        },
        {
            eyebrow: '第 2 題 / 手搖加料',
            title: '手搖飲想少一點負擔，哪個做法比較有幫助？',
            text: '不是不能喝，是怎麼點更重要。',
            choices: [
                { label: '改無糖或微糖，不加珍珠椰果', note: '糖和配料先降下來，通常就能明顯減少不少額外熱量。', points: 2 },
                { label: '正常糖再加兩種配料', note: '糖分和配料一起上去後，常常比一份點心還要重。', points: 0 },
            ],
        },
        {
            eyebrow: '第 3 題 / 便利選餐',
            title: '開會前只剩五分鐘，哪個快速組合通常更好？',
            text: '目標是快速、方便，又不要只靠糖撐。',
            choices: [
                { label: '鮭魚飯糰加無糖豆漿', note: '有主食也有一些蛋白質，通常比純甜食更能頂住忙碌時段。', points: 2 },
                { label: '奶油鬆餅加含糖咖啡', note: '這種組合吃起來快樂，但血糖起伏通常也更明顯。', points: 0 },
            ],
        },
        {
            eyebrow: '第 4 題 / 聚會炸物',
            title: '朋友點了一桌炸物，哪個想法比較接近健康直覺？',
            text: '不是掃興，而是找到比較聰明的吃法。',
            choices: [
                { label: '分食幾塊就好，再搭配無糖茶', note: '把份量拉回可控範圍，比整份自己吃掉更容易平衡。', points: 2 },
                { label: '反正都點了，炸雞薯條一次吃到飽', note: '把聚餐當放飛時，熱量常常會遠超出原本預期。', points: 0 },
            ],
        },
        {
            eyebrow: '第 5 題 / 一日觀念',
            title: '下面哪種想法比較接近長期可維持的飲食方式？',
            text: '這題考的不是完美，而是能不能真的做下去。',
            choices: [
                { label: '多數時間吃均衡，偶爾享受喜歡的食物', note: '長期飲食最重要的是能持續，彈性通常比極端更實際。', points: 2 },
                { label: '今天吃多了，明天就整天不吃', note: '用極端補償法很容易讓後續節奏更亂，也更難維持。', points: 0 },
            ],
        },
    ],
];

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'show';
    window.setTimeout(() => {
        toast.className = '';
    }, 3000);
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
}

function normalizeUrl(rawUrl, options = {}) {
    const {
        allowRelative = false,
        allowedHosts = null,
        allowedProtocols = ['https:'],
    } = options;
    if (typeof rawUrl !== 'string') return null;

    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    try {
        const parsed = new URL(trimmed, window.location.href);
        const isAbsoluteInput = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
        if (!allowedProtocols.includes(parsed.protocol)) return null;
        if ((!allowRelative || isAbsoluteInput) && allowedHosts && !allowedHosts.has(parsed.hostname)) {
            return null;
        }
        return parsed;
    } catch (_error) {
        return null;
    }
}

function getSafeImageUrl(rawUrl, fallback = '') {
    const parsed = normalizeUrl(rawUrl, {
        allowRelative: true,
        allowedHosts: ALLOWED_IMAGE_HOSTS,
    });
    return parsed ? parsed.toString() : fallback;
}

function applySafeExternalHref(link, rawUrl) {
    if (!(link instanceof HTMLAnchorElement)) return false;
    const parsed = normalizeUrl(rawUrl, {
        allowRelative: false,
        allowedHosts: ALLOWED_EXTERNAL_HOSTS,
    });
    if (!parsed) {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.addEventListener('click', (event) => event.preventDefault());
        return false;
    }
    link.href = parsed.toString();
    link.target = '_blank';
    link.rel = 'noopener noreferrer external';
    link.referrerPolicy = 'no-referrer';
    return true;
}

function safeOpen(url) {
    const parsed = normalizeUrl(url, {
        allowRelative: false,
        allowedHosts: ALLOWED_EXTERNAL_HOSTS,
    });
    if (!parsed) {
        showToast(MSG_INVALID_LINK);
        return;
    }

    trackEvent('external_link_click', { url: parsed.toString() });

    const newWindow = window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
}

function createNutritionStat(value, label) {
    const wrapper = createElement('div', 'flex flex-col items-center gap-1');
    wrapper.append(
        createElement('span', 'font-bold text-slate-700', String(value)),
        createElement('span', '', label),
    );
    return wrapper;
}

function createNutritionDivider() {
    return createElement('div', 'w-px h-6 bg-slate-200');
}

function buildMealCard(meal) {
    const card = createElement('article', 'menu-card bg-white rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col h-full shadow-sm relative group');

    const imageContainer = createElement('div', 'h-64 bg-slate-50 flex items-center justify-center p-8 overflow-hidden');
    const image = document.createElement('img');
    image.src = getSafeImageUrl(meal.img, getSafeImageUrl(DEFAULT_MENU_BY_ID.get(meal.id)?.img || '', ''));
    image.alt = meal.name;
    image.className = 'max-h-full max-w-full object-contain product-img transition-transform duration-700 group-hover:scale-110';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => {
        image.classList.add('hidden');
    }, { once: true });
    imageContainer.appendChild(image);

    const content = createElement('div', 'p-10 flex-grow flex flex-col border-t border-slate-50 text-center');
    const title = createElement('h3', 'text-xl font-bold text-slate-900', meal.name);
    const price = createElement('span', 'text-brand-orange font-bold text-xl', `$${meal.price}`);
    const header = createElement('div', 'flex justify-between items-center mb-4');
    header.append(title, price);

    const tags = Array.isArray(meal.tags) && meal.tags.length ? meal.tags : (mealTagsById[meal.id] || ['推薦']);
    const tagsContainer = createElement('div', 'meal-tags');
    tags.forEach((tag) => tagsContainer.appendChild(createElement('span', 'meal-tag', tag)));

    const description = createElement('p', 'text-slate-500 text-lg leading-relaxed font-light mb-6 flex-grow', meal.desc);

    const nutritionBlock = createElement('div', 'bg-slate-50 rounded-2xl p-4 flex justify-between items-center text-xs text-slate-500 mt-auto border border-slate-100');
    nutritionBlock.append(
        createNutritionStat(meal.calories, '大卡'),
        createNutritionDivider(),
        createNutritionStat(`${meal.protein}g`, '蛋白質'),
        createNutritionDivider(),
        createNutritionStat(`${meal.fat}g`, '脂肪'),
        createNutritionDivider(),
        createNutritionStat(`${meal.carbs}g`, '碳水'),
    );

    content.append(header, tagsContainer, description, nutritionBlock);
    card.append(imageContainer, content);
    return card;
}

function renderMenu() {
    const container = document.getElementById('mealContainer');
    if (!container) return;
    container.replaceChildren(...menuData.map(buildMealCard));
}

function buildNewsCard(item) {
    const link = createElement('a', 'group block overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 hover:border-brand-orange/30 transition-all shadow-sm hover:shadow-md');
    applySafeExternalHref(link, item.url || '');

    const mediaWrap = createElement('div', 'h-48 bg-slate-200 overflow-hidden relative');
    const imageUrl = getSafeImageUrl(item.image, '');
    if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = item.title || 'news';
        image.className = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105';
        image.loading = 'lazy';
        image.decoding = 'async';
        mediaWrap.appendChild(image);
    } else {
        mediaWrap.appendChild(createElement('div', 'w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm', 'No Image'));
    }

    mediaWrap.appendChild(
        createElement(
            'div',
            `absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 pb-1.5 rounded-lg font-bold text-sm tracking-wider ${item.tagClass || 'text-brand-orange'}`,
            item.tag || '最新消息',
        ),
    );

    const content = createElement('div', 'p-6');
    content.append(
        createElement('p', 'text-slate-400 text-sm mb-2 font-medium', item.date || ''),
        createElement('h3', 'text-xl font-bold text-slate-800 mb-3 group-hover:text-brand-orange transition-colors line-clamp-2', item.title || ''),
        createElement('p', 'text-slate-500 text-sm line-clamp-3 leading-relaxed', item.summary || ''),
    );

    link.append(mediaWrap, content);
    return link;
}

function renderNews(newsItems) {
    const container = document.getElementById('newsContainer');
    if (!container || !Array.isArray(newsItems) || !newsItems.length) return;
    container.replaceChildren(...newsItems.map(buildNewsCard));
    updateMobileNewsVisibility();
}

let isMobileNewsExpanded = false;

function updateMobileNewsVisibility() {
    const container = document.getElementById('newsContainer');
    const toggleButton = document.getElementById('toggleNewsCollapseButton');
    if (!container || !toggleButton) return;

    const cards = Array.from(container.children);
    const isMobile = window.innerWidth < 768;
    const shouldCollapse = isMobile && cards.length > 1;

    cards.forEach((card, index) => {
        card.classList.toggle('hidden', shouldCollapse && !isMobileNewsExpanded && index > 0);
    });

    toggleButton.classList.toggle('hidden', !shouldCollapse);
    toggleButton.classList.toggle('inline-flex', shouldCollapse);
    toggleButton.setAttribute('aria-expanded', shouldCollapse && isMobileNewsExpanded ? 'true' : 'false');
    toggleButton.textContent = shouldCollapse && isMobileNewsExpanded ? '收合其他消息' : '查看更多消息';
}

function initMobileNewsCollapse() {
    const toggleButton = document.getElementById('toggleNewsCollapseButton');
    if (!toggleButton) return;

    toggleButton.addEventListener('click', () => {
        isMobileNewsExpanded = !isMobileNewsExpanded;
        updateMobileNewsVisibility();
    });

    updateMobileNewsVisibility();
}

function normalizePhoneHref(phone = '') {
    return String(phone).replace(/[^\d+]/g, '');
}

function buildLocationCard(item) {
    const card = createElement('article', 'bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 hover:border-brand-orange transition-colors text-center flex flex-col h-full');
    const title = createElement('h3', 'text-2xl font-bold text-brand-orange mb-4', item.name || '');
    const infoWrap = createElement('div', 'store-info-block');
    infoWrap.append(
        createElement('p', 'store-info store-address text-slate-600 text-sm mb-2', '📍 ' + (item.address || '')),
        createElement('p', 'store-info store-phone text-slate-600 text-sm mb-8', '📞 ' + (item.phone || '')),
        createElement('p', 'store-info store-hours text-slate-600 text-sm mb-1', item.hours || ''),
        createElement('p', 'store-info store-reg text-slate-600 text-sm mb-6', item.registration || ''),
    );

    const buttonRow = createElement('div', 'store-action-row flex gap-3 mt-auto pt-2');
    const orderLink = createElement('a', 'flex-[1.5] py-3 btn-primary text-white rounded-xl text-base font-bold text-center', '立即訂餐');
    applySafeExternalHref(orderLink, item.mapUrl || '');
    buttonRow.appendChild(orderLink);

    if (item.phone) {
        const callLink = createElement('a', 'store-quick-action py-3 rounded-xl text-base font-bold text-center', '立即撥號');
        callLink.href = 'tel:' + normalizePhoneHref(item.phone);
        buttonRow.appendChild(callLink);
    }

    if (item.address) {
        const mapLink = createElement('a', 'store-quick-action py-3 rounded-xl text-base font-bold text-center', '地圖導航');
        mapLink.target = '_blank';
        mapLink.rel = 'noopener noreferrer';
        applySafeExternalHref(mapLink, 'https://maps.google.com/?q=' + encodeURIComponent(item.address));
        buttonRow.appendChild(mapLink);
    }

    card.append(title, infoWrap, buttonRow);
    return card;
}

function renderLocations(locations) {
    const locationContainer = document.getElementById('locationContainer');
    if (locationContainer && Array.isArray(locations) && locations.length) {
        locationContainer.replaceChildren(...locations.map(buildLocationCard));
    }

    const modalLinks = document.getElementById('storeModalLinks');
    if (!modalLinks || !Array.isArray(locations) || !locations.length) return;

    const fragment = document.createDocumentFragment();
    locations.forEach((item) => {
        const button = createElement('button', 'store-link-button w-full py-5 bg-slate-50 hover:bg-brand-orange hover:text-white rounded-2xl font-bold text-slate-700 transition-all border border-slate-100 flex items-center justify-center gap-3 group');
        button.type = 'button';
        button.setAttribute('data-open-url', item.mapUrl || '');
        button.append(
            createElement('span', '', item.name || ''),
            createElement('span', 'opacity-0 group-hover:opacity-100 transition-opacity', '→'),
        );
        fragment.appendChild(button);
    });

    const closeButton = createElement('button', 'w-full py-4 text-slate-400 font-medium hover:text-slate-600 transition-colors text-sm', '取消點餐');
    closeButton.type = 'button';
    closeButton.id = 'closeStoreModalButton';
    fragment.appendChild(closeButton);
    modalLinks.replaceChildren(fragment);
}

function hydrateMenuData(remoteMenu) {
    if (!Array.isArray(remoteMenu) || !remoteMenu.length) return;
    const mergedById = new Map(DEFAULT_MENU_DATA.map((meal) => [meal.id, { ...meal }]));
    const appended = [];

    remoteMenu.forEach((meal) => {
        if (!meal || typeof meal !== 'object') return;
        if (typeof meal.id === 'number' && mergedById.has(meal.id)) {
            mergedById.set(meal.id, { ...mergedById.get(meal.id), ...meal });
            return;
        }
        appended.push(meal);
    });

    const mergedMenu = [...DEFAULT_MENU_DATA.map((meal) => mergedById.get(meal.id)), ...appended];
    menuData.length = 0;
    mergedMenu.forEach((meal) => menuData.push(meal));
}

async function loadSiteContent() {
    const isLocalPreview = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    if (isLocalPreview) return;

    try {
        const response = await fetch(CONTENT_API_URL, { method: 'GET' });
        if (!response.ok) return;
        const content = await response.json();
        hydrateMenuData(content.menu);
        renderMenu();
        renderNews(content.news);
        renderLocations(content.locations);
    } catch (_error) {
        // Keep static fallback content from HTML.
    }
}

function toggleModal(show) {
    const modal = document.getElementById('storeModal');
    if (!modal) return;
    modal.classList.toggle('hidden', !show);
    modal.classList.toggle('modal-active', show);
    if (show) {
        trackEvent('store_modal_open');
    }
}

function bindEvents() {
    const openStoreModalButton = document.getElementById('openStoreModalButton');
    const storeModal = document.getElementById('storeModal');
    const openMobileMenuButton = document.getElementById('openMobileMenuButton');
    const mobileQuickMenu = document.getElementById('mobileQuickMenu');
    const closeMobileMenuButton = document.getElementById('closeMobileMenuButton');

    const closeMobileMenu = () => {
        if (!mobileQuickMenu || !openMobileMenuButton) return;
        mobileQuickMenu.classList.remove('mobile-drawer-open');
        mobileQuickMenu.classList.add('hidden');
        openMobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-lock');
    };

    const openMobileMenu = () => {
        if (!mobileQuickMenu || !openMobileMenuButton) return;
        if (window.innerWidth >= 768) return;
        mobileQuickMenu.classList.remove('hidden');
        window.requestAnimationFrame(() => mobileQuickMenu.classList.add('mobile-drawer-open'));
        openMobileMenuButton.setAttribute('aria-expanded', 'true');
        document.body.classList.add('mobile-menu-lock');
    };

    openStoreModalButton?.addEventListener('click', () => toggleModal(true));
    document.querySelectorAll('[data-open-store-modal="true"]').forEach((button) => {
        button.addEventListener('click', () => toggleModal(true));
    });
    openMobileMenuButton?.addEventListener('click', () => {
        if (mobileQuickMenu?.classList.contains('hidden')) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
    closeMobileMenuButton?.addEventListener('click', closeMobileMenu);

    storeModal?.addEventListener('click', (event) => {
        if (event.target === storeModal) {
            toggleModal(false);
            return;
        }
        const closeButton = event.target.closest('#closeStoreModalButton');
        if (closeButton) {
            toggleModal(false);
            return;
        }
        const storeButton = event.target.closest('.store-link-button');
        if (storeButton) {
            const url = storeButton.getAttribute('data-open-url');
            if (url) safeOpen(url);
            toggleModal(false);
        }
    });

    mobileQuickMenu?.addEventListener('click', (event) => {
        if (event.target === mobileQuickMenu || event.target.classList.contains('mobile-drawer-backdrop')) {
            closeMobileMenu();
        }
    });

    document.querySelectorAll('.mobile-menu-link').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) closeMobileMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleModal(false);
            closeMobileMenu();
        }
    });
}

function getCalculatorRecommendations(goal) {
    if (goal === 'lose') {
        return [...menuData].sort((a, b) => a.calories - b.calories).slice(0, 2);
    }
    if (goal === 'gain') {
        return [...menuData].sort((a, b) => b.protein - a.protein).slice(0, 2);
    }
    return [...menuData]
        .sort((a, b) => (Math.abs(a.calories - 500) + Math.abs(a.protein - 28)) - (Math.abs(b.calories - 500) + Math.abs(b.protein - 28)))
        .slice(0, 2);
}

function createCalculatorRecommendation(meal) {
    const wrapper = createElement('div', 'bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between shadow-sm hover:border-brand-orange transition-colors');
    const content = createElement('div', 'flex items-center gap-3');
    const image = document.createElement('img');
    image.src = getSafeImageUrl(meal.img, '');
    image.alt = meal.name;
    image.className = 'w-12 h-12 object-contain bg-slate-50 rounded';
    image.loading = 'lazy';
    image.decoding = 'async';

    const copy = createElement('div', '');
    copy.append(
        createElement('p', 'font-bold text-slate-800 text-sm', meal.name),
        createElement('p', 'text-xs text-slate-500', `${meal.calories} 大卡 | ${meal.protein}g 蛋白質`),
    );

    const link = createElement('a', 'text-brand-orange text-sm font-bold whitespace-nowrap px-2', '看餐盒');
    link.href = '#menu';

    content.append(image, copy);
    wrapper.append(content, link);
    return wrapper;
}

function initCalorieCalculator() {
    const calcForm = document.getElementById('calorieCalculatorForm');
    const calcResult = document.getElementById('calorieResult');
    const calcResultTdee = document.getElementById('calcResultTdee');
    const recommendedMealsContainer = document.getElementById('recommendedMeals');
    if (!calcForm || !calcResult || !calcResultTdee || !recommendedMealsContainer) return;

    calcForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const gender = document.getElementById('calcGender')?.value || 'male';
        const weight = parseFloat(document.getElementById('calcWeight')?.value || '');
        const height = parseFloat(document.getElementById('calcHeight')?.value || '');
        const age = parseInt(document.getElementById('calcAge')?.value || '', 10);
        const activity = parseFloat(document.getElementById('calcActivity')?.value || '');
        const goal = document.getElementById('calcGoal')?.value || 'maintain';

        if (!weight || !height || !age || !activity) {
            showToast('請先完整填寫試算資料。');
            return;
        }

        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        let targetCalories = Math.round(bmr * activity);
        if (goal === 'lose') targetCalories -= 400;
        if (goal === 'gain') targetCalories += 300;

        calcResultTdee.textContent = `${targetCalories} 大卡`;
        recommendedMealsContainer.replaceChildren(...getCalculatorRecommendations(goal).map(createCalculatorRecommendation));
        calcResult.classList.remove('hidden');
        calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        trackEvent('calculator_calculate', {
            gender,
            goal,
            target_calories: targetCalories
        });
    });
}

function chooseMealsByScore(score) {
    const light = [...menuData].sort((a, b) => a.calories - b.calories);
    const protein = [...menuData].sort((a, b) => b.protein - a.protein);
    const balanced = [...menuData]
        .sort((a, b) => (Math.abs(a.calories - 500) + Math.abs(a.protein - 28)) - (Math.abs(b.calories - 500) + Math.abs(b.protein - 28)));

    if (score >= 250) {
        return {
            rank: '京簡康王牌配送員',
            summary: '節奏非常穩，健康食材幾乎都能精準接住，適合高蛋白又有飽足感的組合。',
            meals: protein.slice(0, 2),
        };
    }
    if (score >= 160) {
        return {
            rank: '健康外送達人',
            summary: '你的選擇很均衡，適合兼顧續航力與風味的餐盒搭配。',
            meals: balanced.slice(0, 2),
        };
    }
    if (score >= 80) {
        return {
            rank: '均衡小幫手',
            summary: '已經抓到健康選擇方向，從清爽、低負擔又有蛋白質的品項開始最剛好。',
            meals: light.slice(0, 2),
        };
    }
    return {
        rank: '外送新手',
        summary: '先從清爽、容易建立節奏的餐盒開始，再搭配熱量試算會更容易找到適合自己的份量。',
        meals: [light[0], balanced[0]],
    };
}

function createRecommendedMealItem(meal) {
    const item = createElement('article', 'game-recommended-item');
    const copy = createElement('div', '');
    copy.append(
        createElement('strong', '', meal.name),
        createElement('span', '', `${meal.calories} kcal | ${meal.protein}g 蛋白質`),
    );
    item.append(copy, createElement('span', 'game-tag-pill', mealTagsById[meal.id]?.[0] || '推薦'));
    return item;
}

function createJinggeRushGame() {
    const canvas = document.getElementById('jinggeRushCanvas');
    const overlay = document.getElementById('gameOverlay');
    const startButton = document.getElementById('gameStartButton');
    const restartButton = document.getElementById('gameRestartButton');
    const scoreValue = document.getElementById('gameScoreValue');
    const livesValue = document.getElementById('gameLivesValue');
    const timeValue = document.getElementById('gameTimeValue');
    const rankLabel = document.getElementById('gameRankLabel');
    const resultSummary = document.getElementById('gameResultSummary');
    const resultMeals = document.getElementById('gameRecommendedMeals');
    const overlayResults = document.getElementById('gameOverlayResults');
    const overlayRank = document.getElementById('gameOverlayRank');
    const overlaySummary = document.getElementById('gameOverlaySummary');
    const overlayRecommendedMeals = document.getElementById('gameOverlayRecommendedMeals');
    const overlayEyebrow = document.getElementById('gameOverlayEyebrow');
    const overlayTitle = document.getElementById('gameOverlayTitle');
    const overlayText = document.getElementById('gameOverlayText');
    const leftButton = document.getElementById('gameLeftButton');
    const rightButton = document.getElementById('gameRightButton');
    const gameBackdrop = document.getElementById('gameBackdrop');
    const gameCloseButton = document.getElementById('gameCloseButton');
    const openGameModalButton = document.getElementById('openGameModalButton');
    const gameExperience = document.getElementById('gameExperience');
    const controlsOverlay = gameExperience?.querySelector('.game-controls-overlay');
    const orderButton = document.getElementById('gameOrderButton');
    const menuCta = document.getElementById('gameMenuCta');

    if (!canvas || !overlay || !startButton || !restartButton) return null;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const playerImage = new Image();
    playerImage.decoding = 'async';
    playerImage.crossOrigin = 'anonymous';
    playerImage.src = 'https://formosachangcoltd.wpcomstaging.com/wp-content/uploads/2026/03/%E4%BA%AC%E7%B0%A1%E5%BA%B7-%E5%85%AC%E4%BB%94-AI%E5%AE%8C%E6%95%B4%E6%AA%94-04.png';
    playerImage.addEventListener('load', () => render());

    const backgroundImage = new Image();
    backgroundImage.decoding = 'async';
    backgroundImage.src = 'assets/game-backgrounds/jingge-rush-track.svg';
    backgroundImage.addEventListener('load', () => render());

    const itemImages = new Map();
    function loadItemImage(id, src) {
        const image = new Image();
        image.decoding = 'async';
        image.src = src;
        image.addEventListener('load', () => render());
        itemImages.set(id, image);
    }

    const itemCatalog = [
        { id: 'meal', shortLabel: '餐', asset: 'assets/game-items/meal.svg', kind: 'good', color: '#f97316', accent: '#fff7ed', value: 10, radius: 34, weight: 3 },
        { id: 'broccoli', shortLabel: '菜', asset: 'assets/game-items/broccoli.svg', kind: 'good', color: '#16a34a', accent: '#ecfdf5', value: 10, radius: 28, weight: 3 },
        { id: 'chicken', shortLabel: '雞', asset: 'assets/game-items/chicken.svg', kind: 'good', color: '#0284c7', accent: '#eff6ff', value: 12, radius: 30, weight: 2.5 },
        { id: 'fried', shortLabel: '炸', asset: 'assets/game-items/fried.svg', kind: 'bad', color: '#b45309', accent: '#fef3c7', damage: 1, radius: 30, weight: 2.2 },
        { id: 'fries', shortLabel: '薯', asset: 'assets/game-items/fries.svg', kind: 'bad', color: '#dc2626', accent: '#fef2f2', damage: 1, radius: 28, weight: 2 },
        { id: 'boba', shortLabel: '奶', asset: 'assets/game-items/boba.svg', kind: 'bad', color: '#7c3aed', accent: '#f5f3ff', damage: 1, radius: 28, weight: 2 },
        { id: 'shield', shortLabel: '盾', asset: 'assets/game-items/shield.svg', kind: 'shield', color: '#0f766e', accent: '#ecfeff', shieldMs: 5000, value: 6, radius: 30, weight: 0.8 },
    ];

    itemCatalog.forEach((item) => loadItemImage(item.id, item.asset));

    const weightedPool = itemCatalog.flatMap((item) => Array.from({ length: Math.max(1, Math.round(item.weight * 10)) }, () => item));
    const state = {
        mode: 'ready',
        score: 0,
        lives: 3,
        timeLeftMs: 40000,
        shieldMs: 0,
        moveLeft: false,
        moveRight: false,
        items: [],
        spawnTimerMs: 500,
        player: {
            x: canvas.width / 2,
            y: canvas.height - 110,
            width: 92,
            height: 96,
            speed: 430,
            tilt: 0,
            bob: 0,
        },
    };

    let rafId = 0;
    let lastFrameAt = 0;
    let audioContext = null;
    let audioUnlocked = false;
    let bgmLoopTimer = 0;
    let bgmStartAt = 0;

    function ensureAudioContext() {
        if (audioContext) return audioContext;
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return null;
        audioContext = new AudioContextCtor();
        return audioContext;
    }

    async function unlockGameAudio() {
        const ctx = ensureAudioContext();
        if (!ctx) return false;
        if (ctx.state === 'suspended') {
            try {
                await ctx.resume();
            } catch (_error) {
                return false;
            }
        }
        audioUnlocked = ctx.state === 'running';
        return audioUnlocked;
    }

    function playTone(options) {
        const ctx = ensureAudioContext();
        if (!ctx || !audioUnlocked) return;

        const {
            frequency = 440,
            duration = 0.12,
            type = 'sine',
            volume = 0.04,
            attack = 0.01,
            release = 0.08,
            detune = 0,
            when = 0,
        } = options;

        const startAt = ctx.currentTime + when;
        const endAt = startAt + duration;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startAt);
        oscillator.detune.setValueAtTime(detune, startAt);

        gainNode.gain.setValueAtTime(0.0001, startAt);
        gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), startAt + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt + release);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startAt);
        oscillator.stop(endAt + release + 0.02);
    }

    function playGameSound(kind) {
        if (!audioUnlocked) return;
        if (kind === 'start') {
            playTone({ frequency: 392, duration: 0.06, type: 'square', volume: 0.034, release: 0.04 });
            playTone({ frequency: 523.25, duration: 0.07, type: 'square', volume: 0.036, when: 0.08, release: 0.05 });
            playTone({ frequency: 659.25, duration: 0.08, type: 'square', volume: 0.04, when: 0.16, release: 0.05 });
            playTone({ frequency: 783.99, duration: 0.1, type: 'triangle', volume: 0.025, when: 0.23, release: 0.08 });
            return;
        }
        if (kind === 'good') {
            playTone({ frequency: 880, duration: 0.045, type: 'square', volume: 0.03, release: 0.025 });
            playTone({ frequency: 1174.66, duration: 0.06, type: 'square', volume: 0.026, when: 0.04, release: 0.035 });
            return;
        }
        if (kind === 'shield') {
            playTone({ frequency: 523.25, duration: 0.06, type: 'triangle', volume: 0.028, release: 0.03 });
            playTone({ frequency: 659.25, duration: 0.08, type: 'square', volume: 0.026, when: 0.05, release: 0.04 });
            playTone({ frequency: 880, duration: 0.1, type: 'triangle', volume: 0.022, when: 0.11, release: 0.08 });
            playTone({ frequency: 1046.5, duration: 0.08, type: 'sine', volume: 0.018, when: 0.16, release: 0.08 });
            return;
        }
        if (kind === 'bad') {
            playTone({ frequency: 196, duration: 0.07, type: 'sawtooth', volume: 0.03, release: 0.03 });
            playTone({ frequency: 146.83, duration: 0.09, type: 'square', volume: 0.022, when: 0.045, release: 0.04 });
            playTone({ frequency: 110, duration: 0.12, type: 'triangle', volume: 0.016, when: 0.095, release: 0.06 });
            return;
        }
        if (kind === 'end') {
            playTone({ frequency: 659.25, duration: 0.08, type: 'square', volume: 0.026, release: 0.03 });
            playTone({ frequency: 523.25, duration: 0.09, type: 'square', volume: 0.024, when: 0.09, release: 0.04 });
            playTone({ frequency: 392, duration: 0.12, type: 'triangle', volume: 0.022, when: 0.18, release: 0.08 });
            playTone({ frequency: 261.63, duration: 0.18, type: 'sine', volume: 0.016, when: 0.28, release: 0.12 });
        }
    }

    function stopGameBgm() {
        if (bgmLoopTimer) {
            window.clearTimeout(bgmLoopTimer);
            bgmLoopTimer = 0;
        }
    }

    function scheduleBgmBar(startAt) {
        const ctx = ensureAudioContext();
        if (!ctx || !audioUnlocked || state.mode !== 'playing') return;

        const beat = 0.3;
        const bassNotes = [261.63, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66, 261.63];
        const leadNotes = [659.25, 783.99, 880, 783.99, 659.25, 783.99, 987.77, 880];
        const sparkleNotes = [1046.5, 1174.66, 1046.5, 1318.51];

        bassNotes.forEach((frequency, index) => {
            playTone({
                frequency,
                when: startAt - ctx.currentTime + (index * beat),
                duration: 0.1,
                type: 'triangle',
                volume: 0.011,
                attack: 0.006,
                release: 0.045,
            });
        });

        leadNotes.forEach((frequency, index) => {
            playTone({
                frequency,
                when: startAt - ctx.currentTime + (index * beat) + 0.15,
                duration: 0.07,
                type: 'square',
                volume: 0.01,
                attack: 0.004,
                release: 0.028,
            });
        });

        sparkleNotes.forEach((frequency, index) => {
            playTone({
                frequency,
                when: startAt - ctx.currentTime + (index * beat * 2) + 0.22,
                duration: 0.055,
                type: 'sine',
                volume: 0.0055,
                attack: 0.003,
                release: 0.03,
            });
        });

        playTone({
            frequency: 196,
            when: startAt - ctx.currentTime,
            duration: beat * 8,
            type: 'sine',
            volume: 0.0035,
            attack: 0.02,
            release: 0.08,
        });
    }

    function queueGameBgm() {
        const ctx = ensureAudioContext();
        if (!ctx || !audioUnlocked || state.mode !== 'playing') return;

        const barDuration = 2.4;
        if (!bgmStartAt || bgmStartAt < ctx.currentTime) {
            bgmStartAt = ctx.currentTime + 0.05;
        }

        scheduleBgmBar(bgmStartAt);
        bgmStartAt += barDuration;
        bgmLoopTimer = window.setTimeout(() => {
            queueGameBgm();
        }, Math.max(200, (barDuration * 1000) - 180));
    }

    function startGameBgm() {
        stopGameBgm();
        bgmStartAt = 0;
        queueGameBgm();
    }

    function getViewportPreset() {
        const isDesktopLandscape = window.innerWidth >= 1024;
        if (isDesktopLandscape) {
            return {
                className: 'game-modal-landscape',
                canvasWidth: 1280,
                canvasHeight: 720,
                deviceWidth: '1220px',
                deviceHeight: '760px',
                deviceRadius: '34px',
                canvasAspectRatio: '1280 / 720',
                modalGap: '0.9rem',
                modalPadding: '1rem',
                controlHeight: '3.3rem',
                statLabelSize: '0.76rem',
                statValueSize: '1.7rem',
                statPaddingY: '0.78rem',
                statPaddingX: '0.5rem',
                playerWidth: 112,
                playerHeight: 116,
            };
        }
        return {
            className: 'game-modal-portrait',
            canvasWidth: 720,
            canvasHeight: 920,
            deviceWidth: '400px',
            deviceHeight: '840px',
            deviceRadius: '32px',
            canvasAspectRatio: '720 / 920',
            modalGap: '0.75rem',
            modalPadding: '0.9rem',
            controlHeight: '3rem',
            statLabelSize: '0.68rem',
            statValueSize: '1.35rem',
            statPaddingY: '0.7rem',
            statPaddingX: '0.4rem',
            playerWidth: 92,
            playerHeight: 96,
        };
    }

    function resizeGameViewport() {
        const preset = getViewportPreset();
        const previousWidth = canvas.width;
        const previousHeight = canvas.height;
        const widthRatio = previousWidth ? preset.canvasWidth / previousWidth : 1;
        const heightRatio = previousHeight ? preset.canvasHeight / previousHeight : 1;

        document.body.classList.toggle('game-modal-landscape', preset.className === 'game-modal-landscape');
        document.body.style.setProperty('--game-device-width', preset.deviceWidth);
        document.body.style.setProperty('--game-device-height', preset.deviceHeight);
        document.body.style.setProperty('--game-device-radius', preset.deviceRadius);
        document.body.style.setProperty('--game-canvas-aspect-ratio', preset.canvasAspectRatio);
        document.body.style.setProperty('--game-modal-gap', preset.modalGap);
        document.body.style.setProperty('--game-modal-padding', preset.modalPadding);
        document.body.style.setProperty('--game-control-height', preset.controlHeight);
        document.body.style.setProperty('--game-stat-label-size', preset.statLabelSize);
        document.body.style.setProperty('--game-stat-value-size', preset.statValueSize);
        document.body.style.setProperty('--game-stat-padding-y', preset.statPaddingY);
        document.body.style.setProperty('--game-stat-padding-x', preset.statPaddingX);

        if (canvas.width !== preset.canvasWidth || canvas.height !== preset.canvasHeight) {
            canvas.width = preset.canvasWidth;
            canvas.height = preset.canvasHeight;
            state.items = state.items.map((item) => ({
                ...item,
                x: item.x * widthRatio,
                y: item.y * heightRatio,
            }));
        }

        state.player.width = preset.playerWidth;
        state.player.height = preset.playerHeight;
        state.player.y = canvas.height - (preset.className === 'game-modal-landscape' ? 96 : 110);
        state.player.x = Math.max(state.player.width / 2 + 18, Math.min(canvas.width - state.player.width / 2 - 18, state.player.x * widthRatio));
    }

    function drawBackdropLayer(alpha, offsetX, offsetY) {
        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = '#dff1dd';
        context.beginPath();
        context.moveTo(0, canvas.height * 0.62 + offsetY);
        context.bezierCurveTo(canvas.width * 0.14, canvas.height * 0.54 + offsetY, canvas.width * 0.3, canvas.height * 0.58 + offsetY, canvas.width * 0.46, canvas.height * 0.64 + offsetY);
        context.bezierCurveTo(canvas.width * 0.62, canvas.height * 0.7 + offsetY, canvas.width * 0.78, canvas.height * 0.52 + offsetY, canvas.width, canvas.height * 0.61 + offsetY);
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.closePath();
        context.fill();

        context.fillStyle = '#c4e5bb';
        context.beginPath();
        context.ellipse(canvas.width * (0.16 + offsetX), canvas.height * 0.79, canvas.width * 0.1, canvas.height * 0.05, 0, 0, Math.PI * 2);
        context.ellipse(canvas.width * (0.82 - offsetX), canvas.height * 0.72, canvas.width * 0.1, canvas.height * 0.05, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    function drawSideKiosk(x, y, scale, tint) {
        context.save();
        context.translate(x, y);
        context.scale(scale, scale);
        context.fillStyle = '#fff8ef';
        context.beginPath();
        context.roundRect(-44, -28, 88, 56, 16);
        context.fill();
        context.fillStyle = tint;
        context.beginPath();
        context.roundRect(-28, -10, 56, 18, 9);
        context.fill();
        context.fillStyle = '#f6b37f';
        context.beginPath();
        context.roundRect(-34, -36, 68, 12, 6);
        context.fill();
        context.fillStyle = '#7f5c42';
        context.beginPath();
        context.roundRect(6, -60, 10, 36, 5);
        context.fill();
        context.fillStyle = '#73bf78';
        context.beginPath();
        context.arc(-10, -56, 20, Math.PI, 0, false);
        context.arc(12, -56, 18, Math.PI, 0, false);
        context.closePath();
        context.fill();
        context.restore();
    }

    function syncHud() {
        scoreValue.textContent = String(state.score);
        livesValue.textContent = String(Math.max(0, state.lives));
        timeValue.textContent = String(Math.ceil(state.timeLeftMs / 1000));
    }

    function setOverlay(isVisible, eyebrow, title, text, showRestart = false) {
        overlay.classList.toggle('is-hidden', !isVisible);
        controlsOverlay?.classList.toggle('is-hidden-by-overlay', isVisible);
        if (overlayEyebrow) overlayEyebrow.textContent = eyebrow;
        if (overlayTitle) overlayTitle.textContent = title;
        if (overlayText) overlayText.textContent = text;
        restartButton.classList.toggle('hidden', !showRestart);
    }

    function resetResultsCopy() {
        rankLabel.textContent = '外送準備中';
        resultSummary.textContent = '完成一局後，這裡會顯示你的健康外送稱號與推薦方向。';
        resultMeals.innerHTML = '<p class="game-placeholder-text">推薦餐盒將在遊戲結束後出現。</p>';
        if (overlayRank) overlayRank.textContent = '外送準備中';
        if (overlaySummary) overlaySummary.textContent = '完成一局後，這裡會顯示適合你的餐盒推薦。';
        if (overlayRecommendedMeals) overlayRecommendedMeals.innerHTML = '<p class="game-placeholder-text">推薦餐盒將在遊戲結束後出現。</p>';
        overlayResults?.classList.add('hidden');
    }

    function renderMeals(meals) {
        resultMeals.replaceChildren(...meals.map(createRecommendedMealItem));
        overlayRecommendedMeals?.replaceChildren(...meals.map(createRecommendedMealItem));
    }

    function resetGame() {
        resizeGameViewport();
        state.mode = 'ready';
        state.score = 0;
        state.lives = 3;
        state.timeLeftMs = 40000;
        state.shieldMs = 0;
        state.items = [];
        state.spawnTimerMs = 500;
        state.moveLeft = false;
        state.moveRight = false;
        state.player.x = canvas.width / 2;
        syncHud();
        resetResultsCopy();
        setOverlay(true, '準備出發', '接住健康餐，避開炸物與含糖飲', '桌機可用左右方向鍵，手機可用下方按鈕。40 秒內拿越高分，結束後就能看推薦餐盒。', false);
        render();
    }

    function openGameModal() {
        resizeGameViewport();
        document.body.classList.add('game-modal-open');
        gameBackdrop?.classList.remove('hidden');
        gameCloseButton?.classList.remove('hidden');
        render();
    }

    function closeGameModal() {
        stopLoop();
        stopGameBgm();
        document.body.classList.remove('game-modal-open');
        gameBackdrop?.classList.add('hidden');
        gameCloseButton?.classList.add('hidden');
        resetGame();
    }

    async function startGame() {
        resizeGameViewport();
        await unlockGameAudio();
        openGameModal();
        state.mode = 'playing';
        state.score = 0;
        state.lives = 3;
        state.timeLeftMs = 40000;
        state.shieldMs = 0;
        state.items = [];
        state.spawnTimerMs = 250;
        state.player.x = canvas.width / 2;
        state.player.y = canvas.height - (document.body.classList.contains('game-modal-landscape') ? 96 : 110);
        syncHud();
        setOverlay(false, '', '', '', false);
        playGameSound('start');
        startGameBgm();
        startLoop();

        trackEvent('game_start', { game_name: 'jingge_rush' });
    }

    function endGame(reason) {
        state.mode = 'gameover';
        stopLoop();
        stopGameBgm();
        syncHud();
        playGameSound('end');
        const result = chooseMealsByScore(state.score);
        rankLabel.textContent = result.rank;
        resultSummary.textContent = result.summary;
        if (overlayRank) overlayRank.textContent = result.rank;
        if (overlaySummary) overlaySummary.textContent = result.summary;
        renderMeals(result.meals);
        overlayResults?.classList.remove('hidden');
        const endingCopy = reason === 'lives'
            ? '這回先被高熱量炸物攔下了，下次專注接住健康食材就能更快衝高分。'
            : '時間到，辛苦了。現在來看看你的分數對應哪種健康餐盒。';
        setOverlay(true, '本局結算', result.rank, endingCopy, true);

        trackEvent('game_finish', {
            game_name: 'jingge_rush',
            score: state.score,
            rank: result.rank,
            reason: reason
        });
    }

    function spawnItem() {
        const type = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        state.items.push({
            ...type,
            x: 40 + Math.random() * (canvas.width - 80),
            y: -40,
            speed: 190 + Math.random() * 120 + (40000 - state.timeLeftMs) / 300,
        });
    }

    function circleRectCollision(item) {
        const halfWidth = state.player.width / 2;
        const halfHeight = state.player.height / 2;
        const nearestX = Math.max(state.player.x - halfWidth, Math.min(item.x, state.player.x + halfWidth));
        const nearestY = Math.max(state.player.y - halfHeight, Math.min(item.y, state.player.y + halfHeight));
        const dx = item.x - nearestX;
        const dy = item.y - nearestY;
        return (dx * dx) + (dy * dy) <= item.radius * item.radius;
    }

    function collectItem(item) {
        if (item.kind === 'good') {
            state.score += item.value;
            playGameSound('good');
            return;
        }
        if (item.kind === 'shield') {
            state.score += item.value;
            state.shieldMs = Math.max(state.shieldMs, item.shieldMs);
            playGameSound('shield');
            return;
        }
        if (state.shieldMs > 0) {
            playGameSound('shield');
            return;
        }
        state.lives -= item.damage || 1;
        playGameSound('bad');
        if (state.lives <= 0) endGame('lives');
    }

    function update(dtMs) {
        if (state.mode !== 'playing') return;

        state.timeLeftMs -= dtMs;
        state.shieldMs = Math.max(0, state.shieldMs - dtMs);
        state.spawnTimerMs -= dtMs;

        if (state.spawnTimerMs <= 0) {
            spawnItem();
            state.spawnTimerMs = Math.max(180, 520 - (40000 - state.timeLeftMs) / 120);
        }

        const direction = (state.moveRight ? 1 : 0) - (state.moveLeft ? 1 : 0);
        state.player.x += direction * state.player.speed * (dtMs / 1000);
        state.player.x = Math.max(state.player.width / 2 + 18, Math.min(canvas.width - state.player.width / 2 - 18, state.player.x));

        state.items.forEach((item) => {
            item.y += item.speed * (dtMs / 1000);
        });

        const targetTilt = direction * (document.body.classList.contains('game-modal-landscape') ? 0.26 : 0.18);
        state.player.tilt += (targetTilt - state.player.tilt) * Math.min(1, (dtMs / 1000) * 7);
        state.player.bob += dtMs * 0.006;

        state.items = state.items.filter((item) => {
            if (circleRectCollision(item)) {
                collectItem(item);
                return false;
            }
            return item.y < canvas.height + 80;
        });

        syncHud();

        if (state.timeLeftMs <= 0) {
            state.timeLeftMs = 0;
            endGame('time');
        }
    }

    function drawBackground() {
        context.fillStyle = '#fff7ed';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
            const imageRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let drawX = 0;
            let drawY = 0;

            if (imageRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imageRatio;
                drawX = (canvas.width - drawWidth) / 2;
            } else {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imageRatio;
                drawY = (canvas.height - drawHeight) / 2;
            }
            context.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight);
        }

        drawBackdropLayer(0.42, 0.02, 24);
        drawBackdropLayer(0.62, 0.01, 0);
        drawSideKiosk(canvas.width * 0.12, canvas.height * 0.52, document.body.classList.contains('game-modal-landscape') ? 1.16 : 0.84, '#8FD2A7');
        drawSideKiosk(canvas.width * 0.88, canvas.height * 0.54, document.body.classList.contains('game-modal-landscape') ? 1.22 : 0.88, '#F6D39A');

        const horizonGlow = context.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
        horizonGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
        horizonGlow.addColorStop(1, 'rgba(255, 246, 237, 0.48)');
        context.fillStyle = horizonGlow;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = 'rgba(255, 255, 255, 0.44)';
        context.lineWidth = document.body.classList.contains('game-modal-landscape') ? 12 : 9;
        for (let i = 0; i < 4; i += 1) {
            const laneX = canvas.width * (0.32 + (i * 0.12));
            context.beginPath();
            context.moveTo(laneX, canvas.height * 0.54);
            context.lineTo(laneX + ((i - 1.5) * 18), canvas.height);
            context.stroke();
        }
    }

    function drawPlayer() {
        const bobOffset = Math.sin(state.player.bob) * 3.5;
        const x = state.player.x - (state.player.width / 2);
        const y = state.player.y - (state.player.height / 2) + bobOffset;

        context.save();
        context.fillStyle = 'rgba(110, 83, 56, 0.18)';
        context.beginPath();
        context.ellipse(state.player.x, state.player.y + (state.player.height * 0.34), state.player.width * 0.34, state.player.height * 0.12, 0, 0, Math.PI * 2);
        context.fill();

        if (state.shieldMs > 0) {
            context.strokeStyle = 'rgba(14, 165, 233, 0.7)';
            context.lineWidth = 8;
            context.beginPath();
            context.arc(state.player.x, state.player.y + bobOffset, 62, 0, Math.PI * 2);
            context.stroke();
        }

        context.translate(state.player.x, state.player.y + bobOffset);
        context.rotate(state.player.tilt);
        context.translate(-state.player.x, -(state.player.y + bobOffset));

        context.fillStyle = '#fb923c';
        context.beginPath();
        context.roundRect(x, y + 52, state.player.width, 26, 14);
        context.fill();

        if (playerImage.complete) {
            context.drawImage(playerImage, x, y - 4, state.player.width, state.player.height);
        } else {
            context.fillStyle = '#f97316';
            context.beginPath();
            context.arc(state.player.x, state.player.y - 4 + bobOffset, 34, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();
    }

    function drawItem(item) {
        context.save();
        context.shadowColor = `${item.color}33`;
        context.shadowBlur = 22;
        context.shadowOffsetY = 8;
        context.fillStyle = item.accent;
        context.beginPath();
        context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = item.color;
        context.stroke();
        const itemImage = itemImages.get(item.id);
        if (itemImage && itemImage.complete && itemImage.naturalWidth > 0) {
            const imageSize = item.radius * 1.6;
            context.drawImage(itemImage, item.x - (imageSize / 2), item.y - (imageSize / 2), imageSize, imageSize);
        } else {
            context.fillStyle = item.color;
            context.font = `bold ${Math.max(20, item.radius)}px sans-serif`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(item.shortLabel, item.x, item.y + 1);
        }
        context.restore();
    }

    function drawFooterTips() {
        context.save();
        context.fillStyle = 'rgba(15, 23, 42, 0.74)';
        const isLandscape = document.body.classList.contains('game-modal-landscape');
        context.font = isLandscape ? '14px sans-serif' : '18px sans-serif';
        const footerY = canvas.height - (isLandscape ? 54 : 28);
        context.textAlign = 'left';
        context.fillText('接住健康食材，閃開炸物與含糖飲', 28, footerY);
        context.textAlign = 'right';
        context.fillText(state.shieldMs > 0 ? '護盾中' : '保冷箱可開護盾', canvas.width - 28, footerY);
        context.restore();
    }

    function render() {
        drawBackground();
        state.items.forEach(drawItem);
        drawPlayer();
        drawFooterTips();
    }

    function frame(now) {
        const dtMs = Math.min(32, now - (lastFrameAt || now));
        lastFrameAt = now;
        update(dtMs);
        render();
        if (state.mode === 'playing') {
            rafId = window.requestAnimationFrame(frame);
        }
    }

    function startLoop() {
        stopLoop();
        lastFrameAt = 0;
        rafId = window.requestAnimationFrame(frame);
    }

    function stopLoop() {
        if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
        }
    }

    function setDirection(direction, active) {
        if (direction === 'left') state.moveLeft = active;
        if (direction === 'right') state.moveRight = active;
    }

    function bindPress(button, direction) {
        if (!button) return;
        const press = (event) => {
            event.preventDefault();
            setDirection(direction, true);
        };
        const release = () => setDirection(direction, false);
        button.addEventListener('pointerdown', press);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('pointercancel', release);
    }

    bindPress(leftButton, 'left');
    bindPress(rightButton, 'right');

    window.addEventListener('resize', () => {
        resizeGameViewport();
        if (state.mode !== 'playing') {
            render();
        }
    });

    openGameModalButton?.addEventListener('click', openGameModal);
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    gameCloseButton?.addEventListener('click', closeGameModal);
    gameBackdrop?.addEventListener('click', closeGameModal);
    orderButton?.addEventListener('click', () => toggleModal(true));
    menuCta?.addEventListener('click', () => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') setDirection('left', true);
        if (event.key === 'ArrowRight') setDirection('right', true);
        if (event.key === 'Escape' && document.body.classList.contains('game-modal-open')) closeGameModal();
    });
    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft') setDirection('left', false);
        if (event.key === 'ArrowRight') setDirection('right', false);
    });

    window.render_game_to_text = () => JSON.stringify({
        mode: state.mode,
        score: state.score,
        lives: state.lives,
        secondsLeft: Math.ceil(state.timeLeftMs / 1000),
        items: state.items.map((item) => item.id),
    });
    window.advanceTime = async (ms) => {
        const frames = Math.max(1, Math.round(ms / (1000 / 60)));
        for (let index = 0; index < frames; index += 1) {
            update(1000 / 60);
        }
        render();
    };

    resizeGameViewport();
    resetGame();
    return { startGame, closeGameModal };
}

function chooseQuizResult(score) {
    const light = [...menuData].sort((a, b) => a.calories - b.calories);
    const protein = [...menuData].sort((a, b) => b.protein - a.protein);
    const balanced = [...menuData]
        .sort((a, b) => (Math.abs(a.calories - 500) + Math.abs(a.protein - 28)) - (Math.abs(b.calories - 500) + Math.abs(b.protein - 28)));

    if (score >= 9) {
        return {
            rank: '健康直覺領航員',
            summary: '你對熱量與均衡搭配很有概念，適合選擇高蛋白又有飽足感的主力餐盒。',
            meals: protein.slice(0, 2),
        };
    }
    if (score >= 6) {
        return {
            rank: '均衡感不錯',
            summary: '你已經抓到大方向，選擇兼顧蛋白質、熱量與口味的餐盒會最適合你。',
            meals: balanced.slice(0, 2),
        };
    }
    return {
        rank: '健康節奏養成中',
        summary: '從清爽、負擔較低的餐盒開始最容易建立習慣，再慢慢找到最適合自己的份量。',
        meals: light.slice(0, 2),
    };
}

function createCaloriesQuizGame() {
    const openButton = document.getElementById('openQuizModalButton');
    const modal = document.getElementById('quizGameExperience');
    const backdrop = document.getElementById('quizGameBackdrop');
    const closeButton = document.getElementById('quizGameCloseButton');
    const startButton = document.getElementById('quizStartButton');
    const nextButton = document.getElementById('quizNextButton');
    const restartButton = document.getElementById('quizRestartButton');
    const progressLabel = document.getElementById('quizProgressLabel');
    const scoreLabel = document.getElementById('quizScoreLabel');
    const progressFill = document.getElementById('quizProgressFill');
    const eyebrow = document.getElementById('quizQuestionEyebrow');
    const title = document.getElementById('quizQuestionTitle');
    const text = document.getElementById('quizQuestionText');
    const choices = document.getElementById('quizChoices');
    const feedback = document.getElementById('quizFeedback');
    const feedbackTitle = document.getElementById('quizFeedbackTitle');
    const feedbackText = document.getElementById('quizFeedbackText');
    const resultPanel = document.getElementById('quizResultPanel');
    const resultRank = document.getElementById('quizResultRank');
    const resultSummary = document.getElementById('quizResultSummary');
    const resultMeals = document.getElementById('quizResultMeals');

    if (!openButton || !modal || !startButton || !nextButton || !restartButton || !choices) return null;

    const state = {
        mode: 'intro',
        index: 0,
        score: 0,
        selected: null,
        questions: [],
        setIndex: 0,
        recentSetHistory: [],
    };
    const quizMusic = {
        context: null,
        masterGain: null,
        ambienceGain: null,
        stepTimer: null,
        stopTimer: null,
        stepIndex: 0,
        isPlaying: false,
    };

    const melody = [
        { note: 659.25, length: 0.72, bass: 220.0, accent: true },
        { note: 783.99, length: 0.56, bass: 220.0 },
        { note: 880.0, length: 0.5, bass: 246.94 },
        { note: 783.99, length: 0.5, bass: 246.94 },
        { note: 698.46, length: 0.72, bass: 196.0, accent: true },
        { note: 783.99, length: 0.52, bass: 196.0 },
        { note: 880.0, length: 0.5, bass: 246.94 },
        { note: 987.77, length: 0.82, bass: 246.94, accent: true },
        { note: 880.0, length: 0.52, bass: 220.0 },
        { note: 783.99, length: 0.52, bass: 220.0 },
        { note: 698.46, length: 0.52, bass: 196.0 },
        { note: 659.25, length: 0.9, bass: 196.0, accent: true },
    ];

    function ensureQuizMusicContext() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!quizMusic.context) {
            quizMusic.context = new AudioCtx();
            quizMusic.masterGain = quizMusic.context.createGain();
            quizMusic.masterGain.gain.value = 0.055;
            quizMusic.masterGain.connect(quizMusic.context.destination);

            quizMusic.ambienceGain = quizMusic.context.createGain();
            quizMusic.ambienceGain.gain.value = 0.018;
            quizMusic.ambienceGain.connect(quizMusic.masterGain);
        }
        return quizMusic.context;
    }

    function scheduleQuizTone(frequency, duration, when) {
        const context = ensureQuizMusicContext();
        if (!context || !quizMusic.masterGain) return;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        const filter = context.createBiquadFilter();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, when);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, when);
        gainNode.gain.setValueAtTime(0.0001, when);
        gainNode.gain.linearRampToValueAtTime(0.24, when + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, when + duration);
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(quizMusic.masterGain);
        oscillator.start(when);
        oscillator.stop(when + duration + 0.02);
    }

    function scheduleQuizBassPulse(frequency, when, accent = false) {
        const context = ensureQuizMusicContext();
        if (!context || !quizMusic.masterGain) return;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        const filter = context.createBiquadFilter();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, when);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(accent ? 220 : 180, when);
        gainNode.gain.setValueAtTime(0.0001, when);
        gainNode.gain.linearRampToValueAtTime(accent ? 0.14 : 0.09, when + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(quizMusic.masterGain);
        oscillator.start(when);
        oscillator.stop(when + 0.22);
    }

    function ensureQuizAmbience() {
        const context = ensureQuizMusicContext();
        if (!context || !quizMusic.ambienceGain || quizMusic.stopTimer) return;
        const pad = context.createOscillator();
        const padGain = context.createGain();
        pad.type = 'sine';
        pad.frequency.setValueAtTime(261.63, context.currentTime);
        padGain.gain.setValueAtTime(0.0001, context.currentTime);
        padGain.gain.linearRampToValueAtTime(1, context.currentTime + 0.6);
        pad.connect(padGain);
        padGain.connect(quizMusic.ambienceGain);
        pad.start();
        quizMusic.stopTimer = { pad, padGain };
    }

    async function startQuizMusic() {
        const context = ensureQuizMusicContext();
        if (!context || quizMusic.isPlaying) return;
        if (context.state === 'suspended') {
            try {
                await context.resume();
            } catch (_error) {
                return;
            }
        }
        ensureQuizAmbience();
        quizMusic.isPlaying = true;
        quizMusic.stepIndex = 0;

        const playStep = () => {
            if (!quizMusic.isPlaying || !quizMusic.context) return;
            const step = melody[quizMusic.stepIndex % melody.length];
            const duration = 0.26 * step.length;
            const when = quizMusic.context.currentTime + 0.02;
            scheduleQuizTone(step.note, duration, when);
            scheduleQuizBassPulse(step.bass, when, Boolean(step.accent));
            quizMusic.stepIndex += 1;
        };

        playStep();
        quizMusic.stepTimer = window.setInterval(playStep, 340);
    }

    function stopQuizMusic() {
        quizMusic.isPlaying = false;
        if (quizMusic.stepTimer) {
            window.clearInterval(quizMusic.stepTimer);
            quizMusic.stepTimer = null;
        }
        if (quizMusic.stopTimer?.pad && quizMusic.stopTimer?.padGain && quizMusic.context) {
            const when = quizMusic.context.currentTime;
            quizMusic.stopTimer.padGain.gain.cancelScheduledValues(when);
            quizMusic.stopTimer.padGain.gain.setValueAtTime(quizMusic.stopTimer.padGain.gain.value || 0.018, when);
            quizMusic.stopTimer.padGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.25);
            quizMusic.stopTimer.pad.stop(when + 0.3);
        }
        quizMusic.stopTimer = null;
    }

    function cloneQuestionSet(set) {
        return set.map((question) => ({
            ...question,
            choices: question.choices.map((choice) => ({ ...choice })),
        }));
    }

    function chooseRandomQuestionSet() {
        const totalSets = quizQuestionSets.length;
        const recentBlocked = totalSets > 1 ? state.recentSetHistory.slice(-1) : [];
        const candidateIndexes = [];
        for (let index = 0; index < totalSets; index += 1) {
            if (!recentBlocked.includes(index)) {
                candidateIndexes.push(index);
            }
        }

        const pool = candidateIndexes.length > 0
            ? candidateIndexes
            : Array.from({ length: totalSets }, (_unused, index) => index);

        state.setIndex = pool[Math.floor(Math.random() * pool.length)];
        state.questions = cloneQuestionSet(quizQuestionSets[state.setIndex]);
        state.recentSetHistory.push(state.setIndex);
        if (state.recentSetHistory.length > 3) {
            state.recentSetHistory = state.recentSetHistory.slice(-3);
        }
    }

    function syncProgress() {
        const total = state.questions.length || 5;
        progressLabel.textContent = `第 ${Math.min(state.index + 1, total)} 題 / ${total}`;
        scoreLabel.textContent = `${state.score} 分`;
        const completed = state.mode === 'result' ? total : state.index;
        progressFill.style.width = `${(completed / total) * 100}%`;
    }

    function renderMealSuggestions(meals) {
        resultMeals.replaceChildren(...meals.map(createRecommendedMealItem));
    }

    function resetQuiz(shouldReroll = true) {
        stopQuizMusic();
        if (shouldReroll || state.questions.length === 0) {
            chooseRandomQuestionSet();
        }
        state.mode = 'intro';
        state.index = 0;
        state.score = 0;
        state.selected = null;
        eyebrow.textContent = `隨機題組 ${state.setIndex + 1} / ${quizQuestionSets.length}`;
        title.textContent = '康妹出題中，測測看你的熱量直覺';
        text.textContent = '每次會隨機抽出 1 套共 5 題，選出你認為更貼近健康直覺的答案，最後會看到你的作答屬性與推薦餐盒。';
        choices.replaceChildren();
        feedback.classList.add('hidden');
        resultPanel.classList.add('hidden');
        startButton.classList.remove('hidden');
        nextButton.classList.add('hidden');
        restartButton.classList.add('hidden');
        progressFill.style.width = '0%';
        syncProgress();
    }

    function showResult() {
        stopQuizMusic();
        const result = chooseQuizResult(state.score);
        state.mode = 'result';
        eyebrow.textContent = '快問快答結果';
        title.textContent = '你目前的健康直覺屬性';
        text.textContent = '以下是依照你的作答風格，整理出的推薦方向與適合餐盒。';
        choices.replaceChildren();
        feedback.classList.add('hidden');
        resultPanel.classList.remove('hidden');
        resultRank.textContent = result.rank;
        resultSummary.textContent = result.summary;
        renderMealSuggestions(result.meals);
        startButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
        progressFill.style.width = '100%';

        trackEvent('quiz_finish', {
            score: state.score,
            rank: result.rank,
            set_index: state.setIndex
        });
    }

    function selectChoice(index) {
        if (state.mode !== 'playing' || state.selected !== null) return;
        state.selected = index;
        const question = state.questions[state.index];
        const chosen = question.choices[index];
        state.score += chosen.points;

        Array.from(choices.children).forEach((button, buttonIndex) => {
            button.disabled = true;
            button.classList.toggle('is-selected', buttonIndex === index);
            button.classList.toggle('is-dimmed', buttonIndex !== index);
        });

        feedback.classList.remove('hidden');
        feedbackTitle.textContent = chosen.points > 0 ? '方向正確' : '可以再調整';
        feedbackText.textContent = chosen.note;

        if (state.index === state.questions.length - 1) {
            showResult();
        } else {
            nextButton.classList.remove('hidden');
        }
        syncProgress();
    }

    async function renderQuestion() {
        const question = state.questions[state.index];
        state.mode = 'playing';
        state.selected = null;
        await startQuizMusic();
        eyebrow.textContent = question.eyebrow;
        title.textContent = question.title;
        text.textContent = question.text;
        feedback.classList.add('hidden');
        resultPanel.classList.add('hidden');
        startButton.classList.add('hidden');
        nextButton.classList.add('hidden');
        restartButton.classList.add('hidden');

        choices.replaceChildren(...question.choices.map((choice, index) => {
            const button = createElement('button', 'quiz-choice-button', choice.label);
            button.type = 'button';
            button.addEventListener('click', () => selectChoice(index));
            return button;
        }));
        syncProgress();
    }

    function openQuizModal() {
        document.body.classList.add('quiz-modal-open');
        modal.classList.remove('hidden');
        backdrop?.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        resetQuiz(true);
    }

    function closeQuizModal() {
        stopQuizMusic();
        document.body.classList.remove('quiz-modal-open');
        modal.classList.add('hidden');
        backdrop?.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        resetQuiz(false);
    }

    openButton.addEventListener('click', openQuizModal);
    closeButton?.addEventListener('click', closeQuizModal);
    backdrop?.addEventListener('click', closeQuizModal);
    startButton.addEventListener('click', renderQuestion);
    nextButton.addEventListener('click', () => {
        state.index += 1;
        renderQuestion();
    });
    restartButton.addEventListener('click', () => resetQuiz(true));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('quiz-modal-open')) {
            closeQuizModal();
        }
    });

    window.render_quiz_to_text = () => JSON.stringify({
        mode: state.mode,
        setIndex: state.setIndex,
        index: state.index,
        score: state.score,
        prompt: title.textContent,
        choices: Array.from(choices.querySelectorAll('button')).map((button) => button.textContent.trim()),
    });

    resetQuiz();
    return { openQuizModal, closeQuizModal };
}

function applyWeatherTheme(theme, label) {
    const body = document.body;
    WEATHER_THEME_CLASSES.forEach((className) => body.classList.remove(className));
    body.classList.add(`weather-${theme}`);
    body.dataset.weatherTheme = theme;
    renderWeatherChipIcon(theme);
    if (weatherThemeLabel && label) {
        const titleNode = weatherThemeLabel.querySelector('.hero-weather-chip-title');
        if (titleNode) {
            titleNode.textContent = label;
        } else {
            weatherThemeLabel.textContent = label;
        }
    }
}

function syncThemeSwitcherState() {
    themeSwitcherButtons.forEach((button) => {
        const mode = button.dataset.themeMode;
        const label = button.dataset.themeLabel || '';
        const isActive = manualWeatherTheme
            ? (mode === manualWeatherTheme.theme && label === manualWeatherTheme.label)
            : mode === 'auto';
        button.classList.toggle('is-active', isActive);
    });
}

function setWeatherThemeSelection(selection) {
    if (!selection) return;
    applyWeatherTheme(selection.theme, selection.label);
    syncThemeSwitcherState();

    trackEvent('theme_change', {
        theme_mode: selection.theme,
        theme_label: selection.label
    });
}

function closeThemeSwitcher() {
    if (!themeSwitcherPanel || !themeSwitcherToggle || !themeSwitcher) return;
    themeSwitcherPanel.classList.add('hidden');
    themeSwitcherToggle.setAttribute('aria-expanded', 'false');
    themeSwitcher.classList.remove('is-open');
}

function openThemeSwitcher() {
    if (!themeSwitcherPanel || !themeSwitcherToggle || !themeSwitcher) return;
    themeSwitcherPanel.classList.remove('hidden');
    themeSwitcherToggle.setAttribute('aria-expanded', 'true');
    themeSwitcher.classList.add('is-open');
}

function toggleThemeSwitcher() {
    if (!themeSwitcherPanel) return;
    const isHidden = themeSwitcherPanel.classList.contains('hidden');
    if (isHidden) {
        openThemeSwitcher();
    } else {
        closeThemeSwitcher();
    }
}

function fallbackWeatherTheme() {
    const taipeiNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const hour = taipeiNow.getHours();
    return {
        theme: (hour >= 18 || hour < 6) ? 'night' : 'sunny',
        label: (hour >= 18 || hour < 6) ? '靜藍夜幕' : '晴光暖晨',
    };
}

function resolveDayPhase(currentTime, sunriseText, sunsetText) {
    const current = new Date(currentTime);
    const sunrise = sunriseText ? new Date(sunriseText) : null;
    const sunset = sunsetText ? new Date(sunsetText) : null;
    if (!sunrise || !sunset || Number.isNaN(sunrise.getTime()) || Number.isNaN(sunset.getTime()) || Number.isNaN(current.getTime())) {
        const hour = current.getHours();
        if (hour >= 17 && hour < 19) return 'dusk';
        if (hour >= 5 && hour < 7) return 'dawn';
        return (hour >= 19 || hour < 5) ? 'night' : 'day';
    }

    const dawnEnd = sunrise.getTime() + (75 * 60 * 1000);
    const duskStart = sunset.getTime() - (75 * 60 * 1000);
    if (current.getTime() < sunrise.getTime() || current.getTime() > sunset.getTime()) return 'night';
    if (current.getTime() <= dawnEnd) return 'dawn';
    if (current.getTime() >= duskStart) return 'dusk';
    return 'day';
}

function resolveWeatherTheme(current, daily) {
    const weatherCode = Number(current?.weather_code ?? 0);
    const isDay = Number(current?.is_day ?? 1) === 1;
    const cloudCover = Number(current?.cloud_cover ?? 0);
    const temperature = Number(current?.temperature_2m ?? current?.apparent_temperature ?? 24);
    const precipitation = Number(current?.precipitation ?? 0)
        + Number(current?.rain ?? 0)
        + Number(current?.showers ?? 0)
        + Number(current?.snowfall ?? 0);
    const dayPhase = resolveDayPhase(current?.time, daily?.sunrise?.[0], daily?.sunset?.[0]);

    const rainyCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]);
    const cloudyCodes = new Set([2, 3, 45, 48]);

    if (!isDay || dayPhase === 'night') {
        return { theme: 'night', label: temperature >= 28 ? '暖夜海風' : '靜藍夜幕' };
    }

    if (precipitation > 0.1 || rainyCodes.has(weatherCode)) {
        if (dayPhase === 'dawn') return { theme: 'rainy', label: '晨雨微霧' };
        if (dayPhase === 'dusk') return { theme: 'rainy', label: '暮雨輕幕' };
        return { theme: 'rainy', label: temperature <= 20 ? '涼雨青灰' : '雨幕微涼' };
    }

    if (cloudCover >= 65 || cloudyCodes.has(weatherCode)) {
        if (dayPhase === 'dawn') return { theme: 'cloudy', label: '晨霧薄光' };
        if (dayPhase === 'dusk') return { theme: 'cloudy', label: '暮雲緩光' };
        return { theme: 'cloudy', label: temperature <= 20 ? '涼霧雲層' : '雲影漫行' };
    }

    if (dayPhase === 'dawn') return { theme: 'sunny', label: '晴光暖晨' };
    if (dayPhase === 'dusk') return { theme: 'sunny', label: '暮金餘暉' };
    if (temperature >= 30) return { theme: 'sunny', label: '盛夏晴朗' };
    if (temperature <= 20) return { theme: 'sunny', label: '清朗微光' };
    return { theme: 'sunny', label: '日晴輕暖' };
}

function fallbackWeatherTheme() {
    const taipeiNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    const hour = taipeiNow.getHours();
    return {
        theme: (hour >= 18 || hour < 6) ? 'night' : (hour < 8 ? 'dawn' : 'sunny'),
        label: (hour >= 18 || hour < 6) ? '靜藍夜幕' : (hour < 8 ? '晨曦薄霧' : '清朗微光'),
    };
}

function resolveWeatherTheme(current, daily) {
    const weatherCode = Number(current?.weather_code ?? 0);
    const isDay = Number(current?.is_day ?? 1) === 1;
    const cloudCover = Number(current?.cloud_cover ?? 0);
    const temperature = Number(current?.temperature_2m ?? current?.apparent_temperature ?? 24);
    const precipitation = Number(current?.precipitation ?? 0)
        + Number(current?.rain ?? 0)
        + Number(current?.showers ?? 0)
        + Number(current?.snowfall ?? 0);
    const dayPhase = resolveDayPhase(current?.time, daily?.sunrise?.[0], daily?.sunset?.[0]);

    const rainyCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]);
    const mistCodes = new Set([2, 45, 48]);

    if (!isDay || dayPhase === 'night') {
        return { theme: 'night', label: temperature >= 28 ? '暖夜海風' : '靜藍夜幕' };
    }

    if (precipitation > 0.1 || rainyCodes.has(weatherCode)) {
        if (dayPhase === 'dawn') return { theme: 'rainy', label: '晨雨微霧' };
        if (dayPhase === 'dusk') return { theme: 'rainy', label: '暮雨輕幕' };
        return { theme: 'rainy', label: temperature <= 20 ? '涼雨青灰' : '雨幕微涼' };
    }

    if (cloudCover >= 78 || weatherCode === 3) {
        if (dayPhase === 'dusk') return { theme: 'cloudy', label: '暮雲緩光' };
        return { theme: 'cloudy', label: temperature <= 20 ? '涼霧雲層' : '雲影漫行' };
    }

    if (cloudCover >= 45 || mistCodes.has(weatherCode)) {
        if (dayPhase === 'dawn') return { theme: 'mist', label: '晨霧薄光' };
        return { theme: 'mist', label: temperature <= 22 ? '薄霧清晨' : '輕霧柔光' };
    }

    if (dayPhase === 'dawn') return { theme: 'dawn', label: '晨曦薄霧' };
    if (dayPhase === 'dusk') return { theme: 'dusk', label: '暮金餘暉' };
    if (temperature >= 30) return { theme: 'summer', label: '盛夏晴朗' };
    if (temperature <= 20) return { theme: 'sunny', label: '清朗微光' };
    return { theme: 'sunny', label: '日晴輕暖' };
}

async function initWeatherTheme() {
    const fallback = fallbackWeatherTheme();
    automaticWeatherTheme = fallback;
    setWeatherThemeSelection(manualWeatherTheme || automaticWeatherTheme);
    updateTaipeiWeatherGlance({}, fallback.label);

    try {
        const response = await fetch(TAIPEI_WEATHER_URL, { method: 'GET' });
        if (!response.ok) throw new Error(`weather_http_${response.status}`);
        const payload = await response.json();
        automaticWeatherTheme = resolveWeatherTheme(payload?.current || {}, payload?.daily || {});
        setWeatherThemeSelection(manualWeatherTheme || automaticWeatherTheme);
        updateTaipeiWeatherGlance(payload?.current || {}, automaticWeatherTheme.label);
    } catch (_error) {
        const fallbackAgain = fallbackWeatherTheme();
        automaticWeatherTheme = fallbackAgain;
        setWeatherThemeSelection(manualWeatherTheme || automaticWeatherTheme);
        updateTaipeiWeatherGlance({}, fallbackAgain.label);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    startTaipeiClock();
    void initWeatherTheme();
    renderMenu();
    initMobileNewsCollapse();
    bindEvents();
    initCalorieCalculator();
    createJinggeRushGame();
    createCaloriesQuizGame();
    void loadSiteContent();

    document.querySelectorAll('img').forEach((img, index) => {
        if (index > 2) img.loading = 'lazy';
        img.decoding = 'async';
    });

    if (themeSwitcherToggle && themeSwitcherPanel) {
        themeSwitcherToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleThemeSwitcher();
        });
    }

    if (themeSwitcher) {
        themeSwitcherPanel?.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        themeSwitcherButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const mode = button.dataset.themeMode;
                if (mode === 'auto') {
                    manualWeatherTheme = null;
                    setWeatherThemeSelection(automaticWeatherTheme || fallbackWeatherTheme());
                    closeThemeSwitcher();
                    return;
                }
                manualWeatherTheme = {
                    theme: mode,
                    label: button.dataset.themeLabel || button.textContent.trim(),
                };
                setWeatherThemeSelection(manualWeatherTheme);
                closeThemeSwitcher();
            });
        });
        syncThemeSwitcherState();
    }

    document.addEventListener('click', (event) => {
        if (!themeSwitcher || !themeSwitcherPanel || themeSwitcherPanel.classList.contains('hidden')) return;
        if (themeSwitcher.contains(event.target)) return;
        closeThemeSwitcher();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && themeSwitcher && themeSwitcher.classList.contains('is-open')) {
            closeThemeSwitcher();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            isMobileNewsExpanded = false;
        }
        updateMobileNewsVisibility();
    });
});
