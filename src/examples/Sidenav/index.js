import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import AccountService from "api/AccountService";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const jwtToken = sessionStorage.getItem("jwtToken");
  const [account, setAccount] = useState("");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  useEffect(() => {
    const getProfile = async () => {
      if (!jwtToken) {
        return;
      } else {
        try {
          const response = await AccountService.getProfile(jwtToken);
          setAccount(response);
        } catch (error) {
          error;
        }
      }
    };
    getProfile();
  }, [jwtToken]);

  const renderRoutes = account?.type
    ? routes
        .filter(({ name }) => {
          if (account.type === 1) {
            return name !== "Chat with customer";
          } else if (account.type === 2) {
            return name !== "Staff Management" && name !== "Dash board";
          }
          return true;
        })
        .map(({ type, name, icon, title, noCollapse, key, href, route }) => {
          let returnValue;

          if (type === "collapse") {
            returnValue = href ? (
              <Link
                href={href}
                key={key}
                target="_blank"
                rel="noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  noCollapse={noCollapse}
                />
              </Link>
            ) : (
              <NavLink key={key} to={route}>
                <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
              </NavLink>
            );
          } else if (type === "title") {
            returnValue = (
              <MDTypography
                key={key}
                color={textColor}
                display="block"
                variant="caption"
                fontWeight="bold"
                textTransform="uppercase"
                pl={3}
                mt={2}
                mb={1}
                ml={1}
              >
                {title}
              </MDTypography>
            );
          } else if (type === "divider") {
            returnValue = (
              <Divider
                key={key}
                light={
                  (!darkMode && !whiteSidenav && !transparentSidenav) ||
                  (darkMode && !transparentSidenav && whiteSidenav)
                }
              />
            );
          }

          return returnValue;
        })
    : null;

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} px={4} textAlign="center">
        {account?.type ? (
          <MDTypography variant="h6" color="white">
            {account.type === 2 ? "STAFF" : "MANAGER"}
          </MDTypography>
        ) : (
          <MDTypography variant="h6" color="white" sx={{ opacity: 0.5 }}></MDTypography>
        )}
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
