'use client'
import { Button } from '@/components/ui/button'
import React, { useContext, useEffect, useState } from 'react'
import { HiLightBulb, HiMiniClipboardDocumentCheck, HiMiniSquares2X2 } from 'react-icons/hi2'
import SelectCategory from './_components/SelectCategory'
import TopicDescription from './_components/TopicDescription'
import SelectOption from './_components/SelectOption'
import { UserInputContext } from '../_context/UserInputContext'
import { GenerateCourseLinks, GeneratePathLayout_AI } from '@/configs/AiModel'
import LoadingDialog from './_components/LoadingDialog'
import { db } from '@/configs/db'
import { CourseLinks, PathList } from '@/configs/schema'
import uuid4 from 'uuid4'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const CreatePath = () => {
  const Options = [
    {
    id: 1,
    name: 'Category',
    icon : <HiMiniSquares2X2 />
    },
    {
    id: 2,
    name: 'Topic & Units',
    icon : <HiLightBulb />
    },
    {
    id: 3,
    name: 'Options',
    icon : <HiMiniClipboardDocumentCheck />
    },
]
const [activeIndex , setActiveIndex] = useState(0);
const [loading , setLoading] = useState(false);
const {userInput , setUserInput} = useContext(UserInputContext);
const {user} = useUser();
const router = useRouter();
 const [courseLinks, setCourseLinks] = useState([]); 

useEffect(() => {
  console.log(userInput )
}, [userInput])


const checkStatus=() => {
  if(userInput?.length == 0){
    return true;
  }
  if(activeIndex==0 && (userInput?.category?.length == 0 || userInput?.category == undefined)){
    return true;
  }
  if(activeIndex == 1 && (userInput?.topic?.length == 0 || userInput?.topic == undefined)){
    return true;
  }else if(activeIndex == 2 && (userInput?.level == undefined || userInput?.duration == undefined || userInput?.displayVideo == undefined || userInput?.noOfChapter == undefined)){
    return true;
  }
  return false;
}

const GeneratePathLayout = async () => {
  setLoading(true);
  const BASIC_PROMPT = 'Generate A Learning Path on Following Detail with field as Path Name , Description , Along with Chapter Name , about , duration: ';
  const USER_INPUT_PROMPT = 'Category: '+userInput?.category+' , Topic : '+userInput?.topic+' , Level : '+userInput?.level+' , Duration : '+userInput?.duration+' , NoOf Chapters: '+userInput?.noOfChapter+' , in JSON format ';
  const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;
  console.log(FINAL_PROMPT);

  const result = await GeneratePathLayout_AI.sendMessage(FINAL_PROMPT);
  console.log(result.response?.text());
  console.log(JSON.parse(result.response?.text()));
  setLoading(false);
  SavePathLayoutInDB(JSON.parse(result.response?.text()))
}

const SavePathLayoutInDB = async (pathLayout) => {
  var id = uuid4();
  setLoading(true);
  const result = await db.insert(PathList).values({
    pathId : id,
    name : userInput?.topic,
    level : userInput?.level,
    category : userInput?.category,
    pathOutput : pathLayout,
    createdBy: user?.primaryEmailAddress?.emailAddress,
    userName : user?.fullName,
    userProfileImage : user?.imageUrl
  })
  console.log("done");
    await FetchAndSaveCourseLinks(id);
  setLoading(false);
  router.replace('/create-path/'+id);
}

const FetchAndSaveCourseLinks = async (pathId) => {
  setLoading(true);

  const BASIC_PROMPT = "Suggest 5 relevant online courses for the topic: ";
  const USER_INPUT_PROMPT = `"${userInput?.topic}" from Udemy and Coursera. Provide the course title, platform (Udemy or Coursera), a short description, and a sample URL in JSON format.`;
  const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT;

  console.log("📢 Prompt for Course Links:", FINAL_PROMPT);

  try {
    // Fetch course links from Gemini AI
    const result = await GenerateCourseLinks.sendMessage(FINAL_PROMPT);
    const courses = JSON.parse(result.response?.text());

    console.log("✅ Generated Course Links:", courses);
    setCourseLinks(courses);

    // Save courses to database with the associated pathId
    await db.insert(CourseLinks).values(
      courses.map((course) => ({
        pathId,  // Associate with the learning path
        title: course.title,
        platform: course.platform,
        description: course.description,
        url: course.url,
      }))
    );

    console.log("✅ Course Links Saved to DB");
    setLoading(false);
  } catch (error) {
    console.error("❌ Error fetching/saving course links:", error);
    setLoading(false);
  }
};


  return (
    <div>
      
      <div className='flex flex-col justify-center items-center mt-12'>
        <h2 className='text-3xl'>
            Create Path
        </h2>
        <div className='flex mt-12'>
          {Options.map((item , index) => (
            <div className='flex items-center' key={item.id}>
              <div className='flex flex-col items-center w-[50px] md:w-[100px]'>
                <div className={`bg-slate-300 p-3 rounded-full ${activeIndex>=index && 'bg-slate-500'}`}>
                  {item.icon}
                </div>
                <h2 className='hidden md:block md:text-sm'>{item.name}</h2>
              </div>
              {index!= Options?.length-1 && <div className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] bg-slate-300 ${activeIndex -1 >=index && 'bg-slate-500'}`}></div>}
            </div>
          ))}
        </div>
      </div>

        <div className='px-10 md:px-20 lg:px-44 mt-12'>
          {activeIndex == 0 ?<SelectCategory/>: activeIndex == 1 ? <TopicDescription />:<SelectOption/>}
          <div className='flex justify-between mt-12'>
              <Button disabled={activeIndex == 0} onClick={() => setActiveIndex(activeIndex - 1)}>Previous</Button>
              {activeIndex < 2 && <Button disabled={checkStatus()} onClick={() => setActiveIndex(activeIndex + 1)}>Next</Button>}
              {activeIndex == 2 && <Button disabled={checkStatus()} onClick={() => GeneratePathLayout()}>Generate Path</Button>}
          </div>
        </div>
          <LoadingDialog loading={loading} />
    </div>
  )
}

export default CreatePath
