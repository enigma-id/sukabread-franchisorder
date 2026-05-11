import { Routes, Route, Outlet } from "react-router-dom";
import AuthorizedRoute from "./components/app/layout/AuthorizedRoute";
import UnauthorizedRoute from "./components/app/layout/UnauthorizedRoute";
import BottomMenu from "./components/app/BottomMenu";
import FloatingCartBar from "./components/app/FloatingCartBar";

// Screens
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CatalogScreen from "./screens/CatalogScreen";
import OrderListScreen from "./screens/OrderListScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

const MainLayout = () => (
  <div className="min-h-screen bg-base-200 pb-16">
    <Outlet />
    <FloatingCartBar />
    <BottomMenu />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<UnauthorizedRoute />}>
        <Route path="/signin" element={<LoginScreen />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthorizedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CatalogScreen />} />
          <Route path="/orders" element={<OrderListScreen />} />
          <Route path="/order/:id" element={<OrderDetailScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
