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
import Product_Detail from "layouts/product_detail";
import Order_Detail from "layouts/order_detail";
import Profile_Detail from "layouts/profile_detail";
import Add_Coupon from "layouts/add_coupon";
import View_Coupon from "layouts/view_coupon";
import View_Staff from "layouts/view_staff";
import Add_Staff from "layouts/add_staff";
import Add_Product from "layouts/add_product";
import Logout from "layouts/logout";

const token = sessionStorage.getItem("jwtToken");

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
  {
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: token ? "Logout" : "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">{token ? "logout" : "login"}</Icon>,
    route: token ? "/logout" : "/sign-in",
    component: token ? <Logout /> : <SignIn />,
  },
  {
    route: "/product_detail",
    component: <Product_Detail />,
  },
  {
    route: "/order_detail",
    component: <Order_Detail />,
  },
  {
    route: "/profile_detail",
    component: <Profile_Detail />,
  },
  {
    route: "/add_coupon",
    component: <Add_Coupon />,
  },
  {
    route: "/view_coupon",
    component: <View_Coupon />,
  },
  {
    route: "/view_staff",
    component: <View_Staff />,
  },
  {
    route: "/add_staff",
    component: <Add_Staff />,
  },
  {
    route: "/add_product",
    component: <Add_Product />,
  },
];

export default routes;
