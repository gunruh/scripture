const apiKey = "xxx"; // Reemplace "xxx" con la clave API.

const bibleIdKiche = "a77409f7cf5be995-01"; // ID de la Biblia para "Nuevo Testamento K'iche' of Totonicapan"
const bibleIdSpanish = "48acedcf8595c754-01"; // ID de la Biblia para "Spanish Bible, Palabla de Dios para ti"
const bibleIdEnglish = "9879dbb7cfe39e4d-04"; // ID de la Biblia para "World English Bible"

// Crea "RequestOptions" para enviar en cada solicitud HTTP.
const requestOptions = {
  method: "GET",
  headers: {
    "api-key": `${apiKey}`,
  },
};

// Esta función busca en la API de la Biblia usando la palabra clave del elemento <input> dado.
// Luego coloca los resultados de la búsqueda en el elemento <div> del resultado dado.
async function searchBible(searchInputId, resultDivId) {
  
  // Obtener los elementos HTML.
  let searchInput = document.getElementById(searchInputId); // Obtiene el elemento <input>.
  let resultDiv = document.getElementById(resultDivId); // Obtiene el resultado del elemento <div>.

  // Configura el texto del encabezado para cada tarjeta <div>.
  let leftCardHTML = `
  <div class="result-item-header">
    <h2>K'iche'</h2>
  </div>`;

  // Nota: El carácter ñ en "Español" se representa como "&ntilde;" en HTML.
  let centerCardHTML = `
  <div class="result-item-header">
    <h2>Espa&ntilde;ol</h2>
  </div>`;

  let rightCardHTML = `
  <div class="result-item-header">
    <h2>Inglés</h2>
  </div>`;

  // Crea un objeto URL de búsqueda de la Biblia.
  let searchUrl = new URL(
    `https://api.scripture.api.bible/v1/bibles/${bibleIdSpanish}/search`
  );

  // Agrega parámetros de consulta a la URL.
  searchUrl.searchParams.append("query", searchInput.value);
  searchUrl.searchParams.append("limit", 5);
  searchUrl.searchParams.append("range", "MAT-REV"); // Solo busca Nuevo Testamento, Mateo (MAT) - Apocalipsis (REV).

  // Envía la URL creada a los registros de la consola de herramientas de desarrollo.
  console.log("Bible Search URL: ", searchUrl);

  // Inicia el icono de carga.
  resultDiv.innerHTML = `
  <img class="loading-icon" src="icons/spinner-solid.svg"></img>`;

  // Envía una solicitud HTTP a la URL para buscar versículos que contengan las palabras de búsqueda.
  const searchBibleResponseJson = await fetch(searchUrl, requestOptions)
    .then((response) => {

      // Si el estado de la respuesta HTTP no es 200 (OK), registra la respuesta y arroja un error.
      if (!response.ok) {
        console.log("Bible Search response:", response);
        throw new Error("HTTP searchBible - Response was not ok");
      }

      // Devuelve el cuerpo de la respuesta JSON.
      return response.json();
    })
    .catch((error) => {
      // Registra cualquier error detectado en la consola.
      console.error("An error was caught during Search Bible request:", error);
    });

  // Recorre cada verso devuelto en el resultado de la búsqueda para obtener su información.
  for (verse of searchBibleResponseJson.data.verses) {

    // Crea una nueva URL para obtener este versículo de las otras ID de la Biblia.
    let verseUrl = new URL(
      `https://api.scripture.api.bible/v1/bibles/${bibleIdEnglish}/verses/${verse.id}`
    );

    // Agregue parámetros de consulta a la URL del verso.
    verseUrl.searchParams.append("parallels", bibleIdKiche);
    verseUrl.searchParams.append("include-titles", false);
    verseUrl.searchParams.append("include-verse-numbers", false);

    // Envía la URL creada a los registros de la consola de herramientas de desarrollo.
    console.log("Get Verse URL: ", verseUrl);

    // Envíe una solicitud HTTP para obtener el versículo en las ID de la Biblia adicionales.
    const getVerseResponseJson = await fetch(verseUrl, requestOptions)
      .then((response) => {
        
        // Si el estado de la respuesta no es 200 (OK), registra la respuesta.
        if (!response.ok) {
          console.log("Get Verse response:", response);
          throw new Error("HTTP Get Verse - Response was not ok");
        }

        // Devuelve el cuerpo de la respuesta JSON.
        return response.json();
      })
      .catch((error) => {
        // Registra cualquier error detectado en la consola.
        console.error("An error was caught during Get Verse request:", error);
      });

    // Definir variables para los versos k'iche', español e inglés.
    let verseKiche = getVerseResponseJson.data.parallels[0];
    let verseSpanish = verse;
    let verseEnglish = getVerseResponseJson.data;

    // Agrega la información de cada verso a la tarjeta <div> correcta.
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

  // Establece el contenido del resultado <div> para que contenga las 3 tarjetas <div>s.
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

  // El siguiente código es opcional...

  /*
    Debido a que los versos tienen diferentes alturas en diferentes idiomas,
    Podemos alinear los elementos de resultado del verso dándole a cada elemento de resultado del verso <div> en una fila una altura coincidente.
    El siguiente código alinea los elementos de resultados del verso en las tarjetas para que se alineen de izquierda a derecha.
    
    Primero, encuentre el versículo con la altura de texto más grande de los 3.
    Configure cada uno de los 3 versos de esa fila para que tengan la misma altura que el verso más grande.
    Repita esto para cada fila de versos.
  */

  // Primero, obtenga una lista que contenga cada una de las tarjetas <div>.
  let cardDivArray = resultDiv.getElementsByClassName("result-item-card");

  // Ahora repite el número de versos en la tarjeta.
  // Usamos el número de versos de la primera (0ª) tarjeta, pero todos deben ser iguales.

  // Comienza la cuenta en 0 para rastrear en qué fila de versos estamos (de arriba a abajo).
  // Continúa el bucle hasta que nuestro conteo alcance la longitud de la lista de versos (hasta que llegue al final de la tarjeta).
  // Después de cada bucle, aumenta 'count' en 1 para avanzar al siguiente elemento de resultado del verso.
  for ( var count = 0; count < cardDivArray[0].getElementsByClassName("result-item").length; count++ ) {
    
    // Crea variables de matriz (listas).
    let itemDivRow = []; // Una lista para cada elemento de resultado <div> en una fila (de izquierda a derecha).
    let itemDivHeights = []; // Una lista de las alturas de cada elemento de resultado <div> en una fila (de izquierda a derecha).

    // Recorre la lista de tarjetas <div>s.
    for (cardDiv of cardDivArray) {

      // Obtiene el <div> del elemento resultante que queremos agregar a nuestra lista.
      let itemDiv = cardDiv.getElementsByClassName("result-item")[count];
      
      itemDivRow.push(itemDiv); // Agrega el <div> a una lista.
      itemDivHeights.push(itemDiv.clientHeight); // Agrega la altura del <div> a una lista separada.
    }

    // Encuentra la altura máxima en la lista de alturas <div>.
    let maxHeight = Math.max(...itemDivHeights);

    // Recorre cada <div> de la lista y establece su altura en la altura máxima que encontramos.
    for (itemDiv of itemDivRow) {
      itemDiv.setAttribute("style", `height: ${maxHeight}px`);
      itemDiv.style.height = `${maxHeight}px`; // Establece una configuración alternativa para la compatibilidad entre navegadores.
    }
  }
}
