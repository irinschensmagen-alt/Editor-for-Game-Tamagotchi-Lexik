const REPO_URL = "https://irinschensmagen-alt.github.io/Tamagotchi-Game/";

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initTasks();
    initIframeGen();
});

// 1. Управление вкладками
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

// 2. Управление заданиями (Лексика/Грамматика)
function initTasks() {
    const container = document.getElementById('tasks-container');
    const addBtn = document.getElementById('add-task');

    const createRow = () => {
        const div = document.createElement('div');
        div.className = 'task-row';
        div.innerHTML = `
            <input type="text" class="clean-input q-input" placeholder="Вопрос / Слово">
            <input type="text" class="clean-input a-input" placeholder="Правильный ответ">
            <button class="btn-del">×</button>
        `;
        div.querySelector('.btn-del').onclick = () => { div.remove(); updateIframe(); };
        div.querySelectorAll('input').forEach(i => i.oninput = updateIframe);
        container.appendChild(div);
    };

    addBtn.onclick = createRow;
    createRow(); // Создаем первую строку сразу
}

// 3. Генератор Iframe со всеми параметрами
function updateIframe() {
    const config = {
        name: document.getElementById('game-name').value,
        bg: document.getElementById('bg-url').value,
        color: document.getElementById('color-primary').value,
        happy: document.getElementById('msg-happy').value,
        sad: document.getElementById('msg-sad').value,
        timer: document.getElementById('timer-val').value,
        pts: document.getElementById('pts-plus').value
    };

    // Кодируем конфиг в URL (Base64 или параметры)
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
    const finalUrl = `${REPO_URL}?data=${encoded}`;

    const code = `<iframe src="${finalUrl}" width="100%" height="700px" frameborder="0" allowfullscreen></iframe>`;
    document.getElementById('iframe-res').value = code;
}

// Слушатели для всех полей ввода
function initIframeGen() {
    const inputs = document.querySelectorAll('.clean-input, input[type="color"]');
    inputs.forEach(input => input.addEventListener('input', updateIframe));
    
    document.getElementById('copy-iframe').onclick = () => {
        const area = document.getElementById('iframe-res');
        area.select();
        document.execCommand('copy');
        alert('Код скопирован!');
    };
}
