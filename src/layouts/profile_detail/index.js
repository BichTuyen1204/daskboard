import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Header from "layouts/profile_detail/data/Header";

function ProfileDetail() {
  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header>
        <MDBox mt={3} mb={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description="Hi, I’m Alec Thompson,"
                info={{
                  fullName: "Trinh Tran Phuong Tuan",
                  mobile: "0999999999",
                  email: "j97@mail.com",
                  location: "Viet Nam",
                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default ProfileDetail;
