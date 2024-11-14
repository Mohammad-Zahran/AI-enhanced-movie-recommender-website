const input = document.querySelector('input');
const send = document.querySelector('button');
const chatContainer = document.querySelector('.chats');

send.onclick = () => {
    if (input.value){
        const message = `
            <div class="message">
                <div>
                    ${input.value}
                </div>
            </div>
        `;
        chatContainer.innerHTML+=message;
        scrollDown();
        bot();
        input.value = null;
    }
}

// when click enter

input.addEventListener("keypress",function(e){
    if (e.key === "Enter"){
        e.preventDefault();
        send.click();
    }
});

// Scroll down when a new message is added

function scrollDown(){
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Bot response
function bot(){
    var http = new XMLHttpRequest();
    var data = new FormData();
    data.append('prompt', input.value);
    http.open('POST', './../../server/request.php', true);
    http.send(data);
    setTimeout(() => {
        // preloader
        chatContainer.innerHTML += `
        <div class="message response">
            <div>
                <img src="../assets/images/preloader.gif" alt="preloader">
            </div>
        </div>
        `
        scrollDown();
    }, 1000);
    http.onload = () => {
        var response = JSON.parse(http.response);
    
        if (response.error) {
            var replyText = "Sorry, there was an error with the response.";
        } 
        else {
            var replyText = processResponse(response.response);
        }
        var replyContainer = document.querySelectorAll('.response');
        replyContainer[replyContainer.length - 1].querySelector('div').innerHTML = replyText;
        scrollDown();
    }
}

function processResponse(res) {
    return res.replace(/(\r\n|\r|\n)/gm, '').trim();
}

