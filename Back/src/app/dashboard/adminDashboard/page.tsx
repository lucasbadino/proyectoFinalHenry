"use client";
import React, { useState } from "react";
import UserList from "@/components/UserList/UserList";
import Services from "@/components/Services/Services";
import ListGardeners from "@/components/ListGardeners/ListGardeners";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string>("userList");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      <nav className="flex flex-col sm:flex-row justify-around bg-primary text-white p-4 rounded-md space-y-2 sm:space-y-0">

        <div>
          <h1>Admin Dashboard</h1>
        </div>
        <button
          onClick={() => setActiveComponent("userList")}
          className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded text-sm sm:text-base lg:text-lg ${activeComponent === "userList" ? "opacity-75" : ""}`}
        >
          Usuarios
        </button>

        <button
          onClick={() => setActiveComponent("services")}
          className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded text-sm sm:text-base lg:text-lg  ${activeComponent === "services" ? "opacity-75" : ""}`}
        >
          Servicios
        </button>
        <button
          onClick={() => setActiveComponent("listGardeners")}
          className={`p-3 bg-[#8BC34A] hover:bg-[#CDDC39] text-white hover:text-[#263238] font-semibold py-2 px-4 rounded text-sm sm:text-base lg:text-lg  ${activeComponent === "listGardeners" ? "opacity-75" : ""}`}
        >
          Jardineros
        </button>
      </nav>
      <div className="p-6">
        {activeComponent === "userList" && <UserList />}
        {activeComponent === "services" && <Services />}
        {activeComponent === "listGardeners" && <ListGardeners />}
      </div>
    </div>
  );
};

export default AdminDashboard;
