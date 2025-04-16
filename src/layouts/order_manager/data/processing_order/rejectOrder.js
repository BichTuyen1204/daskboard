/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ShipperService from "api/ShipperService";

export default function data(pageReject, selectedType, rowsPerPageReject) {
  const [shipper, setReject] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const getShipmentFetchShipper = async () => {
      if (!jwtToken) return;
      try {
        const response = await ShipperService.getShipmentFetchShipper(
          selectedType,
          pageReject,
          rowsPerPageReject
        );
        console.log(response);
        if (Array.isArray(response.content)) {
          setReject(response.content);
          setTotalPages(response.total_page || 1);
        } else {
          setReject([]);
          setTotalPages(1);
        }
      } catch (error) {
        setReject([]);
        setTotalPages(1);
      }
    };
    getShipmentFetchShipper();
  }, [jwtToken, pageReject, selectedType, rowsPerPageReject]);

  const hasNextPageReject = pageReject < totalPages;

  const ID = ({ id }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {id}
      </MDTypography>
    </MDBox>
  );

  const Process = ({ process }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {process}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "id of order", accessor: "id", align: "left" },
    { Header: "process by", accessor: "process", align: "center" },
    { Header: "confirm date", accessor: "confirm_date", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = Array.isArray(shipper)
    ? shipper.map((item) => ({
        id: <ID id={item.id} />,
        process: <Process process={item.process_by} />,
        confirm_date: (
          <MDTypography variant="caption">
            {(() => {
              const utcDate = new Date(item.confirm_date);
              utcDate.setHours(utcDate.getHours() + 7);
              return utcDate.toLocaleString("vi-VN");
            })()}
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <Link to={`/choose_shipper/${item.id}`} style={{ textDecoration: "none" }}>
              <MDTypography
                variant="caption"
                style={{
                  backgroundColor: "#1976d2",
                  fontWeight: "500",
                  color: "white",
                  padding: "8px 10px",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                Choose order shipper
              </MDTypography>
            </Link>
          </MDBox>
        ),
      }))
    : [];

  return { columns, rows, hasNextPageReject };
}
