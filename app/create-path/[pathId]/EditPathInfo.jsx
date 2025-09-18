import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HiPencilSquare } from 'react-icons/hi2'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/configs/db'
import { PathList } from '@/configs/schema'
import { eq } from 'drizzle-orm'


const EditPathInfo = ({path , refreshData}) => {


    const [name , setName] = useState();
    const [description , setDescription] = useState();

    useEffect(() => {
        setName(path?.pathOutput?.learningPath?.pathName);
        setDescription(path?.pathOutput?.learningPath?.description)
    },[path])

    const onUpdateHandler = async () => {
        path.pathOutput.learningPath.pathName = name;
        path.pathOutput.learningPath.description = description;
        const result = await db.update(PathList).set({
            pathOutput: path?.pathOutput
        }).where(eq(PathList?.id , path?.id)).returning({id:PathList.id});

        refreshData(true);
    }

  return (
    <div>
        <Dialog>
            <DialogTrigger><HiPencilSquare /></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Edit Title and desc</DialogTitle>
                <DialogDescription>
                    <div className='mt-3'>
                        <label>Title</label>
                        <Input defaultValue={path?.pathOutput?.learningPath?.pathName} onChange = {(event) => setName(event?.target.value)} />
                    </div>
                    <div>
                        <label>Description</label>
                        <Textarea className="h-36" defaultValue={path?.pathOutput?.learningPath?.description} onChange = {(event) => setDescription(event?.target.value)} />
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

    </div>
  )
}

export default EditPathInfo
