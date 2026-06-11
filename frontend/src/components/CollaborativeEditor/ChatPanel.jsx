import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:3000");

const ChatPanel = ({ groupCode, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit('join-room', groupCode);

    socketRef.current.on('chat-history', (history) => {
      setMessages(history);
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [groupCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      roomCode: groupCode,
      text: inputMessage,
      sender: username,
      timestamp: new Date().toISOString(),
    };

    // સર્વર પર મેસેજ મોકલો
    socketRef.current.emit('send-message', messageData);
    
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-[#161619] rounded-xl border border-white/5 overflow-hidden">
      {/* મેસેજીસ લિસ્ટ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col min-h-[200px]">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#c2c6d6]/40 text-xs">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === username;
            return (
              <div
                key={index}
                className={`flex flex-col max-w-[85%] ${
                  isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <span className="text-[10px] text-[#c2c6d6]/60 mb-0.5 px-1">
                  {msg.sender}
                </span>
                <div
                  className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#3b82f6] text-white rounded-tr-none shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                      : 'bg-white/5 text-[#e5e1e4] border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] text-[#c2c6d6]/40 mt-0.5 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* મેસેજ ઇનપુટ બોક્સ */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-white/5 bg-[#0e0e10] flex gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-w-0 bg-white/5 text-xs text-[#e5e1e4] placeholder-[#c2c6d6]/30 px-3 py-2 rounded-lg border border-white/10 outline-none focus:border-[#3b82f6]/50 transition-colors"
        />
        <button
          type="submit"
          className="flex items-center justify-center p-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg active:scale-95 duration-100 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
