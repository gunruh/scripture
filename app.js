const apiKey = "xxx"; // Replace "xxx" with API Key

const bibleIdKiche = "a77409f7cf5be995-01"; // Bible Id for "Nuevo Testamento K'iche' of Totonicapan"
const bibleIdSpanish = "48acedcf8595c754-01"; // Bible Id for "Spanish Bible, Palabla de Dios para ti"
const bibleIdEnglish = "9879dbb7cfe39e4d-04"; // Bible Id for "World English Bible"

// Create "RequestOptions" to send on each HTTP request.
const requestOptions = {
  method: "GET",
  headers: {
    "api-key": `${apiKey}`,
  },
};

// This function searches the Bible API using the keyword from the given <input> element.
// Then it puts the search results into the given result <div> element.
async function searchBible(searchInputId, resultDivId) {
  
  // Get the HTML elements.
  let searchInput = document.getElementById(searchInputId); // Get the <input> element.
  let resultDiv = document.getElementById(resultDivId); // Get the result <div> element.

  // Set up the header text for each card <div>.
  let leftCardHTML = `
  <div class="result-item-header">
    <h2>K'iche'</h2>
  </div>`;

  // Note: The ñ character in "Español" is represented as "&ntilde;" in HTML.
  let centerCardHTML = `
  <div class="result-item-header">
    <h2>Espa&ntilde;ol</h2>
  </div>`;

  let rightCardHTML = `
  <div class="result-item-header">
    <h2>Inglés</h2>
  </div>`;

  // Create a search Bible URL object.
  let searchUrl = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibleIdSpanish}/search`
  );

  // Add query parameters to the URL.
  searchUrl.searchParams.append("query", searchInput.value);
  searchUrl.searchParams.append("limit", 5);
  searchUrl.searchParams.append("range", "MAT-REV"); // Only search New Testament (Matthew - Revelation)

  // Output the created URL to the Developer Tools console logs.
  console.log("Bible Search URL: ", searchUrl);

  // Start the loading-icon.
  resultDiv.innerHTML = `
  <img class="loading-icon" src="icons/spinner-solid.svg"></img>`;

  // Send an HTTP request to the URL to search for verses containing the search words.
  const searchBibleResponseJson = await fetch(searchUrl, requestOptions)
    .then((response) => {

      // If the HTTP response status is not 200 (OK), log the response and throw an error.
      if (!response.ok) {
        console.log("Bible Search response:", response);
        throw new Error("HTTP searchBible - Response was not ok");
      }

      // Return the response body JSON.
      return response.json();
    })
    .catch((error) => {
      // Log any caught error to the console.
      console.error("An error was caught during Search Bible request:", error);
    });

  // Loop through each verse returned in the search result to get its information.
  for (verse of searchBibleResponseJson.data.verses) {

    // Create a new URL to get this verse from the other Bible IDs.
    let verseUrl = new URL(
      `https://api.scripture.api.bible/v1/bibles/${bibleIdEnglish}/verses/${verse.id}`
    );

    // Add query parameters to the verse URL.
    verseUrl.searchParams.append("parallels", bibleIdKiche);
    verseUrl.searchParams.append("include-titles", false);
    verseUrl.searchParams.append("include-verse-numbers", false);

    // Output the created URL to the Developer Tools console logs.
    console.log("Get Verse URL: ", verseUrl);

    // Send an HTTP request to get the verse in the additional Bible IDs.
    const getVerseResponseJson = await fetch(verseUrl, requestOptions)
      .then((response) => {
        
        // If the response status is not 200 (OK), log the response
        if (!response.ok) {
          console.log("Get Verse response:", response);
          throw new Error("HTTP Get Verse - Response was not ok");
        }

        // Return the response body JSON.
        return response.json();
      })
      .catch((error) => {
        // Log any caught error to the console.
        console.error("An error was caught during Get Verse request:", error);
      });

    // Define variables for the K'iche', Spanish, and English verses.
    let verseKiche = getVerseResponseJson.data.parallels[0];
    let verseSpanish = verse;
    let verseEnglish = getVerseResponseJson.data;

    // Add the information from each verse to the correct card <div>.
    leftCardHTML = leftCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseKiche.reference}</b></div>
        <div>${verseKiche.content}</div>
      </div>`);

    centerCardHTML = centerCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseSpanish.reference}</b></div>
        <div>${verseSpanish.text}</div>
      </div>`);

    rightCardHTML = rightCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseEnglish.reference}</b></div>
        <div>${verseEnglish.content}</div>
      </div>`);
  }

  // Set the result <div> contents to contain the 3 card <divs>.
  resultDiv.innerHTML = `
      <div class="result-item-card">
        ${leftCardHTML}
      </div>
      <div class="result-item-card">
        ${centerCardHTML}
      </div>
      <div class="result-item-card">
        ${rightCardHTML}
      </div>`;

  // The below code is optional...

  /*
    Because verses are different heights in different languages,
    We can align the verse result-items by giving each verse result-item <div> in a row a matching height.
    The below code aligns verse result-items across the cards so that they line up from left to right.
    
    First, find the verse with the largest text height out of the 3.
    Set each of the 3 verses in that row to have the same height as the largest verse.
    Repeat this for each row of verses.
  */

  // First, get a list containing each of the card <div>s.
  let cardDivArray = resultDiv.getElementsByClassName("result-item-card");

  // Now Loop the number of verses on the card.
  // We use the number of verses from the first (0th) card, but they should all be the same.

  // Start the count at 0 to track which verse item row we're on (going from top to bottom).
  // Continue looping until our count reaches the length of the list of verses (Until it reaches the bottom of the card).
  // After each loop, increase 'count' by 1 to advance down to the next verse result-item.
  for ( var count = 0; count < cardDivArray[0].getElementsByClassName("result-item").length; count++ ) {
    
    // Create array variables (lists).
    let itemDivRow = []; // A list for each <div> result-item in a row (left to right).
    let itemDivHeights = []; // A list for the heights of each result-item <div> in a row (left to right).

    // Loop through the list of card <div>s
    for (cardDiv of cardDivArray) {

      // Get the <div> of the result-item that we want to add to our list.
      let itemDiv = cardDiv.getElementsByClassName("result-item")[count];
      
      itemDivRow.push(itemDiv); // Add the <div> to a list.
      itemDivHeights.push(itemDiv.clientHeight); // Add the <div>'s height to a separate list.
    }

    // Find the maximum height in the list of <div> heights.
    let maxHeight = Math.max(...itemDivHeights);

    // Loop through each <div> in the list and set its height to the maximum height that we found.
    for (itemDiv of itemDivRow) {
      itemDiv.setAttribute("style", `height: ${maxHeight}px`);
      itemDiv.style.height = `${maxHeight}px`; // Set an alternate setting for cross-browser compatibility.
    }
  }
}
