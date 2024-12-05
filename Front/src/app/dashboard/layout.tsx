"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);  

  useEffect(() => {

    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("userSession") || "null");
      if (user && user.token && user.user.role) setAuthorized(true);
      else router.push("/login");
    }
  }, [router]);

  if (authorized === null) return null;
  if (!authorized) return null;

  if (!authorized) return null;
  return (
    <div className='mt-10 p-8 justify-center'>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
