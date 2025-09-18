import { UserInputContext } from '@/app/_context/UserInputContext'
import CategoryList from '@/app/_shared/CategoryList'
import Image from 'next/image'
import React, { useContext } from 'react'

const SelectCategory = () => {
  const {userInput , setUserInput} = useContext(UserInputContext);
  const handleCategoryChange = (category) => {
    setUserInput(prev=>({
      ...prev,
      category:category
    }))
  }
  return (
    <div className='px-10 md:px-20'>
      <h2 className='my-5'>Select the Category</h2>
      <div className='grid grid-cols-3 gap-10'>
        {CategoryList.map((item, index) => (
          <div key={item.name} className={`flex flex-col p-5 border items-center rounded-2xl hover:border-slate-600 cursor-pointer ${userInput?.category == item.name && 'border-slate-600'}`} onClick={() => handleCategoryChange(item.name)}>
            <Image src={item.icon} alt="Images" width={50} height={50}/>
            <h2 className='text-sm md:text-base lg:text-base'>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectCategory
