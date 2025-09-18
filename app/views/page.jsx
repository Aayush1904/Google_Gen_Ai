// 'use client'
// import { useEffect } from "react";
// import Canvas from "../_components/Canvas";
// import Ui from "../_components/Ui";
// import { useSearchParams } from "next/navigation";
// import { useAppContext } from "../provider/AppStates";
// import { socket } from "../api/socket";
// // import '../styles/index.css'

// export default function WorkSpace() {
//   const { setSession } = useAppContext();
//  const searchParams = useSearchParams();


//   useEffect(() => {
//     const room = searchParams.get("room");

//     if (room) {
//       setSession(room);
//       socket.emit("join", room);
//     }
//   }, [searchParams]);

//   return (
//     <>
//       <Ui />
//       <Canvas />
//     </>
//   );
// }

'use client'
// import { useEffect } from "react";
import Canvas from "../_components/Canvas";
import Ui from "../_components/Ui";
import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { useAppContext } from "../provider/AppStates";
// import { socket } from "../api/socket";

export default function WorkSpace() {
  // const { setSession } = useAppContext();
  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   if (!searchParams) return;

  //   const room = searchParams.get("room");
  //   if (room) {
  //     setSession(room);
  //     socket.emit("join", room);
  //   }
  // }, [searchParams]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
      <Ui />
      <Canvas />
      </Suspense>
    </>
  );
}
