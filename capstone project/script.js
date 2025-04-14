const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieContainer = document.getElementById('movies');
const categoryButtons = document.querySelectorAll('.category-btn');

const BASE_URL = 'https://api.themoviedb.org/3/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentCategory = 'popular';

// Function to fetch movies from TMDB API
async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        movieContainer.innerHTML = '<p>Error fetching movies.</p>';
        return [];
    }
}

// Function to display movies
function displayMovies(movies) {
    movieContainer.innerHTML = '';
    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const posterPath = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : './assets/placeholder.png';
        const title = movie.title || movie.name;
        const releaseDate = movie.release_date ? `Release Date: ${movie.release_date}` : 'Release Date: N/A';
        const overview = movie.overview ? movie.overview : 'No overview available.';

        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${title}">
            <h3>${title}</h3>
            <p class="release-date">${releaseDate}</p>
            <p class="overview">${overview}</p>
        `;
        movieContainer.appendChild(movieCard);
    });
}

// Function to load movies by category
async function loadMovies(category) {
    const url = `${BASE_URL}/${category}?api_key=${apiKey}`;
    const movies = await fetchMovies(url);
    displayMovies(movies);
}

// Function to handle search
async function handleSearch(query) {
    if (query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const movies = await fetchMovies(url);
        displayMovies(movies);
    } else {
        loadMovies(currentCategory);
    }
}

// Initial load
loadMovies(currentCategory);

// Event listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.dataset.category;
        loadMovies(currentCategory);
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

searchButton.addEventListener('click', () => handleSearch(searchInput.value));

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSearch(searchInput.value);
});
