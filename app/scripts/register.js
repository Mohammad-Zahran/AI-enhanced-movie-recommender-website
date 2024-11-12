const form = document.querySelector('.form');
const UsernameInput = document.getElementById('username');
const EmailInput = document.getElementById('email');
const PasswordInput = document.getElementById('password');

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // this is called to prevent normall submitings 

    const data = new FormData();
    data.append("username", UsernameInput.value);
    data.append("email", EmailInput.value);
    data.append("password", PasswordInput.value);

    try {
        const response = await axios({
            method: "POST",
            url: "http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/register.php",
            data: data, 
        });

        console.log(response.data); 

        if (response.data.status === "Successful") {
            alert("Registration Successful");
        } else {
            alert(response.data.message); 
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to reach the server."); 
    }
});
