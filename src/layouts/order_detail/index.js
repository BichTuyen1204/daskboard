import { useState } from "react";
import Card from "@mui/material/Card";
import { Grid, TextField, Button, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Link } from "react-router-dom";

function OrderDetail() {
  const [product, setProduct] = useState({
    id: 1,
    image:
      "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/1:1/w_4318,h_4318,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
    name: "Product A",
    category: "Category 1",
    quantity: 10,
    description: 10,
  });

  return (
    <DashboardLayout>
      <MDBox pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <MDBox p={3}>
                <Link to="/order">
                  <Icon sx={{ cursor: "pointer", "&:hover": { color: "gray" } }}>arrow_back</Icon>
                </Link>
                <div style={{ fontWeight: "500", fontSize: "0.9em", paddingBottom: "5px" }}>
                  Order ID: {product.id}
                </div>
                <div style={{ fontWeight: "500", fontSize: "0.6em", paddingBottom: "10px" }}>
                  January 1, 2025 at 09:48 am form Cần Thơ
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
                          color: "green",
                          backgroundColor: "lightgreen",
                          border: "1px solid lightgreen",
                          cursor: "pointer",
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "4rem",
                          height: "55px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      />
                      <div style={{ paddingLeft: "15px", width: "50%" }}>
                        <div
                          style={{
                            fontSize: "0.6em",
                          }}
                        >
                          Category
                        </div>
                        <div
                          style={{
                            fontSize: "0.7em",
                          }}
                        >
                          Name of product
                        </div>
                      </div>
                      <div style={{ display: "flex", width: "50%" }}>
                        <div>
                          <button
                            style={{
                              padding: "5px 15px",
                              background: "#373737",
                              color: "white",
                              border: "1px solid gray",
                              borderRadius: "5px",
                              marginRight: "10rem",
                            }}
                          >
                            3 x $500
                          </button>
                          <button
                            style={{
                              padding: "5px 15px",
                              background: "#373737",
                              color: "white",
                              border: "1px solid gray",
                              borderRadius: "5px",
                              marginRight: "10rem",
                            }}
                          >
                            $1500
                          </button>
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
                          color: "#ffaa00",
                          backgroundColor: "lightyellow",
                          border: "1px solid gray",
                          cursor: "pointer",
                        }}
                      >
                        BANKING
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
                        Nguyen Van A
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
                        099999999999
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
                        Kyoto
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
                        Kyoto
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
                        Subtotal:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        1 item
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        $1500
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        Coupon:
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                        }}
                      >
                        Nguyen Van A
                      </div>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "25%",
                          marginLeft: "-7px",
                        }}
                      >
                        - $1500
                      </div>
                    </div>
                    <div style={{ display: "flex", marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        Shipping:
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
                        $77777
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
                        Paid by customer:
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
                        $77777
                      </div>
                    </div>
                    <div style={{ display: "flex", margin: "15px 0px" }}>
                      <div
                        style={{
                          fontSize: "0.6em",
                          width: "50%",
                        }}
                      >
                        Payment:
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
                        Banking ( Paypal )
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
                          border: "1px solid green",
                          padding: "10px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "5px",
                          fontSize: "0.6em",
                        }}
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
      </MDBox>
    </DashboardLayout>
  );
}

export default OrderDetail;
