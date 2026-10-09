const API_KEY = 'a51df9b01c944c22d31e89e81d80a907';
const BASE_URL='https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesgrid=document.getElementById('movies-grid');

const ObtenerPeliculas=async()=>{
    const url=`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos.results;
}

const crearTarjeta=(pelicula)=>{
    const{title,realease_date,vote_average,poster_path}=pelicula;
    const año=realease_date ? realease_date.split('-')[0]:'N/A';
    const image=poster_path ? `${IMAGE_URL}${poster_path}`:'';
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
const iniciar=async()=>{
    console.log('Mostrar pelicula');
    mostrarLoading();
    try{
        const peliculas=await ObtenerPeliculas();
        console.log(`${peliculas.length} peliculas obtenidas`);
        consultarLoading();
        moviesgrid.innerHTML = peliculas.map(crearTarjeta).join('');
        console.log('Primera pelicula renderizada');
    }catch{
        console.log('Error',console.error);
        let mensaje='No se pudo cargar peliculas';
        if(error.message.includes('401')){
            mensaje='API key invalida, verifica tu clave';
        }else if(error.message.includes('fetch')){
            mensaje='API key invalida, verifica tu clave'
        }else if(error.message.includes('429')){
            mensaje='Existen demasiadas peticiones. Espera un momento'
        }
        mostrarError();
    }

    //const primera=peliculas[10];
    //console.log('Primera pelicula',primera);

}
/*
const probarApi=async()=>{
    const url=`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`;
    console.log('Url de la peticion',url);
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console. log('Respuesta completa',datos);
    console.log('Peliculas',datos.results);
    console.log('Total de resultados',datos.total_results);
}
probarApi();
*/
iniciar();

const loadingDiv=document.getElementById('loading');
const errorDiv=document.getElementById('error');
const errorMessage=document.getElementById('error-message');

const mostrarLoading=()=>{
    loadingDiv.style.display='flex';
    errorDiv.style.display='none';
    moviesgrid.innerHTML='';
}
const consultarLoading=()=>{
    loadingDiv.style.display='none';
}
const mostrarError=(mensaje)=>{
    consultarLoading();
    errorMessage=mensaje;
    errorDiv.style.display='flex';
    moviesgrid.innerHTML='';
}
