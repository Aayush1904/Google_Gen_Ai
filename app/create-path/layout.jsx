"use client"
import React, { useState } from 'react'
import { UserInputContext } from '../_context/UserInputContext'

const layout = ({children}) => {
    const [userInput , setUserInput] = useState([]);
  return (
    <div className='pt-16'>
        <UserInputContext.Provider value= {{userInput , setUserInput}}>
            <div>
                {children}
            </div>
        </UserInputContext.Provider>
    </div>
  )
}

export default layout
