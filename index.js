const claveApi = "xxx"; // Reemplace "xxx" con clave API

const bibliaIdInglés = "9879dbb7cfe39e4d-04"; // World English Bible
const bibliaIdEspañol = "48acedcf8595c754-01"; // Spanish Bible, Palabla de Dios para ti

const solicitudOptions = {
  method: "GET",
  headers: {
    "api-key": `${claveApi}`,
  },
};

function buscarBiblia(buscarEntradaId, resultadoDivId) {
  let buscarEntradaValor = document.getElementById(buscarEntradaId).value;
  let resultadoDiv = document.getElementById(resultadoDivId);

  let url = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibliaIdEspañol}/search`
  );

  url.searchParams.append("query", buscarEntradaValor);
  url.searchParams.append("limit", 5);

  console.log("URL: ", url);

  fetch(url, solicitudOptions)
    .then((respuesta) => {
      if (!respuesta.ok) {
        console.log(respuesta);
        throw new Error("El estado de la respuesta HTTP no era 'OK'");
      }
      return respuesta.json();
    })
    .then((datos) => {
      let respuestaHTML = `
      <div class="título-elemento-resultado">
        <h2>Español</h2>
      </div>`;

      for (verso of datos.data.verses) {
        console.log(verso.reference);
        console.log(verso.text);

        respuestaHTML = respuestaHTML.concat(`
        <div class="elemento-resultado">
            <div><b>${verso.reference}</b></div>
            <div>${verso.text}</div>
        </div>`);
      }

      resultadoDiv.innerHTML = respuestaHTML;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
