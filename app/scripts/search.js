document.getElementById("search-button").addEventListener("click", function() {
    const query = document.getElementById("search-input").value;
    fetchMovies(query);
});

function fetchMovies(query) {
    fetch(`http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/searchMovies.php?search=${query}`)
        .then(response => response.json())
        .then(movies => {
            const movieCardsContainer = document.getElementById("movies-cards");
            movieCardsContainer.innerHTML = '';  

            if (movies.length > 0) {
                movies.forEach(movie => {
                    const movieCard = document.createElement("div");
                    movieCard.classList.add("movie-card");

                    movieCard.innerHTML = `
                        <div class="movie-card-image">
                            <img src="${movie.image}" alt="${movie.movie_title}">
                    `;
                    movieCard.addEventListener("click", () => {
                        window.location.href = `pages/movie-details.html?id=${movie.id}`;
                    });

                    movieCardsContainer.appendChild(movieCard);
                });
            } else {
                movieCardsContainer.innerHTML = "<p>No movies found.</p>";
            }
        })
        .catch(error => console.error("Error fetching movies:", error));
}
