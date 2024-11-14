document.addEventListener("DOMContentLoaded", async () => {
    const userInfo = document.getElementById("user-info");

    // Check if the user is logged in by calling the checkSession.php
    try {
        const response = await fetch("../server/checkSession.php");
        const data = await response.json();

        if (data.status === "Logged in") {
            
            // Display username and logout button
            const accountLink = document.createElement('a');
            accountLink.id = 'account';
            accountLink.href = '';
            accountLink.innerHTML = `
                <div class="account flex center">
                    ${data.username.slice(0, 2).toUpperCase()}
                </div>
            `;

            // Append the new element to the userInfo container
            userInfo.appendChild(accountLink);

            // Attach the event listener
            const accountInfoDiv = document.getElementById('account-info');
            accountLink.addEventListener('click', (event) => {
                event.preventDefault();
                accountInfoDiv.classList.toggle('hidden');
            });

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