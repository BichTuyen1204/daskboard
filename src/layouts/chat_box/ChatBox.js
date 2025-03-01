import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Box, List, ListItem, ListItemText, TextField, Button, Icon } from "@mui/material";
import AccountService from "api/AccountService";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";

const ChatWithCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");

  // Lấy danh sách khách hàng
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await AccountService.getAllCustomer(jwtToken);
        setCustomers(response);
      } catch (error) {
        console.error("Can't fetch customers", error);
      }
    };
    fetchCustomers();
  }, [jwtToken]);

  // WebSocket
  const wsUrl = selectedUser ? `ws://localhost:8000/ws/chat/${selectedUser.id}` : null;
  const { sendMessage } = useWebSocket(wsUrl, {
    onOpen: () => console.log(`Connected to ${selectedUser?.username}`),
    onMessage: (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    },
    shouldReconnect: () => true,
  });

  // Gửi tin nhắn
  const handleSend = () => {
    if (message.trim() !== "" && selectedUser) {
      const msgData = {
        sender: "staff",
        text: message,
        timestamp: new Date().toISOString(),
      };
      sendMessage(JSON.stringify(msgData));
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  return (
    <Box
      style={{
        width: "70%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        padding: "20px",
      }}
    >
      {" "}
      {/* Danh sách khách hàng */}
      <Box width="30%" borderRight="1px solid #ddd" overflow="auto">
        <List>
          {customers.map((customer) => (
            <ListItem
              button
              key={customer.id}
              onClick={() => setSelectedUser(customer)}
              style={{
                backgroundColor: selectedUser?.id === customer.id ? "#f0f0f0" : "white",
              }}
            >
              <ListItemText primary={customer.username} />
            </ListItem>
          ))}
        </List>
      </Box>
      {/* Khung chat */}
      <Box width="70%" display="flex" flexDirection="column">
        <Box flex={1} p={2} overflow="auto">
          {selectedUser ? (
            <>
              <h3>Chat với {selectedUser.username}</h3>
              <Box>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    p={1}
                    m={1}
                    bgcolor={msg.sender === "staff" ? "#d1e7ff" : "#f8d7da"}
                    borderRadius="5px"
                    alignSelf={msg.sender === "staff" ? "flex-end" : "flex-start"}
                  >
                    <strong>{msg.sender}:</strong> {msg.text}
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <p>Chọn một khách hàng để chat</p>
          )}
        </Box>

        {/* Nhập tin nhắn */}
        <Box display="flex" p={2} borderTop="1px solid #ddd">
          <TextField
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <Button onClick={handleSend} variant="contained" color="primary">
            Gửi
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWithCustomer;
