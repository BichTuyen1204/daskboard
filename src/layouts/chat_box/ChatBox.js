import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";

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
        console.error("Can not get list customer", error);
      }
    };
    fetchCustomers();
  }, [jwtToken]);

  const handleSelectCustomer = (customer) => {
    if (socket) socket.close();
    setSelectedUser(customer);
    const storedMessages = localStorage.getItem(`chat_${customer.id}`);
    setMessages(storedMessages ? JSON.parse(storedMessages) : []);
  };

  useEffect(() => {
    if (!jwtToken || !selectedUser) return;

    const ws = new WebSocket(
      `${REACT_APP_BACKEND_WS_ENDPOINT}/ws/chat/connect/${selectedUser.id}?token=${jwtToken}`
    );
    console.log(ws);

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.msg) {
        try {
          const messageContent = JSON.parse(data.msg);
          console.log("Received message:", data);
          const timestamp = new Date().toISOString();

          const newMessage = {
            text: messageContent.message,
            sender: data.sender,
            timestamp: messageContent.timestamp || timestamp,
          };

          setMessages((prev) => {
            const updatedMessages = [...prev, newMessage];
            saveMessagesToLocal(selectedUser.id, updatedMessages);
            return updatedMessages;
          });
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      }
    };

    // Sự kiện khi có lỗi xảy ra với WebSocket
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Sự kiện khi kết nối WebSocket đóng
    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log("WebSocket closed cleanly");
      } else {
        console.error("WebSocket closed with an error");
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [selectedUser, jwtToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    if (input.trim()) {
      const timestamp = new Date().toISOString();
      const messageData = {
        type: "chat",
        sender: "staff",
        message: input,
        timestamp,
      };

      socket.send(JSON.stringify(messageData));
      console.log("Sending message:", messageData);

      const updatedMessages = [...messages, { text: input, sender: "staff", timestamp }];
      setMessages(updatedMessages);

      if (selectedUser) {
        saveMessagesToLocal(selectedUser.id, updatedMessages);
        console.log("Stored messages:", localStorage.getItem(`chat_${selectedUser?.id}`));
      }

      setInput("");
    }
  };

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
                    customer.profile_pic && customer.profile_pic.trim() !== "defaultProfile"
                      ? customer.profile_pic
                      : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                  }
                  alt={customer.username}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <ListItemText
                primaryTypographyProps={{ sx: { fontSize: "0.8em", fontWeight: "500" } }}
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
