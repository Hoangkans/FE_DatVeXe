import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../../styles/ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  
  const userId = JSON.parse(localStorage.getItem('user'))?.id || 1;

  // Kiểm tra xem có nên hiển thị chat widget không
  const shouldShowChat = () => {
    const hiddenPaths = [
      '/login', 
      '/register', 
      '/forgot-password',
      '/auth/login', 
      '/auth/register'
    ];
    return !hiddenPaths.includes(location.pathname);
  };

  useEffect(() => {
    if (isOpen && !socket) {
      const newSocket = io('http://localhost:3000/chat', {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
        newSocket.emit('register', { userId });
        
        // Load conversation và message history
        loadConversationHistory(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('newMessage', (message) => {
        console.log('Received new message:', message);
        setMessages((prev) => {
          // Nếu là tin nhắn user và có tin nhắn tạm với cùng content, thay thế
          if (message.type === 'user' && message.senderId === userId) {
            const tempIndex = prev.findIndex(msg => 
              msg.isTemp && msg.content === message.content && msg.type === 'user'
            );
            if (tempIndex !== -1) {
              const newMessages = [...prev];
              newMessages[tempIndex] = { ...message, isTemp: false };
              return newMessages;
            }
          }
          
          // Kiểm tra duplicate
          const exists = prev.some(msg => msg.id === message.id);
          if (exists) return prev;
          
          return [...prev, message];
        });
      });

      newSocket.on('messageHistory', (history) => {
        console.log('Received message history:', history);
        if (Array.isArray(history)) {
          setMessages(history);
        } else {
          console.error('Invalid message history format:', history);
          setMessages([]);
        }
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  // Load conversation history
  const loadConversationHistory = async (socketInstance) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping conversation load');
        return;
      }

      const response = await fetch('http://localhost:3000/chat/conversations/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const conversation = await response.json();
        console.log('Loaded conversation:', conversation);
        
        // Load messages cho conversation này
        if (socketInstance && conversation.id) {
          socketInstance.emit('getMessages', { conversationId: conversation.id });
        }
      } else {
        console.log('No existing conversation found');
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    const messageContent = inputMessage.trim();
    
    // Thêm tin nhắn của user vào UI ngay lập tức (optimistic update)
    const tempUserMessage = {
      id: Date.now(),
      content: messageContent,
      type: 'user',
      senderId: userId,
      createdAt: new Date().toISOString(),
      isTemp: true
    };
    
    setMessages((prev) => [...prev, tempUserMessage]);
    setInputMessage('');

    socket.emit('sendMessage', {
      userId,
      content: messageContent,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageClass = (type) => {
    switch (type) {
      case 'user':
        return 'message-user';
      case 'admin':
        return 'message-admin';
      case 'bot':
        return 'message-bot';
      default:
        return '';
    }
  };

  const getMessageLabel = (type) => {
    switch (type) {
      case 'user':
        return 'Bạn';
      case 'admin':
        return 'Hỗ trợ viên';
      case 'bot':
        return 'Bot AI';
      default:
        return '';
    }
  };

  // Không hiển thị chat widget trên trang đăng nhập/đăng ký
  if (!shouldShowChat()) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <h3>💬 Hỗ Trợ Trực Tuyến</h3>
              <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                {isConnected ? '● Đang kết nối' : '○ Ngoại tuyến'}
              </span>
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>👋 Xin chào! Chúng tôi có thể giúp gì cho bạn?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${getMessageClass(msg.type)}`}>
                  <div className="message-label">{getMessageLabel(msg.type)}</div>
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows="1"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="send-button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
