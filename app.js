const API_KEY = 'a51df9b01c944c22d31e89e81d80a907';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesgrid = document.getElementById('movies-grid');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('error-message');

const ObtenerPeliculas = async () => {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`;
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    return datos.results;
}

const crearTarjeta = (pelicula) => {
    // Corregido: release_date (sin 'e' intermedia)
    const { title, release_date, vote_average, poster_path } = pelicula; 
    const año = release_date ? release_date.split('-')[0] : 'N/A';
    const image = poster_path ? `${IMAGE_URL}${poster_path}` : '';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    
    return `
        <article class="movie-card">
            <div class="movie-Card__poster">
                <img class="movie-card__image" src="${image}" alt="${title}">
                <span class="movie-card__rating">${rating}</span>
            </div>
            <div>
                <h3 class="movie-card__title">${title}</h3>
                <p class="movie-card__year">${año}</p>
            </div>
        </article>
    `;
}

const mostrarLoading = () => {
    loadingDiv.style.display = 'flex';
    errorDiv.style.display = 'none';
    moviesgrid.innerHTML = '';
}

const consultarLoading = () => {
    loadingDiv.style.display = 'none';
}

const mostrarError = (mensaje) => {
    consultarLoading();
    errorMessage.textContent = mensaje; // Corregido: textContent
    errorDiv.style.display = 'flex';
    moviesgrid.innerHTML = '';
}

const iniciar = async () => {
    console.log('Mostrar película');
    mostrarLoading();
    try {
        const peliculas = await ObtenerPeliculas();
        console.log(`${peliculas.length} películas obtenidas`);
        consultarLoading();
        moviesgrid.innerHTML = peliculas.map(crearTarjeta).join('');
        console.log('Películas renderizadas con éxito');
    } catch (error) { // Corregido: incluir (error)
        console.error('Error al cargar:', error);
        let mensaje = 'No se pudo cargar películas';
        
        if (error.message.includes('401')) {
            mensaje = 'API key inválida, verifica tu clave';
        } else if (error.message.includes('429')) {
            mensaje = 'Demasiadas peticiones. Espera un momento';
        } else if (error.message.includes('Failed to fetch')) {
            mensaje = 'Error de conexión. Revisa tu internet';
        }
        
        mostrarError(mensaje); // Corregido: pasar parámetro mensaje
    }
}

iniciar();
