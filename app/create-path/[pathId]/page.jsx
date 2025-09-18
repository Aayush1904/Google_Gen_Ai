'use client';

import { db } from '@/configs/db';
import { Chapters, PathList } from '@/configs/schema';
import { useUser  } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import React, { use, useEffect, useState } from 'react';
import PathInfo from './PathInfo';
import PathDetail from './PathDetail';
import ChapterList from './ChapterList';
import { Button } from '@/components/ui/button';
import { GenerateChapterContent_AI } from '@/configs/AiModel';
import LoadingDialog from '../_components/LoadingDialog';
import service from '@/configs/service';
import { useRouter } from 'next/navigation';

const PathLayout = ({ params }) => {
  const { pathId } = use(params);
  const { user } = useUser ();
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [existingChapters, setExistingChapters] = useState([]);

  useEffect(() => {
    if (pathId && user) {
      GetPath();
      GetExistingChapters();
    }
  }, [pathId, user]);

  const GetPath = async () => {
    try {
      const result = await db
        .select()
        .from(PathList)
        .where(
          and(
            eq(PathList.pathId, pathId),
            eq(PathList?.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      setPath(result[0]);
      console.log('Fetched Path:', result[0]);
    } catch (error) {
      console.error('Error fetching path:', error);
    }
  };

  const GetExistingChapters = async () => {
    try {
      const result = await db
        .select()
        .from(Chapters)
        .where(eq(Chapters.pathId, pathId));
      setExistingChapters(result);
      console.log('Fetched Existing Chapters:', result);
    } catch (error) {
      console.error('Error fetching existing chapters:', error);
    }
  };

  // Function to check similarity between two strings
  const isSimilar = (str1, str2) => {
    const threshold = 0.7; // Define a threshold for similarity
    const similarity = (str1, str2) => {
      const words1 = str1.split(' ');
      const words2 = str2.split(' ');
      const intersection = words1.filter(word => words2.includes(word)).length;
      const union = new Set([...words1, ...words2]).size;
      return intersection / union; // Jaccard similarity
    };

    return similarity(str1, str2) >= threshold;
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    const chapters = path?.pathOutput?.learningPath?.chapters;

    for (const [index, chapter] of chapters.entries()) {
      const pastChaptersData = existingChapters
        .filter(existingChapter =>
          isSimilar(existingChapter.content.chapterName, chapter.chapterName) ||
          isSimilar(existingChapter.content, chapter.content)
        )
        .map(existingChapter => ({
          chapterName: existingChapter.content.chapterName,
          content: existingChapter.content,
        }));

      console.log('Past Chapters Data:', pastChaptersData); // Log past chapters data

      const PROMPT =
        'Explain the concept in Detail on Topic: ' +
        path?.name +
        ' , Chapter : ' +
        chapter?.chapterName +
        ', in JSON Format with list of array with field as title , description in detail , Code Example (Code field in <precode> format) if applicable. Previous chapters data: ' +
        JSON.stringify(pastChaptersData);
      console.log('Generated Prompt:', PROMPT);

      try {
        let videoId = '';
        const videoResponse = await service.getVideos(path?.name + ':' + chapter?.chapterName);
        console.log('Video Response:', videoResponse);
        videoId = videoResponse[0]?.id?.videoId;

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        console.log('AI Response:', result?.response?.text());

        // Check if the response is valid before parsing
        if (result && result.response && result.response.text) {
          const content = JSON.parse(result.response.text());
          await db.insert(Chapters).values({
            chapterId: index,
            pathId: path?.pathId,
            content: content,
            videoId: videoId,
          });
        } else {
          console.error('Invalid response format:', result);
        }
      } catch (error) {
        console.error('Error generating chapter content:', error.response ? error.response.data : error);
      }
    }

    try {
      await db.update(PathList).set({
        publish: true
      });
      router.replace('/create-path/' + path?.pathId + '/done');
    } catch (error) {
      console.error('Error updating path:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-12 px-7 md:px-20 lg:px-44">
        <h2 className="font-bold text-center text-2xl">Learning Path</h2>

        <LoadingDialog loading={loading} />

        <PathInfo path={path} refreshData={() => GetPath()} />
        <PathDetail path={path} />
        <ChapterList path={path} refreshData={() => GetPath()} />

        <Button onClick={GenerateChapterContent} className="my-10">
          Generate the Content
        </Button>
      </div>
    </>
  );
};

export default PathLayout;




// 'use client';

// import { db } from '@/configs/db';
// import { Chapters, PathList } from '@/configs/schema';
// import { useUser } from '@clerk/nextjs';
// import { and, eq } from 'drizzle-orm';
// import React, { useEffect, useState } from 'react';
// import PathInfo from './PathInfo';
// import PathDetail from './PathDetail';
// import ChapterList from './ChapterList';
// import { Button } from '@/components/ui/button';
// import { GenerateChapterContent_AI } from '@/configs/AiModel';
// import LoadingDialog from '../_components/LoadingDialog';
// import service from '@/configs/service';
// import { useRouter } from 'next/navigation';
// import { use } from 'react';

// const PathLayout = ({ params }) => {
//   // Unwrap the params object using React.use()
//   const { pathId } = use(params);

//   const { user } = useUser();
//   const [path, setPath] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (pathId && user) {
//       GetPath();
//     }
//   }, [pathId, user]);

//   const GetPath = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(PathList)
//         .where(
//           and(
//             eq(PathList.pathId, pathId),
//             eq(PathList?.createdBy, user?.primaryEmailAddress?.emailAddress)
//           )
//         );
//       setPath(result[0]);
//       console.log(result);
//     } catch (error) {
//       console.error('Error fetching path:', error);
//     }
//   };

//   const GenerateChapterContent = () => {
//     setLoading(true);
//     const chapters = path?.pathOutput?.learningPath?.chapters;

//     chapters.forEach(async (chapter, index) => {
//       const PROMPT =
//         'Explain the concept in Detail on Topic: ' +
//         path?.name +
//         ' , Chapter : ' +
//         chapter?.chapterName +
//         ', in JSON Format with list of array with field as title , description in detail , Code Example (Code field in <precode> format) if applicable';
//       console.log(PROMPT);

//       try {
//         let videoId = '';
//         service.getVideos(path?.name + ':' + chapter?.chapterName).then((resp) => {
//           console.log(resp);
//           videoId = resp[0]?.id?.videoId;
//         });
//         const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
//         console.log(result?.response?.text());
//         const content = JSON.parse(result?.response?.text());

//         await db.insert(Chapters).values({
//           chapterId: index,
//           pathId: path?.pathId,
//           content: content,
//           videoId: videoId,
//         });
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//       await db.update(PathList).set({
//         publish : true
//       })
//       router.replace('/create-path/' + path?.pathId + '/done');
//     });
//   };

//   return (
//     <>
//       <div className="mt-12 px-7 md:px-20 lg:px-44">
//         <h2 className="font-bold text-center text-2xl">Learning Path</h2>

//         <LoadingDialog loading={loading} />

//         <PathInfo path={path} refreshData={() => GetPath()} />
//         <PathDetail path={path} />
//         <ChapterList path={path} refreshData={() => GetPath()} />

//         <Button onClick={GenerateChapterContent} className="my-10">
//           Generate the Content
//         </Button>
//       </div>
//     </>
//   );
// };

// export default PathLayout;
