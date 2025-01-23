import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import breakpoints from "assets/theme/base/breakpoints";
import img_profile from "assets/images/img_profile.jpg";
import backgroundImage from "assets/images/bg-profile-detail.jpg";
import AccountService from "api/AccountService";
import { useParams } from "react-router-dom";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const { id } = useParams();
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [staff, setStaff] = useState("");

  useEffect(() => {
    const getStaffDetail = async () => {
      if (jwtToken) {
        try {
          const response = await AccountService.getStaffDetail(id);
          setStaff(response);
        } catch (error) {
          console.error("Can't access the server", error);
        }
      }
    };
    getStaffDetail();
  }, [id, jwtToken]);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "no-repeat",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -10,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Image */}
          <Grid item>
            <MDAvatar src={img_profile} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          {/* Info profile */}
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {staff.username}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {staff.type}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
