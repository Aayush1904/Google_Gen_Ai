import React from 'react'
import { HiOutlineChartBar, HiOutlineVideoCamera } from 'react-icons/hi2'

const PathDetail = ({path}) => {
  return (
    <div className='border p-6 rounded-xl shadow-sm mt-3'>
      <div className='grid grid-cols-2 gap-5'>

        <div className='flex gap-5'>
            <HiOutlineChartBar className='text-4xl text-green-400' />
            <div>
                <h2 className='text-xs text-gray-500'>Skill Level</h2>
                <h2 className='font-medium text-lg'>{path?.level}</h2>
            </div>
        </div>

        <div className='flex gap-5'>
            <HiOutlineVideoCamera className='text-4xl text-green-400' />
            <div>
                <h2 className='text-xs text-gray-500'>Video Reference?</h2>
                <h2 className='font-medium text-lg'>{path?.includeVideo}</h2>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PathDetail
