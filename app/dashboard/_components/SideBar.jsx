'use client'
import { UserPathListContext } from '@/app/_context/UserPathListContext';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react'
import {HiOutlineHome, HiOutlineShieldCheck, HiOutlineSquare3Stack3D} from "react-icons/hi2";

const SideBar = () => {
 const {userPathList , setUserPathList} = useContext(UserPathListContext);
  const Menu = [
    {
      id : 1 ,
      name : 'Home' ,
      icon :<HiOutlineHome />,
      path : '/dashboard'
    },
    {
      id : 2 ,
      name : 'Explore' ,
      icon :<HiOutlineSquare3Stack3D />,
      path : '/explore'
    },
    {
      id : 3 ,
      name : 'Upgrade' ,
      icon :<HiOutlineShieldCheck />,
      path : '/Upgrade'
    },
    
  ]
  const path = usePathname();
  return (
    <div className='fixed h-full md:w-64 p-5 shadow-md'>
      {/* Logo  */}
      {/* <Link href="/gallery" className="items-center hidden gap-2 sm:flex">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
              Learning Path
          </p>
        </Link> */}
        {/* <hr className='my-5' /> */}

        <ul>
          {Menu.map((item , index) => (
            <Link key={item.id || index} href={item.path}>
              <div className={`flex items-center gap-2 p-3 cursor-pointer rounded-lg mb-3`}>
                <div className='text-2xl'>{item.icon}</div>
                <h2>{item.name}</h2>
              </div>
            </Link>
          ))}
        </ul>
        <div className='absolute bottom-28 w-[80%]'>
          <Progress value={(userPathList?.length/5)*100} />
          <h2 className='text-sm my-2'> {userPathList?.length} out of 5 Path Created</h2>
          <h2 className='text-sm'>Upgrade your plan for more!</h2>
        </div>
    </div>
  )
}

export default SideBar
