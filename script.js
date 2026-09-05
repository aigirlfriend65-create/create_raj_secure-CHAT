// --- Firebase Config (আপনার দেওয়া প্রজেক্ট ডিটেইলস সহ) ---
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
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const leaveBtn = document.getElementById('leave-btn');

let currentUser = '';
let currentRoom = '';
let roomRef = null;

// Connect to Room
connectBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const roomCode = roomCodeInput.value.trim().toLowerCase();

    if (!username || !roomCode) {
        alert('Please enter both username and room code/IP.');
        return;
    }

    currentUser = username;
    currentRoom = roomCode.replace(/[.#$[\]]/g, '_'); // Firebase safe key

    authScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    displayRoom.textContent = roomCode;

    initChatRoom();
});

function initChatRoom() {
    roomRef = db.ref('rooms/' + currentRoom + '/messages');
    
    // Listen for new messages
    roomRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            appendMessage(data.sender, data.text);
        }
    });

    // Listen for clear chat command
    db.ref('rooms/' + currentRoom + '/cleared').on('value', (snapshot) => {
        if(snapshot.val()) {
            chatMessages.innerHTML = '<div class="system-message">--- Chat cleared ---</div>';
        }
    });
}

// Send Message
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

// Append Message to UI
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    
    if (sender === currentUser) {
        msgDiv.classList.add('outgoing');
        msgDiv.innerHTML = `<span class="sender">You</span>${escapeHtml(text)}`;
    } else {
        msgDiv.classList.add('incoming');
        msgDiv.innerHTML = `<span class="sender">${escapeHtml(sender)}</span>${escapeHtml(text)}`;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Clear Chat Functionality
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat for everyone in this room?')) {
        db.ref('rooms/' + currentRoom + '/messages').remove();
        db.ref('rooms/' + currentRoom + '/cleared').set(true);
    }
});

// Leave Room
leaveBtn.addEventListener('click', () => {
    window.location.reload();
});

// Helper to prevent HTML injection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
