// Inside your 'agent_dash.js' file

// Function to update user count in the notification
function updateUserCount(userCount) {
    const userCountElement = document.querySelector('.notification .num');
    userCountElement.textContent = userCount;
}

// Establish Socket.IO connection with the server
const socket = io();

// Listen for user count updates from the server
socket.on('userChatCount', (userCount) => {
    // Update user count in the notification
    updateUserCount(userCount);
});

// Function to handle live chat link click event
function handleLiveChatLinkClick(event) {
    event.preventDefault(); // Prevent default link behavior

    // Send AJAX request to server to redirect to agent chat
    fetch('/redirect_to_agent_chat', {
        method: 'GET'
    }).then(response => {
        if (response.ok) {
            // Redirect to agent chat page
            window.location.href = '/agent_chat';
        } else {
            console.error('Error redirecting to agent chat');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}
console.log('application');

// Attach click event listener to live chat link
const liveChatLink = document.querySelector('#sidebar .side-menu li:nth-child(2) a');
liveChatLink.addEventListener('click', handleLiveChatLinkClick);

// Handling Active Menu Items
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

// Toggle Sidebar
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
})

// Search Button Functionality
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

// Handling Initial Configuration based on Window Width
if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

// Handling Window Resize Event
window.addEventListener('resize', function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})

// Switch Mode Functionality
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    console.log('Switch Mode');
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// WhatsApp Link
const whatsappLink = document.querySelector('#sidebar .side-menu li:nth-child(3) a');
whatsappLink.addEventListener('click', function (event) {
    window.location.href = 'whatsapp://send?phone=YOUR_PHONE_NUMBER_HERE';
    event.preventDefault();
});

// AnyDesk Link
const anyDeskLink = document.querySelector('#sidebar .side-menu li:nth-child(4) a');
anyDeskLink.addEventListener('click', function (event) {
    // Open AnyDesk application using custom URI scheme
    window.location.href = 'anydesk://';
    event.preventDefault();
});


// Logout Link
const logoutLink = document.querySelector('#sidebar .side-menu li:nth-child(6) a.logout');
logoutLink.addEventListener('click', function (event) {
    window.location.href = 'your-logout-url';
    event.preventDefault();
});

// Settings Link
const settingsLink = document.querySelector('#sidebar .side-menu li:nth-child(6) a:not(.logout)');
settingsLink.addEventListener('click', function (event) {
    window.location.href = 'your-settings-url';
    event.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    const notification = document.querySelector('.notification');
    const notificationPanel = document.querySelector('.notification-panel');

    notification.addEventListener('click', function (event) {
        event.preventDefault();
        notificationPanel.classList.toggle('active');
    });

    // Function to update user count in the notification
    function updateUserCount(userCount) {
        const userCountElement = document.querySelector('.notification .num');
        userCountElement.textContent = userCount;
    }