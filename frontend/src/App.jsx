import Dashboard from "./page/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./page/Dashboard/DashboardPage";
import DetailOrder from "./page/Dashboard/PartySchedule/DetailOrder";
import ContractPage from "./page/Dashboard/ContractPage";
import PartySchedule from "./page/Dashboard/PartySchedule";
import HallAndShift from "./page/Dashboard/Hall";
import Menu from "./page/Dashboard/Menu";
import ActionModal from "./page/Dashboard/PartySchedule/ActionModal";
import Customer from "./page/Dashboard/customer";
import Staff from "./page/Dashboard/Staff";
import DetailCustomer from "./page/Dashboard/customer/DetailCustomer";
import DetailStaff from "./page/Dashboard/Staff/DetailStaff";
import PrivateRoute from "./components/privateRouteAdmin";
import LoginAdmin from "./page/Dashboard/auth/Login";
import CustomerPage from "./page/customers";
import HomePage from "./page/customers/HomePage";
import AboutPage from "./page/customers/about";
import HallPage from "./page/customers/hall";
import MenuPage from "./page/customers/menu";
import ContactPage from "./page/customers/contact";
import LoginAndRegister from "./page/customers/auth/loginandregister";
import PrivateRouteAdmin from "./components/privateRouteAdmin";
import OrderPage from "./page/customers/history";

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
          <PrivateRouteAdmin>
            <Dashboard />
          </PrivateRouteAdmin>
        }
      >
        <Route index element={<DashboardPage />} replace />
        <Route path="schedule" element={<PartySchedule />} />
        <Route path="schedule/booking" element={<ActionModal />} />
        <Route path="schedule/detail/:id" element={<DetailOrder />} />
        <Route path="contract/:id" element={<ContractPage />} />
        <Route path="halls" element={<HallAndShift />} />
        <Route path="menu" element={<Menu />} />
        <Route path="customers" element={<Customer />} />
        <Route path="customers/detail/:id" element={<DetailCustomer />} />
        <Route path="staffs" element={<Staff />} />
        <Route path="staffs/detail/:id" element={<DetailStaff />} />
      </Route>
    </Routes>
  );
}

export default App;
