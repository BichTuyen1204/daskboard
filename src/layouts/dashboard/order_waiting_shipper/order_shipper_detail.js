import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Icon, Grid, Card } from "@mui/material";
import ShipperService from "api/ShipperService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";

const OrderShipperDetail = () => {
  const { id } = useParams();
  const [shipper, setShipper] = useState(null);
  const [item, setItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [idCancelOrder, setIdCancelOrder] = useState(null);
  const [popupAccept, setPopupAccept] = useState(false);
  const [popupAcceptSuccess, setPopupAcceptSuccess] = useState(false);
  const [popupRejectSuccess, setPopupRejectSuccess] = useState(false);
  const [popupReject, setPopupReject] = useState(false);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem("jwtToken"));
  const navigate = useNavigate();
  const page = 1;
  const pageSize = 50;

  const openModal = (id) => {
    setSelectedItemId(id);
    setPopupAccept(true);
  };

  const closerAccept = () => {
    setPopupAccept(false);
  };

  const openRejectOrder = (id) => {
    setIdCancelOrder(id);
    setPopupReject(true);
  };

  const closerCancelOrder = () => {
    setPopupReject(false);
  };

  useEffect(() => {
    const getOrderDetailShipper = async () => {
      if (!id) {
        return;
      }
      try {
        const data = await ShipperService.getOrderDetailShipper(id);
        setShipper(data);
      } catch (err) {}
    };
    getOrderDetailShipper();
  }, [id]);

  useEffect(() => {
    const getOrderItemsShipper = async () => {
      if (!id) return;
      try {
        const response = await ShipperService.getOrderItemsShipper(id, page, pageSize);
        if (response) {
          setItem(response);
        }
      } catch (error) {}
    };
    getOrderItemsShipper();
  }, [id, page, pageSize]);

  const acceptOrder = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.acceptOrder(id);
      setTimeout(() => {
        setPopupAccept(false);
        setPopupAcceptSuccess(true);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {}
  };

  const rejectOrder = async (id) => {
    if (!jwtToken) return;
    try {
      await ShipperService.rejectOrder(id);
      setPopupReject(false);
      setPopupAccept(false);
      setTimeout(() => {
        setPopupRejectSuccess(true);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {}
  };

  const mapTypeToLabel = (type) => {
    switch (type) {
      case "MK":
        return "Meal kit";
      case "SS":
        return "Season";
      case "VEG":
        return "Vegetable";
      case "MEAT":
        return "Meat";
    }
  };

  return (
    <DashboardLayout>
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <Link to="/dashboard">
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                {shipper && (
                  <>
                    <div style={{ fontWeight: "500", fontSize: "0.9em", paddingBottom: "5px" }}>
                      Order ID: {shipper.id}
                    </div>
                    <div style={{ fontWeight: "500", fontSize: "0.6em", paddingBottom: "10px" }}>
                      {(() => {
                        const utcDate = new Date(shipper.order_date);
                        utcDate.setHours(utcDate.getHours() + 7);
                        return utcDate.toLocaleString("vi-VN");
                      })()}
                    </div>
                  </>
                )}

                {/* Order Item */}
                <Card>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Order Item</div>
                    {shipper && (
                      <>
                        <div>
                          <button
                            style={{
                              fontWeight: "500",
                              borderRadius: "5px",
                              padding: "5px 10px",
                              color: "white",
                              backgroundColor: "#FF4545",
                              border: "1px solid white",
                              cursor: "pointer",
                            }}
                          >
                            {shipper.payment_status}
                          </button>
                        </div>
                      </>
                    )}

                    <div style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
                        {item &&
                          item.content &&
                          item.content.length > 0 &&
                          item.content.map((items, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "15px",
                                width: "100%",
                                flexWrap: "wrap",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "15px",
                              }}
                            >
                              <img
                                src={items.image_url}
                                alt={items.name}
                                style={{
                                  width: "4rem",
                                  height: "55px",
                                  borderRadius: "8px",
                                  marginRight: "15px",
                                }}
                              />

                              <div style={{ fontSize: "0.6em", width: "50%" }}>
                                <div>
                                  Category: <strong>{mapTypeToLabel(items.type)}</strong>
                                </div>
                                <div>
                                  Name of product: <strong>{items.name}</strong>
                                </div>
                                <div>
                                  Product of the day:{" "}
                                  <strong>
                                    {(() => {
                                      const utcDate = new Date(items.price_date);
                                      utcDate.setHours(utcDate.getHours() + 7);
                                      return utcDate.toLocaleString("vi-VN");
                                    })()}
                                  </strong>
                                </div>
                                <div>
                                  Coupon used: <strong>{items?.sale_percent || "0"}%</strong>
                                </div>
                              </div>

                              {/* Giá sản phẩm */}
                              <div
                                style={{
                                  fontSize: "0.65em",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p>Price</p>
                                <button
                                  style={{
                                    padding: "5px 15px",
                                    background: "#373737",
                                    color: "white",
                                    border: "1px solid gray",
                                    borderRadius: "5px",
                                    marginBottom: "5px",
                                  }}
                                >
                                  ${items.price}
                                </button>
                              </div>
                            </div>
                          ))}

                        {/* Tổng giá của các sản phẩm */}
                        {shipper && (
                          <div style={{ marginTop: "15px", display: "flex" }}>
                            <p style={{ fontSize: "0.75em", fontWeight: "450" }}>Total price:</p>
                            <div
                              style={{
                                color: "tomato",
                                marginLeft: "15px",
                                paddingBottom: "10px",
                              }}
                            >
                              <strong>${shipper.total_price}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Grid>
                </Card>

                {/* Info user */}
                <Card style={{ marginTop: "20px" }}>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Infor receiver</div>
                    {shipper && (
                      <div>
                        <button
                          style={{
                            fontWeight: "500",
                            borderRadius: "5px",
                            padding: "5px 10px",
                            color: "white",
                            backgroundColor: "green",
                            border: "1px solid gray",
                            cursor: "pointer",
                          }}
                        >
                          {shipper.payment_method}
                        </button>
                      </div>
                    )}

                    {shipper && (
                      <div style={{ display: "flex", marginTop: "15px" }}>
                        <div
                          style={{
                            fontSize: "0.6em",
                            fontWeight: "500",
                          }}
                        >
                          Name of receiver:
                        </div>
                        <div
                          style={{
                            fontSize: "0.6em",
                            marginLeft: "5px",
                          }}
                        >
                          {shipper.receiver}
                        </div>
                      </div>
                    )}

                    {shipper && (
                      <div style={{ display: "flex", marginTop: "15px" }}>
                        <div
                          style={{
                            fontSize: "0.6em",
                            fontWeight: "500",
                          }}
                        >
                          Phone number:
                        </div>
                        <div
                          style={{
                            fontSize: "0.6em",
                            marginLeft: "5px",
                          }}
                        >
                          {shipper.phonenumber}
                        </div>
                      </div>
                    )}

                    {shipper && (
                      <div style={{ display: "flex", marginTop: "15px" }}>
                        <div
                          style={{
                            fontSize: "0.6em",
                            fontWeight: "500",
                          }}
                        >
                          Address:
                        </div>
                        <div
                          style={{
                            fontSize: "0.6em",
                            marginLeft: "5px",
                          }}
                        >
                          {shipper.delivery_address}
                        </div>
                      </div>
                    )}

                    {shipper && (
                      <div style={{ display: "flex", marginTop: "15px" }}>
                        <div
                          style={{
                            fontSize: "0.6em",
                            fontWeight: "500",
                          }}
                        >
                          Note from receiver:
                        </div>
                        <div
                          style={{
                            fontSize: "0.6em",
                            marginLeft: "5px",
                          }}
                        >
                          {shipper.note || "Nothing"}
                        </div>
                      </div>
                    )}
                  </Grid>
                </Card>

                {/* Order summary */}
                <Card style={{ marginTop: "20px" }}>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Order summary</div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "30%",
                        }}
                      >
                        <strong>Shipping:</strong>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "30%",
                        }}
                      >
                        Free shipping
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                          textAlign: "end",
                        }}
                      >
                        $0
                      </div>
                    </div>
                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.7em",
                          width: "30%",
                          fontWeight: "500",
                        }}
                      >
                        Total:
                      </div>
                      <div
                        style={{
                          width: "30%",
                        }}
                      ></div>
                      {shipper && (
                        <div
                          style={{
                            fontSize: "0.7em",
                            width: "25%",
                            fontWeight: "500",
                            textAlign: "end",
                          }}
                        >
                          ${shipper.total_price}
                        </div>
                      )}
                    </div>

                    <div style={{ borderBottom: "1px solid #cfcfcf" }}></div>

                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        <strong>Paid by customer:</strong>
                      </div>
                      <div
                        style={{
                          width: "10%",
                        }}
                      ></div>
                      {shipper && (
                        <div
                          style={{
                            fontSize: "0.6em",
                            width: "25%",
                            textAlign: "end",
                          }}
                        >
                          ${shipper.total_price}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "30%",
                        }}
                      >
                        <strong>Payment:</strong>
                      </div>
                      <div
                        style={{
                          width: "30%",
                        }}
                      ></div>
                      {shipper && (
                        <div
                          style={{
                            fontSize: "0.6em",
                            width: "25%",
                            textAlign: "end",
                          }}
                        >
                          {shipper.payment_method}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        style={{
                          border: "1px solid green",
                          marginRight: "15px",
                          padding: "10px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "5px",
                          fontSize: "0.6em",
                        }}
                        onClick={() => openModal(shipper.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        style={{
                          border: "1px solid red ",
                          padding: "10px",
                          backgroundColor: "#FF4545",
                          color: "white",
                          borderRadius: "5px",
                          fontSize: "0.6em",
                        }}
                        onClick={() => openRejectOrder(shipper.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </Grid>
                </Card>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/*  Popup Accept */}
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
                style={{
                  marginBottom: "10px",
                  color: "#333",
                  fontWeight: "bold",
                  fontSize: "0.8em",
                }}
              >
                Confirm Accept
              </h3>
              <p
                style={{
                  marginBottom: "20px",
                  color: "#555",
                  fontSize: "0.9em",
                  fontSize: "0.7em",
                }}
              >
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

        {/* ✅ Popup Reject */}
        {popupReject && (
          <>
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
                style={{
                  marginBottom: "10px",
                  color: "#333",
                  fontWeight: "bold",
                  fontSize: "0.8em",
                }}
              >
                Confirm Reject Order
              </h3>
              <p
                style={{
                  marginBottom: "20px",
                  color: "#555",
                  fontSize: "0.9em",
                  fontSize: "0.7em",
                }}
              >
                Are you sure you want to reject this order?
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button
                  onClick={() => rejectOrder(idCancelOrder)}
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

        {popupAcceptSuccess &&
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
                  Order accepted successfully
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
      </MDBox>
    </DashboardLayout>
  );
};

export default OrderShipperDetail;
