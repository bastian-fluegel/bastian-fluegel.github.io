let letters = [];
let profile = JSON.parse(localStorage.getItem('epistulae_v1_profile')) || {
    name: "Suchender",
    aiProfile: "Sokrates beobachtet dich...",
    frequency: "sofort",
    answeredCount: 0
};

// Start der App
async function init() {
    try {
        const response = await fetch('letters.json');
        letters = await response.json();
        
        // UI mit gespeicherten Daten füllen
        document.getElementById('user-name').value = profile.name;
        document.getElementById('ai-profile-text').innerText = profile.aiProfile;
        document.getElementById('frequency').value = profile.frequency;

        checkState();
    } catch (e) {
        console.error("Fehler beim Laden der Briefe:", e);
    }
}

function checkState() {
    const isWandering = localStorage.getItem('isWandering') === 'true';
    if (isWandering && profile.frequency !== 'sofort') {
        showView('wandering');
    } else {
        loadRandomLetter();
    }
}

async function loadRandomLetter() {
    const lastIdx = parseInt(localStorage.getItem('lastIdx') || "-1");
    let nextIdx = (lastIdx + 1) % letters.length;
    localStorage.setItem('lastIdx', nextIdx);

    const letter = letters[nextIdx];
    showView('letter');

    // UI zurücksetzen
    document.getElementById('salutation').innerText = `Heils dir, ${profile.name},`;
    const contentEl = document.getElementById('letter-content');
    const questionArea = document.getElementById('question-area');
    contentEl.innerText = "";
    questionArea.classList.add('hidden');

    // Schreibanimation
    const text = letter.content.replace("[NAME]", profile.name);
    for (let char of text) {
        contentEl.innerText += char;
        await new Promise(r => setTimeout(r, 25));
    }

    // Frage & Optionen einblenden
    questionArea.classList.remove('hidden');
    document.getElementById('letter-question').innerText = letter.question;
    const list = document.getElementById('options-list');
    list.innerHTML = "";

    letter.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => selectOption(letter.traits[i]);
        list.appendChild(btn);
    });
}

function selectOption(trait) {
    profile.answeredCount++;
    profile.aiProfile = `Sokrates sieht in dir eine Seele der ${trait}.`;
    saveToStorage();

    if (profile.frequency === 'sofort') {
        loadRandomLetter();
    } else {
        localStorage.setItem('isWandering', 'true');
        showView('wandering');
    }
}

function forceNextLetter() {
    localStorage.setItem('isWandering', 'false');
    loadRandomLetter();
}

function showView(view) {
    document.getElementById('wandering-view').className = (view === 'wandering' ? '' : 'hidden');
    document.getElementById('active-letter').className = (view === 'letter' ? '' : 'hidden');
}

function toggleSettings() {
    document.getElementById('settings-modal').classList.toggle('hidden');
}

function saveAndCloseSettings() {
    profile.name = document.getElementById('user-name').value;
    profile.frequency = document.getElementById('frequency').value;
    saveToStorage();
    document.getElementById('ai-profile-text').innerText = profile.aiProfile;
    toggleSettings();
    checkState(); // Falls Frequenz auf "sofort" geändert wurde
}

function saveToStorage() {
    localStorage.setItem('epistulae_v1_profile', JSON.stringify(profile));
}

init();
