const form = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", emailInput.value);
    data.append("password", passwordInput.value);

    try {
        const response = await axios({
            method: "POST",
            url: "http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/login.php",
            data: data,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const responseData = response.data;
        console.log(responseData);

        if (responseData.status === "Successful") {
            alert("Login Successful");
            window.location.href = "../index.html"; 
        } else {
            alert(responseData.message); 
        }
    } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to reach the server.");
    }
});
