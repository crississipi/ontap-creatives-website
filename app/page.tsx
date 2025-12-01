<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import { Mainpage } from "@/components";
import { Page } from "@/components/admin";
import { canUseSecretKeyAccess, refreshStoredRoleSession } from "@/utils/adminAccessSession";

=======
import { Mainpage } from "@/components";
>>>>>>> ebf4a206820da091b50990d7f9eb3550ad0230a6
export default function Home() {
  const editable = false;

<<<<<<< HEAD
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
        <Page showAdminLogin={showAdminLogin} editable={editable} />
      ) : (
        <Mainpage editable={editable} />
      )}
=======
  return (
    <main className='min-h-[100vh] h-auto w-full flex flex-col items-center relative overflow-x-hidden p-0 m-0 select-none'>
      <Mainpage editable={editable} />
>>>>>>> ebf4a206820da091b50990d7f9eb3550ad0230a6
    </main>
    
  );
}
