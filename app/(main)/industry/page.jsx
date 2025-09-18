import { getIndustryInsight } from '@/actions/industry';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import IndustryView from './_components/IndustryView';

const IndustryInsight = async () => {
   const {isOnboarded} = await getUserOnboardingStatus();
   const insights = await getIndustryInsight();
  
      if(!isOnboarded){
          redirect("/onboarding")
      }
  return (
    <div className='container mx-auto'>
      <IndustryView insights = {insights} />
    </div>
  )
}

export default IndustryInsight
