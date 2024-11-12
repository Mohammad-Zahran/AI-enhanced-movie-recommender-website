document.addEventListener("DOMContentLoaded", async () => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    console.log(movieId)

    if (movieId) {
        try {
            const response = await fetch(`http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/getMovieById.php?id=${movieId}`, {
                method: "GET",
            });

            const movie = await response.json();

            console.log(movie)

            const movieDetailsContainer = document.getElementById("movie-details-container");
            movieDetailsContainer.innerHTML = `
                <h2>${movie.movie_title}</h2>
                <img src="${movie.image}" alt="${movie.movie_title}">
                <p class="summary">Summary: ${movie.summary}</p>
                <p class="duration">Duration: ${movie.duaration}</p>
                <p class="genre">Genre: ${movie.genre}</p>
            `;

            if(movie.director !== null){
                movieDetailsContainer.innerHTML += `
                    <p class="director">Director: ${movie.director}</p>
                `;
            }

            if(movie.cast !== null){
                movieDetailsContainer.innerHTML += `
                    <p class="cast">Cast: ${movie.cast}</p>
                `;
            }

            movieDetailsContainer.innerHTML +=`
                <p class="released-date">Released Date: ${movie.release_date}</p>
                <p class="likes">Likes: ${movie.number_of_likes}</p>
            `;

            if(movie.nationality !== null){
                movieDetailsContainer.innerHTML += `
                    <p class="nationality">Nationality: ${movie.nationality}</p>
                `;
            }

        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }
});
