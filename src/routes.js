import Dashboard from "layouts/dashboard";
import Product from "layouts/product_manager";
import Customer from "layouts/customer_manager";
import Order from "layouts/order_manager";
import Coupon from "layouts/coupon_manager";
import Staff from "layouts/staff_manager";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dash board",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Product Management",
    key: "product",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/product",
    component: <Product />,
  },
  {
    type: "collapse",
    name: "Order Management",
    key: "Order",
    icon: <Icon fontSize="small">list_alt</Icon>,
    route: "/Order",
    component: <Order />,
  },
  {
    type: "collapse",
    name: "Customer Management",
    key: "customer",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/customer",
    component: <Customer />,
  },
  // {
  //   type: "collapse",
  //   name: "Manager customer",
  //   key: "Customer",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/Customer",
  //   component: <Customer />,
  // },
  {
    type: "collapse",
    name: "Coupon Management",
    key: "coupon",
    icon: <Icon fontSize="small">redeem</Icon>,
    route: "/coupon",
    component: <Coupon />,
  },
  {
    type: "collapse",
    name: "Staff Management",
    key: "staff",
    icon: <Icon fontSize="small">diversity_3</Icon>,
    route: "/staff",
    component: <Staff />,
  },
  // {
  //   type: "collapse",
  //   name: "Blog Management",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
