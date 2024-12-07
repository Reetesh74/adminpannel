import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//admin
import CreateCourse from "./pages/admin/CreateCoursePage";
import CouponPage from "./pages/coupon/couponPage";
import CouponDetail from "./pages/coupon/couponDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateCourse />} />
        <Route path="/create-coupon" element={<CouponPage />} />
        <Route path="/details-coupon" element={<CouponDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
