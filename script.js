document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initDynamicLists();
    initIframeSync();
});

// 1. Навигация по вкладкам
function initTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });
}

// 2. Управление словами (Лексика)
function initDynamicLists() {
    const container = document.getElementById('words-list');
    const addBtn = document.getElementById('add-word');

    const addRow = (q = "", a = "") => {
        const row = document.createElement('div');
        row.className = 'word-row';
        row.innerHTML = `
            <input type="text" class="clean-input q-val" value="${q}" placeholder="Слово">
            <input type="text" class="clean-input a-val" value="${a}" placeholder="Перевод">
            <button class="btn-del">✕</button>
        `;
        row.querySelector('.btn-del').onclick = () => { row.remove(); updateIframe(); };
        row.querySelectorAll('input').forEach(i => i.oninput = updateIframe);
        container.appendChild(row);
    };

    addBtn.onclick = () => addRow();
    addRow("Gehen", "Идти"); // Начальный пример
}

// 3. Генератор Iframe (Собирает ВСЕ данные)
function updateIframe() {
    const baseUrl = `https://${document.getElementById('project-id').value}.github.io/Tamagotchi-for-Lexik/`;
    
    // Собираем объект настроек (как в вашем оригинале)
    const config = {
        t: document.getElementById('game-title').value,
        bg: document.getElementById('bg-url').value,
        c: document.getElementById('theme-color').value,
        op: document.getElementById('ui-opacity').value,
        msgOk: document.getElementById('msg-correct').value,
        msgErr: document.getElementById('msg-wrong').value,
        rew: document.getElementById('coin-reward').value,
        pr: document.getElementById('item-price').value,
        words: Array.from(document.querySelectorAll('.word-row')).map(row => ({
            q: row.querySelector('.q-val').value,
            a: row.querySelector('.a-val').value
        }))
    };

    // Кодируем данные в безопасный формат для URL
    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    const finalUrl = `${baseUrl}?data=${encodedData}`;

    const width = document.getElementById('if-w').value;
    const height = document.getElementById('if-h').value;

    const iframeCode = `<iframe src="${finalUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen style="border-radius:20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"></iframe>`;
    
    document.getElementById('iframe-output').value = iframeCode;
}

// Слушатели обновлений
function initIframeSync() {
    const inputs = document.querySelectorAll('.clean-input, .clean-textarea, input[type="color"], input[type="range"]');
    inputs.forEach(input => input.addEventListener('input', updateIframe));

    document.getElementById('copy-code').onclick = () => {
        const area = document.getElementById('iframe-output');
        area.select();
        navigator.clipboard.writeText(area.value);
        const btn = document.getElementById('copy-code');
        btn.textContent = "✅ Скопировано!";
        setTimeout(() => btn.textContent = "📋 Копировать код", 2000);
    };
    
    updateIframe(); // Первый запуск
}
