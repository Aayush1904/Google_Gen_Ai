// import React from 'react'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"


// const ChapterList = ({path}) => {
//   return (
//     <div className='mt-3'>
//         <h2>Chapters</h2>
//         <div className='mt-2'>
//           {path?.pathOutput?.learningPath?.chapters.map((chapter , index) => (
//             <div key={chapter.id} className='grid grid-cols-3 gap-5'>
//               <div className='flex gap-5'>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Card Title</CardTitle>
//                     <CardDescription>Card Description</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <p>Card Content</p>
//                   </CardContent>
//                   <CardFooter>
//                     <p>Card Footer</p>
//                   </CardFooter>
//                 </Card>
//               </div>
//             </div>
//           ))}
//         </div>
//     </div>
//   )
// }

// export default ChapterList


import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HiOutlineCheckBadge, HiOutlineClock } from "react-icons/hi2";
import EditChapters from "./EditChapters";

const ChapterList = ({ path, refreshData }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Chapters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {path?.pathOutput?.learningPath?.chapters.map((chapter, index) => (
          <Card key={chapter.id || index} className="border shadow-md">
            <CardHeader>
              <CardTitle>{chapter.chapterName}</CardTitle>
              <CardDescription>
                {chapter.about}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex gap-2 text-green-500 text-center items-center"> <HiOutlineClock /> {chapter.duration}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <HiOutlineCheckBadge className="text-3xl text-gray-400" />
              <EditChapters path={path} index = {index} refreshData={() => refreshData(true)}/>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
