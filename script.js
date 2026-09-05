:root {
    --bg-color: #0c1017;
    --card-bg: #131a24;
    --border-color: #1f2c3e;
    --text-primary: #f1f5f9;
    --text-secondary: #8899ac;
    --accent-glow: #00f2fe;
    --accent-blue: #00c6ff;
    --sidebar-bg: #0f151e;
}

/* সিস্টেম বা ব্রাউজারের ডার্ক মোড ডিটেক্ট করার অপশন */
@media (prefers-color-scheme: light) {
    :root {
        --bg-color: #f4f7fc;
        --card-bg: #ffffff;
        --border-color: #e2e8f0;
        --text-primary: #1e293b;
        --text-secondary: #64748b;
        --accent-glow: #0072ff;
        --accent-blue: #0056b3;
        --sidebar-bg: #eef2f7;
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace, sans-serif;
}

body {
    background-color: var(--bg-color);
    color: var(--text-primary);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.hidden {
    display: none !important;
}

/* Auth Page Design */
.auth-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
    background-size: 24px 24px;
    height: 100vh;
}

.auth-card {
    background: var(--card-bg);
    width: 100%;
    max-width: 420px;
    padding: 35px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.logo-title {
    font-size: 26px;
    letter-spacing: 2px;
    margin-bottom: 8px;
    font-weight: bold;
}

.logo-title span {
    color: var(--accent-glow);
    text-shadow: 0 0 10px var(--accent-glow);
}

.auth-card p {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 25px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-size: 11px;
    color: var(--text-secondary);
    margin-bottom: 8px;
    letter-spacing: 1px;
}

.input-group input {
    width: 100%;
    padding: 12px 15px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 6px;
    font-size: 14px;
}

.input-group input:focus {
    outline: none;
    border-color: var(--accent-glow);
    box-shadow: 0 0 8px rgba(0, 242, 254, 0.2);
}

#connect-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-glow));
    border: none;
    color: #0c1017;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: 0.3s;
    box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
}

#connect-btn:hover {
    opacity: 0.9;
    box-shadow: 0 0 20px var(--accent-glow);
}

/* Chat Layout Style */
.chat-layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background: var(--bg-color);
}

.chat-sidebar {
    width: 280px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
}

.sidebar-logo {
    font-size: 20px;
    letter-spacing: 1px;
    margin-bottom: 20px;
}

.sidebar-logo span {
    color: var(--accent-glow);
}

.room-box {
    background: var(--card-bg);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.room-box .label {
    font-size: 10px;
    color: var(--text-secondary);
    display: block;
}

.room-name {
    font-size: 20px;
    color: var(--accent-glow);
    font-weight: bold;
    display: block;
    margin: 5px 0;
}

.online-status {
    font-size: 11px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
}

.dot {
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 6px #22c55e;
}

.members-section {
    flex: 1;
    margin-top: 25px;
    overflow-y: auto;
}

.members-section h3 {
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 1px;
    margin-bottom: 12px;
}

.member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--card-bg);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    margin-bottom: 8px;
    border: 1px solid var(--border-color);
}

.member-item .badge {
    font-size: 9px;
    background: var(--accent-glow);
    color: #0c1017;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
}

.sidebar-bottom button {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: 0.2s;
}

.sidebar-bottom button:hover {
    background: var(--card-bg);
    color: var(--text-primary);
}

/* Main Chat Window */
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-color);
}

.main-header {
    height: 60px;
    padding: 0 25px;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-info {
    font-size: 13px;
    color: var(--text-secondary);
}

.header-info b {
    color: var(--accent-glow);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

#clear-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

#clear-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
}

.user-badge {
    background: var(--border-color);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: var(--accent-glow);
    font-weight: bold;
}

.chat-messages {
    flex: 1;
    padding: 25px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.system-message {
    text-align: center;
    font-size: 11px;
    color: var(--text-secondary);
    margin: 10px 0;
}

.message {
    max-width: 65%;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 14px;
    word-break: break-word;
    line-height: 1.5;
    border: 1px solid var(--border-color);
}

.message.incoming {
    background: var(--card-bg);
    align-self: flex-start;
}

.message.outgoing {
    background: rgba(0, 198, 255, 0.1);
    border-color: var(--accent-blue);
    align-self: flex-end;
}

.message .sender {
    font-size: 10px;
    color: var(--accent-glow);
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
}

.message img, .message video {
    max-width: 100%;
    border-radius: 6px;
    margin-top: 5px;
    display: block;
}

/* Input Section */
.chat-input-area {
    padding: 15px 25px;
    background: var(--card-bg);
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
}

.media-btn {
    font-size: 18px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: 0.2s;
}

.media-btn:hover {
    color: var(--accent-glow);
}

.chat-input-area input[type="text"] {
    flex: 1;
    padding: 12px 15px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 6px;
    font-size: 14px;
}

.chat-input-area input[type="text"]:focus {
    outline: none;
    border-color: var(--accent-glow);
}

#send-btn {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-glow));
    border: none;
    color: #0c1017;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
}

#send-btn:hover {
    box-shadow: 0 0 15px var(--accent-glow);
}

/* Responsive for Mobile */
@media (max-width: 768px) {
    .chat-layout {
        flex-direction: column;
    }
    .chat-sidebar {
        width: 100%;
        height: auto;
        padding: 10px 15px;
    }
    .members-section {
        display: none;
    }
}
