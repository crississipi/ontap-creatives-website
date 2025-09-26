import React, { JSX, useState } from 'react'
import AdminLogin from './AdminLogin';
import Mainpage from './AdminMainpage';
import { AdminPageProps, EditProps } from '@/types';


type APageProps = AdminPageProps & EditProps;
const Page = ({ showAdminLogin, editable }: APageProps) => {
  const [page, setPage] = useState(0);
  const pages: Record<number, JSX.Element> = {
    0: <AdminLogin showAdminLogin={showAdminLogin} setPage={setPage}/>,
    1: <Mainpage setPage={setPage} editable={editable}/>
  }
  return (
    <div className='w-full h-[100vh] flex items-center justify-center relative'>
        {pages[page]}
    </div>
  )
}

export default Page