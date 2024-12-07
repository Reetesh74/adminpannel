import React, { useState } from "react";
import "../../styles/coupon.css";

const ManageCoupons = () => {
  const coupons = [
    {
      discount: "₹ 15,000 OFF",
      code: "SPECIAL15000",
      title: "special offer",
      creator: "DEEPAK KUMAR",
      type: "Private Coupon",
      validity: "2024/06/06, 02:15 pm - 2024/07/31, 12:00 pm",
      usage: 0,
      details: {
        eligibleStudents: 0,
        assignedCourses: 7,
        usageLimit: 1000,
        perStudent: 1000,
        minOrderValue: "₹ 1,000",
      },
      expired: true,
    },
    {
      discount: "₹ 3,000 OFF",
      code: "WELCOME3000",
      title: "WELCOME3000",
      creator: "DEEPAK KUMAR",
      type: "Public Coupon",
      validity: "2024/06/02, 01:56 pm - 2024/07/31, 12:00 pm",
      usage: 0,
      details: {
        eligibleStudents: 0,
        assignedCourses: 0,
        usageLimit: 0,
        perStudent: 0,
        minOrderValue: "₹ 0",
      },
      expired: true,
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="manage-coupons">
      <div className="header">
        <h1>Manage Coupons</h1>
        <p>
          You can avail coupons to your students and increase the sales of your
          courses. <a href="#">Learn More</a>
        </p>
      </div>
      {coupons.map((coupon, index) => (
        <div key={index} className="coupon-card">
          <div className="coupon-info">
            <div className="coupon-left">
              <div className="coupon-code-section">
                <h2>{coupon.discount}</h2>
                <p className="coupon-code">{coupon.code}</p>
              </div>
              <div className="details-container">
                <div className="details-counpn-section">
                  <p className="coupon-title">{coupon.title}</p>
                  <p className="creator">
                    Created by {coupon.creator} - <span>{coupon.type}</span>
                  </p>
                  <p className="validity">{coupon.validity}</p>
                  <p className="usage">
                    <strong>Used:</strong> {coupon.usage} times
                  </p>
                </div>
                <div className="coupon-right">
                  <span
                    className={`status ${
                      coupon.expired ? "expired" : "active"
                    }`}
                  >
                    {coupon.expired ? "EXPIRED" : "ACTIVE"}
                  </span>
                  <button
                    className="toggle-details"
                    onClick={() => toggleDetails(index)}
                  >
                    {expandedIndex === index ? "Hide Details" : "Show Details"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="details-box">
              <p>
                <strong>Total Eligible Students:</strong>{" "}
                {coupon.details.eligibleStudents}
              </p>
              <p>
                <strong>Total Assigned Courses:</strong>{" "}
                {coupon.details.assignedCourses}
              </p>
              <p>
                <strong>Overall Usage Limit:</strong>{" "}
                {coupon.details.usageLimit}
              </p>
              <p>
                <strong>Usage Per Student:</strong> {coupon.details.perStudent}
              </p>
              <p>
                <strong>Min Order Value:</strong> {coupon.details.minOrderValue}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageCoupons;
