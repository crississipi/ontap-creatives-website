"use client";

import { useEffect, useState } from "react";
import { Mainpage } from "@/components";
import { canUseSecretKeyAccess, refreshStoredRoleSession } from "@/utils/adminAccessSession";
import { AdminLogin, AdminMainpage } from "@/components/admin";

export default function Home() {
  const editable = false;
  const [adminLogin, showAdminLogin] = useState(false);
  const [page, setPage] = useState(0)

  useEffect(() => {
    refreshStoredRoleSession();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        showAdminLogin(true);
        // if (canUseSecretKeyAccess()) {
          
        // }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className='min-h-[100vh] h-auto w-full flex flex-col items-center relative overflow-x-hidden p-0 m-0 select-none'>
      {adminLogin ? (
        page === 0 ? (
          <AdminLogin showAdminLogin={showAdminLogin} setPage={setPage} />
        ) : (
          <AdminMainpage editable={editable} setPage={setPage}/>
        )
      ) : (
        <Mainpage editable={editable} />
      )}
    </main>
    
  );
}
