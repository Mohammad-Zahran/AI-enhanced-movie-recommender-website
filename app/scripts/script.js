class Movies{

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
            
            const eightMovies = movies.slice(0, 8);
            const userRatings = await this.fetchUserRatings() || [];
            this.displayMovies(eightMovies, userRatings);

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

    // function to display movies on the section movies
    async displayMovies(movies, userRatings = []) {
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

            movieCard.addEventListener("click", () => {
                this.trackClick(movie.id);
                setTimeout(() => {
                    window.location.href = `./pages/movie-details.html?id=${movie.id}`;
                }, 500);
                
            });

            const bookmark_button = movieCard.querySelector(".bookmark-btn");
            bookmark_button.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleBookmark(movie.id, bookmark_button);
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

    async toggleBookmark(movieId, likeBtn){
        try {
            const response = await fetch(`${this.apiUrl}/bookmark.php?user_id=${this.userId}&movie_id=${movieId}`);
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
        } catch (error) {
            console.error("Error updating bookmark status:", error);
        }
    }

    async toggleLikeBtn(movieId, likeBtn){
        try {
            const response = await fetch(`${this.apiUrl}/like.php?user_id=${this.userId}&movie_id=${movieId}`);
            const result = await response.json();

            if (result.message === "Added") {
                likeBtn.classList.add("active");
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
            this.updateMostPopularMoviesLikes(movieId, currentLikes);

        } catch (error) {
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
            const swiper_slide = document.createElement('div');
            swiper_slide.classList.add('swiper-slide');
            swiper_slide.id = `popular-${movie.id}`;
            swiper_slide.innerHTML =`
                <div class="popular-number">${count++}</div>
                <img src="${movie.image}" alt="${movie.movie_title} poster" class="movie-poster">
                <div class="popular-details">
                    <h3>${movie.movie_title}</h3>
                    <p>Number of likes: <span class="number_of_likes">${movie.number_of_likes}</span></p>
                    <p>Top spot this week for action fans!</p>
                </div>
            `;
            swiper_wrapper.appendChild(swiper_slide);

            swiper_slide.addEventListener("click", () => {
                this.trackClick(movie.id);
                setTimeout(() => {
                    window.location.href = `./pages/movie-details.html?id=${movie.id}`;
                }, 500);
            });
        });
    }

    async updateMostPopularMoviesLikes(movieId, currentLikes) {
        console.log("hello");
        const swiperSlide = document.getElementById(`popular-${movieId}`);
        if(swiperSlide){
            const numberOfLikes = swiperSlide.querySelector(".number_of_likes");

            if(numberOfLikes){
                numberOfLikes.textContent = currentLikes;
            }
            else {
                console.error("Number of likes element not found.");
            }
        } 
        else {
            console.error("Popular movie slide not found.");
        }
    }

    viewMore(){
        const view_button = document.getElementById("view-more-btn");
        view_button.addEventListener("click", ()=>{
            window.location.href = "./pages/movies-page.html";
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("UserId");
    const movieFetcher = new Movies('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server', userId);
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

// Pop up for the admin page - Start
const popup_buttons = document.querySelectorAll('.popup_button');

popup_buttons.forEach(button => {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
  
  <p>
    <button class="user-edit-button">Set admin</button>
    <button class="user-edit-button">Ban user</button>
    <button class="user-delete-button">Delete user</button>
  </p>
  
  `;

  document.body.appendChild(popup);
  button.addEventListener('click', function() {
    if (popup.style.display === 'block') {
      popup.style.display = 'none';
    } else {
      const buttonRect = button.getBoundingClientRect();
      popup.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
      popup.style.left = `${buttonRect.left + window.scrollX}px`;
      popup.style.display = 'block';
    }
  });
});
// Pop up for the admin page - End