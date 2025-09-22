import React, { JSX, useState } from 'react'
import AdminLogin from './AdminLogin';
import Mainpage from './Mainpage';
import { AdminPageProps } from '@/types';

const Page = ({ showAdminLogin }: AdminPageProps) => {
  const [page, setPage] = useState(0);
  const pages: Record<number, JSX.Element> = {
    0: <AdminLogin showAdminLogin={showAdminLogin} setPage={setPage}/>,
    1: <Mainpage setPage={setPage}/>
  }
  return (
    <div className='w-full h-[100vh] flex items-center justify-center relative'>
        {pages[page]}
    </div>
  )
}

export default Page