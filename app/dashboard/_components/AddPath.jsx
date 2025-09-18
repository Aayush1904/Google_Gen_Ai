'use client'
import { UserPathListContext } from '@/app/_context/UserPathListContext';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useContext } from 'react'

const AddPath = () => {
  const {userPathList , setUserPathList} = useContext(UserPathListContext);
    const {user} = useUser();
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h2 className='text-3xl'>Hello , <span className='font-bold'>{user?.fullName}</span></h2>
        <p className='text-sm'>Generate the learning path yourself with AI and share with friends</p>
      </div>
      <Link href={userPathList>=5 ?'/Upgrade' :'/create-path'}>
        <Button>Lets go</Button>
      </Link>
    </div>
  )
}

export default AddPath
