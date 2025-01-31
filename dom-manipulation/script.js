const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to get unique categories from quotes
function getUniqueCategories() {
    const categories = new Set(quotes.map(quote => quote.category));
    return Array.from(categories);
}

// Function to populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = getUniqueCategories();

    // Clear existing items
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate the dropdown with unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from localStorage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const categoryFilter = document.getElementById('categoryFilter').value;

    // Filter quotes based on selected category
    const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(q => q.category === categoryFilter);
    const randomQuote = filteredQuotes.length ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] : null;

    // Save last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));

    quoteDisplay.innerHTML = `<p>"${randomQuote ? randomQuote.text : "No quotes available"}"</p><p><em>- ${randomQuote ? randomQuote.category : ""}</em></p>`;
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);
    showRandomQuote();
}

// Function to create a form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h3>Add a New Quote</h3>
        <input type="text" id="quoteText" placeholder="Enter your quote" required>
        <input type="text" id="quoteCategory" placeholder="Enter category" required>
        <button id="addQuote">Add Quote</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
        <button id="exportQuotes">Export Quotes to JSON</button>
        <select id="categoryFilter" onchange="filterQuotes()">
            <option value="all">All Categories</option>
            <!-- Dynamically populated categories -->
        </select>
    `;
    
    document.body.appendChild(formContainer);
    populateCategories();

    document.getElementById('addQuote').addEventListener('click', () => {
        const quoteText = document.getElementById('quoteText').value;
        const quoteCategory = document.getElementById('quoteCategory').value;

        if (quoteText && quoteCategory) {
            quotes.push({ text: quoteText, category: quoteCategory });
            saveQuotes();
            alert("Quote added!");
            document.getElementById('quoteText').value = '';
            document.getElementById('quoteCategory').value = '';
            populateCategories();
        } else {
            alert("Please fill in both fields.");
        }
    });

    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from the server
function fetchQuotesFromServer() {
    fetch(SERVER_URL)
        .then(response => response.json())
        .then(data => {
            const serverQuotes = data.map(item => ({
                text: item.title,
                category: 'general' // Assign a default category for simplicity
            }));

            syncQuotes(serverQuotes);
        })
        .catch(error => console.error('Error fetching server quotes:', error));
}

// Function to sync local quotes with fetched server quotes
function syncQuotes(serverQuotes) {
    const localQuotesString = localStorage.getItem('quotes');
    if (!localQuotesString) {
        quotes = serverQuotes; // Initialize if local storage is empty
    } else {
        const localQuotes = JSON.parse(localQuotesString);
        const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
        quotes = mergedQuotes; // Resolve conflicts and merge the quotes
    }
    
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes have been synced with the server.');
}

// Function to merge local and server quotes
function mergeQuotes(local, server) {
    const localTextSet = new Set(local.map(q => q.text));
    const conflicts = [];

    const merged = server.map(sq => {
        if (localTextSet.has(sq.text)) {
            conflicts.push(sq.text); // Record any conflicts
            return sq; // Server quote takes precedence
        }
        return sq; // New quote from server
    }).concat(local.filter(lq => !localTextSet.has(lq.text))); // Append local quotes that didn't conflict

    if (conflicts.length) {
        notifyUserOfConflicts(conflicts);
    }

    return merged; // Return merged results
}

// Function to notify users of conflicts
function notifyUserOfConflicts(conflicts) {
    const uniqueConflicts = Array.from(new Set(conflicts)); // Unique conflicts
    alert(`Conflicts detected for the following quotes:\n${uniqueConflicts.join(', ')}\nServer versions will be used.`);
}

// Call this function periodically to sync data
setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds

// Attach event listener to the button to show a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to create the add quote form
createAddQuoteForm();

// Show an initial random quote when the page loads
showRandomQuote();

// Sync initial data on page load
fetchQuotesFromServer();



// // Task 2
// // Define an array to store quote objects, load initial quotes from localStorage
// let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// // Function to save quotes to local storage
// function saveQuotes() {
//     localStorage.setItem('quotes', JSON.stringify(quotes));
// }

// // Function to get unique categories from quotes
// function getUniqueCategories() {
//     const categories = new Set(quotes.map(quote => quote.category));
//     return Array.from(categories);
// }

// // Function to populate category dropdown
// function populateCategories() {
//     const categoryFilter = document.getElementById('categoryFilter');
//     const uniqueCategories = getUniqueCategories();

//     // Clear existing items
//     categoryFilter.innerHTML = '<option value="all">All Categories</option>';

//     // Populate the dropdown with unique categories
//     uniqueCategories.forEach(category => {
//         const option = document.createElement('option');
//         option.value = category;
//         option.textContent = category;
//         categoryFilter.appendChild(option);
//     });

//     // Restore last selected category from localStorage
//     const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
//     categoryFilter.value = lastSelectedCategory;
// }

// // Function to display a random quote
// function showRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     const categoryFilter = document.getElementById('categoryFilter').value;

//     // Filter quotes based on selected category
//     const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(q => q.category === categoryFilter);
//     const randomQuote = filteredQuotes.length ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)] : null;

//     // Save last viewed quote in session storage
//     sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));

//     quoteDisplay.innerHTML = `<p>"${randomQuote ? randomQuote.text : "No quotes available"}"</p><p><em>- ${randomQuote ? randomQuote.category : ""}</em></p>`;
// }

// // Function to filter quotes based on the selected category
// function filterQuotes() {
//     // Save selected category to local storage
//     const selectedCategory = document.getElementById('categoryFilter').value;
//     localStorage.setItem('lastSelectedCategory', selectedCategory);
//     showRandomQuote();
// }

// // Function to create a form to add a new quote
// function createAddQuoteForm() {
//     const formContainer = document.createElement('div');
//     formContainer.innerHTML = `
//         <h3>Add a New Quote</h3>
//         <input type="text" id="quoteText" placeholder="Enter your quote" required>
//         <input type="text" id="quoteCategory" placeholder="Enter category" required>
//         <button id="addQuote">Add Quote</button>
//         <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
//         <button id="exportQuotes">Export Quotes to JSON</button>
//         <select id="categoryFilter" onchange="filterQuotes()">
//             <option value="all">All Categories</option>
//             <!-- Dynamically populated categories -->
//         </select>
//     `;
    
