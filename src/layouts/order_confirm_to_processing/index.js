import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderService from "api/OrderService";

function OrderDetail() {
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState("");
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [popupDeleteOrder, setPopupDelete] = useState(false);
  const [popupCancelOrderSuccess, setPopupCancelOrderSuccess] = useState(false);
  const [popupOnProcessing, setPopupOnProcessing] = useState(false);
  const [popupProcessingOrderSuccess, setPopupProcessingOrderSuccess] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIdProcess, setSelectedItemIdProcess] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const getOrderDetail = async () => {
      if (jwtToken) {
        try {
          const response = await OrderService.getOrderDetail(id);
          setOrderDetail(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };

    getOrderDetail();
  }, [id, jwtToken]);

  // Hàm mở popup
  const openModal = (id) => {
    setSelectedItemId(id);
    setPopupDelete(true);
  };

  // Hàm hủy xóa
  const cancelDelete = () => {
    setPopupDelete(false);
  };

  const closePopupInfoSuccess = () => {
    setPopupCancelOrderSuccess(false);
  };

  const cancelOrder = async (id) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.log("No JWT token found");
      return;
    }
    try {
      const response = await OrderService.cancelOrder(id);
      if (response === true) {
        setPopupDelete(false);
        setPopupCancelOrderSuccess(true);
        setTimeout(() => {
          setPopupCancelOrderSuccess(false);
          navigate("/confirm_order");
        }, 4000);
      } else {
        console.log("Failed to cancel order:", response);
      }
    } catch (error) {
      console.error("Failed to cancel order:", error.message);
    }
  };

  const processingOrder = async (id) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      console.log("No JWT token found");
      return;
    }
    try {
      const response = await OrderService.processingOrder(id);
      if (response === true) {
        setPopupOnProcessing(false);
        setPopupProcessingOrderSuccess(true);
        setTimeout(() => {
          setPopupProcessingOrderSuccess(false);
          navigate("/confirm_order");
        }, 4000);
      } else {
        console.log("Failed to cancel order:", response);
      }
    } catch (error) {
      console.error("Failed to cancel order:", error.message);
    }
  };

  // Hàm mở popup
  const openProcessingOrder = (id) => {
    setSelectedItemIdProcess(id);
    setPopupOnProcessing(true);
  };

  // Hàm hủy xóa
  const cancelProcessingOrder = () => {
    setPopupOnProcessing(false);
  };

  return (
    <DashboardLayout>
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <Link to="/confirm_order">
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                <div style={{ fontWeight: "500", fontSize: "0.9em", paddingBottom: "5px" }}>
                  Order ID: {orderDetail.id}
                </div>
                <div style={{ fontWeight: "500", fontSize: "0.6em", paddingBottom: "10px" }}>
                  {new Date(orderDetail.order_date).toLocaleString("en-US", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </div>

                {/* Order Item */}
                <Card>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Order Item</div>
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
                        {orderDetail.payment_status}
                      </button>
                    </div>

                    <div style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
                        {orderDetail.items &&
                          orderDetail.items.length > 0 &&
                          orderDetail.items.map((item, index) => (
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
                              {/* Hình ảnh sản phẩm */}
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "4rem",
                                  height: "55px",
                                  borderRadius: "8px",
                                  marginRight: "15px", // Thêm khoảng cách giữa hình ảnh và thông tin
                                }}
                              />

                              {/* Thông tin sản phẩm */}
                              <div style={{ fontSize: "0.6em", width: "50%" }}>
                                <div>
                                  Category: <strong>{item.type}</strong>
                                </div>
                                <div>
                                  Name of product: <strong>{item.name}</strong>
                                </div>
                                <div>
                                  Sale percent: <strong>{item.sale_percent}%</strong>
                                </div>
                                <div>
                                  Product of the day:{" "}
                                  <strong>
                                    {new Date(item.price_date).toLocaleString("en-US", {
                                      timeZone: "Asia/Ho_Chi_Minh",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false,
                                    })}
                                  </strong>
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
                                  ${item.price}
                                </button>
                              </div>
                            </div>
                          ))}

                        {/* Tổng giá của các sản phẩm */}
                        <div style={{ marginTop: "15px", display: "flex" }}>
                          <p style={{ fontSize: "0.75em", fontWeight: "450" }}>Total price:</p>
                          <div
                            style={{
                              color: "tomato",
                              marginLeft: "15px",
                              paddingBottom: "10px",
                            }}
                          >
                            <strong>${orderDetail.total_price}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Card>

                {/* Info user */}
                <Card style={{ marginTop: "20px" }}>
                  <Grid p={2}>
                    <div style={{ fontWeight: "500", fontSize: "0.8em" }}>Infor receiver</div>
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
                        {orderDetail.payment_method}
                      </button>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "12%",
                          fontWeight: "500",
                        }}
                      >
                        Name of receiver:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                        }}
                      >
                        {orderDetail.receiver}
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "12%",
                          fontWeight: "500",
                        }}
                      >
                        Phone number:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                        }}
                      >
                        {orderDetail.phonenumber}
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "12%",
                          fontWeight: "500",
                        }}
                      >
                        Address:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                        }}
                      >
                        {orderDetail.delivery_address}
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "12%",
                          fontWeight: "500",
                        }}
                      >
                        Note from receiver:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                        }}
                      >
                        {orderDetail.note || "Nothing"}
                      </div>
                    </div>
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
                          width: "50%",
                        }}
                      >
                        <strong>Subtotal:</strong>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        {orderDetail.items && orderDetail.items.length > 0
                          ? orderDetail.items.length
                          : 0}{" "}
                        items
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        ${orderDetail.total_price}
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        <strong>Coupon:</strong>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        {/* {orderDetail.coupon} */}
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                          marginLeft: "-7px",
                        }}
                      >
                        {/* - $1500 */}
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        <strong>Shipping:</strong>
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        Free shipping
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        $0
                      </div>
                    </div>
                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.7em",
                          width: "50%",
                          fontWeight: "500",
                        }}
                      >
                        Total:
                      </div>
                      <div
                        style={{
                          width: "25%",
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: "0.7em",
                          width: "25%",
                          fontWeight: "500",
                        }}
                      >
                        {orderDetail.total_price}
                      </div>
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
                          width: "25%",
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        {orderDetail.total_price}
                      </div>
                    </div>
                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        <strong>Payment:</strong>
                      </div>
                      <div
                        style={{
                          width: "25%",
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        {orderDetail.payment_method}
                      </div>
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
                          border: "1px solid red",
                          marginRight: "15px",
                          padding: "10px",
                          backgroundColor: "#FF4545",
                          color: "white",
                          borderRadius: "5px",
                          fontSize: "0.6em",
                        }}
                        onClick={() => openModal(orderDetail.id)}
                      >
                        CANCEL
                      </Button>
                      <Button
                        style={{
                          border: "1px solid green",
                          padding: "10px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "5px",
                          fontSize: "0.6em",
                        }}
                        onClick={() => openProcessingOrder(orderDetail.id)}
                      >
                        ON PROCESSING
                      </Button>
                    </div>
                  </Grid>
                </Card>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        {popupDeleteOrder && (
          <>
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(87, 87, 87, 0.5)",
                backdropFilter: "blur(0.05em)",
                zIndex: "999",
              }}
              onClick={cancelDelete}
            ></div>

            {/* Popup nội dung */}
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
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#333",
                  fontWeight: "bold",
                  fontSize: "0.9em",
                }}
              >
                Confirm Cancel Order
              </h3>
              <p
                style={{
                  marginBottom: "15px",
                  color: "#555",
                  fontSize: "0.8em",
                }}
              >
                Are you sure you want to cancel this order?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => cancelOrder(selectedItemId)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.7em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#c62828")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                >
                  Cancel
                </button>
                <button
                  onClick={cancelDelete}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.7em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
                >
                  Back
                </button>
              </div>
              <Icon
                onClick={cancelDelete}
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
        {popupCancelOrderSuccess && (
          <>
            {/* Popup nội dung */}
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(87, 87, 87, 0.5)",
                backdropFilter: "blur(0.05em)",
                zIndex: "999",
              }}
              onClick={cancelDelete}
            ></div>
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
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.9)",
                zIndex: "1000",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  marginBottom: "20px",
                  color: "green",
                  fontSize: "0.9em",
                  fontWeight: "500",
                  marginTop: "20px",
                }}
              >
                You have successfully canceled the order.
              </p>
              <Icon
                onClick={closePopupInfoSuccess}
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
        {popupOnProcessing && (
          <>
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(87, 87, 87, 0.5)",
                backdropFilter: "blur(0.05em)",
                zIndex: "999",
              }}
              onClick={cancelProcessingOrder}
            ></div>

            {/* Popup nội dung */}
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
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#333",
                  fontWeight: "bold",
                  fontSize: "0.9em",
                }}
              >
                Confirm Processing Order
              </h3>
              <p
                style={{
                  marginBottom: "15px",
                  color: "#555",
                  fontSize: "0.8em",
                }}
              >
                Are you sure you want to process the order?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => processingOrder(selectedItemIdProcess)}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.7em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#c62828")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                >
                  Yes
                </button>
                <button
                  onClick={cancelProcessingOrder}
                  style={{
                    flex: "1",
                    padding: "10px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.7em",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
                >
                  No
                </button>
              </div>
              <Icon
                onClick={cancelProcessingOrder}
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
        {popupProcessingOrderSuccess && (
          <>
            {/* Popup nội dung */}
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(87, 87, 87, 0.5)",
                backdropFilter: "blur(0.05em)",
                zIndex: "999",
              }}
              onClick={cancelProcessingOrder}
            ></div>
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
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.9)",
                zIndex: "1000",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  marginBottom: "20px",
                  color: "green",
                  fontSize: "0.9em",
                  fontWeight: "500",
                  marginTop: "20px",
                }}
              >
                You have successfully canceled the order.
              </p>
              <Icon
                onClick={cancelProcessingOrder}
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
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderDetail;
