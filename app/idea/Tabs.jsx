// import React from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const Tabs1 = () => {
//   return (
//     <div className="my-10 flex flex-col items-center gap-5">
//       <Tabs defaultValue="account" className="w-[350px]">
//         <TabsList className="flex gap-6">
//           <TabsTrigger value="hots" className="text-lg font-semibold">Hots ♨️</TabsTrigger>
//           <TabsTrigger value="new" className="text-lg font-semibold">New 💫</TabsTrigger>
//           <TabsTrigger value="top" className="text-lg font-semibold">Top 💹</TabsTrigger>
//         </TabsList>
//         <TabsContent value="hots" className="p-6 text-lg">
//           Make changes to your account here.
//         </TabsContent>
//         <TabsContent value="new" className="p-6 text-lg">
//           Change your password here.
//         </TabsContent>
//         <TabsContent value="top" className="p-6 text-lg">
//           Explore top trending ideas here.
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// export default Tabs1


import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Tabs1 = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="my-10 flex flex-col items-center gap-5">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
        <TabsList className="flex gap-6">
          <TabsTrigger value="hots">Hots ♨️</TabsTrigger>
          <TabsTrigger value="new">New 💫</TabsTrigger>
          <TabsTrigger value="top">Top 💹</TabsTrigger>
        </TabsList>
        <TabsContent value="hots" className="p-6 text-lg">
          {/* Hots Content */}
        </TabsContent>
        <TabsContent value="new" className="p-6 text-lg">
          {/* New Content */}
        </TabsContent>
        <TabsContent value="top" className="p-6 text-lg">
          {/* Top Content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Tabs1
