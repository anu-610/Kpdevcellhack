import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { getMessages, sendMessage } from "../../services/chatService.js";
import { useAuth } from "../../hooks/useAuth.js";

export function ChatPanel() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [currentRoom] = useState("general"); // ✅ room-based

  const endRef = useRef(null);

  // ✅ Load messages
  const loadMessages = useCallback(async () => {
    try {
      const result = await getMessages(currentRoom);
      setMessages(result.messages || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load chat.");
    }
  }, [currentRoom]);

  // ✅ Load on mount + polling
  useEffect(() => {
    loadMessages();
    const interval = window.setInterval(loadMessages, 10000);
    return () => window.clearInterval(interval);
  }, [loadMessages]);

  // ✅ Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    setStatus("sending");
    setError("");

    try {
      const saved = await sendMessage(currentRoom, trimmed);

      // Add new message to UI
      setMessages((current) => [...current, saved]);

      setMessage("");
    } catch (err) {
      setError(err.message || "Unable to send message.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <section className="chat-section" aria-label="Student doubt chat">
      <div className="chat-shell">

        {/* HEADER */}
        <div className="chat-header">
          <div>
            <p className="eyebrow">Open chat</p>
            <h2>Ask your doubt</h2>
          </div>
          <span>{user?.displayName || user?.email}</span>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.length ? (
            messages.map((item) => {
              const isMine =
                item.sender?.displayName === user?.displayName;

              return (
                <article
                  key={item.id || item._id}
                  className={
                    isMine
                      ? "chat-message chat-message-mine"
                      : "chat-message"
                  }
                >
                  <p className="message-author">
                    {item.sender?.displayName || "Student"}
                  </p>

                  <p>{item.text}</p>
                </article>
              );
            })
          ) : (
            <div className="empty-chat">
              <h3>No doubts yet</h3>
              <p>Start the first conversation 🚀</p>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* INPUT */}
        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="chat-message" className="sr-only">
            Chat message
          </label>

          <input
            id="chat-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type your development doubt..."
            maxLength={500}
          />

          <button
            className="primary-button icon-button"
            type="submit"
            disabled={status === "sending"}
          >
            <Send size={18} />
            Send
          </button>
        </form>

        {/* ERROR */}
        {error ? <p className="form-error">{error}</p> : null}

      </div>
    </section>
  );
}
