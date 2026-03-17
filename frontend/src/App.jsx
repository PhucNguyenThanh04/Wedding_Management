import Dashboard from "./page/Dashboard";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./page/Dashboard/DashboardPage";
import Menu from "./page/Dashboard/Menu";
import Customer from "./page/Dashboard/customer";
import Staff from "./page/Dashboard/Staff";
import DetailCustomer from "./page/Dashboard/customer/DetailCustomer";
import DetailStaff from "./page/Dashboard/Staff/DetailStaff";
import LoginAdmin from "./page/Dashboard/auth/Login";
import CustomerPage from "./page/customers";
import HomePage from "./page/customers/HomePage";
import AboutPage from "./page/customers/about";
import HallPage from "./page/customers/hall";
import MenuPage from "./page/customers/menu";
import ContactPage from "./page/customers/contact";
import LoginAndRegister from "./page/customers/auth/loginandregister";
import OrderPage from "./page/customers/history";
import PrivateRoute from "./components/privateRoute";
import PrivateRouteAdmin from "./components/privateRouteAdmin";
import Dish from "./page/Dashboard/dish";
import Hall from "./page/Dashboard/Hall";
import Booking from "./page/Dashboard/booking";
import BookingDetail from "./page/Dashboard/booking/BookingDetail";
import MenuDetailPage from "./page/Dashboard/Menu/ComboDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerPage />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/about" element={<AboutPage />} />
      <Route path="/halls" element={<HallPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/orders" element={<OrderPage />} />

      <Route path="/auth" element={<LoginAndRegister />} />

      <Route path="/dashboard/login" element={<LoginAdmin />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} replace />
        <Route path="booking" element={<Booking />} />
        <Route path="booking-detail/:id" element={<BookingDetail />} />
        <Route path="halls" element={<Hall />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:id" element={<MenuDetailPage />} />
        <Route path="dishes" element={<Dish />} />
        <Route path="customers" element={<Customer />} />
        <Route path="customers/detail/:id" element={<DetailCustomer />} />
        <Route
          path="staffs"
          element={
            <PrivateRouteAdmin>
              <Staff />
            </PrivateRouteAdmin>
          }
        />
        <Route
          path="staffs/detail/:id"
          element={
            <PrivateRouteAdmin>
              <DetailStaff />
            </PrivateRouteAdmin>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
