    const sidebar = document.getElementById("sidebar");
      const sidebarOverlay = document.getElementById("sidebarOverlay");
      const sessionsList = document.getElementById("sessionsList");
      const chatArea = document.getElementById("chatArea");
      const userInput = document.getElementById("userInput");
      const sendBtn = document.getElementById("sendBtn");
      const inputWrapper = document.getElementById("inputWrapper");
      const welcomeText = document.getElementById("welcomeText");
      const footerTag = document.getElementById("footerTag");

      let currentSession =
        localStorage.getItem("current_session") || "chat_" + Date.now();
      let showingFavorites = false;

      document.getElementById("toggleSidebar").onclick = (e) => {
        e.stopPropagation();
        if (window.innerWidth < 1024) {
          sidebar.classList.toggle("open");
        } else {
          sidebar.classList.toggle("collapsed");
        }
      };

      sidebarOverlay.onclick = () => sidebar.classList.remove("open");

      document.getElementById("openSearch").onclick = () => {
        document
          .getElementById("searchBarContainer")
          .classList.toggle("hidden");
        document.getElementById("searchInput").focus();
      };

      document.getElementById("searchInput").oninput = (e) => {
        const val = e.target.value.toLowerCase();
        Array.from(sessionsList.getElementsByClassName("sidebar-item")).forEach(
          (item) => {
            item.style.display = item.textContent.toLowerCase().includes(val)
              ? "flex"
              : "none";
          },
        );
      };

      document.getElementById("favFilterBtn").onclick = function () {
        showingFavorites = !showingFavorites;
        this.classList.toggle("active", showingFavorites);
        loadSessions();
      };

      document.getElementById("clearAllBtn").onclick = () => {
        if (confirm("Purge all logs?")) {
          Object.keys(localStorage).forEach((k) => {
            if (k.startsWith("rp_chat_") || k.startsWith("meta_rp_chat_"))
              localStorage.removeItem(k);
          });
          currentSession = "chat_" + Date.now();
          localStorage.setItem("current_session", currentSession);
          loadSessions();
          loadChat();
        }
      };

      function loadSessions() {
        sessionsList.innerHTML = "";
        const keys = Object.keys(localStorage)
          .filter((k) => k.startsWith("rp_chat_"))
          .sort()
          .reverse();
        keys.forEach((k) => {
          const chatData = JSON.parse(localStorage.getItem(k) || "[]");
          const metadata = JSON.parse(
            localStorage.getItem("meta_" + k) || "{}",
          );
          if (showingFavorites && !metadata.isFavorite) return;
          const sessionId = k.replace("rp_chat_", "");
          const item = document.createElement("div");
          item.className = `sidebar-item ${currentSession === sessionId ? "active" : ""}`;
          const title =
            chatData.find((m) => m.from === "user")?.text.substring(0, 20) ||
            "New chat";
          item.innerHTML = `<span class="truncate flex-1" onclick="switchSession('${sessionId}')">${metadata.isFavorite ? "⭐ " : ""}${title}</span>
          <span onclick="event.stopPropagation(); deleteSession('${sessionId}')" class="text-zinc-600 hover:text-white px-1">×</span>`;
          sessionsList.appendChild(item);
        });
      }

      function switchSession(id) {
        currentSession = id;
        localStorage.setItem("current_session", id);
        if (window.innerWidth < 1024) sidebar.classList.remove("open");
        loadChat();
        loadSessions();
      }

      function deleteSession(id) {
        localStorage.removeItem("rp_chat_" + id);
        localStorage.removeItem("meta_rp_chat_" + id);
        if (currentSession === id) {
          currentSession = "chat_" + Date.now();
          localStorage.setItem("current_session", currentSession);
        }
        loadSessions();
        loadChat();
      }

      document.getElementById("newChatBtn").onclick = () => {
        currentSession = "chat_" + Date.now();
        localStorage.setItem("current_session", currentSession);
        if (window.innerWidth < 1024) sidebar.classList.remove("open");
        loadChat();
        loadSessions();
      };

      function prepareContent(raw) {
        let codeBlocks = [];
        let cleanText = raw
          .replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
            const id = `BLOCK_${codeBlocks.length}`;
            codeBlocks.push(
              `<div class="code-container"><div class="code-header"><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><pre><code class="language-${lang || "javascript"}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim()}</code></pre></div>`,
            );
            return id;
          })
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/^\s*-\s+(.*)/gm, "<li>$1</li>")
          .replace(/\n/g, "<br>");
        codeBlocks.forEach(
          (b, i) => (cleanText = cleanText.replace(`BLOCK_${i}`, b)),
        );
        return cleanText;
      }

      function appendMessage(content, from, isHistory = false) {
        const row = document.createElement("div");
        row.className = `flex w-full ${from === "user" ? "user" : "bot"}`;
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.innerHTML = prepareContent(content);
        row.appendChild(bubble);
        chatArea.appendChild(row);
        if (!isHistory) {
          chatArea.scrollTop = chatArea.scrollHeight;
          Prism.highlightAllUnder(bubble);
        }
      }

      async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        inputWrapper.classList.remove("centered");
        welcomeText.classList.add("hidden");
        footerTag.classList.add("hidden");
        appendMessage(text, "user");
        saveMsg(text, "user");
        userInput.value = "";
        try {
          const res = await fetch(
            "https://red-phantom-chat-bot-back-wfjk.vercel.app/api/chat",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId: currentSession,
                message: text,
              }),
            },
          );
          const data = await res.json();
          appendMessage(data.reply, "bot");
          saveMsg(data.reply, "bot");
        } catch {
          appendMessage("Analysis error: Connection lost.", "bot");
        }
        loadSessions();
      }

      function saveMsg(text, from) {
        let chat = JSON.parse(
          localStorage.getItem("rp_chat_" + currentSession) || "[]",
        );
        chat.push({ from, text });
        localStorage.setItem("rp_chat_" + currentSession, JSON.stringify(chat));
      }

      function loadChat() {
        chatArea.innerHTML = "";
        let chat = JSON.parse(
          localStorage.getItem("rp_chat_" + currentSession) || "[]",
        );
        if (chat.length > 0) {
          inputWrapper.classList.remove("centered");
          welcomeText.classList.add("hidden");
          footerTag.classList.add("hidden");
          chat.forEach((m) => appendMessage(m.text, m.from, true));
          Prism.highlightAllUnder(chatArea);
          chatArea.scrollTop = chatArea.scrollHeight;
        } else {
          inputWrapper.classList.add("centered");
          welcomeText.classList.remove("hidden");
          footerTag.classList.remove("hidden");
        }
      }

      function copyCode(btn) {
        const code = btn.parentElement.nextElementSibling.innerText;
        navigator.clipboard.writeText(code);
        btn.innerText = "Copied!";
        setTimeout(() => (btn.innerText = "Copy"), 2000);
      }

      sendBtn.onclick = sendMessage;
      userInput.onkeypress = (e) => {
        if (e.key === "Enter") sendMessage();
      };
      loadSessions();
      loadChat();
