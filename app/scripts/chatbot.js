const input = document.querySelector('input');
const send = document.getElementById('send');
const chatContainer = document.querySelector('.chats');
const newChatButton = document.getElementById("new-chat-btn");
const chatHistoryContainer = document.querySelector(".chat-history");

const userId = localStorage.getItem("UserId");
let chatId = localStorage.getItem("ChatId") || generateChatId();

function generateChatId(){
    return Math.ceil((Math.random() * 100));
}

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

        bot(input.value); // Call bot function to get response
        input.value = null;
    }
}

// When pressing Enter key
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        console.log('Enter key pressed');
        e.preventDefault();
        send.click();
    }
});

// Scroll down when a new message is added
function scrollDown() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Bot response
function bot(userMessage) {
    const http = new XMLHttpRequest();
    const data = new FormData();
    data.append('prompt', userMessage);
    data.append("user_id", userId);
    data.append("chat_id", chatId);
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

        saveChatHistory();
    };
}

function processResponse(res) {
    return res.replace(/(\r\n|\r|\n)/gm, '').trim();
}

newChatButton.addEventListener("click", () => { 
    console.log("New chat button clicked"); 

    saveChatHistory();

    chatContainer.innerHTML = ''; 

    chatId = generateChatId(); 

    localStorage.setItem("ChatId", chatId);

    const lastMessage = chatContainer.querySelector('.message:last-child'); 
    const snippet = lastMessage ? lastMessage.innerText : 'No messages'; 
    const timestamp = new Date().toLocaleString(); 

    chatHistoryContainer.innerHTML += ` 
        <div class="chat-item"> 
            <p class="chat-title">Chat with Robima</p> 
            <p class="chat-snippet">${snippet}</p> 
            <span class="chat-timestamp">${timestamp}</span> 
        </div>
    `; 
});

function saveChatHistory() { 
    const chatHistory = localStorage.getItem("ChatHistory") || "[]"; 
    const chatHistoryArray = JSON.parse(chatHistory); 
    const currentChat = { 
        chatId: chatId, 
        chatContent: chatContainer.innerHTML 
    }; 
    chatHistoryArray.push(currentChat); 
    localStorage.setItem("ChatHistory", JSON.stringify(chatHistoryArray));
}

function loadChatHistory() { 
    const chatHistory = localStorage.getItem("ChatHistory") || "[]"; 
    const chatHistoryArray = JSON.parse(chatHistory); 
    chatHistoryArray.forEach(chat => { 
        if (chat.chatId === chatId) { 
            chatContainer.innerHTML = chat.chatContent; 
        } 
        else { 
            const lastMessage = chat.chatContent.split('<div class="message">').pop().split('</div>')[0]; 
            const snippet = lastMessage ? lastMessage : 'No messages'; 
            const timestamp = new Date().toLocaleString(); 
            chatHistoryContainer.innerHTML += ` 
                <div class="chat-item"> 
                <p class="chat-title">Chat with Robima</p> 
                <p class="chat-snippet">${snippet}</p> 
                <span class="chat-timestamp">${timestamp}</span> 
                </div> 
            `; 
        } 
    }); 
}      
window.onload = loadChatHistory;