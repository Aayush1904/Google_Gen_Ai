'use client'
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
const tabs = [
  {
    title: 'What is Learning Path Generation with Gemini AI?',
    description:
      'Sarthi AI utilizes Gemini AI to generate personalized learning paths based on your skills, preferences, and goals. It analyzes your learning style and creates a roadmap to help you learn effectively and efficiently.',
    imageUrl:
      'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  },
  {
    title: 'How can I upload a PDF to generate questions and flashcards?',
    description:
      'You can upload a PDF containing learning materials, and Sarthi AI will extract the relevant information from it. It then generates quizzes, flashcards, and questions to help you review and retain the content.',
    imageUrl:
      'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  },
  {
    title: 'What is the interactive canvas for learning?',
    description:
      'The interactive canvas is a dynamic space that allows you to engage in live learning sessions, collaborate in real time, and visualize concepts during meetings. It enhances the learning experience with interactive tools and shared whiteboards.',
    imageUrl:
      'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  },
  {
    title: 'How does secure authentication work?',
    description:
      'Sarthi AI integrates secure authentication methods like OAuth and token-based systems to ensure that only authorized users can access their personalized learning content. Your data is always kept safe and private.',
    imageUrl:
      'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  },
  {
    title: 'What are the free and paid plans?',
    description:
      'Sarthi AI offers 5 free generations for you to explore and test the platform. After that, you can opt for paid plans which unlock additional features like unlimited generations, priority support, and more advanced learning tools.',
    imageUrl:
      'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  },
  {
    title: 'Can I convert my questions and flashcards into a PDF?',
    description:
      'Yes, after generating your questions and flashcards, you can easily convert them into a PDF format. This allows you to take your learning materials offline and access them at any time.',
    imageUrl:
      'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  },
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(0);
      const [activeItem, setActiveItem] = useState(tabs[0]);
      const handleClick = async (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        const newActiveItem = tabs.find((_, i) => i === index);
        setActiveItem(newActiveItem);
      };
  return (
    <div className="container mx-auto pb-10 pt-2">
        <h1 className="uppercase text-center text-4xl font-bold pt-2 pb-4">
          FAQ
        </h1>
        <div className="h-fit border  rounded-lg p-2 dark:bg-[#111111] bg-[#F2F2F2]">
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              className={`overflow-hidden ${
                index !== tabs.length - 1 ? 'border-b' : ''
              }`}
              onClick={() => handleClick(index)}>
              <button
                className={`p-3 px-2 w-full cursor-pointer sm:text-base text-xs items-center transition-all font-semibold dark:text-white text-black   flex gap-2 
               `}>
                <Plus
                  className={`${
                    activeIndex === index ? 'rotate-45' : 'rotate-0 '
                  } transition-transform ease-in-out w-5 h-5  dark:text-gray-200 text-gray-600`}
                />
                {tab.title}
              </button>
              <AnimatePresence mode="sync">
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut',
                      delay: 0.14,
                    }}>
                    <p
                      className={`dark:text-white text-black p-3 xl:text-base sm:text-sm text-xs pt-0 w-[90%]`}>
                      {tab.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
  )
}

export default FAQ
