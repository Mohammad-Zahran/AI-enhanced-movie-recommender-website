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

// Put response
