document.addEventListener('DOMContentLoaded', function () {
    // Fetch the user data from getUsers.php
    fetch('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/getUsers.php')
        .then(response => response.json())
        .then(data => {
            // Get the table body element
            const tableBody = document.querySelector('.Users tbody');

            // Build the rows as a single HTML string
            let rowsHTML = '';

            data.forEach(user => {
                rowsHTML += `
                    <tr data-user-id="${user.id}">
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>Null</td>
                        <td>Null</td>
                        <td>${user.bookmark_count}</td>
                        <td>${user.role === "admin" ? "Admin" : user.is_banned ? "Banned" : "Not Banned"}</td>
                        <td class="flex center">
                            <button class="options popup_button">
                                <img src="../assets/icons/three-dots.svg" alt="">
                            </button>
                        </td>
                    </tr>
                `;
            });

            // Set the HTML of the table body
            tableBody.innerHTML = rowsHTML;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });

    // Handle the popup menu with event delegation
    const tableContainer = document.querySelector('.table-container');
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <p>
            <button class="user-edit-button set-admin-button">Set admin</button>
            <button class="user-edit-button ban-user-button">Ban user</button>
        </p>
    `;
    popup.style.display = 'none'; // Initially hidden
    document.body.appendChild(popup);

    // Store the current user ID
    let currentUserId = null;

    // Event delegation for the popup buttons
    tableContainer.addEventListener('click', function (event) {
        const target = event.target.closest('.popup_button');

        if (target) {
            // Toggle the popup
            if (popup.style.display === 'block') {
                popup.style.display = 'none';
            } else {
                const row = target.closest('tr');
                currentUserId = row.getAttribute('data-user-id'); // Get user ID from the row

                const buttonRect = target.getBoundingClientRect();
                popup.style.top = `${buttonRect.bottom + window.scrollY}px`;
                popup.style.left = `${buttonRect.left + window.scrollX}px`;
                popup.style.display = 'block';
            }
        } else if (!event.target.closest('.popup')) {
            // Hide the popup when clicking outside
            popup.style.display = 'none';
        }
    });

    // Handle Set Admin button
    popup.addEventListener('click', function (event) {
        if (event.target.classList.contains('set-admin-button')) {
            if (!currentUserId) {
                alert('No user selected');
                return;
            }

            // Send API request to set admin
            fetch('http://localhost/FSW-SE-Factory/AI-enhanced-movie-recommender-website/server/setAdmin.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ user_id: currentUserId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('User role updated to admin');
                        // Update the user role in the table
                        const row = document.querySelector(`tr[data-user-id="${currentUserId}"]`);
                        const roleCell = row.querySelector('td:nth-child(3)'); // Update role column
                        roleCell.textContent = 'admin';
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error updating user role:', error);
                    alert('Error updating user role');
                });

            // Hide the popup
            popup.style.display = 'none';
        }
    });

    // Hide popup when clicking anywhere outside it
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.popup') && !event.target.closest('.popup_button')) {
            popup.style.display = 'none';
        }
    });
});
