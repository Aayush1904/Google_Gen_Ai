'use client'
import { PathList } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useContext, useEffect, useState } from 'react'
import PathCard from './PathCard'
import { db } from '@/configs/db'
import { UserPathListContext } from '@/app/_context/UserPathListContext'

const UserPathList = () => {

    const [pathList , setPathList] = useState([]);
    const {user} = useUser();
    const {userPathList , setUserPathList} = useContext(UserPathListContext);

    useEffect(() => {
        user && GetUserPath();
    },[user])

    const GetUserPath = async () => {
        const result = await db.select().from(PathList).where(eq(PathList?.createdBy, user?.primaryEmailAddress?.emailAddress));
        setPathList(result);
        setUserPathList(result);
    }

  return (
    <div className='mt-10'>
      <h2 className='font-medium text-xl'>Sarthi : Learning Pathways</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {pathList?.length>0 ? pathList?.map((path) => (
            <PathCard path={path} key={path.id || path.createdAt} refreshData={() => GetUserPath()}/>
        ))
        :
        <div>
          {[1,2,3,4,5].map((_ , index) => (
            <div key={index} className='w-full bg-slate-200 animate-pulse rounded-lg'></div>
          ))}
        </div>
      }
      </div>
    </div>
  )
}

export default UserPathList
