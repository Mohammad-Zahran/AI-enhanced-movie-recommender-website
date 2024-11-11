class Movies{

    constructor(apiUrl){
        this.apiUrl = apiUrl;
    }

    async fetchMovies(){
        try{
            const response = await fetch(`${this.apiUrl}/getMovies.php`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            const rawResponse = await response.text();  // Log raw response as text
            console.log(rawResponse);
            const movies = JSON.parse(rawResponse);
            
            const sixMovies = movies.slice(0, 6);
            this.displayMovies(sixMovies)
        }
        catch(error){
            console.error("Error fetching data ", error);
        }
    }

    displayMovies(movies) {
        const movies_cards = document.getElementById("movies-cards");
        movies.forEach(movie=>{
            const movieCard = `
                <div class="movie-card">
                    <img src="${movie.image}" alt="${movie.movie_title} poster" class="movie-poster">
                    <div class="movie-details">
                        <h4 class="movie-title">${movie.movie_title}</h4>
                        <span class="movie-duration">${movie.duaration}</span>
                        <div class="movie-icons">
                            <span class="like">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up like-btn">
                                    <path d="M7 10v12"/>
                                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
                                </svg>
                                <p class="likes-number">${movie.number_of_likes}</p>
                            </span>
                            <span class="bookmark-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark">
                                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                </svg>
                            </span>
                        </div>
                        <div class="movie-rating">
                            <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                        </div>
                    </div>
                </div>
            `;
            movies_cards.innerHTML += movieCard;
        });
    }
}

const movieFetcher = new Movies('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server');
movieFetcher.fetchMovies();