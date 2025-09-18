// 'use client'
// import React, { useState, useEffect } from 'react'
// import HeaderIdea from './HeaderIdea'
// import HeroIdea from './HeroIdea'
// import Tabs from './Tabs'
// import { db } from '@/configs/db'
// import { Ideas } from '@/configs/schema'
// import { asc, desc, eq } from 'drizzle-orm'

// const HomeIdea = () => {
//   const [selectedTab, setSelectedTab] = useState('hots')
//   const [ideas, setIdeas] = useState([])

//   useEffect(() => {
//     GetAllIdeas(selectedTab)
//   }, [selectedTab])

//   const GetAllIdeas = async (tab) => {
//     let result
//     switch (tab) {
//       case 'hots':
//         result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id))
//         break
//       case 'new':
//         result = await db.select().from(Ideas).orderBy(desc(Ideas.createdAt))
//         break
//       case 'top':
//         result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id))
//         break
//       default:
//         result = []
//     }
//     setIdeas(result)
//     console.log(result)
//   }

//   const handleUpvote = async (ideaId) => {
//     try {
//       // Get the current vote count for the idea
//       const currentIdea = ideas.find(idea => idea.id === ideaId);
//       const newVoteCount = currentIdea.vote + 1;

//       const result = await db.update(Ideas).set({
//         vote: newVoteCount
//       }).where(eq(Ideas.id, ideaId)).returning({ id: Ideas.id });

//       if (result) {
//         GetAllIdeas(selectedTab);
//       }
//     } catch (error) {
//       console.error("Error upvoting idea:", error);
//     }
//   }

//   const handleDownvote = async (ideaId) => {
//     try {
//       // Get the current vote count for the idea
//       const currentIdea = ideas.find(idea => idea.id === ideaId);
//       const newVoteCount = currentIdea.vote - 1;

//       const result = await db.update(Ideas).set({
//         vote: newVoteCount
//       }).where(eq(Ideas.id, ideaId)).returning({ id: Ideas.id });

//       if (result) {
//         GetAllIdeas(selectedTab);
//       }
//     } catch (error) {
//       console.error("Error downvoting idea:", error);
//     }
//   }

//   return (
//     <div>
//       <HeaderIdea />
//       <HeroIdea />
//       <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
//       <div className="mt-8 flex flex-col gap-4">
//         {ideas.length === 0 ? (
//           <p className="text-center text-lg">No ideas to display.</p>
//         ) : (
//           ideas.map((idea) => (
//             <div key={idea.id} className="p-6 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//               <h3 className="text-2xl font-semibold">{idea.name}</h3>
//               <p className="mt-2">{idea.content}</p>
//               <div className="mt-4 flex justify-between items-center text-sm">
//                 <span>{idea.createdAt}</span>
//                 <div className="flex items-center">
//                   <span className="mr-2">{idea.vote} Votes</span>
//                   <button 
//                     onClick={() => handleUpvote(idea.id)} 
//                     className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600 transition duration-200"
//                   >
//                     Upvote
//                   </button>
//                   <button 
//                     onClick={() => handleDownvote(idea.id)} 
//                     className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg -red-600 transition duration-200 ml-2"
//                   >
//                     Downvote
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default HomeIdea

'use client'
import React, { useState, useEffect } from 'react'
import HeaderIdea from './HeaderIdea'
import HeroIdea from './HeroIdea'
import Tabs from './Tabs'
import { db } from '@/configs/db'
import { Ideas } from '@/configs/schema'
import { asc, desc, eq } from 'drizzle-orm'

