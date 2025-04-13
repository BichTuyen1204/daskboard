import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Icon } from "@mui/material";
import ShipperService from "api/ShipperService";
import { Link } from "react-router-dom";

const DataShipper = () => {
  const [shipper, setShipper] = useState(null);
  const [orderCurrent, setOrderCurrent] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [idOrder, setIdOrder] = useState(null);
  const [idCancelOrder, setIdCancelOrder] = useState(null);
  const [popupAccept, setPopupAccept] = useState(false);
  const [popupShipped, setPopupShipped] = useState(false);
  const [popupReject, setPopupReject] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [popupShippedSuccess, setPopupShippedSuccess] = useState(false);
  const [popupRejectSuccess, setPopupRejectSuccess] = useState(false);

  const openModal = (id) => {
    setSelectedItemId(id);
    setPopupAccept(true);
  };

  const closerAccept = () => {
    setPopupAccept(false);
  };

  const openOrderCurrent = (id) => {
    setIdOrder(id);
    setPopupShipped(true);
  };

  const closerOrderCurrent = () => {
    setPopupShipped(false);
  };

  const opencancelOrder = (id) => {
    setIdCancelOrder(id);
    setPopupReject(true);
  };

  const closerCancelOrder = () => {
    setPopupReject(false);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await ShipperService.getOrderAwait();
      if (response) {
        setShipper(response);
        console.log("Orders:", response);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    const getFetchCurrent = async () => {
      const response = await ShipperService.getFetchCurrent();
      if (response) {
        setOrderCurrent(response);
        console.log("Current Order:", response);
      }
    };
    getFetchCurrent();
  }, []);

  const acceptOrder = async (id) => {
    if (!jwtToken) return;
    try {
      const response = await ShipperService.acceptOrder(id);
      if (response) {
        const current = await ShipperService.getFetchCurrent();
        if (current) {
          setOrderCurrent(current);
          setShipper(null);
          setPopupAccept(false);
        }
      }
    } catch (error) {
      console.error("Accept order failed:", error);
    }
  };

  const orderShipped = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.orderShipped(id);
      setPopupShipped(false);
      setTimeout(() => {
        setPopupShippedSuccess(true);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Accept order failed:", error);
    }
  };

  const cancelOrder = async (id) => {
    if (!jwtToken) return;
    try {
      const response = await ShipperService.cancelOrder(id);
      setPopupReject(false);
      setTimeout(() => {
        setPopupRejectSuccess(true);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Accept order failed:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "90%",
        background: "white",
        padding: "10px",
        borderRadius: "20px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        color: "#333",
        position: "relative",
      }}
    >
      {orderCurrent ? (
        <>
          <Typography fontWeight="bold" gutterBottom style={{ fontSize: "0.8em" }}>
            ✅ Current Order In Progress
          </Typography>
          <Typography variant="body1" style={{ fontSize: "0.65em" }}>
            <strong>Customer Name:</strong> {orderCurrent.receiver}
          </Typography>
          <Typography variant="body1" style={{ fontSize: "0.65em" }}>
            <strong>Delivery Address:</strong> {orderCurrent.address}
          </Typography>
          <Typography variant="body1" style={{ fontSize: "0.65em" }}>
            <strong>Phone Number:</strong> {orderCurrent.phone}
          </Typography>
          <Typography variant="body1" style={{ fontSize: "0.65em" }}>
            <strong>Total Price:</strong> $<strong>{orderCurrent.pay}</strong>
          </Typography>
          <Typography variant="body1" style={{ fontSize: "0.65em" }}>
            <strong>Note:</strong> {orderCurrent.note || "Nothing"}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              sx={{
                fontSize: "0.7em",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                padding: "6px 12px",
              }}
              onClick={() => openOrderCurrent(orderCurrent.id)}
            >
              ✅ Shipped
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                fontSize: "0.7em",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                padding: "6px 12px",
              }}
              onClick={() => opencancelOrder(orderCurrent.id)}
            >
              ❌ Cancel
            </Button>
          </Box>
        </>
      ) : shipper ? (
        <>
          <Typography
            variant="body2"
            fontWeight="bold"
            style={{ fontSize: "0.75em", marginBottom: "10px" }}
          >
            Orders waiting for shipper
          </Typography>
          <Box sx={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <Typography variant="body1" fontSize="0.6em">
              <strong>Customer Name:</strong> {shipper.receiver}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.6em" }}>
              <strong>Phone Number:</strong> {shipper.phone}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.6em" }}>
              <strong>Delivery Address:</strong> {shipper.address}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.6em" }}>
              <strong>Total Price:</strong> $<strong>{shipper.pay}</strong>
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.6em" }}>
              <strong>Note:</strong> {shipper.note || "Nothing"}
            </Typography>
            <Link to={`/order_shipper_detail/${shipper.id}`}>
              <Button
                size="small"
                sx={{ mt: 1, fontSize: "0.5em", color: "black", border: "1px solid gray" }}
              >
                View Detail
              </Button>
            </Link>
            {/* <Button
              onClick={() => openModal(shipper.id)}
              size="small"
              sx={{ mt: 1, fontSize: "0.6em" }}
              variant="outlined"
            >
              Accept
            </Button>

            <Button
              onClick={() => cancelAccept}
              size="small"
              sx={{ mt: 1, fontSize: "0.6em" }}
              variant="outlined"
            >
              Not Accept
            </Button> */}
          </Box>
        </>
      ) : (
        <Typography
          variant="body2"
          style={{ fontSize: "0.7em", fontWeight: "500", textAlign: "center" }}
        >
          You have no orders.
        </Typography>
      )}

      {/* ✅ Popup Accept */}
      {popupAccept && (
        <>
          {/* Background overlay */}
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(87, 87, 87, 0.2)",
              backdropFilter: "blur(0.05em)",
              zIndex: "999",
            }}
            onClick={closerAccept}
          />

          {/* Popup box */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              zIndex: "1000",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#333", fontWeight: "bold" }}>
              Confirm Accept
            </h3>
            <p style={{ marginBottom: "30px", color: "#555", fontSize: "0.9em" }}>
              Are you sure you want to accept this order?
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={() => acceptOrder(selectedItemId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Yes
              </button>
              <button
                onClick={closerAccept}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#c62828",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                No
              </button>
            </div>
            <Icon
              onClick={closerAccept}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "#555",
              }}
            >
              close
            </Icon>
          </div>
        </>
      )}

      {/* ✅ Popup Shipped */}
      {popupShipped && (
        <>
          {/* Background overlay */}
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(87, 87, 87, 0.2)",
              backdropFilter: "blur(0.05em)",
              zIndex: "999",
            }}
            onClick={closerOrderCurrent}
          />

          {/* Popup box */}
          <div
            style={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "15px",
              width: "85%",
              maxWidth: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              zIndex: "1000",
              textAlign: "center",
            }}
          >
            <h3
              style={{ marginBottom: "10px", color: "#333", fontWeight: "bold", fontSize: "0.8em" }}
            >
              Confirm Shipped Order
            </h3>
            <p
              style={{ marginBottom: "20px", color: "#555", fontSize: "0.9em", fontSize: "0.7em" }}
            >
              Are you sure you want to accept this order?
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={() => orderShipped(idOrder)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Yes
              </button>
              <button
                onClick={closerOrderCurrent}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#c62828",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                No
              </button>
            </div>
            <Icon
              onClick={closerOrderCurrent}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "#555",
              }}
            >
              close
            </Icon>
          </div>
        </>
      )}

      {/* ✅ Popup Reject */}
      {popupReject && (
        <>
          {/* Background overlay */}
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(87, 87, 87, 0.2)",
              backdropFilter: "blur(0.05em)",
              zIndex: "999",
            }}
            onClick={closerCancelOrder}
          />

          {/* Popup box */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "400px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              zIndex: "1000",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "20px", color: "#333", fontWeight: "bold" }}>
              Confirm Reject Order
            </h3>
            <p style={{ marginBottom: "30px", color: "#555", fontSize: "0.9em" }}>
              Are you sure you want to reject this order?
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={() => cancelOrder(idCancelOrder)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#2e7d32",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Yes
              </button>
              <button
                onClick={closerCancelOrder}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#c62828",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                No
              </button>
            </div>
            <Icon
              onClick={closerCancelOrder}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "#555",
              }}
            >
              close
            </Icon>
          </div>
        </>
      )}

      {popupRejectSuccess &&
        ReactDOM.createPortal(
          <>
            {/* Overlay */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(2px)",
                zIndex: 999,
              }}
              onClick={closerAccept}
            />

            {/* Popup */}
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                width: "90%",
                maxWidth: "360px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                zIndex: 1000,
                textAlign: "center",
              }}
            >
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                width="55"
                height="55"
                style={{
                  marginBottom: "15px",
                  animation: "popIn 0.6s ease",
                  borderRadius: "30px",
                }}
              >
                <circle cx="27" cy="26" r="25" fill="none" stroke="#4caf50" strokeWidth="4" />
                <path fill="none" stroke="#4caf50" strokeWidth="4" d="M14 26l7 7 15-15" />
              </svg>

              {/* Message */}
              <p
                style={{
                  color: "green",
                  fontSize: "0.8em",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Order rejected successfully
              </p>
            </div>

            {/* Animation keyframes */}
            <style>
              {`
                @keyframes popIn {
                  0% {
                    transform: scale(0);
                    opacity: 0;
                  }
                  100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }
              `}
            </style>
          </>,
          document.body
        )}

      {popupShippedSuccess &&
        ReactDOM.createPortal(
          <>
            {/* Overlay */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(2px)",
                zIndex: 999,
              }}
              onClick={closerAccept}
            />

            {/* Popup */}
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                width: "90%",
                maxWidth: "360px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                zIndex: 1000,
                textAlign: "center",
              }}
            >
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
                width="55"
                height="55"
                style={{
                  marginBottom: "15px",
                  animation: "popIn 0.6s ease",
                  borderRadius: "30px",
                }}
              >
                <circle cx="27" cy="26" r="25" fill="none" stroke="#4caf50" strokeWidth="4" />
                <path fill="none" stroke="#4caf50" strokeWidth="4" d="M14 26l7 7 15-15" />
              </svg>

              {/* Message */}
              <p
                style={{
                  color: "green",
                  fontSize: "0.8em",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Order shipped successfully
              </p>
            </div>

            {/* Animation keyframes */}
            <style>
              {`
                  @keyframes popIn {
                    0% {
                      transform: scale(0);
                      opacity: 0;
                    }
                    100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                `}
            </style>
          </>,
          document.body
        )}
    </Box>
  );
};

export default DataShipper;
