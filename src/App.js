import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//admin
import CreateCourse from "./pages/admin/CreateCoursePage";
import CouponPage from "./pages/coupon/couponPage";
import CouponDetail from "./pages/coupon/couponDetail";
import SubscriptionPage from "./pages/admin/SubscriptionPage";
import PlanPage from "./pages/admin/PlanPage";
import Year from "./components/planComponent/Year";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateCourse />} />
        <Route path="/subscription-page" element={<SubscriptionPage />} />
        <Route path="/plans-page" element={<PlanPage />} />
        <Route path="/create-coupon" element={<CouponPage />} />
        <Route path="/details-coupon" element={<CouponDetail />} />
        <Route path="/year-date" element={<Year />} />
      </Routes>
    </Router>
  );
}

export default App;
