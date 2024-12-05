"use client";
import React, { useState } from "react";
import Orders from "../../../components/Orders/Orders";
import EditDashboard from "../../../components/EditDashboard/EditDashboard";

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string>("orders");

  return (
    <div>
        <nav className="flex justify-around bg-primary text-white p-4 rounded-md">
        <button
          onClick={() => setActiveComponent("orders")}
          className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded ${activeComponent === "orders" ? "opacity-75" : ""}`}
        >
          Órdenes
        </button>
        <button
          onClick={() => setActiveComponent("userProfile")}
          className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded ${activeComponent === "userProfile" ? "opacity-75" : ""}`}
        >
          Perfil de Usuario
        </button>
      </nav>
      <div className="p-6 bg-secondary">
        {activeComponent === "orders" && <Orders />}
        {activeComponent === "userProfile" && <EditDashboard />}
      </div>
    </div>
  );
};

export default UserDashboard;
