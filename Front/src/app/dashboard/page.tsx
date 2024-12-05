// "use client";


// import UserDashboard from './userDashboard/page';
// import React, { useEffect, useState } from 'react';
// import GardenerDashboard from './gardenerDashboard/page';
// import Swal from 'sweetalert2';
// import AdminDashboard from './adminDashboard/page';

// const Dashboard = () => {
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const user = JSON.parse(localStorage.getItem("userSession") || "null");

//     if (user && user.token && user.user.role) {
//       setRole(user.user.role); 
//     } else {
//       Swal.fire({
//         title: "Error",
//         text: "Debes iniciar sesion primero",
//         icon: "error",
//       }).then(() => {
//         window.location.href = "/";
//         })
//       }
//     }
//   }, []);

//   if (role === null) return null;
  

//   // Renderiza el componente correspondiente según el rol
//   switch (role) {
//     case "admin":
//       return <AdminDashboard />;
//     case "gardener":
//       return <GardenerDashboard />;
//     case "user":
//     default:
//       return <UserDashboard />;
//   }
// };

// export default Dashboard;
"use client";

import UserDashboard from './userDashboard/page';
import GardenerDashboard from './gardenerDashboard/page';
import Swal from 'sweetalert2';
import AdminDashboard from './adminDashboard/page';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("userSession") || "null");

      if (user && user.token && user.user.role) {
        setRole(user.user.role);
      } else {
        Swal.fire({
          title: "Error",
          text: "Debes iniciar sesión primero",
          icon: "error",
        }).then(() => {
          window.location.href = "/";
        });
      }
    }
  }, []);

  if (role === null) return null;

  // Renderiza el componente correspondiente según el rol
  return (

    // <div className=" bg-[url('/images/dashboard.webp')] bg-cover bg-center">
        <div > 
           {role === "admin" && <AdminDashboard />}
      {role === "gardener" && <GardenerDashboard />}
      {role === "user" && <UserDashboard />}
    </div>
  );
};

export default Dashboard;
