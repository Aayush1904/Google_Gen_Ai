import React from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'


const LoadingDialog = ({loading}) => {
  return (
    <AlertDialog open = {loading}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogDescription>
        <div className='flex flex-col items-center py-12'>
            <Image src={'/Loader.gif'} alt='Loader' width={100} height={100}/>
            <h2>Please wait... AI working on your preferences</h2>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
  </AlertDialogContent>
</AlertDialog>

  )
}

export default LoadingDialog
