class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            maximizeButton: document.getElementById('maximizeButton'),
            liveChatButton: document.getElementById('liveChatButton'),
            downloadButton: document.getElementById('downloadButton')
        };

        this.state = false;
        this.messages = [];
        this.dropdownVisible = false;
    }

    display() {
        const { openButton, chatBox, sendButton, maximizeButton, liveChatButton, downloadButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        maximizeButton.addEventListener('click', () => this.maximizeChatbox(chatBox)); // Attach maximizeChatbox to the click event
        liveChatButton.addEventListener('click', () => this.liveChatButton(chatBox)); //
        downloadButton.addEventListener('click', () => this.downloadChatHistory(chatBox)); // Attach download

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active');
            const node = chatbox.querySelector('input');
            node.focus();
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const text = textField.value.trim();

        if (text === "") {
            return;
        }

        const userMsg = { name: "User", message: text };
        this.messages.push(userMsg);

        // Mock response
        const omoshMsg = { name: "Omosh", message: "This is a mock response." };
        this.messages.push(omoshMsg);

        this.updateChatText(chatbox);
        textField.value = '';
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(item => {
            const className = item.name === "Omosh" ? "messages__item messages__item--visitor" : "messages__item messages__item--operator";
            html += `<div class="${className}">${item.message}</div>`;
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    maximizeChatbox(chatbox) {
        console.log('maximize button clicked');

        // Check if chatbox is maximized, if not, maximize it
        if (!document.fullscreenElement) {
            if (chatbox.requestFullscreen) {
                chatbox.requestFullscreen();
            } else if (chatbox.webkitRequestFullscreen) {
                chatbox.webkitRequestFullscreen();
            } else if (chatbox.msRequestFullscreen) {
                chatbox.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen mode if already maximized
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    downloadChatHistory() {
        // Prepare chat history data
        const chatHistory = this.messages.map(msg => `${msg.name}: ${msg.message}`).join('\n');
        const blob = new Blob([chatHistory], { type: 'text/plain' });

        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'chat_history.txt';
        link.click();
    }

    liveChatButton() {
        console.log('Live chat button clicked');
        // Redirect to live chat page
        window.location.href = '/live';
    }
}

const chatbox = new Chatbox();
chatbox.display();

// Close dropdown when clicking outside of settings button
window.addEventListener('click', function(event) {
    const dropdownContent = document.getElementById('dropdownContent');
    if (!event.target.matches('.dropbtn')) {
        dropdownContent.classList.remove('show');
        chatbox.dropdownVisible = false;
    }
});
