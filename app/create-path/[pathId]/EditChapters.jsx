import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HiPencilSquare } from 'react-icons/hi2'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { db } from '@/configs/db'
import { PathList } from '@/configs/schema'
import { eq } from 'drizzle-orm'


const EditChapters = ({path , index , refreshData}) => {
    const Chapters = path?.pathOutput?.path?.chapters;
    const [name , setName] = useState();
    const [about , setAbout] = useState();

    useEffect(() => {
        setName(path?.pathOutput?.path?.chapters[index].name);
        setAbout(path?.pathOutput?.path?.chapters[index].about)
    },[path])
    
    const onUpdateHandler = async () => {
        path.pathOutput.path.chapters[index].name = name;
        path.pathOutput.path.chapters[index].about = about;

        const result = await db.update(PathList).set({
                    pathOutput: path?.pathOutput
                }).where(eq(PathList?.id , path?.id)).returning({id:PathList.id});

                refreshData(true);
    }
  return (
    <Dialog>
  <DialogTrigger><HiPencilSquare className='text-2xl' /></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Chapter</DialogTitle>
      <DialogDescription>
         <div className='mt-3'>
            <label>Title</label>
            <Input defaultValue={path?.pathOutput?.path?.chapters[index].name} onChange = {(event) => setName(event?.target.value)} />
        </div>
        <div>
            <label>Description</label>
            <Textarea className="h-36" defaultValue={path?.pathOutput?.path?.chapters[index].about} onChange = {(event) => setAbout(event?.target.value)} />
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
            <DialogClose>
                <Button onClick={onUpdateHandler}>Update</Button>
            </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default EditChapters
