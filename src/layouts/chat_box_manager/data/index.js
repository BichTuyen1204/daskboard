/* eslint-disable react/prop-types */
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Icon } from "@mui/material";
import ChatBoxService from "api/ChatBoxService";

export default function data(pageCustomer, rowsPerPageCustomer) {
  const [customer, setCustomer] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const jwtToken = sessionStorage.getItem("jwtToken");
  const hasNextPageCustomer = pageCustomer < totalPages;

  useEffect(() => {
    const getAllUser = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await ChatBoxService.getAllUser(pageCustomer, rowsPerPageCustomer);
          if (Array.isArray(response.content)) {
            setCustomer(response.content);
            setTotalPages(response.total_page || 1);
          } else {
            setCustomer([]);
            setTotalPages(1);
          }
        } catch (error) {
          setCustomer([]);
          setTotalPages(1);
        }
      }
    };
    getAllUser();
  }, [jwtToken, pageCustomer, rowsPerPageCustomer]);

  const Status = ({ status }) => (
    <MDBox lineHeight={1} textAlign="center">
      <MDTypography display="block" variant="button" fontWeight="medium" fontSize="0.8em">
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

  const columns = [
    { Header: "image", accessor: "image", width: "5%", align: "left" },
    { Header: "ID", accessor: "id", width: "5%", align: "left" },
    { Header: "username", accessor: "username", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = customer?.map((item) => ({
    //Image start
    image: (
      <MDBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 35,
          height: 35,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
          marginRight: "10px",
        }}
      >
        <img
          src={
            item.user_pfp && item.user_pfp.trim() !== "defaultProfile"
              ? item.user_pfp
              : "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
          }
          alt="Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://i.pinimg.com/originals/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
          }}
        />
      </MDBox>
    ),
    //Image end

    //ID start
    id: <ID id={item.id} />,
    //ID end

    //Username start
    username: <Username username={item.username} />,
    //Username end

    //Action start
    action: (
      <MDBox display="flex" justifyContent="center">
        <>
          {/* Button view customer detail start */}
          <Link to={`/chat_with_user/${item.id}`}>
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
              Chat
            </MDTypography>
          </Link>
          {/* Button view customer detail end */}
        </>
      </MDBox>
    ),
    //Action end
  }));

  return { columns, rows, hasNextPageCustomer };
}
