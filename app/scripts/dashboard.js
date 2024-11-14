document.addEventListener('DOMContentLoaded', function () {
    // Fetch dashboard stats
    fetch('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/getDashboardStats.php')
        .then(response => response.json())
        .then(data => {
            // Update user and admin stats
            document.getElementById('total-users').textContent = data.total_users;
            document.getElementById('total-admins').textContent = data.total_admins;
        })
        .catch(error => {
            console.error('Error fetching dashboard stats:', error);
            document.getElementById('total-users').textContent = 'Error';
            document.getElementById('total-admins').textContent = 'Error';
        });

    // Fetch movie count
    fetch('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/getMoviesCount.php')
        .then(response_2 => response_2.json())
        .then(data => {
            if (data.success) {
                // Update movie count
                document.getElementById('total-movies').textContent = data.total_movies;
            } else {
                document.getElementById('total-movies').textContent = 'Error';
            }
        })
        .catch(error => {
            console.error('Error fetching movie count:', error);
            document.getElementById('total-movies').textContent = 'Error';
        });
});
