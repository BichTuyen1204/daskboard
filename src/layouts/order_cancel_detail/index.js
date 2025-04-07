import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderService from "api/OrderService";

function OrderCancel() {
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState("");
  const [orderItem, setOrderItem] = useState([]);
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const page = 1;
  const pageSize = 50;

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

  return (
    <DashboardLayout>
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <Link to="/cancel_order">
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
                        {orderDetail.order_status}
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
                    {/* <div style={{ display: "flex", marginTop: "15px" }}>
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
                          marginLeft: "5px",
                          width: "25%",
                        }}
                      >
                        {orderDetail?.coupon?.sale_percent || "0"}%
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                          marginLeft: "7px",
                        }}
                      >
                        {orderDetail?.coupon?.sale_percent || "0"}%
                      </div>
                    </div> */}
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
                  </Grid>
                </Card>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderCancel;
