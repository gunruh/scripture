const apiKey = "xxx"; // Replace "xxx" with API Key

const bibleIdEnglish = "9879dbb7cfe39e4d-04"; // World English Bible
const bibleIdSpanish = "48acedcf8595c754-01"; // Spanish Bible, Palabla de Dios para ti
const bibleIdKiche = "a77409f7cf5be995-01"; // Nuevo Testamento K'iche' of Totonicapan

const requestOptions = {
  method: "GET",
  headers: {
    "api-key": `${apiKey}`,
  },
};

async function searchBible(searchInputId, resultDivId) {
  let searchInputText = document.getElementById(searchInputId).value;
  let resultDiv = document.getElementById(resultDivId);

  // Set up initial card text
  let leftCardHTML = `
  <div class="result-item-header">
    <h2>K'iche'</h2>
  </div>`;

  let centerCardHTML = `
  <div class="result-item-header">
    <h2>English</h2>
  </div>`;

  let rightCardHTML = `
  <div class="result-item-header">
    <h2>Espa&ntilde;ol</h2>
  </div>`;

  // Search Bible
  let url = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibleIdEnglish}/search`
  );

  url.searchParams.append("query", searchInputText);
  url.searchParams.append("limit", 5);
  url.searchParams.append("range", "MAT-REV"); // Only search New Testament

  console.log("URL: ", url);

  // Search for verses
  const searchBibleResponseJson = await fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("HTTP searchBible - Response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  for (verse of searchBibleResponseJson.data.verses) {

    // Get verse in alternate languages
    let verseUrl = new URL(
      `https://api.scripture.api.bible/v1/bibles/${bibleIdSpanish}/verses/${verse.id}`
    );

    verseUrl.searchParams.append("parallels", bibleIdKiche);
    verseUrl.searchParams.append("include-titles", false);
    verseUrl.searchParams.append("include-verse-numbers", false);

    const getVerseResponseJson = await fetch(verseUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error("HTTP getVerse - Response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    let verseKiche = getVerseResponseJson.data.parallels[0];
    let verseEnglish = verse;
    let verseSpanish = getVerseResponseJson.data;

    leftCardHTML = leftCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseKiche.reference}</b></div>
        <div>${verseKiche.content}</div>
      </div>`);

    centerCardHTML = centerCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseEnglish.reference}</b></div>
        <div>${verseEnglish.text}</div>
      </div>`);

    rightCardHTML = rightCardHTML.concat(`
      <div class="result-item">
        <div><b>${verseSpanish.reference}</b></div>
        <div>${verseSpanish.content}</div>
      </div>`);
  }

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
}