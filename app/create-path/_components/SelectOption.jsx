import React, { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { UserInputContext } from '@/app/_context/UserInputContext';


const SelectOption = () => {
  const {userInput , setUserInput} = useContext(UserInputContext);
      const handleInputChange = (fieldName , value) => {
          setUserInput(prev =>({
              ...prev,
              [fieldName]:value
          }))
      }
  return (
    <div className='px-10 md:px-20 lg:px-44'>
      <div className='grid grid-cols-2 gap-10'>

        <div>
          <label className='text-sm'>👨🏻‍🎓Difficulty level</label>
          <Select onValueChange={(value) => handleInputChange('level' , value)} defaultValue={userInput?.level}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advance">Advance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm'>🕕Duration</label>
          <Select  onValueChange={(value) => handleInputChange('duration' , value)} defaultValue={userInput?.duration}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 Hour">1 Hour</SelectItem>
              <SelectItem value="2 Hours">2 Hours</SelectItem>
              <SelectItem value="More than 2 Hours">More than 2 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm'>▶️Wanna refer videos?</label>
          <Select  onValueChange={(value) => handleInputChange('displayVideo' , value)} defaultValue={userInput?.displayVideo}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm'>📖Chapters</label>
          <Input type="number" onChange ={(event) => handleInputChange('noOfChapter' , event.target.value)} defaultValue={userInput?.noOfChapter}/>
        </div>

      </div>
    </div>
  )
}

export default SelectOption
