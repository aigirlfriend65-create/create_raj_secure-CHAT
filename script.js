// --- Firebase Config (আপনার কনফিগারেশন) ---
const firebaseConfig = {
    apiKey: "AIzaSyDG5WM0vhgigbmEDahNlEkry5Mepek90UM",
    authDomain: "ip-chat-6423a.firebaseapp.com",
    databaseURL: "https://ip-chat-6423a-default-rtdb.firebaseio.com",
    projectId: "ip-chat-6423a",
    storageBucket: "ip-chat-6423a.firebasestorage.app",
    messagingSenderId: "467904400423",
    appId: "1:467904400423:web:f2a3fbeaac2702aa859202",
    measurementId: "G-RLXGCLNQKP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const roomCodeInput = document.getElementById('room-code');
const connectBtn = document.getElementById('connect-btn');
const displayRoom = document.getElementById('display-room');
const headerRoomCode = document.getElementById('header-room-code');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const leaveBtn = document.getElementById('leave-btn');
const userBadge = document.getElementById('user-badge');
const membersList = document.getElementById('members-list');
const onlineNum = document.getElementById('online-num');
const attachBtn = document.getElementById('attach-btn');
const mediaFileInput = document.getElementById('media-file-input');

// Mobile Menu Elements
const chatSidebar = document.getElementById('chat-sidebar');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const closeSidebar = document.getElementById('close-sidebar');

let currentUser = '';
let currentRoom = '';
let roomRef = null;
let userPresenceRef = null;

// Connect to Room
connectBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const roomCode = roomCodeInput.value.trim().toLowerCase();

    if (!username || !roomCode) {
        alert('Please enter both username and room code/IP.');
        return;
    }

    currentUser = username;
    currentRoom = roomCode.replace(/[.#$[\]]/g, '_');

    authScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    displayRoom.textContent = roomCode;
    headerRoomCode.textContent = roomCode;
    userBadge.textContent = username;

    initChatRoom();
});

// Mobile Sidebar Toggle Events
if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
        chatSidebar.classList.toggle('active');
    });
}
if (closeSidebar) {
    closeSidebar.addEventListener('click', () => {
        chatSidebar.classList.remove('active');
    });
}

function initChatRoom() {
    roomRef = db.ref('rooms/' + currentRoom + '/messages');
    
    // Listen for new messages & media
    roomRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            appendMessage(data.sender, data.text, data.mediaUrl, data.mediaType);
        }
    });

    // Listen for clear chat
    db.ref('rooms/' + currentRoom + '/cleared').on('value', (snapshot) => {
        if(snapshot.val()) {
            chatMessages.innerHTML = '<div class="system-message">— Chat cleared —</div>';
        }
    });

    // Handle Active Online Members Presence
    const memberKey = currentUser.replace(/[.#$[\]]/g, '_');
    userPresenceRef = db.ref('rooms/' + currentRoom + '/members/' + memberKey);
    userPresenceRef.set(true);
    userPresenceRef.onDisconnect().remove();

    // Track active members list
    db.ref('rooms/' + currentRoom + '/members').on('value', (snapshot) => {
        const members = snapshot.val() || {};
        const memberNames = Object.keys(members);
        onlineNum.textContent = memberNames.length;
        
        membersList.innerHTML = '';
        memberNames.forEach(name => {
            const div = document.createElement('div');
            div.classList.add('member-item');
            const isYou = name === currentUser.replace(/[.#$[\]]/g, '_');
            div.innerHTML = `<span><span class="dot" style="display:inline-block; width:6px; height:6px; background:#22c55e; border-radius:50%; margin-right:6px;"></span>${name}</span> ${isYou ? '<span class="you-tag">you</span>' : ''}`;
            membersList.appendChild(div);
        });
    });
}

// Send Text Message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    roomRef.push({
        sender: currentUser,
        text: text,
        timestamp: Date.now()
    });

    messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Media Upload Trigger (Photo & Video)
attachBtn.addEventListener('click', () => {
    mediaFileInput.click();
});

mediaFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(uploadEvent) {
        const base64Data = uploadEvent.target.result;
        const mediaType = file.type.startsWith('video') ? 'video' : 'image';

        roomRef.push({
            sender: currentUser,
            text: file.name,
            mediaUrl: base64Data,
            mediaType: mediaType,
            timestamp: Date.now()
        });
    };
    reader.readAsDataURL(file);
    mediaFileInput.value = '';
});

// Append Message / Media to UI
function appendMessage(sender, text, mediaUrl, mediaType) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    let mediaHTML = '';
    if (mediaUrl) {
        if (mediaType === 'video') {
            mediaHTML = `<video src="${mediaUrl}" controls class="media-content"></video>`;
        } else {
            mediaHTML = `<img src="${mediaUrl}" class="media-content" alt="Uploaded Image">`;
        }
    }

    if (sender === currentUser) {
        msgDiv.classList.add('outgoing');
        msgDiv.innerHTML = `<span class="sender">You</span>${mediaUrl ? mediaHTML : escapeHtml(text)}`;
    } else {
        msgDiv.classList.add('incoming');
        msgDiv.innerHTML = `<span class="sender">${escapeHtml(sender)}</span>${mediaUrl ? mediaHTML : escapeHtml(text)}`;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Clear Chat
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat for everyone?')) {
        db.ref('rooms/' + currentRoom + '/messages').remove();
        db.ref('rooms/' + currentRoom + '/cleared').set(true);
    }
});

// Leave Room
leaveBtn.addEventListener('click', () => {
    if(userPresenceRef) userPresenceRef.remove();
    window.location.reload();
});

// Helper to prevent HTML injection
function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
