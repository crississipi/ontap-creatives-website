"use client";

import { Mainpage } from "@/components";
import { AdminLogin, Page } from "@/components/admin";
import Feedback from "@/components/Feedback";

import { useEffect, useState } from "react";

export default function Home() {
  const [adminLogin, showAdminLogin] = useState(false);
  const editable = false;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        showAdminLogin(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className='min-h-[100vh] h-auto w-full flex flex-col items-center relative overflow-x-hidden p-0 m-0 select-none'>
      {adminLogin ? (<Page showAdminLogin={showAdminLogin} editable={editable} />) : (<Mainpage editable={editable} />)}
    </main>
    
  );
}
