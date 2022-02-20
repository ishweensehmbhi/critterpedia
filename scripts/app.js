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

// Assign an event listener to the form, get form results from user, process results
app.getFormResults = () => {
	const formElement = document.querySelector("form");
	formElement.addEventListener("submit", function (e) {
		e.preventDefault();
		// Get user's selected hemisphere, handled with a "required" attribute by browser
		const hemisphere = document.querySelector(
			"input[name=hemisphere]:checked"
		).value;
		// Get user's selected month
		const month = parseInt(
			document.querySelector("option:checked").value
		);

		// If valid data entered
		if (hemisphere && month) {
			// Make API call when user submits correcct form info
			app.getData(hemisphere, month);
			const tabsContainer = document.querySelector(".tabs");
			tabsContainer.style.display = "flex";
		} else if (!hemisphere || !month) {
			// Graceful error handling if results are invalid
			const resultsSection =
				document.querySelector(".info .wrapper");
			const errorMessage = document.createElement("h2");
			errorMessage.innerHTML =
				"My feathers! Something has gone terribly wrong. Could you please try again?";
			resultsSection.appendChild(errorMessage);
		}
	});
};

// Request information from the API based on user's responses
app.getData = (hemisphere, month) => {
	// Clear previous results or error messages
	document.querySelector(`.bugsResultList`).innerHTML = "";
	document.querySelector(`.fishResultList`).innerHTML = "";
	document.querySelector(`.seaCreatureResultList`).innerHTML = "";

	// Create an array of endpoints
	const endpointValues = ["bugs/", "fish/", "sea/"];

	// Define a function which fetches creature data and parses it into JSON
	async function getCreatureData(endpoint) {
		const creatureDataRequest = await fetch(`${app.apiUrl}${endpoint}`);
		const creatureDataJson = await creatureDataRequest.json();
		return creatureDataJson;
	}

	// Save all promises to an array
	const creatureDataList = endpointValues.map((endpoint) => {
		return getCreatureData(endpoint);
	});

	// Resolve all promises and work with the returned data
	Promise.all(creatureDataList).then((creatureData) => {
		// Now we are returned an array of objects and we must filter out which creatures to display

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

		// Call the display info method for each array
		app.displayInfo(matchedBugsArray, "bugs");
		app.displayInfo(matchedFishArray, "fish");
		app.displayInfo(matchedSeaCreatureArray, "seaCreature");
	});

	// Set default tab to the bugs tab
	const bugsResults = document.querySelector(".bugsResults");
	// Change Blathers' mood! He hates bugs!
	app.blathersIconChange("panic");
	bugsResults.classList.add("activeResultsTab");
};

// Change Blathers' mood
app.blathersIconChange = (mood) => {
	const blathersIcon = document.querySelector(".blathersContainer img");
	if (mood == "panic") {
		blathersIcon.src = "./assets/blathers_panic.png";
	} else if (mood == "chill") {
		blathersIcon.src = "./assets/blathers_icon.png";
	}
};

// Results event listener
app.resultsEventListener = () => {
	// Select all the results tab buttons
	const resultsBtns = document.querySelectorAll(".tabs a");

	// Select the Blathers icon
	const blathersIcon = document.querySelector(".blathersContainer img");

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
				// Change blathers image to blathers panic because he hates bugs
				app.blathersIconChange("panic");
			} else if (this.classList.contains("viewFishBtn")) {
				fishResults.classList.add("activeResultsTab");
				app.blathersIconChange("chill");
			} else if (this.classList.contains("viewSeaCreaturesBtn")) {
				seaCreatureResults.classList.add("activeResultsTab");
				app.blathersIconChange("chill");
			}
		});
	});
};

// Display specified info from each filtered creature array
app.displayInfo = (matchedArray, critterType) => {
	// Select the corresponding ul element that the critter list elements will be appended to
	const ulElement = document.querySelector(`.${critterType}ResultList`);

	// Go through the critter array and generate a list element
	matchedArray.forEach((critter) => {
		const critterName = critter.name["name-USen"];
		const critterIcon = critter["icon_uri"];
		const critterFact = critter["museum-phrase"];
		let critterTime = critter.availability.time;
		if (critter.availability.isAllDay) {
			critterTime = "all day!";
		}
		let primaryAttribute = "";
		let primaryValue = "";
		let secondaryAttribute = "";
		let secondaryValue = "";
		if (critterType == "bugs" || critterType == "fish") {
			primaryAttribute = "location";
			primaryValue = critter.availability.location;
			secondaryAttribute = "rarity";
			secondaryValue = critter.availability.rarity;
		} else {
			primaryAttribute = "speed";
			primaryValue = critter.speed;
			secondaryAttribute = "shadow";
			secondaryValue = critter.shadow;
		}

		// Create html elements to add to page
		const newCritter = document.createElement("li");
		newCritter.classList.add("itemCard");
		newCritter.innerHTML = `
			<h3>${critterName}</h3>
			<img src="${critterIcon}" alt="animated icon of ${critterName}"></img>
			<h4 class="itemSubheading">time</h4>
			<p class="itemProperty">${critterTime}</p>
			<h4 class="itemSubheading">${primaryAttribute}</h4>
			<p class="itemProperty">${primaryValue}</p>
			<h4 class="itemSubheading">${secondaryAttribute}</h4>
			<p class="itemProperty">${secondaryValue}</p>
		`;
		ulElement.appendChild(newCritter);
	});
};

// Initialize app
app.init = () => {
	app.getFormResults();
	app.resultsEventListener();
};

// Start app
app.init();
