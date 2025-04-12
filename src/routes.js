import Dashboard from "layouts/dashboard";
import Product from "layouts/product_manager";
import Customer from "layouts/customer_manager";
import Coupon from "layouts/coupon_manager";
import Staff from "layouts/staff_manager";
import Blog from "layouts/blog_manager";
import SignIn from "layouts/authentication/sign-in";
import Icon from "@mui/material/Icon";
import Product_Detail from "layouts/product_detail";
import Order_Confirm from "layouts/order_confirm_to_processing/index";
import Add_Coupon from "layouts/add_coupon";
import View_Coupon from "layouts/view_coupon";
import View_Staff from "layouts/view_staff";
import Add_Staff from "layouts/add_staff";
import Add_Shipper from "layouts/add_shipper";
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
import Chat from "layouts/chat_box_manager/index";
import Chat_With_User from "layouts/chat_box/ChatBox";
import Order from "layouts/order_manager";
import List_Order from "layouts/order_manager/data/list_order/index";
import Processing_Order from "layouts/order_manager/data/processing_order/index";
import Shipping_Order from "layouts/order_manager/data/shipping_order/index";
import Cancel_Order from "layouts/order_manager/data/cancel_order/index";
import Confirm_Order from "layouts/order_manager/data/confirm_order/index";
import Order_Processing_To_Shipping from "layouts/order_processing_to_shipping/index";
import Order_Shipping_To_Shipped from "layouts/oder_shipping_to_shipped/index";
import Shipped_Order from "layouts/order_manager/data/shipped_order/index";
import Order_Shipped from "layouts/order_shipped/index";
import Order_Cancel_Detail from "layouts/order_cancel_detail/index";
import Delivered_Order from "layouts/order_manager/data/delivered_order/index";
import Order_Delivered_Detail from "layouts/order_delivered/index";
import Shipper from "layouts/shipper_manager/index";
import Choose_shipper from "layouts/choose_shipper/index";
import Edit_Shipper from "layouts/edit_shipper/index";
import OrderWaitingShipper from "layouts/orders_waiting_shipper/index";
import Waiting_Shipper from "layouts/order_manager/data/shipping_order/index";

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
  {
    type: "collapse",
    name: "Order Management",
    key: "Order",
    icon: <Icon fontSize="small">list_alt</Icon>,
    route: "/order",
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
    type: "collapse",
    name: "Shipper Management",
    key: "shipper",
    icon: <Icon fontSize="small">directions_bike</Icon>,
    route: "/shipper",
    component: <Shipper />,
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
    icon: <Icon fontSize="small">forum</Icon>,
    route: "/chat",
    component: <Chat />,
  },
  {
    route: "/chat_with_user/:id",
    component: <Chat_With_User />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "sign-in",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
  },
  {
    route: "/sign-in",
    component: <SignIn />,
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
    route: "/edit_shipper/:id",
    component: <Edit_Shipper />,
  },
  {
    route: "/order_detail/:id",
    component: <Order_Confirm />,
  },
  {
    route: "/order_processing_to_shipping/:id",
    component: <Order_Processing_To_Shipping />,
  },
  {
    route: "/order_shipping_to_shipped/:id",
    component: <Order_Shipping_To_Shipped />,
  },
  {
    route: "/order_cancel_detail/:id",
    component: <Order_Cancel_Detail />,
  },
  {
    route: "/order_delivered_detail/:id",
    component: <Order_Delivered_Detail />,
  },
  {
    route: "/order_shipped/:id",
    component: <Order_Shipped />,
  },
  {
    route: "/add_coupon",
    component: <Add_Coupon />,
  },
  {
    route: "/choose_shipper/:id",
    component: <Choose_shipper />,
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
    route: "/add_shipper",
    component: <Add_Shipper />,
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
  {
    route: "/list_order",
    component: <List_Order />,
  },
  {
    route: "/processing_order",
    component: <Processing_Order />,
  },
  {
    route: "/shipping_order",
    component: <Shipping_Order />,
  },
  {
    route: "/orderWaitingShipper",
    component: <OrderWaitingShipper />,
  },
  {
    route: "/shipped_order",
    component: <Shipped_Order />,
  },
  {
    route: "/order_waiting",
    component: <Waiting_Shipper />,
  },
  {
    route: "/cancel_order",
    component: <Cancel_Order />,
  },
  {
    route: "/delivered_order",
    component: <Delivered_Order />,
  },
  {
    route: "/confirm_order",
    component: <Confirm_Order />,
  },
];

export default routes;
