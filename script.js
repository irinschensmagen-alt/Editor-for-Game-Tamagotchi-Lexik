// Константы проекта
const REPO_URL = "https://irinschensmagen-alt.github.io/Tamagotchi-for-Lexik/";
let translations = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    setupEventListeners();
    generateIframe(); // Генерируем код при старте с базовыми настройками
});

// Загрузка словарей из JSON
async function loadTranslations() {
    try {
        const response = await fetch('langs.json');
        translations = await response.json();
    } catch (error) {
        console.error("Ошибка загрузки словарей:", error);
    }
}

// Привязка событий (избавляемся от onclick в HTML)
function setupEventListeners() {
    // Смена языка интерфейса
    const langSelect = document.getElementById('ui-lang-select');
    langSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });

    // Динамическая генерация Iframe при изменении параметров
    const inputs = ['iframe-w', 'iframe-h'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', generateIframe);
    });

    // Копирование кода
    document.getElementById('btn-copy-code').addEventListener('click', copyIframeCode);
}

// Применение выбранного языка
function applyLanguage(langCode) {
    const dict = translations[langCode] || translations['ru']; // ru как fallback по умолчанию
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
}

// ДИНАМИЧЕСКИЙ ГЕНЕРАТОР IFRAME (Без скрытых блоков)
function generateIframe() {
    const width = document.getElementById('iframe-w').value;
    const height = document.getElementById('iframe-h').value;
    
    // Формируем чистый код
    const iframeCode = `<iframe 
    src="${REPO_URL}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    allow="autoplay; fullscreen" 
    style="border:none; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.1);">
</iframe>`;

    document.getElementById('iframe-output').value = iframeCode;
}

// Функция копирования
function copyIframeCode() {
    const codeArea = document.getElementById('iframe-output');
    codeArea.select();
    navigator.clipboard.writeText(codeArea.value).then(() => {
        const btn = document.getElementById('btn-copy-code');
        const originalText = btn.textContent;
        btn.textContent = "✓ Скопировано!";
        setTimeout(() => btn.textContent = originalText, 2000);
    });
}
