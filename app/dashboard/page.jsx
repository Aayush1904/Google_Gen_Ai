'use client'
import React, { useState } from 'react'
import AddPath from './_components/AddPath'
import UserPathList from './_components/UserPathList'

const page = () => {
  const [userPathList , setUserPathList] = useState([]);
  return (
    <div>
     <AddPath />
     <UserPathList />
    </div>
  )
}

export default page
