import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HeaderIdea = () => {
  return (
    <div className='flex flex-row justify-between p-4 shadow-md'>
        <Link href = {'/addNew'}>
            <Button>New Ideas</Button>
        </Link>
      <h2 className='font-bold text-sm md:text-2xl'>
        Most Trendy Ideas
      </h2>
    </div>
  )
}

export default HeaderIdea
