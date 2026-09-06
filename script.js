// Firebase Configuration (Updated with your new Firebase keys)
const firebaseConfig = {
    apiKey: "AIzaSyAR34u1V1SmYph9PVZg0BNhK7Wfb7r4-Cw",
    authDomain: "chat-8501b.firebaseapp.com",
    databaseURL: "https://chat-8501b-default-rtdb.firebaseio.com",
    projectId: "chat-8501b",
    storageBucket: "chat-8501b.firebasestorage.app",
    messagingSenderId: "1013550632468",
    appId: "1:1013550632468:web:898f3e347df294ac8ba101",
    measurementId: "G-Z5CN4610M8"
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
const installBtn = document.getElementById('install-btn');

const displayRoom = document.getElementById('display-room');
const headerRoomCode = document.getElementById('header-room-code');
const onlineNum = document.getElementById('online-num');
const membersList = document.getElementById('members-list');
const userBadge = document.getElementById('user-badge');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const leaveBtn = document.getElementById('leave-btn');

const menuToggleBtn = document.getElementById('menu-toggle-btn');
const closeSidebar = document.getElementById('close-sidebar');
const chatSidebar = document.getElementById('chat-sidebar');
const attachBtn = document.getElementById('attach-btn');
const mediaFileInput = document.getElementById('media-file-input');

let currentUser = '';
let currentRoom = '';
let userRef = null;

// PWA Install Logic (সব সময় দৃশ্যমান ও কাজ করার উপযোগী)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
        } else {
            alert('To install this app, tap your browser menu (3 dots) and select "Add to Home Screen" or "Install App".');
        }
    });
}

// Connect to Room
connectBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const room = roomCodeInput.value.trim();

    if (!username || !room) {
        alert('Please enter both username and IP / Room Code');
        return;
    }

    currentUser = username;
    currentRoom = room.replace(/[.#$[\]]/g, '_'); // Sanitize room string for Firebase

    authScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');

    displayRoom.innerText = room;
    headerRoomCode.innerText = room;
    userBadge.innerText = currentUser;

    initChatSession();
});

function initChatSession() {
    const roomRef = db.ref('rooms/' + currentRoom);
    const messagesRef = roomRef.child('messages');
    const presenceRef = roomRef.child('presence');

    userRef = presenceRef.push();
    userRef.set({ name: currentUser });
    userRef.onDisconnect().remove();

    // Listen to online presence
    presenceRef.on('value', (snapshot) => {
        const members = snapshot.val();
        membersList.innerHTML = '';
        let count = 0;

        if (members) {
            Object.values(members).forEach(member => {
                count++;
                const div = document.createElement('div');
                div.className = 'member-item';
                div.innerHTML = `<span>${member.name}</span> ${member.name === currentUser ? '<span class="you-tag">You</span>' : ''}`;
                membersList.appendChild(div);
            });
        }
        onlineNum.innerText = count;
    });

    // Send Message
    const sendMessage = (content, type = 'text') => {
        if (!content) return;
        messagesRef.push({
            sender: currentUser,
            content: content,
            type: type,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = '';
    };

    sendBtn.addEventListener('click', () => sendMessage(messageInput.value.trim(), 'text'));
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage(messageInput.value.trim(), 'text');
    });

    // Listen to incoming messages
    messagesRef.limitToLast(50).on('child_added', (snapshot) => {
        const msg = snapshot.val();
        appendMessage(msg);
    });

    // Clear messages locally
    clearBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '<div class="system-message">— Conversation cleared locally —</div>';
    });

    // Leave room
    leaveBtn.addEventListener('click', () => {
        if (userRef) userRef.remove();
        window.location.reload();
    });
}

// Append Message to UI
function appendMessage(msg) {
    const div = document.createElement('div');
    const isOutgoing = msg.sender === currentUser;
    div.className = `message ${isOutgoing ? 'outgoing' : 'incoming'}`;

    let innerHTML = `<span class="sender">${msg.sender}</span>`;
    if (msg.type === 'image') {
        innerHTML += `<img src="${msg.content}" class="media-content">`;
    } else if (msg.type === 'video') {
        innerHTML += `<video src="${msg.content}" class="media-content" controls></video>`;
    } else {
        innerHTML += `<span>${escapeHTML(msg.content)}</span>`;
    }

    div.innerHTML = innerHTML;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Security: Escape HTML to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Sidebar Toggles for Mobile
menuToggleBtn.addEventListener('click', () => chatSidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => chatSidebar.classList.remove('active'));

// Media Upload Handler (Base64)
attachBtn.addEventListener('click', () => mediaFileInput.click());
mediaFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(uploadEvent) {
        const base64Data = uploadEvent.target.result;
        const type = file.type.startsWith('video') ? 'video' : 'image';
        
        // Push to Firebase directly
        if (currentRoom) {
            db.ref('rooms/' + currentRoom + '/messages').push({
                sender: currentUser,
                content: base64Data,
                type: type,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
    };
    reader.readAsDataURL(file);
});
