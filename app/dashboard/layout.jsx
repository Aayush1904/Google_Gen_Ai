'use client'
import React, { useState } from 'react'
import SideBar from './_components/SideBar'
import { UserPathListContext } from '../_context/UserPathListContext'

const DashboardLayout = ({children}) => {
  const [userPathList , setUserPathList] = useState([]);
  return (
    <UserPathListContext.Provider value={{userPathList , setUserPathList}}>
      <div className='pt-16'>
        <div className='md:w-64 hidden md:block'>
          <SideBar />
        </div>
        <div className='md:ml-64'>
          <div className='p-10'>
            {children}
          </div>
        </div>
      </div>

    </UserPathListContext.Provider>
  )
}

export default DashboardLayout
