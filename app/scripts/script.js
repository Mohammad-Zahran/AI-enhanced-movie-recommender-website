class Movies{

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
            
            const eightMovies = movies.slice(0, 8);
            this.displayMovies(eightMovies);
        }
        catch(error){
            console.error("Error fetching data ", error);
        }
    }

    async markBookmarkedMovies(movies){
        try{
            const bookmarkResponse = await fetch(`${this.apiUrl}/getBookmark.php?user_id=2`);
            if (!bookmarkResponse.ok) throw new Error('Failed to fetch bookmarks');
            const responseData = await bookmarkResponse.json();

            console.log("Response Data:", responseData);

            const bookmarks = responseData.bookmarkedMovies;

            if (Array.isArray(bookmarks)) {
                const bookmarkedIds = new Set(bookmarks.map(b => b.movie_id));
    
                movies.forEach(movie => {
                    const movieCard = document.getElementById(`movie-${movie.id}`);
                
                    const bookmarkBtn = movieCard.querySelector(".bookmark-btn");

                    if (bookmarks.includes(movie.id)) {
                        bookmarkBtn.classList.add("active");
                    } else {
                        bookmarkBtn.classList.remove("active");
                    }
                });
                
            } else {
                console.error("Invalid bookmarks data format:", bookmarks);
            }
        }
        catch (error) {
            console.error("Error fetching bookmarks", error);
        }
    }

    // function to display movies on the section movies
    displayMovies(movies) {
        const movies_cards = document.getElementById("movies-cards");
        movies.forEach(movie=>{
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.id = `movie-${movie.id}`;
            movieCard.innerHTML = `
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
            `;
            movies_cards.appendChild(movieCard);

            movieCard.addEventListener("click", () => {
                window.location.href = `./pages/movie-details.html?id=${movie.id}`;
            });

            const bookmark_button = movieCard.querySelector(".bookmark-btn");
            bookmark_button.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleBookmark(e, movie.id, bookmark_button);
            });

            
        });

        
        this.markBookmarkedMovies(movies);

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

    async toggleBookmark(event, movieId, bookmarkBtn){
        try {
            const userId = 2;
            const response = await fetch(`${this.apiUrl}/bookmark.php?user_id=${userId}&movie_id=${movieId}`);
            const result = await response.json();

            if (result.message === "Added") {
                // Toggle the "filled" class on success
                bookmarkBtn.classList.toggle("active");
            } 
            else if(result.message === "Deleted"){
                bookmarkBtn.classList.remove("active");
            }
            else if (result.error) {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error updating bookmark status:", error);
        }
    }
    
    // fetch the API of get the most popular movies
    async fetchMostPopularMovies(){
        try{
            const response = await fetch(`${this.apiUrl}/getMostPopularMovies.php`);
            if (!response.ok) throw new Error('Failed to fetch most popular movies');
            const data = await response.json();
            console.log(data);

            const mostPopular = data.movies.slice(0, 10);
            this.displayMostPopularMovies(mostPopular);
        }
        catch(error){
            console.error("Error fetching data ", error);
        }
    }

    // function to display most 10 popular moves
    displayMostPopularMovies(movies){
        let count = 1;
        const swiper_wrapper = document.getElementById("swiper-wrapper");
        movies.forEach(movie=>{
            const swiper_slide =`
                <div class="swiper-slide">
                    <div class="popular-number">${count++}</div>
                    <img src="${movie.image}" alt="${movie.movie_title} poster" class="movie-poster">
                    <div class="popular-details">
                        <h3>${movie.movie_title}</h3>
                        <p>Number of likes: ${movie.number_of_likes}</p>
                        <p>Top spot this week for action fans!</p>
                    </div>
                </div>
            `;
            swiper_wrapper.innerHTML += swiper_slide;
        });
    }

    viewMore(){
        const view_button = document.getElementById("view-more-btn");
        view_button.addEventListener("click", ()=>{
            window.location.href = "./pages/movies-page.html";
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const movieFetcher = new Movies('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server');
    movieFetcher.fetchMovies();
    movieFetcher.fetchMostPopularMovies();
    movieFetcher.viewMore();

    // Burger Menu
    const burger = document.getElementById("burger");
    const navLinks = document.querySelector(".nav-links");
    var startButton = document.getElementById("start");
    var start = document.getElementById("start-now");

    burger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burger.classList.toggle("active");
    });
});