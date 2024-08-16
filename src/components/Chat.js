import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat({ onSaveRating }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // API 호출 부분 (이전과 동일)
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": input}]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const botMessage = { text: response.data.choices[0].message.content, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: '죄송합니다. 오류가 발생했습니다.', sender: 'bot' }]);
    }

    setIsLoading(false);
  };

  const handleEndChat = () => {
    setShowRating(true);
  };

  const handleRating = (value) => {
    setRating(value);
    onSaveRating({
      date: new Date().toISOString(),
      topic: messages[0]?.text || "Unknown",
      rating: value
    });
    setShowRating(false);
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="message-content loading">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage} disabled={isLoading}>전송</button>
        <button onClick={handleEndChat} className="end-chat-btn">대화 마침</button>
      </div>
      {showRating && (
        <div className="rating-container">
          <h3>대화는 어떠셨나요? (1-5점)</h3>
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} onClick={() => handleRating(value)}>{value}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chat;