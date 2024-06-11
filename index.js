const apiKey = "xxx"; // Replace "xxx" with API Key

const bibleIdEnglish = "9879dbb7cfe39e4d-04"; // World English Bible
const bibleIdSpanish = "48acedcf8595c754-01"; // Spanish Bible, Palabla de Dios para ti

const requestOptions = {
  method: "GET",
  headers: {
    "api-key": `${apiKey}`,
  },
};

function searchBible(searchInputId, resultDivId) {
  let searchInputText = document.getElementById(searchInputId).value;
  let resultDiv = document.getElementById(resultDivId);

  let url = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibleIdEnglish}/search`
  );

  url.searchParams.append("query", searchInputText);
  url.searchParams.append("limit", 5);

  console.log("URL: ", url);

  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error("HTTP Response was not ok");
      }
      return response.json();
    })
    .then((data) => {
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

      for (verse of data.data.verses) {
        console.log(verse.reference);
        console.log(verse.text);

        // TODO Make additional REST call here
        // Escape k'iche' (') characters
        leftCardHTML = leftCardHTML.concat(`
          <div class="result-item">
            <div><b>2 Corintios 5:7</b></div>
            <div><p class=\"p\">Rumal ri kojob\'al uj k\'aslik man rumal ta ri kaqilo. </p></div>
          </div>`);

        centerCardHTML = centerCardHTML.concat(`
          <div class="result-item">
            <div><b>${verse.reference}</b></div>
            <div>${verse.text}</div>
          </div>`);

        rightCardHTML = rightCardHTML.concat(`
          <div class="result-item">
            <div><b>2 Corintios 5:7</b></div>
            <div><p class=\"p\">porque vivimos por fe, no por vista. </p></div>
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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
