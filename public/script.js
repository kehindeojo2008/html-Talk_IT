const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

// Sidebar Logic
hamburger.onclick = () => sidebar.style.right = "0";
closeBtn.onclick = () => sidebar.style.right = "-250px";

// API Configuration
const OPENROUTER_API_KEY = "OPEN_ROUTER_API_KEY"; // Put your key here

async function send() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Clear input
    userInput.value = "";

    // 2. Append User Message
    const userDiv = document.createElement("div");
    userDiv.className = "message user";
    userDiv.innerHTML = `<div class="msg-content">${text}</div>`;
    chatbox.appendChild(userDiv);
    
    // Auto-scroll
    chatbox.scrollTop = chatbox.scrollHeight;

    // 3. Create Bot Message (Loading State)
    const botId = "bot-" + Date.now();
    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.id = botId;
    botDiv.innerHTML = `<div class="msg-content">...</div>`;
    chatbox.appendChild(botDiv);

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": text }]
            })
        });

        const data = await response.json();
        const aiText = data.choices[0].message.content;
        
        // 4. Update bot message with real text
        document.getElementById(botId).querySelector('.msg-content').innerText = aiText;
        
    } catch (e) {
        document.getElementById(botId).querySelector('.msg-content').innerText = "Sorry, I'm having trouble connecting.";
    }
    
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Allow "Enter" key to send
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") send();
});
