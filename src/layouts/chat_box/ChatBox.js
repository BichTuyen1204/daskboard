import React, { useState, useEffect, useRef, useCallback } from "react";
import AccountService from "api/AccountService";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Paper,
  Box,
  Typography,
  IconButton,
  Icon,
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { Link, useParams } from "react-router-dom";

const REACT_APP_BACKEND_WS_ENDPOINT = process.env.REACT_APP_BACKEND_WS_ENDPOINT;
const ChatContainer = styled(Box)({
  display: "flex",
  width: "81%",
  marginLeft: "auto",
  marginTop: "10px",
  height: "97vh",
  padding: "10px",
  borderRadius: "10px",
});

const CustomerList = styled(Paper)({
  width: "21%",
  overflowY: "auto",
  borderRadius: "10px",
  background: "#fff",
  padding: "10px",
  marginRight: "30px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
});

const ChatBox = styled(Paper)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  borderRadius: "20px",
  background: "#fff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  animation: "fadeIn 0.5s ease-in-out",
});

const MessageList = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "15px",
  borderRadius: "15px",
  background: "linear-gradient(to bottom, #f0f4f8, #d9e4ec)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.1)",
});

const MessageContainer = styled(Box)(({ sender }) => ({
  fontSize: "0.7em",
  display: "flex",
  flexDirection: "column",
  alignItems: sender === "staff" ? "flex-end" : "flex-start",
  maxWidth: "70%",
  alignSelf: sender === "staff" ? "flex-end" : "flex-start",
}));

const MessageBubble = styled(Box)(({ sender }) => ({
  padding: "5px 10px",
  borderRadius: sender === "staff" ? "15px 15px 0 15px" : "15px 15px 15px 0",
  background: sender === "staff" ? "#00c3ff" : "#e3f2fd",
  color: sender === "staff" ? "white" : "black",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
  position: "relative",
}));

const SenderName = styled(Typography)({
  fontSize: "0.85em",
  fontWeight: "bold",
  padding: "3px 10px",
  color: "#444",
});

const Timestamp = styled(Typography)({
  fontSize: "0.75em",
  color: "#666",
  marginTop: "3px",
  textAlign: "right",
  opacity: 0.7,
});

const saveMessagesToLocal = (userId, messages) => {
  localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
};

