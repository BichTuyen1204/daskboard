import React, { useState, useEffect, useRef } from "react";
import AccountService from "api/AccountService";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";

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

const MessageBubble = styled(Box)(({ sender }) => ({
  display: "inline-block",
  maxWidth: "70%",
  padding: "5px 15px",
  fontSize: "0.8em",
  borderRadius: sender === "staff" ? "15px 15px 0 15px" : "15px 15px 15px 0",
  background: sender === "staff" ? "#00c3ff" : "#e3f2fd",
  color: sender === "staff" ? "white" : "black",
  alignSelf: sender === "staff" ? "flex-end" : "flex-start",
  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
}));

const ChatWithCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await AccountService.getAllCustomer(jwtToken);
        setCustomers(response);
      } catch (error) {
        console.error("Không thể lấy danh sách khách hàng", error);
      }
    };
    fetchCustomers();
  }, [jwtToken]);

  const handleSelectCustomer = (customer) => {
    if (socket) socket.close();
    setSelectedUser(customer);
    setMessages([]);
  };

  useEffect(() => {
    if (!jwtToken || !selectedUser) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/connect/${selectedUser.id}`);
    ws.onopen = () => console.log("🔗 Kết nối WebSocket với User");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          setMessages((prev) => [...prev, { text: messageContent.message, sender: data.sender }]);
        } catch (error) {}
      }
    };
    ws.onerror = (error) => console.error("❌ Lỗi WebSocket:", error);
    ws.onclose = () => console.warn("⚠️ WebSocket bị đóng");
    setSocket(ws);
    return () => ws.close();
  }, [selectedUser, jwtToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    if (input.trim()) {
      const messageData = { type: "chat", sender: "staff", message: input };
      socket.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <ChatContainer>
      <CustomerList elevation={3}>
        <Typography variant="h6" sx={{ padding: "15px", textAlign: "center" }}>
          Customer List
        </Typography>
        <hr style={{ marginBottom: "15px" }} />
        <List>
          {customers?.map((customer) => (
            <ListItem
              button
              key={customer.id}
              onClick={() => handleSelectCustomer(customer)}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedUser?.id === customer.id ? "#bbdefb" : "white",
                borderRadius: "5px",
                marginBottom: "5px",
                padding: "5px 15px",
              }}
            >
              <Avatar sx={{ marginRight: 2 }}>{customer.username.charAt(0)}</Avatar>
              <ListItemText
                primaryTypographyProps={{ sx: { fontSize: "0.8em" } }}
                primary={customer.username}
              />
            </ListItem>
          ))}
        </List>
      </CustomerList>

      <ChatBox elevation={3}>
        <Typography sx={{ textAlign: "center", fontSize: "0.8em", fontWeight: "500" }}>
          Chat with {selectedUser?.username || "..."}
        </Typography>
        <MessageList>
          {messages.map((msg, index) => (
            <MessageBubble key={index} sender={msg.sender}>
              {msg.text}
            </MessageBubble>
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
            <SendIcon />
          </IconButton>
        </Box>
      </ChatBox>
    </ChatContainer>
  );
};

export default ChatWithCustomer;
