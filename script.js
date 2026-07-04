const journalForm = document.querySelector("#journalForm");
const journalGallery = document.querySelector("#journalGallery");
const storageKey = "cozyJourneysEntries";

let journalEntries = [];

const escapeHtml = (value) => {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
};

const formatDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};

const saveJournalEntries = () => {
  localStorage.setItem(storageKey, JSON.stringify(journalEntries));
};

const loadJournalEntries = () => {
  const savedEntries = localStorage.getItem(storageKey);

  if (!savedEntries) {
    return;
  }

  try {
    const parsedEntries = JSON.parse(savedEntries);
    journalEntries = Array.isArray(parsedEntries) ? parsedEntries : [];
  } 
  
  catch {
    journalEntries = [];
  }
};

const renderJournalEntries = () => {
  journalGallery.innerHTML = "";

  journalEntries.forEach((entry) => {
    const journalCard = document.createElement("article");

    journalCard.className = "journal-card";
    journalCard.dataset.id = entry.id;

    journalCard.innerHTML = `
      <div class="journal-photo-frame">

        <img
          class="journal-photo"
          src="${escapeHtml(entry.photoUrl)}"
          alt="${escapeHtml(entry.destination)}"
        >

        <button
          class="delete-button" type="button"
          data-action="delete"
          aria-label="Delete ${escapeHtml(entry.destination)} journal entry"
        >
          ×
        </button>
      </div>

      <div class="journal-card-content">

        <div class="journal-card-heading">
          <h3 class="journal-destination">${escapeHtml(entry.destination)}</h3>
          <p class="journal-date">${formatDate(entry.date)}</p>
        </div>

        <span class="journal-mood">${escapeHtml(entry.mood)}</span>
        <p class="journal-description">${escapeHtml(entry.description)}</p>
      </div>
    `;

    journalGallery.append(journalCard);
  });
};

journalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(journalForm);

  const journalEntry = {
    id: Date.now(),
    destination: formData.get("destination").trim(),
    date: formData.get("date"),
    mood: formData.get("mood"),
    photoUrl: formData.get("photoUrl").trim(),
    description: formData.get("description").trim()
  };

  journalEntries.unshift(journalEntry);

  saveJournalEntries();
  renderJournalEntries();
  journalForm.reset();
  document.querySelector("#destination").focus();
});

journalGallery.addEventListener("click", (event) => {
    
  const deleteButton = event.target.closest('[data-action="delete"]');

  if (!deleteButton) {
    return;
  }

  const journalCard = deleteButton.closest(".journal-card");
  const entryId = Number(journalCard.dataset.id);

  journalEntries = journalEntries.filter((entry) => entry.id !== entryId);
  saveJournalEntries();
  renderJournalEntries();
});

loadJournalEntries();
renderJournalEntries();