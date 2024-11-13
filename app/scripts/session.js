document.addEventListener("DOMContentLoaded", async () => {
    const userInfo = document.getElementById("user-info");

    // Check if the user is logged in by calling the checkSession.php
    try {
        const response = await fetch("../server/checkSession.php");
        const data = await response.json();

        if (data.status === "Logged in") {
            // Display username and logout button
            userInfo.innerHTML = `
                <span>
                    ${data.username.slice(0,2).toUpperCase()}
                </span>
                <button class="button login" id="logout-btn">Logout</button>
            `;
            // Handle logout button click
            document.getElementById("logout-btn").addEventListener("click", async () => {
                const logoutResponse = await fetch("../server/logout.php");
                const logoutData = await logoutResponse.json();
                alert(logoutData.message);
                window.location.href = "index.html"; // Redirect to login page after logout
            });
        } else {
            // Show the login/register button if the user is not logged in
            userInfo.innerHTML = `<a href="./pages/login.html" class="button">Login</a>`;
        }
    } catch (error) {
        console.error("Error checking session:", error);
    }
});
