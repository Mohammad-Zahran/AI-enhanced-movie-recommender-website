const input = document.querySelector('input');
const send = document.querySelector('button');
const chatContainer = document.querySelector('.chats');

send.onclick = () => {
    if (input.value) {
        const userMessage = `
            <div class="message">
                <div>${input.value}</div>
            </div>
        `;
        chatContainer.innerHTML += userMessage;
        scrollDown();

        // Add loading animation immediately after the user message
        chatContainer.innerHTML += `
            <div class="message response">
                <div>
                    <img src="../assets/images/preloader.gif" alt="preloader">
                </div>
            </div>
        `;
        scrollDown();

        bot(); // Call bot function to get response
        input.value = null;
    }
}

// When pressing Enter key
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        send.click();
    }
});

// Scroll down when a new message is added
function scrollDown() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Bot response
function bot() {
    const http = new XMLHttpRequest();
    const data = new FormData();
    data.append('prompt', input.value);
    http.open('POST', './../../server/request.php', true);
    http.send(data);

    http.onload = () => {
        const response = JSON.parse(http.response);
        const replyText = response.error ? "Sorry, there was an error with the response." : processResponse(response.response);

        // Update the loading animation container with the actual response text
        const replyContainer = document.querySelectorAll('.response');
        const lastReply = replyContainer[replyContainer.length - 1];
        
        if (lastReply) {
            lastReply.querySelector('div').innerHTML = replyText;
        }

        scrollDown();
    }
}

function processResponse(res) {
    return res.replace(/(\r\n|\r|\n)/gm, '').trim();
}
