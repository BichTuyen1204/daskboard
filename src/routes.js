import Dashboard from "layouts/dashboard";
import Product from "layouts/product_manager";
import Customer from "layouts/customer_manager";
import Coupon from "layouts/coupon_manager";
import Staff from "layouts/staff_manager";
import Profile from "layouts/profile";
import Blog from "layouts/blog_manager";
import SignIn from "layouts/authentication/sign-in";
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
import Edit_Product from "layouts/edit_product";
import Edit_Blog from "layouts/edit_blog";
import Mealkit from "layouts/mealkit_manager";
import Add_Mealkit from "layouts/add_mealkit";
import Edit_Profile from "layouts/edit_profile";
import Mealkit_Detail from "layouts/mealkit_detail";
import Add_Blog from "layouts/add_blog";
import View_Blog from "layouts/view_blog";
import View_Customer from "layouts/view_customer";
import Edit_Customer from "layouts/edit_customer";
import Edit_Staff from "layouts/edit_staff";
import Edit_Mealkit from "layouts/edit_mealkit";
import History_Product from "layouts/history_product";
import History_Mealkit from "layouts/history_mealkit";
import Chat_box from "layouts/chat_box/ChatBox";

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
    name: "Ingredient Management",
    key: "ingredient",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/ingredient",
    component: <Product />,
  },
  {
    type: "collapse",
    name: "Mealkit Management",
    key: "mealkit",
    icon: <Icon fontSize="small">soup_kitchen</Icon>,
    route: "/mealkit",
    component: <Mealkit />,
  },
  // {
  //   type: "collapse",
  //   name: "Order Management",
  //   key: "Order",
  //   icon: <Icon fontSize="small">list_alt</Icon>,
  //   route: "/Order",
  //   component: <Order />,
  // },
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
    type: "collapse",
    name: "Blog Management",
    key: "blog",
    icon: <Icon fontSize="small">article_shortcut</Icon>,
    route: "/blog",
    component: <Blog />,
  },
  {
    type: "collapse",
    name: "Chat with customer",
    key: "chat box",
    icon: <Icon fontSize="small">chat</Icon>,
    route: "/chat",
    component: <Chat_box />,
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
    route: "/product_detail/:prod_id",
    component: <Product_Detail />,
  },
  {
    route: "/mealkit_detail/:prod_id",
    component: <Mealkit_Detail />,
  },
  {
    route: "/edit_product/:prod_id",
    component: <Edit_Product />,
  },
  {
    route: "/edit_mealkit/:prod_id",
    component: <Edit_Mealkit />,
  },
  {
    route: "/edit_customer/:id",
    component: <Edit_Customer />,
  },
  {
    route: "/edit_profile/:id",
    component: <Edit_Profile />,
  },
  {
    route: "/edit_blog/:id",
    component: <Edit_Blog />,
  },
  {
    route: "/edit_staff/:id",
    component: <Edit_Staff />,
  },
  {
    route: "/order_detail",
    component: <Order_Detail />,
  },
  {
    route: "/profile_detail/:id",
    component: <Profile_Detail />,
  },
  {
    route: "/add_coupon",
    component: <Add_Coupon />,
  },
  {
    route: "/view_coupon/:id",
    component: <View_Coupon />,
  },
  {
    route: "/view_blog/:id",
    component: <View_Blog />,
  },
  {
    route: "/view_customer/:id",
    component: <View_Customer />,
  },
  {
    route: "/view_staff/:id",
    component: <View_Staff />,
  },
  {
    route: "/history_product/:id",
    component: <History_Product />,
  },
  {
    route: "/history_mealkit/:id",
    component: <History_Mealkit />,
  },
  {
    route: "/add_staff",
    component: <Add_Staff />,
  },
  {
    route: "/add_product",
    component: <Add_Product />,
  },
  {
    route: "/add_blog",
    component: <Add_Blog />,
  },
  {
    route: "/add_mealkit",
    component: <Add_Mealkit />,
  },
];

export default routes;