const ChatWithCustomer = () => {
  const [customers, setCustomers] = useState(null);
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { id } = useParams();
  const messagesRef = useRef([]);

  useEffect(() => {
    if (!jwtToken || !id) return;

    const fetchCustomer = async () => {
      try {
        const response = await AccountService.getCustomerDetail(id);
        console.log("Db user:", response);
        if (response) {
          setCustomers(response);
          setSelectedUser(response);
          const storedMessages = localStorage.getItem(`chat_${id}`);
          setMessages(storedMessages ? JSON.parse(storedMessages) : []);
        } else {
          console.warn("Customer data is empty!");
          setCustomers(null);
        }
      } catch (error) {
        console.error("Can't access server", error);
      }
    };
    fetchCustomer();
  }, [id, jwtToken]);

  const setupWebSocket = useCallback(() => {
    if (!jwtToken || !id) return;

    const ws = new WebSocket(
      `${REACT_APP_BACKEND_WS_ENDPOINT}/ws/chat/connect/${id}?token=${jwtToken}`
    );

    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket Connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "data" && Array.isArray(data.chatlog)) {
        // Khi tải lịch sử chat từ server
        const parsedMessages = data.chatlog
          .map((msgObj) => {
            try {
              const messageContent = JSON.parse(msgObj.msg);
              return {
                text: messageContent.message,
                sender: messageContent.sender,
                timestamp: messageContent.timestamp,
              };
            } catch (error) {
              console.error("Error parsing message", error);
              return null;
            }
          })
          .filter(Boolean);

        // ✅ Tránh trùng lặp tin nhắn đã hiển thị
        const newMessages = parsedMessages.filter(
          (msg) => !messagesRef.current.some((m) => m.timestamp === msg.timestamp)
        );

        if (newMessages.length > 0) {
          messagesRef.current = [...messagesRef.current, ...newMessages];
          setMessages([...messagesRef.current]);
          saveMessagesToLocal(id, messagesRef.current);
        }
      } else if (data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          if (messageContent.type === "chat") {
            const newMessage = {
              text: messageContent.message,
              sender: messageContent.sender,
              timestamp: messageContent.timestamp,
            };

            // ✅ Kiểm tra tin nhắn đã có trên UI chưa (tránh trùng)
            if (!messagesRef.current.some((m) => m.timestamp === newMessage.timestamp)) {
              messagesRef.current = [...messagesRef.current, newMessage];
              setMessages([...messagesRef.current]);
              saveMessagesToLocal(idUser, messagesRef.current);
            }
          }
        } catch (error) {
          console.error("Lỗi khi parse tin nhắn từ server:", error);
        }
      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);

    ws.onclose = () => {
      console.warn("WebSocket Disconnected. Reconnecting in 3s...");
      setTimeout(() => {
        if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
          setupWebSocket();
        }
      }, 3000);
    };

    return () => ws.close();
  }, [id, jwtToken]);

  useEffect(() => {
    if (id) {
      const storedMessages = localStorage.getItem(`chat_${id}`);
      setMessages(storedMessages ? JSON.parse(storedMessages) : []);
      messagesRef.current = storedMessages ? JSON.parse(storedMessages) : [];
    }
  }, [id]);

  useEffect(() => {
    setupWebSocket();
  }, [setupWebSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    if (input.trim()) {
      const timestamp = new Date().toISOString();
      const messageData = {
        type: "chat",
        sender: "staff",
        message: input,
        timestamp,
      };

      socketRef.current.send(JSON.stringify(messageData));
      console.log("📤 Sent Message:", messageData);

      // Cập nhật UI ngay lập tức mà không cần chờ phản hồi từ server
      const newMessage = { text: input, sender: "staff", timestamp };
      messagesRef.current = [...messagesRef.current, newMessage];
      setMessages([...messagesRef.current]);
      saveMessagesToLocal(id, messagesRef.current);

      // Cuộn xuống cuối khi gửi tin nhắn
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      setInput(""); // Xóa input sau khi gửi
    }
  };

  useEffect(() => {
    console.log("📩 Tất cả tin nhắn:", messages);
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <ChatContainer>
      <CustomerList elevation={3}>
        <Link to="/chat">
          <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
        </Link>
        <Typography variant="h6" sx={{ padding: "15px", textAlign: "center" }}>
          Customer
        </Typography>
        <hr style={{ marginBottom: "15px" }} />
        <List>
          {customers && (
            <ListItem
              button
              key={customers.id}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: customers?.id ? "#bbdefb" : "white",
                borderRadius: "5px",
                marginBottom: "5px",
                padding: "5px 15px",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                }}
              >
                <img
                  src={
                    customers.profile_pic && customers.profile_pic.trim() !== "defaultProfile"
                      ? customers.profile_pic
                      : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                  }
                  alt={customers.username}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <ListItemText
                primaryTypographyProps={{ sx: { fontSize: "0.8em", fontWeight: "500" } }}
                primary={customers.username}
              />
            </ListItem>
          )}
        </List>
      </CustomerList>

      <ChatBox elevation={3}>
        <Typography sx={{ textAlign: "center", fontSize: "0.8em", fontWeight: "500" }}>
          Chat with {customers?.username || "No one"}
        </Typography>
        <MessageList>
          {messages.map((msg, index) => (
            <MessageContainer key={index} sender={msg.sender}>
              <SenderName>{msg.sender === "staff" ? "You" : selectedUser?.username}</SenderName>
              <MessageBubble sender={msg.sender}>{msg.text}</MessageBubble>
              <Timestamp>{formatTime(msg.timestamp)}</Timestamp>
            </MessageContainer>
          ))}
          <div ref={messagesEndRef} />
        </MessageList>

        <Box display="flex" mt={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
            <SendIcon sx={{ color: "#00c3ff" }} />
          </IconButton>
        </Box>
      </ChatBox>
    </ChatContainer>
  );
};

export default ChatWithCustomer;
