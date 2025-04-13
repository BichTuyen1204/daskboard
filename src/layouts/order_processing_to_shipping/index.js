import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderService from "api/OrderService";

function OrderProcessingToShipping() {
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState("");
  const [orderItem, setOrderItem] = useState([]);
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [popupDeleteOrder, setPopupDelete] = useState(false);
  const [popupCancelOrderSuccess, setPopupCancelOrderSuccess] = useState(false);
  const [popupOnShipping, setPopupOnShipping] = useState(false);
  const [popupShippingOrderSuccess, setPopupShippingOrderSuccess] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemIdShipping, setSelectedItemIdShipping] = useState(null);
  const page = 1;
  const pageSize = 50;
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) return;

      try {
        const response = await AccountService.getProfile(jwtToken);
        if (response) {
          setAccount(response);
        } else {
          setAccount(null);
        }
      } catch (error) {
        setAccount(null);
      }
    };

    getProfile();
  }, [jwtToken]);

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
        } catch (error) {}
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
      return;
    }
    try {
      const response = await OrderService.cancelOrder(id);
      if (response === true) {
        setPopupDelete(false);
        setPopupCancelOrderSuccess(true);
        setTimeout(() => {
          setPopupCancelOrderSuccess(false);
          navigate("/processing_order");
        }, 2000);
      }
    } catch (error) {}
  };

  const shippingOrder = async (id) => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    if (!jwtToken) {
      return;
    }
    try {
      const response = await OrderService.shippingOrder(id);
      if (response === true) {
        setPopupOnShipping(false);
        setPopupShippingOrderSuccess(true);
        setTimeout(() => {
          setPopupShippingOrderSuccess(false);
          navigate("/processing_order");
        }, 4000);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const getOrderItem = async () => {
      if (jwtToken) {
        try {
          const response = await OrderService.getOrderItem(id, page, pageSize);
          setOrderItem(response.content);
        } catch (error) {}
      }
    };
    getOrderItem();
  }, [id, jwtToken]);

  const mapTypeToLabel = (type) => {
    const typeMap = {
      VEG: "Vegetable",
      MEAT: "Meat",
      SS: "Season",
      MK: "Meal kit",
    };
    return typeMap[type] || type;
  };

  // Hàm mở popup
  const openShippingOrder = (id) => {
    setSelectedItemIdShipping(id);
    setPopupOnShipping(true);
  };

  // Hàm hủy xóa
  const cancelShippingOrder = () => {
    setPopupOnShipping(false);
  };

  return (
    <DashboardLayout>
      {account.type === 1}
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <Link to="/processing_order">
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                <div style={{ fontWeight: "500", fontSize: "0.9em", paddingBottom: "5px" }}>
                  Order ID: {orderDetail.id}
                </div>
                <div style={{ fontWeight: "500", fontSize: "0.6em", paddingBottom: "10px" }}>
                  {(() => {
                    const utcDate = new Date(orderDetail.order_date);
                    utcDate.setHours(utcDate.getHours() + 7);
                    return utcDate.toLocaleString("vi-VN");
                  })()}
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
                        {orderItem.length > 0 &&
                          orderItem.map((item, index) => (
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
                                src={item.image_url}
                                alt={item.name}
                                style={{
                                  width: "4rem",
                                  height: "55px",
                                  borderRadius: "8px",
                                  marginRight: "15px",
                                }}
                              />

                              <div style={{ fontSize: "0.6em", width: "50%" }}>
                                <div>
                                  Category: <strong>{mapTypeToLabel(item.type)}</strong>
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
                                    {(() => {
                                      const utcDate = new Date(item.price_date);
                                      utcDate.setHours(utcDate.getHours() + 7);
                                      return utcDate.toLocaleString("vi-VN");
                                    })()}
                                  </strong>
                                </div>
                                <div>
                                  Coupon used:{" "}
                                  <strong>
                                    {orderDetail?.sale_percent || "0"}% (- $
                                    {orderDetail?.total_price && orderDetail?.sale_percent
                                      ? (
                                          (orderDetail.total_price * orderDetail.sale_percent) /
                                          100
                                        ).toFixed(2)
                                      : "0"}
                                    )
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
                        onClick={() => openShippingOrder(orderDetail.id)}
                      >
                        SHIPPING
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
                  Yes
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
                  No
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
        {popupOnShipping && (
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
              onClick={cancelShippingOrder}
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
                Confirm Shipping Order
              </h3>
              <p
                style={{
                  marginBottom: "15px",
                  color: "#555",
                  fontSize: "0.8em",
                }}
              >
                Are you sure you want to ship the order?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => shippingOrder(selectedItemIdShipping)}
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
                  onClick={cancelShippingOrder}
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
                onClick={cancelShippingOrder}
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
        {popupShippingOrderSuccess && (
          <>
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
                You have successfully transitioned the order to shipping.
              </p>
            </div>
          </>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderProcessingToShipping;
