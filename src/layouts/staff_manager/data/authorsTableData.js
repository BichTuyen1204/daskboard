/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import beef from "assets/images/beef.jpg";
import { Link } from "react-router-dom";

export default function data() {
  const Author = ({ image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} size="sm" />
    </MDBox>
  );

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
      <MDTypography display="block" variant="caption" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "id", accessor: "id", width: "5%", align: "left" },
      { Header: "name of coupon", accessor: "name", width: "20%", align: "left" },
      { Header: "creation date", accessor: "creation_date", align: "center" },
      { Header: "expiration date", accessor: "expiration_date", align: "center" },
      { Header: "discount percentage", accessor: "discount_percentage", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        id: (
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
            S01
          </MDTypography>
        ),
        name: <Name name="Chirs" />,
        creation_date: <Creation_date title="01/01/2025" />,
        expiration_date: (
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
            10/01/2025
          </MDTypography>
        ),
        expiry_date: (
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
            23/04/18
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
          <Link to="/view_staff">
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
          </Link>
        ),
      },
    ],
  };
}
