import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile_detail/data/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountService from "api/AccountService";

function ProfileDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const getStaffDetail = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getStaffDetail(id);
          setStaff(response); // Giả sử response trả về là object chứa thông tin staff
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getStaffDetail();
  }, [id, jwtToken]);

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header>
        <MDBox mt={3} mb={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              {staff && (
                <MDBox
                  sx={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    width: "100%",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      marginBottom: "15px",
                      color: "#333",
                    }}
                  >
                    Profile Information
                  </h2>
                  <div style={{ marginLeft: "15px" }}>
                    {[
                      { label: "Full name", value: staff.realname || "N/A" },
                      { label: "Your birthday", value: staff.dob || "N/A" },
                      { label: "Phone number", value: staff.phonenumber || "N/A" },
                      { label: "Email", value: staff.email || "N/A" },
                      { label: "SSN", value: staff.ssn || "N/A" },
                      { label: "Status", value: staff.status || "N/A" },
                    ].map((item, index) => (
                      <div key={index}>
                        <p
                          style={{
                            fontSize: "0.7em",
                            color: "#555",
                            marginBottom: "-8px",
                            marginTop: "18px",
                          }}
                        >
                          <strong style={{ fontWeight: "600", color: "#000" }}>
                            {item.label}:
                          </strong>{" "}
                          {item.value}
                        </p>
                        {index < 6 && (
                          <hr
                            style={{
                              border: "1px solid #ccc",
                              margin: "10px 0px",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default ProfileDetail;
