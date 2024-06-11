const apiKey = "xxx"; // Replace "xxx" with API Key

const bibleIdEnglish = "9879dbb7cfe39e4d-04"; // World English Bible
const bibleIdSpanish = "48acedcf8595c754-01"; // Spanish Bible, Palabla de Dios para ti

const requestOptions = {
  method: "GET",
  headers: {
    "api-key": `${apiKey}`,
  },
};

function searchBible(bibleId, searchInputText, resultElement) {
  let url = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/search`
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
      let responseHTML = `
      <div class="result-item-header">
        <h2>English</h2>
      </div>`;

      for (verse of data.data.verses) {
        console.log(verse.reference);
        console.log(verse.text);

        responseHTML = responseHTML.concat(`
        <div class="result-item">
            <div><b>${verse.reference}</b></div>
            <div>${verse.text}</div>
        </div>`);
      }

      resultElement.innerHTML = responseHTML;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
