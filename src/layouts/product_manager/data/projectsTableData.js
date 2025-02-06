/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import chicken from "assets/images/chicken.jpg";

export default function data() {
  const Image = ({ image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} size="sm" variant="rounded" sx={{ borderRadius: "50%" }} />
    </MDBox>
  );

  const Name = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1} fontSize="0.8em">
      <MDTypography display="block" variant="caption" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "image", accessor: "image", width: "5%", align: "left" },
      { Header: "name of product", accessor: "name", width: "25%", align: "left" },
      { Header: "cost price", accessor: "cost_price", align: "center" },
      { Header: "selling price", accessor: "selling_price", align: "center" },
      { Header: "percent sale", accessor: "sale", align: "center" },
      { Header: "quantity sold", accessor: "quantity_sold", align: "center" },
      { Header: "quantity left", accessor: "quantity_left", align: "center" },
      { Header: "profit", accessor: "profit", align: "center" },
    ],

    rows: [
      {
        image: <Image image={chicken} />,
        name: <Name name="Chicken" />,
        cost_price: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            fontSize="0.8em"
          >
            $2,500
          </MDTypography>
        ),
        selling_price: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            fontSize="0.8em"
          >
            $4,500
          </MDTypography>
        ),
        sale: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            fontSize="0.8em"
          >
            50%
          </MDTypography>
        ),
        quantity_sold: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            fontSize="0.8em"
          >
            500
          </MDTypography>
        ),
        quantity_left: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            900
          </MDTypography>
        ),
        profit: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
            fontSize="0.8em"
          >
            500
          </MDTypography>
        ),
      },
    ],
  };
}
