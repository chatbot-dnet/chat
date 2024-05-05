const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})
// Existing code...

document.addEventListener('DOMContentLoaded', function() {
    const notificationIcon = document.querySelector('.notification');
    const notificationDropdown = document.querySelector('.notification-dropdown');

    // Sample notifications data as a map
    let notificationsData = new Map([
        
        // Add more notifications as needed
    ]);

    // Function to render notifications
    function renderNotifications() {
        const notificationsList = document.querySelector('.notifications-list');
        notificationsList.innerHTML = ''; // Clear existing notifications

        // Iterate through notificationsData and create list items
        notificationsData.forEach((issue, username) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${username}</strong>
                <p>has a ${issue} problem</p>
            `;
            notificationsList.appendChild(listItem);
        });
    }

    // Initial rendering of notifications
    renderNotifications();

    notificationIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click event from bubbling up to document

        // Toggle the visibility of the notification dropdown
        if (notificationDropdown.style.display === 'none') {
            notificationDropdown.style.display = 'block';
        } else {
            notificationDropdown.style.display = 'none';
        }
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!notificationIcon.contains(event.target) && !notificationDropdown.contains(event.target)) {
            notificationDropdown.style.display = 'none';
        }
    });

    // Function to fetch plant data and update notifications
    function fetchPlantData() {
        fetch('/plant-data')
            .then(response => response.json())
            .then(data => {
                // Update notificationsData map
                data.forEach(row => {
                    notificationsData.set(row.username, row.problem);
                });
                // Update notification dropdown
                renderNotifications();
            })
            .catch(error => console.error('Error:', error));
    }

    // Fetch data initially
    fetchPlantData();

    // Fetch data every 10 seconds
    setInterval(fetchPlantData, 10000); 
});


if ("Notification" in window) {
    console.log("Notification supported");
    console.log('Permission status:', Notification.permission);
    if (Notification.permission === 'granted') {
        console.log('Permission status:', Notification.permission);
        notify();
    } else {
        console.log('Requesting notification permission...');
        Notification.requestPermission().then((res) => {
            if (res === 'granted') {
                console.log('Requesting notification permission...');
                notify();
            } else if (res === 'denied') {
                console.log('Notification permission denied or dismissed.');
            } else if (res === 'default') {
                console.log('Notification permission not given.');
            }
        });
    }
} else {
    console.error("Notification not supported");
}


function notify() {
    const notificationsData = new Map([
        ['dan', 'bitlocker'],
        ['john', 'network issue'],
        // Add more notifications as needed
    ]);

    notificationsData.forEach((issue, username) => {
        const noti= new Notification("C.A chatbots",{
            body: `User ${username} has a ${issue} issue`,
            icon: './download (1).jpg',
            vibrate: [150,50,150],
        });

        noti.addEventListener('click', () => {
            window.open('http://localhost:3000/agent_chat');
        });

        const duration = 20000; // 20 seconds
        const startTime = Date.now();

        // Check if the notification is still open every second
        const checkInterval = setInterval(() => {
            if (noti && noti.close && (Date.now() - startTime) >= duration) {
                noti.close();
                clearInterval(checkInterval); // Stop checking
            }
        }, 1000); 
    });
}
