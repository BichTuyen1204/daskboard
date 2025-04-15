import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Icon } from "@mui/material";
import ShipperService from "api/ShipperService";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

const DataShipper = () => {
  const [shipper, setShipper] = useState(null);
  const [orderCurrent, setOrderCurrent] = useState(null);
  const [idOrder, setIdOrder] = useState(null);
  const [idShippingOrder, setIdShippingOrder] = useState(null);
  const [idCancelOrder, setIdCancelOrder] = useState(null);
  const [popupShipped, setPopupShipped] = useState(false);
  const [popupShipping, setPopupShipping] = useState(false);
  const [popupCancel, setPopupCancel] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const [popupShippedSuccess, setPopupShippedSuccess] = useState(false);
  const [popupShippingSuccess, setPopupShippingSuccess] = useState(false);
  const [popupCancelSuccess, setPopupCancelSuccess] = useState(false);

  const openOrderCurrent = (id) => {
    setIdOrder(id);
    setPopupShipped(true);
  };

  const closerOrderCurrent = () => {
    setPopupShipped(false);
  };

  const openOrderShipping = (id) => {
    setIdShippingOrder(id);
    setPopupShipping(true);
  };

  const closerOrderShipping = () => {
    setPopupShipping(false);
  };

  const opencancelOrder = (id) => {
    setIdCancelOrder(id);
    setPopupCancel(true);
  };

  const closerCancelOrder = () => {
    setPopupCancel(false);
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

  const orderShipped = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.orderShipped(id);
      setTimeout(() => {
        setPopupShipped(false);
        setPopupShippedSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 2000);
    } catch (error) {}
  };

  const orderShipping = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.shippingOrder(id);
      setTimeout(() => {
        setPopupShipping(false);
        setPopupShippingSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 2000);
    } catch (error) {}
  };

  const cancelOrder = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.cancelOrder(id);
      setPopupCancel(false);
      setTimeout(() => {
        setPopupCancelSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, 2000);
    } catch (error) {}
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
        orderCurrent.status === "ON_SHIPPING" ? (
          <>
            <Typography fontWeight="bold" gutterBottom style={{ fontSize: "0.8em" }}>
              🚚 Order is shipping
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
              <strong>
                Total Price:<strong style={{ color: "red" }}>${orderCurrent.pay}</strong>{" "}
              </strong>
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
        ) : orderCurrent.status === "ACCEPTED" ? (
          <>
            <Typography fontWeight="bold" gutterBottom style={{ fontSize: "0.8em" }}>
              📦 Order Accepted - Ready to Shipping
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.65em" }}>
              <strong>Customer Name:</strong> {orderCurrent.receiver}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.65em" }}>
              <strong>Address:</strong> {orderCurrent.address}
            </Typography>
            <Typography variant="body1" style={{ fontSize: "0.65em" }}>
              <strong>Phone:</strong> {orderCurrent.phone}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontSize: "0.7em",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                }}
                onClick={() => openOrderShipping(orderCurrent.id)}
              >
                <span style={{ color: "white" }}>🚀 Start Shipping</span>
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" style={{ fontSize: "0.7em", textAlign: "center" }}>
            ⚠️ You have a current order but status is not supported.
          </Typography>
        )
      ) : shipper ? (
        <>
          <Typography
            variant="body2"
            fontWeight="bold"
            style={{ fontSize: "0.75em", marginBottom: "10px" }}
          >
            ⏳ Orders waiting for shipper
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
              <strong>
                Total Price: <strong style={{ color: "red" }}>${shipper.pay}</strong>{" "}
              </strong>
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

      {/* ✅ Popup Shipping */}
      {popupShipping && (
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
            onClick={closerOrderShipping}
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
              Confirm Shipping Order
            </h3>
            <p
              style={{ marginBottom: "20px", color: "#555", fontSize: "0.9em", fontSize: "0.7em" }}
            >
              Are you sure you want to shipping this order?
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                onClick={() => orderShipping(idShippingOrder)}
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
                onClick={closerOrderShipping}
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
              onClick={closerOrderShipping}
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
              Are you sure you shipped this order?
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

      {/* ✅ Popup Cancel */}
      {popupCancel && (
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
              Confirm Cancel Order
            </h3>
            <p
              style={{ marginBottom: "20px", color: "#555", fontSize: "0.9em", fontSize: "0.7em" }}
            >
              Are you sure you want to cancel this order?
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

      {popupCancelSuccess &&
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
                Order canceled successfully
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

      {popupShippingSuccess &&
        ReactDOM.createPortal(
          <>
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
                Order is shipping successfully
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
