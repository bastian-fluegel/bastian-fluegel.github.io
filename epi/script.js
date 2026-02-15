let letters = [];
let typewriterCancel = false;
const READ_STORAGE_KEY = "epistulae_seen_letters_v1";

// Start der App
async function init() {
    setupLegalModals();

    try {
        const response = await fetch('letters.json');
        letters = await response.json();
        normalizeSavedReadProgress();
        loadNextLetter();
    } catch (e) {
        console.error("Fehler beim Laden der Briefe:", e);
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

    // Anrede – allgemein, wie in den Briefen
    const salutations = [
        "Mein lieber Freund,",
        "Teurer Freund,",
        "Mein Freund,"
    ];
    const salutation = salutations[nextIdx % salutations.length];

    const contentEl = document.getElementById('letter-content');
    const questionEl = document.getElementById('letter-question');
    const signatureEl = document.getElementById('letter-signature');
    const list = document.getElementById('options-list');

    // Layout sofort sichtbar: Anrede, leere Inhaltsfläche, Unterschrift-Platz, Trennlinie, leere Frage, drei Platzhalter-Buttons
    document.getElementById('salutation').innerText = salutation;
    contentEl.innerText = "";
    signatureEl.innerText = "";
    questionEl.innerText = "";
    list.innerHTML = "";

    letter.options.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = "option-btn option-btn-placeholder";
        btn.innerText = "\u00A0"; // geschütztes Leerzeichen als Platzhalter
        btn.disabled = true;
        list.appendChild(btn);
    });

    // Text per Typewriter schreiben (rekursives setTimeout, bricht nicht ab)
    const text = letter.content;
    let index = 0;

    function typeNext() {
        if (typewriterCancel) return;
        if (index < text.length) {
            contentEl.innerText += text[index];
            index++;
            setTimeout(typeNext, 25);
        } else {
            signatureEl.innerText = "Sokrates";
            questionEl.innerText = letter.question;

            list.innerHTML = "";
            letter.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = "option-btn";
                btn.innerText = opt;
                btn.onclick = () => selectOption(i);
                list.appendChild(btn);
            });
        }
    }

    typeNext();
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
