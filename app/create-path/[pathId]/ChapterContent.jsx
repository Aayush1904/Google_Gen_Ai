

// import React from 'react';
// import HeroVideoDialog from '@/components/ui/hero-video-dialog';
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogClose,
//   DialogDescription,
//   DialogContainer,
// } from '../../_components/Linear_Dialog';
// import { Plus } from 'lucide-react';

// const ChapterContent = ({ chapter, content }) => {
//   return (
//     <div className='flex flex-col mt-16 px-4'>
//       <h2 className='font-medium text-3xl'>{chapter?.chapterName}</h2>
//       <p className="mt-2 text-gray-600">{chapter?.about}</p>

//       <div className="mt-6 aspect-video h-[200px] w-full md:h-[390px] md:w-[640px] lg:w-[640px] mx-auto shadow-lg border rounded-md overflow-hidden">
//         <HeroVideoDialog
//           animationStyle="from-center"
//           videoSrc={`https://www.youtube.com/embed/${content?.videoId}?autoplay=1`}
//           thumbnailSrc={`https://img.youtube.com/vi/${content?.videoId}/hqdefault.jpg`}
//           thumbnailAlt="Hero Video"
//           className="w-full h-full object-contain"
//         />
//       </div>

//       {content?.courses && content.courses.length > 0 && (
//         <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
//           <h3 className="text-lg font-semibold">Recommended Courses</h3>
//           <ul className="mt-2">
//             {content.courses.map((course, index) => (
//               <li key={index} className="p-2 border rounded bg-white shadow mt-2">
//                 <a href={course.url} target="_blank" className="text-blue-500 font-semibold">
//                   {course.title} - ({course.platform})
//                 </a>
//                 <p className="text-gray-600 text-sm">{course.description}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}


//       <div className='mt-6 flex flex-wrap gap-4'>
//         {content?.content?.topics?.map((item, index) => (
//           <div key={index} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] flex-grow">
//             <Dialog
//               transition={{
//                 type: 'spring bounce: 0.05',
//                 duration: 0.5,
//               }}
//             >
//               <DialogTrigger
//                 style={{
//                   borderRadius: '12px',
//                 }}
//                 className='flex w-full flex-col overflow-hidden border dark:bg-black bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-950'
//               >
//                 <div className='flex flex-grow flex-row items-end justify-between p-3'>
//                   <div>
//                     <DialogTitle className='text-zinc-950 text-xl dark:text-zinc-50'>
//                       {item.title}
//                     </DialogTitle>
//                   </div>
//                   <button className='absolute bottom-2 right-2 p-2 dark:bg-gray-900 bg-gray-400 hover:bg-gray-500 rounded-full dark:hover:bg-gray-800'>
//                     <Plus className='w-6 h-6' />
//                   </button>
//                 </div>
//               </DialogTrigger>
//               <DialogContainer className='pt-20'>
//                 <DialogContent
//                   style={{
//                     borderRadius: '24px',
//                   }}
//                   className='relative flex h-full mx-auto flex-col overflow-y-auto border dark:bg-black bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-950 lg:w-[900px] w-[90%]'
//                 >
//                   <div className='p-6'>
//                     <DialogTitle className='text-4xl text-zinc-950 dark:text-zinc-50'>
//                       {item.title}
//                     </DialogTitle>
//                     <DialogDescription
//                       disableLayoutAnimation
//                       variants={{
//                         initial: { opacity: 0, scale: 0.8, y: -40 },
//                         animate: { opacity: 1, scale: 1, y: 0 },
//                         exit: { opacity: 0, scale: 0.8, y: -50 },
//                       }}
//                     >
//                       <p className='mt-2 text-zinc-500 dark:text-zinc-500'>
//                         {item.description}
//                       </p>
//                     </DialogDescription>
//                     {item.code_example && (
//                       <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded mt-4'>
//                         <pre>
//                           <code>{item.code_example}</code>
//                         </pre>
//                       </div>
//                     )}
//                   </div>
//                   <DialogClose className='text-zinc-50 dark:bg-gray-900 bg-gray-400 p-4 hover:bg-gray-500 rounded-full dark:hover:bg-gray-800' />
//                 </DialogContent>
//               </DialogContainer>
//             </Dialog>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChapterContent;


