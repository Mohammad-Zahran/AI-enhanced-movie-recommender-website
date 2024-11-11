// Burger Menu
const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");
var startButton = document.getElementById("start");
var start = document.getElementById("start-now");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("active");
});
