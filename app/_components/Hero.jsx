'use client'
import React, { useState } from 'react'
import ImageMouseTrail from './mousetrail';
import { ReactLenis } from '../ReactLenis';

import FAQ from './FAQ';
import Footer from './Footer';

const images = [
  '/img1.jpeg',
  '/img2.jpeg',
  '/img3.jpeg',
  '/img4.jpeg',
  '/img5.jpeg',
];



const Hero = () => {
  
  return (
    <>
      <section className="relative mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center mt-12 lg:mt-52 overflow-hidden">
        <ImageMouseTrail
          items={images}
          maxNumberOfImages={5}
          distance={25}
          imgClass='sm:w-40 w-28 sm:h-48 h-36'
          fadeAnimation={true}
        >
        <div className="absolute right-0 top-0 h-screen w-screen bg-pattern-2 bg-cover bg-center md:-right-28 xl:-top-60" />



        <div className="relative z-20 flex flex-col items-center text-center">
          <h1 className="text-[52px] font-[700] leading-[120%] lg:text-[88px]">
            Mindcraft Your Learning Partner!
          </h1>
          <p className="text-[16px] lg:text-[20px] font-[400] mt-6 text-gray-500 xl:max-w-[520px]">
                       Mindcraft uses AI to create personalized learning paths that adapt to your goals, skills, and progress. Whether you're learning a new skill!
            </p>
        </div>
        </ImageMouseTrail>
      </section>


      <section className="flex items-center justify-center -mt-44">
  <ReactLenis root>
    <main>
      <div className="wrapper">
        <section className="h-screen w-full bg-slate-950 grid place-content-center sticky top-0">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <h1 className="2xl:text-5xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]">
            Unlock Your Learning Potential with Mindcraft AI! <br /> Find Your Personalized Learning Path 🚀
          </h1>
        </section>

        <section className="bg-gray-300 grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <h1 className="2xl:text-5xl text-3xl px-8 font-semibold text-center tracking-tight leading-[120%]">
            Dive into Mindcraft's AI-powered platform and <br /> get a learning path tailored just for you!
          </h1>
        </section>

        <section className=" h-screen w-full bg-slate-950 grid place-content-center sticky top-0">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          <h1 className="2xl:text-5xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]">
            Let AI guide you to the best learning resources <br /> for your personalized growth path.
          </h1>
        </section>
      </div>

      <section className=" w-full bg-slate-950">
        <div className="grid grid-cols-2">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <h1 className="2xl:text-5xl text-4xl px-8 font-semibold text-center tracking-tight leading-[120%]">
              Ready to Level Up? <br /> Start Your AI Learning Path Today! 🚀
            </h1>
          </div>
          <div className="grid gap-2">
            <figure className="grid place-content-center -skew-x-12">
              <img
                src="/img6.jpeg"
                alt=""
                className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
              />
            </figure>
            <figure className="grid place-content-center skew-x-12">
              <img
                src="/img7.jpeg"
                alt=""
                className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
              />
            </figure>
            <figure className="grid place-content-center -skew-x-12">
              <img
                src="/img8.jpeg"
                alt=""
                className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
              />
            </figure>
            <figure className="grid place-content-center skew-x-12">
              <img
                src="/img10.jpeg"
                alt=""
                className="transition-all duration-300 w-80 h-96 align-bottom object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className=" w-full bg-slate-950">
        <div className="grid grid-cols-2 px-8">
          <div className="grid gap-2">
            <figure className="sticky top-0 h-screen grid place-content-center">
              <img
                src="/img11.jpg"
                alt=""
                className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
              />
            </figure>
            <figure className="sticky top-0 h-screen grid place-content-center">
              <img
                src="/img12.jpg"
                alt=""
                className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
              />
            </figure>
            <figure className="sticky top-0 h-screen grid place-content-center">
              <img
                src="/img13.jpg"
                alt=""
                className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
              />
            </figure>
            <figure className="sticky top-0 h-screen grid place-content-center">
              <img
                src="img9.jpeg"
                alt=""
                className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md"
              />
            </figure>
          </div>
          <div className="sticky top-0 h-screen grid place-content-center">
            <h1 className="text-2xl md:text-4xl lg:text-4xl px-8 font-medium text-right tracking-tight leading-[120%]">
              Enhance Your Knowledge with AI! <br /> Explore Interactive Quizzes, Flashcards & Learning Paths
            </h1>
          </div>
        </div>
      </section>

      <footer className="group bg-slate-950">
        <h1 className="text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear">
          Mindcraft AI
        </h1>
        <section className="bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full">
          Thanks for Exploring Your Learning Path with Mindcraft AI
        </section>
      </footer>
    </main>
  </ReactLenis>
</section>


    <section>
     <FAQ />
    </section>

    <section>
      <Footer />
    </section>

    
    </>
  )
}

export default Hero