const HomeIdea = () => {
  const [selectedTab, setSelectedTab] = useState('hots')
  const [ideas, setIdeas] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    GetAllIdeas(selectedTab)
  }, [selectedTab])

  // const GetAllIdeas = async (tab) => {
  //   let result
  //   switch (tab) {
  //     case 'hots':
  //       result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id))
  //       break
  //     case 'new':
  //       result = await db.select().from(Ideas).orderBy(desc(Ideas.createdAt))
  //       break
  //     case 'top':
  //       result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id))
  //       break
  //     default:
  //       result = []
  //   }
  //   setIdeas(result)
  //   console.log(result)
  // }

  const GetAllIdeas = async (tab) => {
  let result;
  switch (tab) {
    case "hots":
      result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id));
      break;
    case "new":
      result = await db.select().from(Ideas).orderBy(desc(Ideas.createdAt));
      break;
    case "top":
      result = await db.select().from(Ideas).orderBy(desc(Ideas.vote || Ideas.id));
      break;
    default:
      result = [];
  }
  setIdeas(result);
  console.log(result);
};

  const handleUpvote = async (ideaId) => {
    // Check if the user has already upvoted this idea
    const upvotedIdeas = JSON.parse(localStorage.getItem('upvotedIdeas')) || [];
    if (upvotedIdeas.includes(ideaId)) {
      alert("You have already upvoted this idea.");
      return;
    }

    try {
      // Get the current vote count for the idea
      const currentIdea = ideas.find(idea => idea.id === ideaId);
      const newVoteCount = currentIdea.vote + 1;

      const result = await db.update(Ideas).set({
        vote: newVoteCount
      }).where(eq(Ideas.id, ideaId)).returning({ id: Ideas.id });

      if (result) {
        // Save the upvoted idea ID to local storage
        upvotedIdeas.push(ideaId);
        localStorage.setItem('upvotedIdeas', JSON.stringify(upvotedIdeas));
        GetAllIdeas(selectedTab);
      }
    } catch (error) {
      console.error("Error upvoting idea:", error);
    }
  }

  const handleDownvote = async (ideaId) => {
    try {
      // Get the current vote count for the idea
      const currentIdea = ideas.find(idea => idea.id === ideaId);
      const newVoteCount = currentIdea.vote - 1;

      const result = await db.update(Ideas).set({
        vote: newVoteCount
      }).where(eq(Ideas.id, ideaId)).returning({ id: Ideas.id });

      if (result) {
        GetAllIdeas(selectedTab);
      }
    } catch (error) {
      console.error("Error downvoting idea:", error);
    }
  }

  const handleAddComment = async (ideaId, commentText) => {
  if (!commentText.trim()) return;

  try {
    const currentIdea = ideas.find(idea => idea.id === ideaId);
    const newComments = [...(currentIdea.comments || []), commentText];

    const result = await db.update(Ideas).set({
      comments: newComments
    }).where(eq(Ideas.id, ideaId)).returning({ id: Ideas.id });

    if (result) {
      setNewComment("");
      GetAllIdeas(selectedTab);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};


  return (
    // <div>
    //   <HeaderIdea />
    //   <HeroIdea />
    //   <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      
    //   <div className="mt-8 flex flex-col gap-4">
    //     {ideas.length === 0 ? (
    //       <p className="text-center text-lg">No ideas to display.</p>
    //     ) : (
    //       ideas.map((idea) => (
    //         <div key={idea.id} className="p-6 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    //           <h3 className="text-2xl font-semibold">{idea.name}</h3>
    //           <p className="mt-2">{idea.content}</p>
    //           <div className="mt-4 flex justify-between items-center text-sm">
    //             <span>{idea.createdAt}</span>
    //             <div className="flex items-center">
    //               <span className="mr-2">{idea.vote} Votes</span>
    //               <button 
    //                 onClick={() => handleUpvote(idea.id)} 
    //                 className={`bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600 transition duration-200 ${JSON.parse(localStorage.getItem('upvotedIdeas'))?.includes(idea.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
    //                 disabled={JSON.parse(localStorage.getItem('upvotedIdeas'))?.includes(idea.id)}
    //               >
    //                 Upvote
    //               </button>
    //               <button 
    //                 onClick={() => handleDownvote(idea.id)} 
    //                 className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-600 transition duration-200 ml-2"
    //               >
    //                 Downvote
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       ))
    //     )}
    //   </div>
    // </div>

    <div>
    <HeaderIdea />
    <HeroIdea />
    <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

    <div className="mt-8 flex flex-col gap-4">
      {ideas.length === 0 ? (
        <p className="text-center text-lg">No ideas to display.</p>
      ) : (
        ideas.map((idea) => (
          <div key={idea.id} className="p-6 border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-2xl font-semibold">{idea.name}</h3>
            <p className="mt-2">{idea.content}</p>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span>{idea.createdAt}</span>
              <div className="flex items-center">
                <span className="mr-2">{idea.vote} Votes</span>
                <button 
                  onClick={() => handleUpvote(idea.id)} 
                  className={`bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600 transition duration-200 ${JSON.parse(localStorage.getItem('upvotedIdeas'))?.includes(idea.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={JSON.parse(localStorage.getItem('upvotedIdeas'))?.includes(idea.id)}
                >
                  Upvote
                </button>
                <button 
                  onClick={() => handleDownvote(idea.id)} 
                  className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-600 transition duration-200 ml-2"
                >
                  Downvote
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">Comments</h4>
              <ul className="mt-2 space-y-2">
                {idea.comments && idea.comments.length > 0 ? (
                  idea.comments.map((comment, index) => (
                    <li key={index} className="p-2 border rounded">
                      {comment}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </ul>

              {/* Add Comment Input */}
              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  className="border rounded p-2 w-full"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  onClick={() => handleAddComment(idea.id, newComment)}
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  )
}

export default HomeIdea