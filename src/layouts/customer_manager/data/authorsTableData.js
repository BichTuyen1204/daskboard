/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import v from "assets/images/v.jpg";

export default function data() {
  const Image = ({ image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} size="sm" />
    </MDBox>
  );

  const Email = ({ email }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {email}
      </MDTypography>
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {name}
      </MDTypography>
    </MDBox>
  );

  const Phone = ({ phone_number }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {phone_number}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "image", accessor: "image", width: "10%", align: "left" },
      { Header: "name of customer", accessor: "name", width: "25%", align: "left" },
      { Header: "email", accessor: "email", align: "center" },
      { Header: "phone number", accessor: "phone_number", align: "center" },
      { Header: "View detail", accessor: "action", align: "center" },
    ],

    rows: [
      {
        image: <Image image={v} />,
        name: <Name name="Kim Teahyung" />,
        email: <Email email="abc@gmail.com" />,
        phone_number: <Phone phone_number="0999999999" />,
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
