let letters = [];
let typewriterCancel = false;
let currentLetter = null; // für Frage-Modal
const READ_STORAGE_KEY = "epistulae_seen_letters_v1";
const PROFILE_STORAGE_KEY = "epistulae_profile_v1";

const wanderingThoughts = [
    "Das Staunen ist der Anfang der Weisheit.",
    "Wer glaubt, etwas zu sein, hat aufgehört, etwas zu werden.",
    "Ein ungeprüftes Leben ist nicht lebenswert.",
    "In jedem Menschen brennt ein Licht, das wir suchen müssen.",
    "Die Wege der Erkenntnis sind oft einsam.",
    "Nur das Fragen hält den Geist wach.",
    "Wahres Wissen kommt aus der Einsicht der eigenen Unwissenheit.",
    "Der Weise zweifelt oft, der Narr niemals."
];

// Start der App
async function init() {
    setupLegalModals();
    setupQuestionModal();

    try {
        const response = await fetch('letters.json');
        letters = await response.json();
        normalizeSavedReadProgress();
        
        // Onboarding-Check
        const profile = getProfile();
        if (!profile.onboardingDone) {
            showOnboarding();
        } else {
            showWelcomeMessage(profile);
            setTimeout(() => {
                hideWelcomeMessage();
                loadNextLetter();
            }, 3000);
        }
    } catch (e) {
        console.error("Fehler beim Laden der Briefe:", e);
    }
}

// Profil-Verwaltung
function getProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) return { name: "", gender: "", onboardingDone: false };
        return JSON.parse(raw);
    } catch {
        return { name: "", gender: "", onboardingDone: false };
    }
}

function saveProfile(profile) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

// Onboarding anzeigen
function showOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    
    document.getElementById('story-next-btn').addEventListener('click', () => {
        document.getElementById('onboarding-story').classList.add('hidden');
        document.getElementById('onboarding-form').classList.remove('hidden');
    });
    
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        
        if (name && gender) {
            saveProfile({
                name: name,
                gender: gender,
                onboardingDone: true
            });
            
            overlay.classList.add('hidden');
            overlay.setAttribute('aria-hidden', 'true');
            loadNextLetter();
        }
    });
}

// Willkommens-Nachricht für wiederkehrende Besuche
function showWelcomeMessage(profile) {
    const welcomeOverlay = document.getElementById('welcome-message');
    const welcomeText = document.getElementById('welcome-text');
    
    welcomeText.innerText = `Sei gegrüßt, ${profile.name}. Sokrates hat über deine letzte Antwort nachgedacht und eine neue Frage für dich.`;
    
    welcomeOverlay.classList.remove('hidden');
    welcomeOverlay.setAttribute('aria-hidden', 'false');
}

function hideWelcomeMessage() {
    const welcomeOverlay = document.getElementById('welcome-message');
    welcomeOverlay.classList.add('hidden');
    welcomeOverlay.setAttribute('aria-hidden', 'true');
}

// Personalisierte Anrede generieren
function getPersonalizedSalutation(gender, name) {
    switch(gender) {
        case 'm':
            return `An den geschätzten ${name},`;
        case 'f':
            return `An die geschätzte ${name},`;
        case 'n':
            return `Sei gegrüßt, ${name},`;
        default:
            return `Mein Freund,`;
    }
}

function normalizeSavedReadProgress() {
    const seen = getSeenIndices();
    const cleaned = seen.filter(
        (idx, pos) => Number.isInteger(idx) && idx >= 0 && idx < letters.length && seen.indexOf(idx) === pos
    );
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(cleaned));
}