//     document.body.appendChild(formContainer);

//     // Populate categories in the dropdown
//     populateCategories();
    
//     // Adding event listener to the "Add Quote" button
//     document.getElementById('addQuote').addEventListener('click', () => {
//         const quoteText = document.getElementById('quoteText').value;
//         const quoteCategory = document.getElementById('quoteCategory').value;

//         if (quoteText && quoteCategory) {
//             // Add the new quote to the quotes array
//             quotes.push({ text: quoteText, category: quoteCategory });
//             saveQuotes();
//             alert("Quote added!");

//             // Clear the input fields
//             document.getElementById('quoteText').value = '';
//             document.getElementById('quoteCategory').value = '';

//             // Re-populate categories
//             populateCategories();
//         } else {
//             alert("Please fill in both fields.");
//         }
//     });

//     // Adding event listener for exporting quotes
//     document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
// }

// // Function to export quotes to a JSON file
// function exportQuotes() {
//     const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'quotes.json';
//     a.click();
//     URL.revokeObjectURL(url);
// }

// // Function to import quotes from a JSON file
// function importFromJsonFile(event) {
//     const fileReader = new FileReader();
//     fileReader.onload = function(event) {
//         const importedQuotes = JSON.parse(event.target.result);
//         quotes.push(...importedQuotes);
//         saveQuotes();
//         alert('Quotes imported successfully!');
//         populateCategories();
//         showRandomQuote();
//     };
//     fileReader.readAsText(event.target.files[0]);
// }

// // Attach event listener to the button to show a new quote
// document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// // Call the function to create the add quote form
// createAddQuoteForm();

// // Show an initial random quote when the page loads
// showRandomQuote();



// // Task 1
// // Define an array to store quote objects, load initial quotes from localStorage
// let quotes = JSON.parse(localStorage.getItem('quotes')) || [];


// // Function to save quotes to local storage
// function saveQuotes() {
//     localStorage.setItem('quotes', JSON.stringify(quotes));
// }

// // Function to display a random quote
// function showRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const randomQuote = quotes[randomIndex];
    
//     // Save last viewed quote in session storage
//     sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    
//     quoteDisplay.innerHTML = `<p>"${randomQuote ? randomQuote.text : "No quotes available"}"</p><p><em>- ${randomQuote ? randomQuote.category : ""}</em></p>`;
// }

// // Function to create a form to add a new quote
// function createAddQuoteForm() {
//     const formContainer = document.createElement('div');
//     formContainer.innerHTML = `
//         <h3>Add a New Quote</h3>
//         <input type="text" id="quoteText" placeholder="Enter your quote" required>
//         <input type="text" id="quoteCategory" placeholder="Enter category" required>
//         <button id="addQuote">Add Quote</button>
//         <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
//         <button id="exportQuotes">Export Quotes to JSON</button>
//     `;
    
//     document.body.appendChild(formContainer);

//     // Adding event listener to the "Add Quote" button
//     document.getElementById('addQuote').addEventListener('click', () => {
//         const quoteText = document.getElementById('quoteText').value;
//         const quoteCategory = document.getElementById('quoteCategory').value;

//         if (quoteText && quoteCategory) {
//             // Add the new quote to the quotes array
//             quotes.push({ text: quoteText, category: quoteCategory });
//             saveQuotes();
//             alert("Quote added!");
            
//             // Clear the input fields
//             document.getElementById('quoteText').value = '';
//             document.getElementById('quoteCategory').value = '';
//         } else {
//             alert("Please fill in both fields.");
//         }
//     });

//     // Adding event listener for exporting quotes
//     document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
// }

// // Function to export quotes to a JSON file
// function exportQuotes() {
//     const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'quotes.json';
//     a.click();
//     URL.revokeObjectURL(url);
// }

