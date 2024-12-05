// Sostituisci con la tua API Key
const API_KEY = 'OGMwfspHeGheDL287wAHFStFjewPD1sfNE8yMbAwEmYy5MbuJOqFXx1X';

// URL per la ricerca delle immagini
// `query=landscape`: Specifica che vogliamo immagini paesaggistiche
// `per_page=52`: Limita il numero di immagini restituite dall'API a 52
const API_URL = 'https://api.pexels.com/v1/search?query=landscape&per_page=52';

// Funzione per creare il mosaico di immagini
function loadMosaic(images) {
    // Trova il contenitore del mosaico nell'HTML
    const mosaicContainer = document.getElementById('mosaic-container');

    // Itera attraverso le immagini passate come parametro
    images.forEach(photo => {
        // Crea un elemento `<img>` per ogni immagine
        const imgElement = document.createElement('img');
        imgElement.src = photo.src.medium; // Imposta l'URL dell'immagine
        imgElement.alt = photo.alt || 'Mosaic Image'; // Imposta l'attributo `alt` per accessibilità

        // Aggiunge l'immagine al contenitore del mosaico
        mosaicContainer.appendChild(imgElement);
    });
}

// Funzione principale per caricare le immagini
function loadImages() {
    // Effettua una chiamata API usando `fetch`
    fetch(API_URL, {
        headers: {
            Authorization: API_KEY // Autorizzazione con la chiave API
        }
    })
        .then(response => {
            // Controlla se la risposta è valida
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Converte la risposta in JSON
        })
        .then(data => {
            // Ottieni il numero totale di immagini ricevute
            const totalImages = data.photos.length;

            // Controlla se ci sono abbastanza immagini per tutte le sezioni
            if (totalImages < 47) {
                console.error('Non ci sono abbastanza immagini per layout e mosaico');
                return; // Interrompe l'esecuzione se non ci sono immagini sufficienti
            }

            // *** SEZIONE 1: Layout principale ***
            // Trova il contenitore del layout principale
            const layout = document.getElementById('photo-layout');

            // Usa le prime 5 immagini per creare il layout principale
            data.photos.slice(0, 5).forEach((photo, index) => {
                // Determina se l'immagine è in posizione pari o dispari
                const isEven = index % 2 === 0;

                // Crea l'HTML per ogni immagine nel layout principale
                const photoItem = `
                    <div class="photo-item">
                        ${isEven ? `<img src="${photo.src.large}" alt="${photo.alt || 'Image'}">` : ''}
                        <div class="photo-description">
                            <p>${photo.alt || 'No description available.'}</p>
                        </div>
                        ${!isEven ? `<img src="${photo.src.large}" alt="${photo.alt || 'Image'}">` : ''}
                    </div>
                `;

                // Aggiunge l'HTML generato al contenitore del layout principale
                layout.innerHTML += photoItem;
            });

            // *** SEZIONE 2: Carosello ***
            // Trova gli elementi del carosello nell'HTML
            const carouselIndicators = document.querySelector('#photo-carousel .carousel-indicators');
            const carouselInner = document.querySelector('#photo-carousel .carousel-inner');

            // Usa le immagini dalla 6 alla 15 per il carosello
            data.photos.slice(5, 15).forEach((photo, index) => {
                // Determina quale immagine è attiva (la prima è attiva)
                const isActive = index === 0 ? 'active' : '';

                // Crea il bottone per l'indicatore del carosello
                const indicatorHTML = `
                    <button type="button" data-bs-target="#photo-carousel" 
                            data-bs-slide-to="${index}" class="${isActive}" aria-current="true"></button>
                `;

                // Crea l'immagine per il carosello
                const slideHTML = `
                    <div class="carousel-item ${isActive}">
                        <img src="${photo.src.large}" class="d-block w-100" alt="${photo.alt || 'Image'}">
                    </div>
                `;

                // Aggiunge gli elementi al carosello
                carouselIndicators.innerHTML += indicatorHTML;
                carouselInner.innerHTML += slideHTML;
            });

            // *** SEZIONE 3: Mosaico ***
            // Usa le immagini dalla 16 alla 40 per il mosaico
            loadMosaic(data.photos.slice(15, 40));
        })
        .catch(error => {
            // Gestisce eventuali errori durante la chiamata API
            console.error('Error fetching images:', error);
        });
}

// Avvia il caricamento delle immagini al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadImages);
