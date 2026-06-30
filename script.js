const journalForm = document.querySelector("#journalForm");
const journalGallery = document.querySelector("#journalGallery");

const journalEntries = [];

const formatDate = (dateValue) => {
  const date = new Date(`${dateValue}T00:00:00`);

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
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
          src="${entry.photoUrl}"
          alt="${entry.destination}"
        >
      </div>

      <div class="journal-card-content">

        <div class="journal-card-heading">
          <h3 class="journal-destination">${entry.destination}</h3>
          <p class="journal-date">${formatDate(entry.date)}</p>
        </div>

        <span class="journal-mood">${entry.mood}</span>
        <p class="journal-description">${entry.description}</p>
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

  renderJournalEntries();
  journalForm.reset();
  document.querySelector("#destination").focus();
});