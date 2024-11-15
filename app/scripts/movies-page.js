class MoviesPage{

    constructor(apiUrl, userId){
        this.apiUrl = apiUrl;
        this.userId = userId;
    }

    // fetch the API of get movies
    async fetchMovies(){
        try{
            const response = await fetch(`${this.apiUrl}/getMovies.php`);
            if (!response.ok) throw new Error('Failed to fetch movies');
            const rawResponse = await response.text();
            const movies = JSON.parse(rawResponse);
            
            const userRatings = await this.fetchUserRatings() || [];
            await this.displayMoviesOnPage(movies, userRatings);
        }
        catch(error){
            console.error("Error fetching data ", error);
        }
    }
    async markLikedMovies(movies){
        try{
            const LikesResponse = await fetch(`${this.apiUrl}/getLike.php?user_id=${this.userId}`);
            if (!LikesResponse.ok) throw new Error('Failed to fetch Likes');
            const responseData = await LikesResponse.json();

            const likes = responseData.likedMovies;

            if (Array.isArray(likes)) {
    
                movies.forEach(movie => {
                    const movieCard = document.getElementById(`movie-${movie.id}`);
                
                    const likeBtn = movieCard.querySelector(".like-btn");

                    if (likes.includes(movie.id)) {
                        likeBtn.classList.add("active");
                    } else {
                        likeBtn.classList.remove("active");
                    }
                });
                
            } else {
                console.error("Invalid likes data format:", likes);
            }
        }
        catch (error) {
            console.error("Error fetching likes", error);
        }
    }

    async markBookmarkedMovies(movies){
        try{
            const LikesResponse = await fetch(`${this.apiUrl}/getBookmark.php?user_id=${this.userId}`);
            if (!LikesResponse.ok) throw new Error('Failed to fetch likes');
            const responseData = await LikesResponse.json();

            console.log("Response Data:", responseData);

            const likes = responseData.bookmarkedMovies;

            if (Array.isArray(likes)) {
    
                movies.forEach(movie => {
                    const movieCard = document.getElementById(`movie-${movie.id}`);
                
                    const likeBtn = movieCard.querySelector(".bookmark-btn");

                    if (likes.includes(movie.id)) {
                        likeBtn.classList.toggle("active");
                    } else {
                        likeBtn.classList.remove("active");
                    }
                });
                
            } else {
                console.error("Invalid likes data format:", likes);
            }
        }
        catch (error) {
            console.error("Error fetching likes", error);
        }
    }

    // Track click event
    async trackClick(movieId) {

        const response = await fetch(`${this.apiUrl}/updateClicksDuration.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.userId,
                movieId: movieId,
                action: 'click'
            }),
        })
        
        if (response.ok){
            console.log("done click");
        }
    }

    // function to display all movies on a page
    async displayMoviesOnPage(movies, userRatings = []) {
        const movies_cards = document.getElementById("movies-cards-page");
        if (!movies_cards) return;
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart like-btn"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
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
            console.log(movie.id)

            // Display the saved rating for this movie, if available
            const savedRating = userRatings.find(r => r.movie_id === movie.id);
            if (savedRating) {
                const stars = movieCard.querySelectorAll(".movie-rating i");
                stars.forEach((star, index) => {
                    if (index < savedRating.rate) {
                        star.classList.add("active");
                    }
                });
            }

            const bookmark_button = movieCard.querySelector(".bookmark-btn");
            bookmark_button.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleBookmark(e, movie.id, bookmark_button);
            });

            movieCard.addEventListener("click", () => {
                this.trackClick(movie.id);
                setTimeout(() => {
                    window.location.href = `../pages/movie-details.html?id=${movie.id}`;
                }, 500);
            });

            const like_btn = movieCard.querySelector(".like-btn");
            like_btn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleLikeBtn(movie.id, like_btn);
            });
        });

        this.markBookmarkedMovies(movies);
        this.markLikedMovies(movies);

        const allMovieCards = movies_cards.querySelectorAll(".movie-card");
        allMovieCards.forEach(card => {
            const stars = card.querySelectorAll(".movie-rating i");
            let currentRating = 0;

            stars.forEach((star, index) => {
                star.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    if (index === 0 && star.classList.contains("active")) {
                        // If first star is clicked and already active, reset rating
                        stars.forEach(s => s.classList.remove("active"));
                        currentRating = 0;
                    } else {
                        // Set rating based on clicked star index
                        currentRating = index + 1;
                        stars.forEach((s, i) => {
                            i < currentRating ? s.classList.add("active") : s.classList.remove("active");
                        });
                    }
                    // Send the rating to the server
                    const movieId = card.id.split('-')[1]; // Extract movie ID
                    try {
                        const response = await fetch(`${this.apiUrl}/rateMovie.php`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: this.userId,
                                movieId: movieId,
                                rating: currentRating,
                            }),
                        });
                        const result = await response.json();
                        if (result.status === "Success") {
                            console.log("Rating submitted:", currentRating);
                        } else {
                            console.error("Error submitting rating:", result.message);
                        }
                    } catch (error) {
                        console.error("Failed to submit rating:", error);
                    }
                });
            });
        });
    }

    async toggleBookmark(event, movieId, bookmarkBtn){
        try {
            const response = await fetch(`${this.apiUrl}/bookmark.php?user_id=${this.userId}&movie_id=${movieId}`);
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

    async toggleLikeBtn(movieId, likeBtn){
        try {
            const response = await fetch(`${this.apiUrl}/like.php?user_id=${this.userId}&movie_id=${movieId}`);
            const result = await response.json();

            if (result.message === "Added") {
                // Toggle the "filled" class on success
                likeBtn.classList.toggle("active");
            } 
            else if(result.message === "Deleted"){
                likeBtn.classList.remove("active");
            }
            else if (result.error) {
                console.error(result.error);
            }
            
            const movieCard = document.getElementById(`movie-${movieId}`);
            const likesNumber = movieCard.querySelector(".likes-number");
            let currentLikes = parseInt(likesNumber.textContent);

            // Update the number of likes
            if (likeBtn.classList.contains("active")) {
                currentLikes += 1; // increment
            } 
            else {
                currentLikes -= 1; // Decrement
            }

            likesNumber.textContent = currentLikes;

            // Update the like count in the database
            await this.updateLikesInDatabase(movieId, currentLikes);
        } 
        catch (error) {
            console.error("Error updating like status:", error);
        }
    }

    async updateLikesInDatabase(movieId, currentLikes) {
        try {
            const response = await fetch(`${this.apiUrl}/updateLikes.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    movieId: movieId,
                    currentLikes: currentLikes,
                }),
            });
    
            const result = await response.json();
            if (result.status === "Success") {
            } else {
                console.error("Error updating like count in database:", result.message);
            }
        } catch (error) {
            console.error("Error updating like count in database:", error);
        }
    }

    async fetchUserRatings() {
        try {
            const response = await fetch(`${this.apiUrl}/getUserRatings.php?user_id=${this.userId}`);
            if (!response.ok) throw new Error("Failed to fetch user ratings");
            const data = await response.json();
            console.log("User Ratings:", data);
            return data.ratings;
        } 
        catch (error) {
            console.error("Error fetching user ratings", error);
            return [];
        }
    }   
}

document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("UserId");
    const moviePageFetcher = new MoviesPage('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server', userId);
    moviePageFetcher.fetchMovies();
    
});