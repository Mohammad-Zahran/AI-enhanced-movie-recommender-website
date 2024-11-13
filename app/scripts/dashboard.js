document.addEventListener('DOMContentLoaded', function() {
    // Fetch the dashboard stats from the API
    fetch('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/getDashboardStats.php')
        .then(response => response.json())
        .then(data => {
            // Update the stats on the page
            document.getElementById('total-users').textContent = data.total_users;
            document.getElementById('total-admins').textContent = data.total_admins;
        })
        .catch(error => {
            console.error('Error fetching dashboard stats:', error);
            // Handle any errors
            document.getElementById('total-users').textContent = 'Error';
            document.getElementById('total-admins').textContent = 'Error';
        });
});