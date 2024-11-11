import puppeteer from "puppeteer";
import fs from "fs";

const getMovies = async () => {
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  await page.goto("https://www.pathe.fr/cinemas/cinema-pathe-wilson", {
    waitUntil: "domcontentloaded",
    timeout: 200000, 
  });

  await page.waitForSelector(".card-screening__content .h3 a");

  // Get page data
  const movies = await page.evaluate(() => {
    const cardList = document.querySelectorAll(".card-screening__content");

    return Array.from(cardList).map(card => {
      // Extract the title
      const titleElement = card.querySelector('.h3 a');
      const title = titleElement ? titleElement.textContent.trim() : null;

      // Extract the image URL
      const imageElement = card.querySelector('.card-screening__img img');
      let imageUrl = imageElement ? imageElement.getAttribute('src') : null;
      if (imageUrl && imageUrl === '/assets/source/img/poster-placeholder-pathe-empty.jpg') {
        imageUrl = 'https://www.pathe.fr/assets/source/img/poster-placeholder-pathe-empty.jpg';
      }

      // Extract the genre and duration
      const genreDurationElement = card.querySelector('.ft-secondary span');
      let genres = null;
      let duration = null;
      if (genreDurationElement) {
          const genreDurationText = genreDurationElement.textContent;
          [genres, duration] = genreDurationText.split('(');
          genres = genres.trim();
          duration = duration ? duration.replace(')', '').trim() : null;
      }

      const movieLink = titleElement ? titleElement.href : null;

      return { title, imageUrl, genres, duration, movieLink };
    });
  });

  // Fetch additional details for each movie
  for (const movie of movies) {
    if (movie.movieLink) {
      // Open a new page for each movie
      const moviePage = await browser.newPage();
      await moviePage.goto(movie.movieLink, { waitUntil: "domcontentloaded" });

      movie.additionalData = await moviePage.evaluate(() => {
        const releaseDateElement = document.querySelector('.ft-default.c-white-70.mb-0.mb-md-0');

        let releaseDate = '';
        if (releaseDateElement) {
          // Split the text content by " : " to get the date part
          const parts = releaseDateElement.textContent.split(" : ");
          if (parts.length > 1) {
            releaseDate = parts[1].trim(); // Get the date part and trim any whitespace
          }
        }

        const numberOfLikes = document.querySelector('.hero-film__subtitle .ft-secondary') ? document.querySelector('.hero-film__subtitle .ft-secondary').textContent.trim() : 'N/A';
        const summary = document.querySelector('.hero-film__desc') ? document.querySelector('.hero-film__desc').textContent.trim() : null;
        const directors = document.querySelector('ul li strong') ? document.querySelector('ul li strong').textContent.trim() : null;

        // Extract cast information
        const castElement = document.querySelector('.ft-default.c-white-70.mb-1');
        let cast = [];
        if (castElement) {
          const castSpans = castElement.querySelectorAll('span.c-white');
          cast = Array.from(castSpans, span => span.textContent.trim());
        }
        if (cast.length > 1) {
          cast = cast.slice(0, -1); // Remove the last element if it's the director
        }
        cast = cast.length === 0 ? null : cast; // Set cast to null if empty

        // Extract nationality
        const nationalityElement = document.querySelector('ul.c-white-50.ft-default.list.mt-2 li:nth-child(3) strong');
        const nationality = nationalityElement ? nationalityElement.textContent.trim() : null;




        return { numberOfLikes, summary, directors, cast, releaseDate, nationality };
      });

      await moviePage.close();
    }
  }


  fs.writeFileSync("movies.json", JSON.stringify(movies, null, 2), "utf-8");

  console.log("Data saved to movies.json");
  console.log("Total movies:", movies.length);

  // Close the browser
  await browser.close();
};

// Start the scraping
getMovies();