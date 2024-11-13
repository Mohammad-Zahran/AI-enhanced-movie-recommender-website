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
    var http = new XMLHttpRequest()
    var data = new FormData()
    data.append('prompt', input.value)
    http.open('POST', 'request.php', true)
    http.send(data)
    setTimeout(() => {
        // preloader
        chatContainer.innerHTML += `
        <div class="message response">
            <div>
                <img src="../assets/img/preloader.gif" alt="preloader">
            </div>
        </div>
        `
        scrollDown();
    }, 1000);
    http.onload = () => {
        // process response
    let response = JSON.parse(http.response)
    let replyText = processResponse(response.choices[0].text)
    let replyContainer = document.querySelectorAll('.response')
    replyContainer[replyContainer.length-1].querySelector('div').innerHTML = replyText
    scrollDown();
    }
}

function processResponse(res){
    let arr = res.split(':')
    return arr[arr.length-1]
        .replace(/(\r\n|\r|\n)/gm, '')
        .trim()
}
