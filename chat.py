<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>I.T Chatbot</title>
    <link rel="icon" type="image/png" href="../static/images/download (1).jpg">
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css')}}">
</head>
<body> 
<div class="container">
    <div class="app">
    <div class="chatbox">
        <div class="chatbox__support" id="chatbotContainer">
            <div class="chatbox__header">
                <div class="chatbox__image--header">
                <img src="static\images\download (1).jpg" alt="image"> 
                </div>
                <div class="chatbox__content--header">
                    <h2 class="chatbox__heading--header"> C.A chatbot </h2>
                    <!--<div class="settings-container">
                        <button class="settings-button" id="settingsButton"><span class="dots">...</span></button>
                        <div class="dropdown-content" id="dropdownContent">
                            <a href="#" id="maximizeButton">Maximize</a>
                            <a href="#" id="downloadButton">Download</a>
                            <button id="liveChatButton">Start Live Chat</button>
                        </div>
                    </div> -->
                    <div class="dropdown">
                        <button class="dropbtn">menu 
                        <i class="fa fa-caret-down"></i>
                        </button>
                        <div class="dropdown-content">
                        <a href="#" id="maximizeButton">Maximize</a>
                            <a href="#" id="downloadButton">Download</a>
                            <button id="liveChatButton">Start Live Chat</button>
                        </div>
                    </div> 
                </div>
            </div>
            <div class="chatbox__messages">
                <div></div>
            </div>
            <div class="chatbox__footer">
                <input type="text" placeholder="Write a message...">
                <button class="chatbox__attach--footer attach__button" id="attachButton"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/attach.png" alt="attach"/></button>
                <button class="chatbox__send--footer send__button">Send</button>
            </div>
        </div>
        <div class="chatbox__button">
            <button><img src="static\images\conversation (1).png" /></button>
        </div>
    </div>
    </div>
</div>

<script>
    // JavaScript to handle opening the chatbox when the button is clicked
    document.getElementById("openChatButton").addEventListener("click", function() {
        document.getElementById("chatbotContainer").style.display = "block";
    });
</script>
<script>
    $SCRIPT_ROOT = {{ request.script_root|tojson }};
</script>
<script type="text/javascript" src="{{ url_for('static', filename='app.js') }}"></script>

</body>
</html>
