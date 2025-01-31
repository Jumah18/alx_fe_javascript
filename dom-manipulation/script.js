// Define an array to store quote objects
let quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "inspirational" },
    { text: "The way to get started is to quit talking and begin doing.", category: "motivational" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "You only live once, but if you do it right, once is enough.", category: "life" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>- ${randomQuote.category}</em></p>`;
}

// Function to create a form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <h3>Add a New Quote</h3>
        <input type="text" id="quoteText" placeholder="Enter your quote" required>
        <input type="text" id="quoteCategory" placeholder="Enter category" required>
        <button id="addQuote">Add Quote</button>
    `;
    
    document.body.appendChild(formContainer);

    // Adding event listener to the "Add Quote" button
    document.getElementById('addQuote').addEventListener('click', () => {
        const quoteText = document.getElementById('quoteText').value;
        const quoteCategory = document.getElementById('quoteCategory').value;

        if (quoteText && quoteCategory) {
            // Add the new quote to the quotes array
            quotes.push({ text: quoteText, category: quoteCategory });
            alert("Quote added!");
            
            // Clear the input fields
            document.getElementById('quoteText').value = '';
            document.getElementById('quoteCategory').value = '';
        } else {
            alert("Please fill in both fields.");
        }
    });
}

// Attach event listener to the button to show a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to create the add quote form
createAddQuoteForm();

// Show an initial random quote when the page loads
showRandomQuote();


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