// // Function to import quotes from a JSON file
// function importFromJsonFile(event) {
//     const fileReader = new FileReader();
//     fileReader.onload = function(event) {
//         const importedQuotes = JSON.parse(event.target.result);
//         quotes.push(...importedQuotes);
//         saveQuotes();
//         alert('Quotes imported successfully!');
//         showRandomQuote();
//     };
//     fileReader.readAsText(event.target.files[0]);
// }

// // Attach event listener to the button to show a new quote
// document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// // Call the function to create the add quote form
// createAddQuoteForm();

// // Show an initial random quote when the page loads
// showRandomQuote();


// Task 0
// // Define an array to store quote objects
// let quotes = [
//     { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "inspirational" },
//     { text: "The way to get started is to quit talking and begin doing.", category: "motivational" },
//     { text: "Life is what happens when you're busy making other plans.", category: "life" },
//     { text: "You only live once, but if you do it right, once is enough.", category: "life" }
// ];

// // Function to display a random quote
// function showRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const randomQuote = quotes[randomIndex];
//     quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
// }

// // Function to create a form to add a new quote
// function createAddQuoteForm() {
//     const formContainer = document.createElement('div');
//     formContainer.innerHTML = `
//         <h3>Add a New Quote</h3>
//         <input type="text" id="quoteText" placeholder="Enter your quote" required>
//         <input type="text" id="quoteCategory" placeholder="Enter category" required>
//         <button id="addQuote">Add Quote</button>
//     `;
    
//     document.body.appendChild(formContainer);

//     // Adding event listener to the "Add Quote" button
//     document.getElementById('addQuote').addEventListener('click', () => {
//         const quoteText = document.getElementById('quoteText').value;
//         const quoteCategory = document.getElementById('quoteCategory').value;

//         if (quoteText && quoteCategory) {
//             // Add the new quote to the quotes array
//             quotes.push({ text: quoteText, category: quoteCategory });
//             alert("Quote added!");
            
//             // Clear the input fields
//             document.getElementById('quoteText').value = '';
//             document.getElementById('quoteCategory').value = '';
//         } else {
//             alert("Please fill in both fields.");
//         }
//     });
// }

// // Attach event listener to the button to show a new quote
// document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// // Call the function to create the add quote form
// createAddQuoteForm();

// // Show an initial random quote when the page loads
// showRandomQuote();


// // Array of quote objects
// let quotes = [
//     { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
//     { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
//     { text: "Strive not to be a success, but rather to be of value.", category: "Success" }
// ];

// // Function to display a random quote
// function showRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     if (quotes.length === 0) {
//         quoteDisplay.innerHTML = "<p>No quotes available. Add a new quote!</p>";
//         return;
//     }
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const randomQuote = quotes[randomIndex];
//     quoteDisplay.innerHTML = `<p><strong>${randomQuote.text}</strong> - <em>${randomQuote.category}</em></p>`;
// }

// // Function to create and display a form for adding new quotes
// function createAddQuoteForm() {
//     const quoteDisplay = document.getElementById('quoteDisplay');

//     // Create form elements
//     const form = document.createElement('form');
//     const textLabel = document.createElement('label');
//     textLabel.textContent = "Quote Text:";
//     const textInput = document.createElement('input');
//     textInput.type = "text";
//     textInput.required = true;

//     const categoryLabel = document.createElement('label');
//     categoryLabel.textContent = "Category:";
//     const categoryInput = document.createElement('input');
//     categoryInput.type = "text";
//     categoryInput.required = true;

//     const submitButton = document.createElement('button');
//     submitButton.type = "submit";
//     submitButton.textContent = "Add Quote";

//     // Append elements to the form
//     form.appendChild(textLabel);
//     form.appendChild(textInput);
//     form.appendChild(document.createElement('br'));
//     form.appendChild(categoryLabel);
//     form.appendChild(categoryInput);
//     form.appendChild(document.createElement('br'));
//     form.appendChild(submitButton);

//     // Handle form submission
//     form.addEventListener('submit', function (event) {
//         event.preventDefault();
//         const newQuote = {
//             text: textInput.value.trim(),
//             category: categoryInput.value.trim()
//         };
//         if (newQuote.text && newQuote.category) {
//             quotes.push(newQuote); // Add the new quote to the array
//             textInput.value = ''; // Clear input fields
//             categoryInput.value = '';
//             showRandomQuote(); // Display a random quote
//         } else {
//             alert("Please fill out both fields.");
//         }
//     });

//     // Replace the quote display with the form
//     quoteDisplay.innerHTML = '';
//     quoteDisplay.appendChild(form);
// }

// // Event listener for the "Show New Quote" button
// document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// // Event listener for adding a new quote (you can add a button for this in the HTML if needed)
// // For now, we'll call it manually or integrate it into the UI as needed.

// // Initial display of a random quote
// showRandomQuote();
//// document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
{/* THIS TO BE ADDED TO THE HTML FILE <button id="addQuote">Add New Quote</button> */}




