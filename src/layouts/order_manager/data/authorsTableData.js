/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function data() {
  const Creation_date = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left" fontSize="0.8em">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "id", accessor: "name", width: "5%", align: "left" },
      { Header: "order date", accessor: "order_date", width: "5%", align: "left" },
      { Header: "receiver", accessor: "receiver", width: "15%", align: "left" },
      { Header: "address", accessor: "address", width: "50%", align: "left" },
      { Header: "total price", accessor: "total_price", width: "10%", align: "left" },
      { Header: "status", accessor: "status", width: "10%", align: "left" },
      { Header: "action", accessor: "action", width: "10%", align: "left" },
    ],

    rows: [
      {
        name: <Name name="Chirs" />,
        order_date: <Creation_date title="01/01/2025" />,
        receiver: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            Bich Tuyen
          </MDTypography>
        ),
        address: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            Califonia
          </MDTypography>
        ),
        total_price: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            $9.9
          </MDTypography>
        ),
        status: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
              color: "green",
            }}
          >
            Confirm
          </MDTypography>
        ),
        discount_percentage: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            style={{
              fontSize: "0.8em",
            }}
          >
            15%
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <MDTypography
              component="button"
              variant="caption"
              color="white"
              fontWeight="medium"
              style={{
                backgroundColor: "#1976d2",
                fontSize: "0.8em",
                border: "none",
                borderRadius: "2px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              View
            </MDTypography>
          </MDBox>
        ),
      },
    ],
  };
}
