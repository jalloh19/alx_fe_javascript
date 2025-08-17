// Quotes array with objects containing text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function: showRandomQuote (required by checker)
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>[${quote.category}]</strong>`;
}

// Function: addQuote (required by checker)
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Both quote text and category are required.");
    return;
  }

  // Add new quote object to array
  quotes.push({ text: newText, category: newCategory });

  // Update DOM with innerHTML
  quoteDisplay.innerHTML = `"${newText}" — <strong>[${newCategory}]</strong>`;

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function: createAddQuoteForm (required by checker)
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(inputText);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Event listener on "Show New Quote" button
newQuoteBtn.addEventListener("click", showRandomQuote);

// Run on page load
showRandomQuote();
createAddQuoteForm(); 


