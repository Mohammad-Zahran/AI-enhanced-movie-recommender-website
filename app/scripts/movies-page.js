class MoviesPage{

    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }

    // fetch the API of get movies
    async fetchMovies(){
        try{
            const response = await fetch(`${this.apiUrl}/getMovies.php`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            const rawResponse = await response.text();
            const movies = JSON.parse(rawResponse);
            
            this.displayMoviesOnPage(movies);
        }
        catch(error){
            console.error("Error fetching data ", error);
        }
    }

    // function to display all movies on a page
    displayMoviesOnPage(movies) {
        const movies_cards = document.getElementById("movies-cards-page");
        if (!movies_cards) return;
        movies.forEach(movie=>{
            const movieCard = `
                <div class="movie-card">
                    <img src="${movie.image}" alt="${movie.movie_title} poster" class="movie-poster">
                    <span class="bookmark-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                    </span>
                    <div class="movie-details">
                        <div class="title-like-container">
                            <h4 class="movie-title">${movie.movie_title}</h4>
                            <span class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up like-btn">
                                    <path d="M7 10v12"/>
                                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                                </svg>
                                <p class="likes-number">${movie.number_of_likes}</p>
                            </span>
                        </div>
                        <span class="movie-duration">${movie.duaration}</span>
                        <div class="movie-rating">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                    </div>
                </div>
            `;
            movies_cards.innerHTML += movieCard;
        });

        const allMovieCards = movies_cards.querySelectorAll(".movie-card");
        allMovieCards.forEach(card => {
            const stars = card.querySelectorAll(".movie-rating i");
            stars.forEach((star, index1) => {
                star.addEventListener("click", () => {
                    stars.forEach((star, index2) => {
                        index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
                    });
                });
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const movieFetcher = new MoviesPage('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server');
    movieFetcher.fetchMovies();
});