import React, { useEffect, useState } from 'react';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogContainer,
} from '../../_components/Linear_Dialog';
import { Plus } from 'lucide-react';
import { db } from '@/configs/db';
import { CourseLinks } from '@/configs/schema';
import { eq } from 'drizzle-orm';

const ChapterContent = ({ chapter, content, pathId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (pathId) {
      FetchCourseLinks(pathId);
    }
  }, [pathId]);

  const FetchCourseLinks = async (pathId) => {
    try {
      const result = await db.select().from(CourseLinks).where(eq(CourseLinks.pathId, pathId));
      if (result.length > 0) {
        setCourses(result);
      }
    } catch (error) {
      console.error("❌ Error fetching course links:", error);
    }
  };

  return (
    <div className='flex flex-col mt-16 px-4'>
      <h2 className='font-medium text-3xl'>{chapter?.chapterName}</h2>
      <p className="mt-2 text-gray-600">{chapter?.about}</p>

      {/* Video Section */}
      <div className="mt-6 aspect-video h-[200px] w-full md:h-[390px] md:w-[640px] lg:w-[640px] mx-auto shadow-lg border rounded-md overflow-hidden">
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc={`https://www.youtube.com/embed/${content?.videoId}?autoplay=1`}
          thumbnailSrc={`https://img.youtube.com/vi/${content?.videoId}/hqdefault.jpg`}
          thumbnailAlt="Hero Video"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Recommended Courses Section */}
      {courses.length > 0 && (
        <div className="mt-6 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Recommended Courses</h3>
          <ul className="mt-2">
            {courses.map((course, index) => (
              <li key={index} className="p-2 border rounded shadow mt-2">
                <a href={course.url} target="_blank" className="font-semibold">
                  {course.title} - ({course.platform})
                </a>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics Section */}
      <div className='mt-6 flex flex-wrap gap-4'>
        {content?.content?.topics?.map((item, index) => (
          <div key={index} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] flex-grow">
            <Dialog
              transition={{
                type: 'spring bounce: 0.05',
                duration: 0.5,
              }}
            >
              <DialogTrigger className='flex w-full flex-col overflow-hidden border dark:bg-black bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-950'>
                <div className='flex flex-grow flex-row items-end justify-between p-3'>
                  <div>
                    <DialogTitle className='text-zinc-950 text-xl dark:text-zinc-50'>{item.title}</DialogTitle>
                  </div>
                  <button className='absolute bottom-2 right-2 p-2 dark:bg-gray-900 bg-gray-400 hover:bg-gray-500 rounded-full dark:hover:bg-gray-800'>
                    <Plus className='w-6 h-6' />
                  </button>
                </div>
              </DialogTrigger>
              <DialogContainer className='pt-20'>
                <DialogContent className='relative flex h-full mx-auto flex-col overflow-y-auto border dark:bg-black bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-950 lg:w-[900px] w-[90%]'>
                  <div className='p-6'>
                    <DialogTitle className='text-4xl text-zinc-950 dark:text-zinc-50'>{item.title}</DialogTitle>
                    <DialogDescription>
                      <p className='mt-2 text-zinc-500 dark:text-zinc-500'>{item.description}</p>
                    </DialogDescription>
                    {item.code_example && (
                      <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded mt-4'>
                        <pre><code>{item.code_example}</code></pre>
                      </div>
                    )}
                  </div>
                  <DialogClose className='text-zinc-50 dark:bg-gray-900 bg-gray-400 p-4 hover:bg-gray-500 rounded-full dark:hover:bg-gray-800' />
                </DialogContent>
              </DialogContainer>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterContent;
