# 🐛 Chat Debug Guide - Sửa Lỗi User Không Thấy Bot Reply

## 🔍 Vấn Đề Đã Phát Hiện

**Triệu chứng**: Admin thấy tin nhắn nhưng User không thấy bot reply

**Nguyên nhân có thể**:

1. ❌ ChatWidget load message history sai conversationId
2. ❌ WebSocket connection không stable
3. ❌ Bot response không được emit đúng cách
4. ❌ Frontend không nhận được tin nhắn từ server

## ✅ Đã Sửa

### 1. **Sửa Logic Load Message History**

```jsx
// Trước (SAI)
newSocket.emit("getMessages", { conversationId: userId });

// Sau (ĐÚNG)
const loadConversationHistory = async (socketInstance) => {
  const response = await fetch("/chat/conversations/my");
  const conversation = await response.json();
  socketInstance.emit("getMessages", { conversationId: conversation.id });
};
```

### 2. **Thêm Optimistic Update**

```jsx
const sendMessage = () => {
  // Hiển thị tin nhắn user ngay lập tức
  const tempUserMessage = {
    id: Date.now(),
    content: messageContent,
    type: "user",
    isTemp: true,
  };
  setMessages((prev) => [...prev, tempUserMessage]);

  // Gửi lên server
  socket.emit("sendMessage", { userId, content: messageContent });
};
```

### 3. **Cải Thiện Message Handling**

```jsx
newSocket.on("newMessage", (message) => {
  setMessages((prev) => {
    // Thay thế tin nhắn tạm bằng tin nhắn thật
    if (message.type === "user" && message.senderId === userId) {
      const tempIndex = prev.findIndex(
        (msg) => msg.isTemp && msg.content === message.content
      );
      if (tempIndex !== -1) {
        const newMessages = [...prev];
        newMessages[tempIndex] = { ...message, isTemp: false };
        return newMessages;
      }
    }

    // Tránh duplicate
    const exists = prev.some((msg) => msg.id === message.id);
    if (exists) return prev;

    return [...prev, message];
  });
});
```

## 🧪 Cách Test

### 1. **Mở Browser Console**

```javascript
// Kiểm tra WebSocket connection
console.log("Socket connected:", socket?.connected);

// Kiểm tra messages state
console.log("Current messages:", messages);
```

### 2. **Test Flow**

1. **User gửi tin nhắn**: "xin chào"

   - ✅ Tin nhắn hiển thị ngay lập tức (optimistic)
   - ✅ Server nhận và xử lý
   - ✅ Bot reply sau 1 giây

2. **Kiểm tra Console Logs**:
   ```
   Connected to chat server
   Loaded conversation: {id: 1, userId: 1, ...}
   Received message history: [...]
   Received new message: {type: 'user', content: 'xin chào'}
   Received new message: {type: 'bot', content: 'Xin chào! Tôi là...'}
   ```

### 3. **Test API Trực Tiếp**

```bash
# Test bot response
GET http://localhost:3000/chat/test-bot/xin%20chào

# Test conversation
GET http://localhost:3000/chat/conversations/my
Authorization: Bearer {token}
```

## 🚨 Troubleshooting

### **Nếu vẫn không thấy bot reply**:

1. **Kiểm tra Backend Logs**:

   ```bash
   # Trong terminal backend
   npm run start:dev

   # Xem logs khi user gửi tin nhắn
   ```

2. **Kiểm tra Database**:

   ```sql
   SELECT * FROM conversations WHERE userId = 1;
   SELECT * FROM messages WHERE conversationId = 1 ORDER BY createdAt DESC;
   ```

3. **Kiểm tra WebSocket Events**:
   ```javascript
   // Trong browser console
   socket.on("newMessage", (msg) => console.log("New message:", msg));
   socket.on("error", (err) => console.error("Socket error:", err));
   ```

### **Nếu Connection Issues**:

1. Restart backend server
2. Clear browser cache
3. Check CORS settings
4. Verify WebSocket port (3000)

## 📝 Debug Checklist

- [ ] Backend server running on port 3000
- [ ] WebSocket connection established
- [ ] User token valid
- [ ] Conversation created in database
- [ ] Bot service working (test via `/chat/test-bot/`)
- [ ] Messages saved to database
- [ ] Frontend receiving WebSocket events
- [ ] No console errors

Sau khi sửa, user sẽ thấy bot reply ngay lập tức! 🎉
