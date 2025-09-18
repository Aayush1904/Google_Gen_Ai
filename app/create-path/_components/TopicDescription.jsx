import { UserInputContext } from '@/app/_context/UserInputContext';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext } from 'react'

const TopicDescription = () => {
    const {userInput , setUserInput} = useContext(UserInputContext);
    const handleInputChange = (fieldName , value) => {
        setUserInput(prev =>({
            ...prev,
            [fieldName]:value
        }))
    }
  return (
    <div className='mx-20 lg:mx-44'>
      <div className='mt-5'>
        <label>💡Topic for Generation (Title) : </label>
        <Input placeholder={'Title'} className="h-14 text-xl" defaultValue={userInput?.topic} onChange={(e) => handleInputChange('topic' , e.target.value)}></Input>
      </div>
      <div className='mt-5'>
        <label>📔Describe about your title for more understanding</label>
        <Textarea placeholder="Description" className="h-24 text-xl" defaultValue={userInput?.description} onChange={(e) => handleInputChange('description' , e.target.value)} />
      </div>
    </div>
  )
}

export default TopicDescription
