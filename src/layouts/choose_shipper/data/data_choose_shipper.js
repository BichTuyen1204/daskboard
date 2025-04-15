/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";
import { useParams } from "react-router-dom";

export default function data(pageShipper, rowsPerPageShipper) {
  const { id: orderId } = useParams();
  const [shipper, setShipper] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [jwtToken, setJwtToken] = sessionStorage.getItem("jwtToken");
  const hasNextPageShipper = pageShipper < totalPages;
  const [popupChooseSuccess, setPopupChooseSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllShipper = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await AccountService.getAllShipper(
            "IDLE",
            pageShipper,
            rowsPerPageShipper
          );
          if (Array.isArray(response.content)) {
            setShipper(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setShipper([]);
            setTotalPages(1);
          }
        } catch (error) {
          setShipper([]);
          setTotalPages(1);
        }
      }
    };
    getAllShipper();
  }, [jwtToken, pageShipper, rowsPerPageShipper]);

  const onChooseShipper = async (orderId, id) => {
    try {
      const response = await AccountService.chooseShipper(orderId, id);
      console.log(response);
      alert("✅ Shipper has been successfully selected!");
      navigate("/processing_order");
    } catch (error) {
      console.error("Error assigning shipper:", error);
      alert("❌ Sorry, please select the correct working time for the shipper.");
    }
  };

  const Status = ({ status }) => (
    <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#4caf50",
          animation: "pulse 1.5s infinite",
          display: "inline-block",
        }}
      />
      <MDTypography
        display="block"
        variant="button"
        fontWeight="medium"
        fontSize="0.8em"
        color="text"
      >
        {status}
      </MDTypography>
    </MDBox>
  );

  const ID = ({ id }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {id}
      </MDTypography>
    </MDBox>
  );

  const Username = ({ username }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {username}
      </MDTypography>
    </MDBox>
  );

  const Email = ({ email }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {email}
      </MDTypography>
    </MDBox>
  );

  const Start = ({ start }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {start}
      </MDTypography>
    </MDBox>
  );

  const End = ({ end }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {end}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "id of shipper", accessor: "id", align: "left" },
    { Header: "username", accessor: "username", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "start time", accessor: "start", align: "center" },
    { Header: "end time", accessor: "end", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = shipper
    ?.filter((item) => {
      if (item.status !== "IDLE") return false;

      const now = new Date();
      const nowTime = new Date(`1970-01-01T${now.toTimeString().slice(0, 8)}`);
      const start = new Date(`1970-01-01T${item.start_shift}`);
      const end = new Date(`1970-01-01T${item.end_shift}`);
      if (end < start) {
        return nowTime >= start || nowTime <= end;
      }
      return nowTime >= start && nowTime <= end;
    })
    .map((item) => ({
      id: <ID id={item.id} />,
      username: <Username username={item.name} />,
      email: <Email email={item.email} />,
      start: <Start start={item.start_shift} />,
      end: <End end={item.end_shift} />,
      status: <Status status="Free time" />,
      action: (
        <MDBox display="flex" justifyContent="center">
          <>
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
              onClick={() => onChooseShipper(orderId, item.id)}
            >
              Choose
            </MDTypography>
          </>
          {popupChooseSuccess && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.01)",
                  backdropFilter: "blur(0.1px)",
                  zIndex: 999,
                }}
              ></div>
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "25px 20px",
                  width: "400px",
                  zIndex: 1000,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "1em",
                    color: "green",
                    fontWeight: "600",
                  }}
                >
                  ✅ Shipper selected successfully!
                </p>
              </div>
            </>
          )}
        </MDBox>
      ),
    }));

  return { columns, rows, hasNextPageShipper };
}
