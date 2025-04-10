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
            "false",
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
    console.log("Choosing shipper with orderId:", orderId, "shipperId:", id);
    try {
      const response = await AccountService.chooseShipper(orderId, id);
      console.log(response);
      if (response.data === true) {
        setPopupChooseSuccess(true);
        setTimeout(() => {
          setPopupChooseSuccess(false);
          navigate(`/processing_order`);
        }, 4000);
      }
    } catch (error) {
      console.error("Error assigning shipper:", error);
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
        {convertTimeOnlyToVN(start)}
      </MDTypography>
    </MDBox>
  );

  const End = ({ end }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
        {convertTimeOnlyToVN(end)}
      </MDTypography>
    </MDBox>
  );

  const convertTimeOnlyToVN = (timeString) => {
    if (!timeString) return "N/A";
    const fullTime = `1970-01-01T${timeString}`;
    const date = new Date(fullTime);
    if (isNaN(date.getTime())) return "Invalid date";
    date.setHours(date.getHours() + 7);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { Header: "ID", accessor: "id", width: "5%", align: "left" },
    { Header: "username", accessor: "username", align: "center" },
    { Header: "email", accessor: "email", align: "center" },
    { Header: "start time", accessor: "start", align: "center" },
    { Header: "end time", accessor: "end", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = shipper?.map((item) => ({
    //ID start
    id: <ID id={item.id} />,
    //ID end

    //Username start
    username: <Username username={item.name} />,
    //Username end

    //Status start
    status: <Status status="Free time" />,
    //Status end

    //Status start
    email: <Email email={item.email} />,
    //Status end

    //Status start
    start: <Start start={item.start_ship} />,
    //Status end

    //Status start
    end: <End end={item.end_shift} />,
    //Status end

    //Action start
    action: (
      <MDBox display="flex" justifyContent="center">
        <>
          {/* Button view shipper detail start */}
          <Link to={`/choose_shipper`}>
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
          </Link>
        </>
        {/* Popup Confirm Delete */}
        {popupChooseSuccess && (
          <>
            {/* Nền bán trong suốt, thấy rõ nội dung phía sau */}
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

            {/* Popup nội dung */}
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
    //Action end
  }));

  return { columns, rows, hasNextPageShipper };
}