function getSeenIndices() {
    try {
        const raw = localStorage.getItem(READ_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function setSeenIndices(seen) {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(seen));
}

function updateProgress(readCount, totalCount) {
    document.getElementById("reading-progress").innerText = `${readCount} / ${totalCount} gelesen`;
}

function getNextUnreadIndex() {
    let seen = getSeenIndices();

    // Alle Briefe gelesen -> neue Runde ohne Dopplungen innerhalb der Runde
    if (seen.length >= letters.length) {
        seen = [];
        setSeenIndices(seen);
    }

    const unreadIdx = letters.findIndex((_, idx) => !seen.includes(idx));
    if (unreadIdx === -1) return 0;

    seen.push(unreadIdx);
    setSeenIndices(seen);
    updateProgress(seen.length, letters.length);

    return unreadIdx;
}

function loadNextLetter() {
    typewriterCancel = false;
    const nextIdx = getNextUnreadIndex();
    const letter = letters[nextIdx];
    
    // Profil laden für personalisierte Anrede
    const profile = getProfile();
    let salutation;
    
    if (profile.onboardingDone && profile.name) {
        salutation = getPersonalizedSalutation(profile.gender, profile.name);
    } else {
        // Fallback: allgemeine Anrede
        const salutations = [
            "Mein lieber Freund,",
            "Teurer Freund,",
            "Mein Freund,"
        ];
        salutation = salutations[nextIdx % salutations.length];
    }

    const textSpan = document.getElementById('typed-text');
    const quillPen = document.getElementById('quill-pen');
    const signatureEl = document.getElementById('letter-signature');
    const answerBtn = document.getElementById('answer-question-btn');

    document.getElementById('salutation').innerText = salutation;
    textSpan.innerText = "";
    signatureEl.innerText = "";
    quillPen.classList.remove('hidden');
    answerBtn.classList.add('hidden');

    let text = letter.content;
    if (profile.onboardingDone && profile.name) {
        text = text.replace(/\[NAME\]/g, profile.name);
    }

    let index = 0;

    function getTypingDelay(char) {
        let ms = Math.floor(Math.random() * (70 - 30 + 1) + 30);
        if (char === '.' || char === ',') ms += 150;
        return ms;
    }

    function typeNext() {
        if (typewriterCancel) {
            quillPen.classList.add('hidden');
            return;
        }
        if (index < text.length) {
            textSpan.innerText += text[index];
            index++;
            setTimeout(typeNext, getTypingDelay(text[index - 1]));
        } else {
            quillPen.classList.add('hidden');
            signatureEl.innerText = "Sokrates";
            currentLetter = letter;
            answerBtn.classList.remove('hidden');
        }
    }

    typeNext();
}

function openQuestionModal() {
    if (!currentLetter) return;
    const modal = document.getElementById('question-modal');
    const questionEl = document.getElementById('modal-question-text');
    const list = document.getElementById('modal-options-list');

    questionEl.innerText = currentLetter.question;
    list.innerHTML = "";
    currentLetter.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.getElementById('answer-question-btn').classList.add('hidden');
            startWandering();
        };
        list.appendChild(btn);
    });

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function startWandering() {
    // Brief ausblenden, Wanderansicht zeigen
    document.getElementById('active-letter').classList.add('hidden');
    document.getElementById('wandering-view').classList.remove('hidden');
    
    const thoughtEl = document.getElementById('wandering-thought');
    const randomThought = wanderingThoughts[Math.floor(Math.random() * wanderingThoughts.length)];
    
    thoughtEl.style.opacity = '0';
    thoughtEl.innerText = randomThought;
    
    // Sanftes Einblenden des Gedankens
    setTimeout(() => { thoughtEl.style.opacity = '1'; }, 100);

    // Wanderung: 3 Sekunden sichtbar
    setTimeout(() => {
        thoughtEl.style.opacity = '0';
        setTimeout(() => {
            document.getElementById('wandering-view').classList.add('hidden');
            document.getElementById('active-letter').classList.remove('hidden');
            loadNextLetter();
        }, 1500); // Zeit für Ausblenden
    }, 3000);
}

function setupQuestionModal() {
    document.getElementById('answer-question-btn').addEventListener('click', openQuestionModal);
}

function selectOption() {
    typewriterCancel = true;
    loadNextLetter();
}

function setupLegalModals() {
    const openButtons = document.querySelectorAll("[data-modal-target]");
    const closeButtons = document.querySelectorAll("[data-modal-close]");

    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-modal-target");
            const modal = document.getElementById(targetId);
            if (!modal) return;
            modal.classList.remove("hidden");
            modal.setAttribute("aria-hidden", "false");
        });
    });

    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (!modal) return;
            modal.classList.add("hidden");
            modal.setAttribute("aria-hidden", "true");
        });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.add("hidden");
                modal.setAttribute("aria-hidden", "true");
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.classList.add("hidden");
            modal.setAttribute("aria-hidden", "true");
        });
    });
}

init();
