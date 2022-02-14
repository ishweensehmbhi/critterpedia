// Record user's input on submit (event listener)
// Create a URL object with specified params (e.g. query fish, query bugs, query sea creatures, etc.)
// Fetch object, parse into JSON, this will return an object of objects (item)
// Then use a for-each loop to iterate over each item and its properties, save all of these individual objects to an array
// Use a filter method to take only the objects which have an availability (month-array-northern and month-array-southern) matching the user's specified month
// Create a "li" element to display each "item" as a card using the following properties:
// item.title, item.museum_fact, item.location, etc...
// Add the information above to the li
// Append the li to the end of the ul which will host each of the fish, sea creatures, and bug sections.

const app = {};

app.apiUrl = "https://acnhapi.com/v1";

// Get form results
app.getFormResults = () => {
	const formElement = document.querySelector("form");
	formElement.addEventListener("submit", function (e) {
		e.preventDefault();
		// Get user's selected hemisphere
		const hemisphere = document.querySelector(
			"input[name=hemisphere]:checked"
		).value;
		// Get user's selected month
		const month = document.querySelector("option:checked").value;
	});
};

// Get information from the API
app.getData = () => {
	// Fetch method for bugs
	fetch(`${app.apiUrl}/bugs`)
		.then(function (response) {
			return response.json();
		})
		.then(function (jsonResponse) {
			console.log(jsonResponse);
			// Constructor to build out li elements
		});

	// Fetch method for fish
	fetch(`${app.apiUrl}/fish`)
		.then(function (response) {
			return response.json();
		})
		.then(function (jsonResponse) {
			console.log(jsonResponse);
		});

	// Fetch method for sea creatures
	fetch(`${app.apiUrl}/sea`)
		.then(function (response) {
			return response.json();
		})
		.then(function (jsonResponse) {
			console.log(jsonResponse);
		});
};

// Initialize app
app.init = () => {
	app.getFormResults();
	// app.getData();
};

// Start app
app.init();
