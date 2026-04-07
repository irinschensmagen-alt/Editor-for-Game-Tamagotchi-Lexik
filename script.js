const REPO_URL = "https://irinschensmagen-alt.github.io/Tamagotchi-for-Lexik/";
let translations = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    setupEventListeners();
    setupTabs();
    addLexiconRow(); // Добавляем первую пустую строку для слов при старте
    generateIframe(); 
});

async function loadTranslations() {
    try {
        const response = await fetch('langs.json');
        translations = await response.json();
    } catch (error) {
        console.error("Ошибка загрузки словарей:", error);
    }
}

function setupEventListeners() {
    // Смена языка
    document.getElementById('ui-lang-select').addEventListener('change', (e) => applyLanguage(e.target.value));
    
    // Генератор Iframe
    ['iframe-w', 'iframe-h'].forEach(id => {
        document.getElementById(id).addEventListener('change', generateIframe);
    });
    
    // Копирование кода
    document.getElementById('btn-copy-code').addEventListener('click', copyIframeCode);

    // Добавление новых слов
    document.getElementById('btn-add-word').addEventListener('click', addLexiconRow);

    // Отслеживание изменений в названии игры для URL
    document.getElementById('game-title').addEventListener('input', generateIframe);
}

// ЛОГИКА ВКЛАДОК (Боковое меню)
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активность со всех
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Активируем нужную
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ЛОГИКА ДОБАВЛЕНИЯ ЛЕКСИКИ
function addLexiconRow() {
    const container = document.getElementById('lexicon-container');
    const row = document.createElement('div');
    row.className = 'lexicon-row';
    
    row.innerHTML = `
        <input type="text" class="clean-input word-original" placeholder="Слово (напр. Gehen)">
        <input type="text" class="clean-input word-translation" placeholder="Перевод (напр. Идти)">
        <button class="btn-delete" title="Удалить">✕</button>
    `;

    // Удаление строки
    row.querySelector('.btn-delete').addEventListener('click', () => {
        row.remove();
        generateIframe(); // Обновляем код при удалении
    });

    // Обновляем Iframe при вводе слов
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', generateIframe);
    });

    container.appendChild(row);
}

// ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
function applyLanguage(langCode) {
    const dict = translations[langCode] || translations['ru'];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
}

// ГЕНЕРАТОР IFRAME (Собирает данные из редактора)
function generateIframe() {
    const width = document.getElementById('iframe-w').value;
    const height = document.getElementById('iframe-h').value;
    const gameTitle = encodeURIComponent(document.getElementById('game-title').value || "Tamagotchi");
    
    // Формируем динамический URL с параметрами (название игры передается в ссылку)
    const finalUrl = `${REPO_URL}?title=${gameTitle}`;

    const iframeCode = `<iframe 
    src="${finalUrl}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    allow="autoplay; fullscreen" 
    style="border:none; border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.1);">
</iframe>`;

    document.getElementById('iframe-output').value = iframeCode;
}

function copyIframeCode() {
    const codeArea = document.getElementById('iframe-output');
    codeArea.select();
    navigator.clipboard.writeText(codeArea.value).then(() => {
        const btn = document.getElementById('btn-copy-code');
        btn.textContent = "✓ Скопировано!";
        setTimeout(() => btn.textContent = "📋 Копировать код", 2000);
    });
}
