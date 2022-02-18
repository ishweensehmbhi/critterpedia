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

app.apiUrl = "https://acnhapi.com/v1/";

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
		const month = parseInt(
			document.querySelector("option:checked").value
		);

		// Make API call when user submits form info
		app.getData(hemisphere, month);
	});
};

// Listen for a click on the "info" button
app.infoEventListener = () => {
	const infoBtn = document.querySelector(".infoLink");
	const popup = document.querySelector(".popup");
	const closeBtn = document.querySelector(".closeButton");

	// When info btn is clicked, show popup
	infoBtn.addEventListener("click", function () {
		popup.style.display = "block";
	});
	// When span is clicked, close popup

	closeBtn.addEventListener("click", function () {
		popup.style.display = "none";
	});
};

// Results event listener
app.resultsEventListener = () => {
	// Select all the results tab buttons
	const resultsBtns = document.querySelectorAll(".tabs a");

	// Select all the results divs
	const bugsResults = document.querySelector(".bugsResults");
	const fishResults = document.querySelector(".fishResults");
	const seaCreatureResults = document.querySelector(".seaCreatureResults");

	// For each of the results buttons, add an event listener
	resultsBtns.forEach((button) => {
		// Whenever a button is pressed execute the following instructions
		button.addEventListener("click", function (e) {
			// Remove active results from each of the results tabs
			e.preventDefault();
			bugsResults.classList.remove("activeResultsTab");
			fishResults.classList.remove("activeResultsTab");
			seaCreatureResults.classList.remove("activeResultsTab");

			// Add the active result to the tab for which the button was clicked
			if (this.classList.contains("viewBugsBtn")) {
				bugsResults.classList.add("activeResultsTab");
			} else if (this.classList.contains("viewFishBtn")) {
				fishResults.classList.add("activeResultsTab");
			} else if (this.classList.contains("viewSeaCreaturesBtn")) {
				seaCreatureResults.classList.add("activeResultsTab");
			}
		});
	});
};

// Get information from the API based on user responses
app.getData = (hemisphere, month) => {
	// Create an array of endpoints
	const endpointValues = ["bugs/", "fish/", "sea/"];

	// Define a function which fetches creature data and parses it into JSON
	async function getCreatureData(endpoint) {
		// Make a fetch request
		const creatureDataRequest = await fetch(`${app.apiUrl}${endpoint}`);
		// request for a JSON parse
		const creatureDataJson = await creatureDataRequest.json();
		return creatureDataJson;
	}

	// Save all promises to an array
	const creatureDataList = endpointValues.map((endpoint) => {
		return getCreatureData(endpoint);
	});

	// Resolve all promises and work with the returned data
	Promise.all(creatureDataList).then((creatureData) => {
		// Now we are returned an array of objects and we must filter out which ones to display

		// For each of the creature-type (bug, fish, sea) we will create a separate array so that filtering is easier
		const bugsArray = Object.values(creatureData[0]);
		const fishArray = Object.values(creatureData[1]);
		const seaCreatureArray = Object.values(creatureData[2]);

		// Check if specified month exists in respective hemisphere array
		const matchedBugsArray = bugsArray.filter(
			(bug) =>
				// check if corresponding hemisphere availability array includes chosen month
				bug.availability[`month-array-${hemisphere}`].includes(
					month
				) == true
		);

		// Check if specified month exists in respective hemisphere array
		const matchedFishArray = fishArray.filter(
			(fish) =>
				// check if corresponding hemisphere availability array includes chosen month
				fish.availability[`month-array-${hemisphere}`].includes(
					month
				) == true
		);

		// Check if specified month exists in respective hemisphere array
		const matchedSeaCreatureArray = seaCreatureArray.filter(
			(seaCreature) =>
				// check if corresponding hemisphere availability array includes chosen month
				seaCreature.availability[
					`month-array-${hemisphere}`
				].includes(month) == true
		);

		// Now we have 3 arrays with matched creatures
		// Get all of the bug info
		/*const bugName = bug.name["name-USen"];
			const bugFact = bug["museum-phrase"];
			const bugIcon = bug["icon_uri"];
			const bugLocation = bug.availability.location;
			const bugRarity = bug.availability.rarity;*/
		// Use this bug info to build an li element
		// Append the li element to the respective results div
	});

	const bugsResults = document.querySelector(".bugsResults");
	bugsResults.classList.add("activeResultsTab");
};

// Initialize app
app.init = () => {
	app.infoEventListener();
	app.getFormResults();
	app.resultsEventListener();
};

// Start app
app.init();
