'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Send } from 'lucide-react'
import { db } from '@/configs/db'
import { Ideas } from '@/configs/schema'
import moment from 'moment/moment'
import { useToast } from '@/hooks/use-toast'

const HeaderNew = () => {
    const [idea , setIdea] = useState('');
    const[name , setName] = useState('');
    const[exisitingUser , setExisitingUser] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
      if(localStorage.getItem('name')){
        setName(localStorage.getItem('name'));
        setExisitingUser(true);
      }
    },[])

    const onSaveHandler = async () => {
        const result = await db.insert(Ideas).values({content:idea , name:name , createdAt : moment().format('DD MM YYYY')}).returning({id:Ideas.id})

        if(result){
            localStorage.setItem('name' , name);
            setIdea('');
            setName('');
            toast({
                title: "Idea Saved",
                description: "Your idea has been successfully saved.",
            });
        }
    }
  return (
    <div className='flex flex-col items-center p-6  rounded-lg'>
      <Link href={'/idea'}>
        <Button className='mb-4'><ChevronLeft />Go Back</Button>
      </Link>
      <h2 className='font-bold text-lg md:text-3xl text-center  mb-6'>
        From Idea to Learning grows Innovation 📈
      </h2>
      <div className='flex flex-col w-full max-w-md mt-8 gap-4'>
        <label className='font-medium'>Your Idea</label>
        <Textarea onChange = {(event) => setIdea(event.target.value)} value={idea} className='border border-gray-300 rounded-md p-2' />
      </div>

      {!exisitingUser && <div className='flex flex-col w-full max-w-md mt-8 gap-4'>
        <label className='font-medium'>Your Name</label>
        <Input onChange = {(event) => setName(event.target.value)} value={name} className = 'border border-gray-300 rounded-md p-2'/>
      </div>}

      <Button disabled = {!(idea || name)} onClick = {() => onSaveHandler()} className=' mt-7'>Save <Send /></Button>
    </div>
  )
}

export default HeaderNew