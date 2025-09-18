
'use client';
import { Separator } from '@/components/ui/separator';
import { db } from '@/configs/db';
import { Chapters, PathList } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import ChapterContent from '../ChapterContent';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GenerateCourseLinks } from '@/configs/AiModel';

// const Done = ({ params }) => {
//   const { pathId } = use(params);
//   const [path, setPath] = useState(null); 
//   const [selectedChapter, setSelectedChapter] = useState(null); 
//   const [chapterContent, setChapterContent] = useState();

//   useEffect(() => {
//     if (pathId) {
//       GetPath();
//     }
//   }, [pathId]);

//   const GetPath = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(PathList)
//         .where(eq(PathList.pathId, pathId));
//       setPath(result[0]);
//       getSelectedChapterContent(0);
//     } catch (error) {
//       console.error('Error fetching path:', error);
//     }
//   };

//   const getSelectedChapterContent = async (chapterId) => {
//     try {
//       const result = await db
//         .select()
//         .from(Chapters)
//         .where(
//           and(
//             eq(Chapters.chapterId, chapterId),
//             eq(Chapters.pathId, path?.pathId)
//           )
//         );
//       setChapterContent(result[0]);
//     } catch (error) {
//       console.error('Error fetching chapter content:', error);
//     }
//   };


//   return (
//     <div className="mt-9 flex flex-col md:flex-row">
//       <div className="w-full p-4 rounded-3xl bg-secondary">
//         {path && path?.pathOutput?.learningPath ? (
//           <>
//             <h1 className="text-3xl font-bold">
//               {path?.pathOutput?.learningPath?.pathName}
//             </h1>
//             <Separator className="mt-2 text-gray-500 bg-gray-400" />
//             <div>
//               {path?.pathOutput?.learningPath?.chapters.map((chapter, index) => (
//                 <div
//                   key={chapter.id || index}
//                   className={`mt-4 cursor-pointer ${
//                     selectedChapter?.chapterName === chapter?.chapterName &&
//                     'text-green-500'
//                   }`}
//                   onClick={() => {
//                     setSelectedChapter(chapter);
//                     getSelectedChapterContent(index);
//                   }}
//                 >
//                   <h2 className="text-sm uppercase">Chapter {index + 1}</h2>
//                   <h2 className="text-xl font-bold">{chapter.chapterName}</h2>
//                   <Separator className="mt-2 text-gray-500 bg-gray-700" />
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>

//       <div className="w-full p-4">
//         <ChapterContent chapter={selectedChapter} content={chapterContent} />
//       </div>

//       <div className='w-full p-4'>
//         <Link href="/dashboard">
//           <Button className="w-full">Done</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Done;





const Done = ({ params }) => {
  const { pathId } = use(params);
  const [path, setPath] = useState(null); 
  const [selectedChapter, setSelectedChapter] = useState(null); 
  const [chapterContent, setChapterContent] = useState();

  useEffect(() => {
    if (pathId) {
      GetPath();
    }
  }, [pathId]);

  const GetPath = async () => {
    try {
      const result = await db.select().from(PathList).where(eq(PathList.pathId, pathId));
      if (result.length > 0) {
        setPath(result[0]);
        getSelectedChapterContent(0);
      }
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  const getSelectedChapterContent = async (chapterId) => {
    try {
      const result = await db.select().from(Chapters).where(
        and(eq(Chapters.chapterId, chapterId), eq(Chapters.pathId, path?.pathId))
      );
      setChapterContent(result[0]);
    } catch (error) {
      console.error("Error fetching chapter content:", error);
    }
  };

  return (
    <div className="mt-9 flex flex-col md:flex-row">
      <div className="w-full p-4 rounded-3xl bg-secondary">
        {path && path?.pathOutput?.learningPath ? (
          <>
            <h1 className="text-3xl font-bold">{path?.pathOutput?.learningPath?.pathName}</h1>
            <Separator className="mt-2 text-gray-500 bg-gray-400" />
            <div>
              {path?.pathOutput?.learningPath?.chapters.map((chapter, index) => (
                <div key={index} className={`mt-4 cursor-pointer ${selectedChapter?.chapterName === chapter?.chapterName && 'text-green-500'}`} onClick={() => { setSelectedChapter(chapter); getSelectedChapterContent(index); }}>
                  <h2 className="text-sm uppercase">Chapter {index + 1}</h2>
                  <h2 className="text-xl font-bold">{chapter.chapterName}</h2>
                  <Separator className="mt-2 text-gray-500 bg-gray-700" />
                </div>
              ))}
            </div>
          </>
        ) : (<p>Loading...</p>)}
      </div>

      <div className="w-full p-4">
        <ChapterContent chapter={selectedChapter} content={chapterContent} pathId={pathId} />
      </div>

      <div className='w-full p-4'>
        <Link href="/dashboard">
          <Button className="w-full">Done</Button>
        </Link>
      </div>
    </div>
  );
};

export default Done;
