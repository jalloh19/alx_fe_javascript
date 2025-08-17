const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();
  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
    displayRandomQuote();
    syncQuotes("add", newQuote);
  } else {
    alert("Please enter both text and category for the quote.");
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input type="text" id="quoteText" placeholder="Enter quote text" />
    <input type="text" id="quoteCategory" placeholder="Enter category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  filter.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join("");
  const lastSelected = localStorage.getItem("selectedCategory") || "all";
  filter.value = lastSelected;
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
}

async function fetchQuotesFromServer() {
  const response = await fetch(SERVER_URL);
  const serverData = await response.json();
  return serverData.slice(0, 5).map(item => ({
    text: item.title,
    category: "Server"
  }));
}

async function syncQuotes(action, data = null) {
  try {
    if (action === "add") {
      await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }
    const serverQuotes = await fetchQuotesFromServer();
    const merged = [...quotes, ...serverQuotes];
    const unique = Array.from(new Map(merged.map(q => [q.text, q])).values());
    if (unique.length !== quotes.length) {
      quotes = unique;
      saveQuotes();
      populateCategories();
      document.getElementById("syncStatus").textContent = "Quotes synced with server! Conflicts resolved.";
    } else {
      document.getElementById("syncStatus").textContent = "Quotes synced with server!";
    }
  } catch {
    document.getElementById("syncStatus").textContent = "Server sync failed.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  } else {
    displayRandomQuote();
  }
  setInterval(syncQuotes, 10000);
});

