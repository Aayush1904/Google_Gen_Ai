

//Original: 
import Image from 'next/image'
import React from 'react'
import { HiMiniEllipsisVertical } from 'react-icons/hi2'
import DropDownOptions from './DropDownOptions'
import { db } from '@/configs/db'
import { PathList } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


const PathCard = ({path , refreshData}) => {

  const handleOnDelte = async () => {
    const resp = await db.delete(PathList).where(eq(PathList.id,path?.id)).returning({id:PathList?.id});
    if(resp){
      refreshData();
    }
  }

  return (
    <div className='shadow-sm rounded-lg border p-2  cursor-pointer mt-4'>
      <Image src={path?.pathImage} alt='' width={300} height={200} className='w-full h-[200px] object-cover rounded-lg' />
      <div className='p-2'>
        <h2 className='font-medium text-lg flex justify-between items-center'>{path?.pathOutput?.learningPath?.pathName} <DropDownOptions handleOnDelte={() => handleOnDelte()}><HiMiniEllipsisVertical /></DropDownOptions></h2>
        <Link href = {'/create-path/' + path?.pathId + '/done'} className='flex flex-col gap-2 mt-3'>
          <Button className="bg-green-500">Lets go</Button>
        </Link>
      </div>
    </div>
  )
}

export default PathCard
