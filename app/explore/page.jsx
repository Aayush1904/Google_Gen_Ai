'use client'
import { db } from '@/configs/db'
import { PathList } from '@/configs/schema'
import React, { useEffect, useState } from 'react'
import PathCard from '../dashboard/_components/PathCard'

const page = () => {

    const [pathList , setPathList] = useState([]);

    useEffect(() => {
        getAllPath();
    },[])
    const getAllPath =async () => {
        const result = await db.select().from(PathList).limit(9).offset(0);
        setPathList(result);
        console.log(result);
    }
  return (
    <div className='mt-24'>
      <h2 className='font-bold text-3xl'>Explore All Paths created by different users</h2>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
        {pathList?.map((path , index) => (
            <div key={path.id || index}>
                <PathCard path={path}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default page
