import { getUserOnboardingStatus } from '@/actions/user'
import industries from '@/data/industry'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboardingForm from './_components/Onboarding-form';

const page = async () => {
    const {isOnboarded} = await getUserOnboardingStatus();

    if(isOnboarded){
        redirect("/industry")
    }
  return (
    <main>
      <OnboardingForm industries = {industries} />
    </main>
  )
}

export default page
