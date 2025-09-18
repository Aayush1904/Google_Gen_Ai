// 'use client'
// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   Circle,
//   Line,
//   Rectangle,
//   Selection,
//   Diamond,
//   Hand,
//   Lock,
//   Arrow,
// } from "../assets/icons";
// import { BACKGROUND_COLORS, STROKE_COLORS, STROKE_STYLES } from "../global/var";
// import { getElementById, minmax } from "../helper/element";
// import useHistory from "../hooks/useHistory";
// import { socket } from "../api/socket";

// const AppContext = createContext();

// const isElementsInLocal = () => {
//   try {
//     JSON.parse(localStorage.getItem("elements")).forEach(() => {});
//     return JSON.parse(localStorage.getItem("elements"));
//   } catch (err) {
//     return [];
//   }
// };

// const initialElements = isElementsInLocal();

// export function AppContextProvider({ children }) {
//   const [session, setSession] = useState(null);
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [elements, setElements, undo, redo] = useHistory(
//     initialElements,
//     session
//   );
//   const [action, setAction] = useState("none");
//   const [selectedTool, setSelectedTool] = useState("selection");
//   const [translate, setTranslate] = useState({
//     x: 0,
//     y: 0,
//     sx: 0,
//     sy: 0,
//   });
//   const [scale, setScale] = useState(1);
//   const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
//   const [lockTool, setLockTool] = useState(false);
//   const [style, setStyle] = useState({
//     strokeWidth: 3,
//     strokeColor: STROKE_COLORS[0],
//     strokeStyle: STROKE_STYLES[0].slug,
//     fill: BACKGROUND_COLORS[0],
//     opacity: 100,
//   });

//   useEffect(() => {
//     if (session == null) {
//       localStorage.setItem("elements", JSON.stringify(elements));
//     }

//     if (!getElementById(selectedElement?.id, elements)) {
//       setSelectedElement(null);
//     }
//   }, [elements, session, selectedElement]);

//   const onZoom = (delta) => {
//     if (delta == "default") {
//       setScale(1);
//       return;
//     }
//     setScale((prevState) => minmax(prevState + delta, [0.1, 20]));
//   };

//   const toolAction = (slug) => {
//     if (slug == "lock") {
//       setLockTool((prevState) => !prevState);
//       return;
//     }
//     setSelectedTool(slug);
//   };

//   const tools = [
//     [
//       {
//         slug: "lock",
//         icon: Lock,
//         title: "Keep selected tool active after drawing",
//         toolAction,
//       },
//     ],
//     [
//       {
//         slug: "hand",
//         icon: Hand,
//         title: "Hand",
//         toolAction,
//       },
//       {
//         slug: "selection",
//         icon: Selection,
//         title: "Selection",
//         toolAction,
//       },
//       {
//         slug: "rectangle",
//         icon: Rectangle,
//         title: "Rectangle",
//         toolAction,
//       },
//       {
//         slug: "diamond",
//         icon: Diamond,
//         title: "Diamond",
//         toolAction,
//       },
//       {
//         slug: "circle",
//         icon: Circle,
//         title: "Circle",
//         toolAction,
//       },
//       {
//         slug: "arrow",
//         icon: Arrow,
//         title: "Arrow",
//         toolAction,
//       },
//       {
//         slug: "line",
//         icon: Line,
//         title: "Line",
//         toolAction,
//       },
//     ],
//   ];

//   useEffect(() => {
//     if (session) {
//       socket.on("setElements", (data) => {
//         setElements(data, true, false);
//       });
//     }
//   }, [session]);

//   return (
//     <AppContext.Provider
//       value={{
//         action,
//         setAction,
//         tools,
//         selectedTool,
//         setSelectedTool,
//         elements,
//         setElements,
//         translate,
//         setTranslate,
//         scale,
//         setScale,
//         onZoom,
//         scaleOffset,
//         setScaleOffset,
//         lockTool,
//         setLockTool,
//         style,
//         setStyle,
//         selectedElement,
//         setSelectedElement,
//         undo,
//         redo,
//         session,
//         setSession,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useAppContext() {
//   return useContext(AppContext);
// }


'use client';
import { createContext, useContext, useEffect, useState } from "react";
import {
  Circle,
  Line,
  Rectangle,
  Selection,
  Diamond,
  Hand,
  Lock,
  Arrow,
  Writing, // Import Writing tool icon
} from "../assets/icons";
import { BACKGROUND_COLORS, STROKE_COLORS, STROKE_STYLES } from "../global/var";
import { getElementById, minmax } from "../helper/element";
import useHistory from "../hooks/useHistory";
import { socket } from "../api/socket";

const AppContext = createContext();

const isElementsInLocal = () => {
  try {
    JSON.parse(localStorage.getItem("elements")).forEach(() => {});
    return JSON.parse(localStorage.getItem("elements"));
  } catch (err) {
    return [];
  }
};

const initialElements = isElementsInLocal();

export function AppContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements, undo, redo] = useHistory(initialElements, session);
  const [action, setAction] = useState("none");
  const [selectedTool, setSelectedTool] = useState("selection");
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
    sx: 0,
    sy: 0,
  });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const [lockTool, setLockTool] = useState(false);
  const [style, setStyle] = useState({
    strokeWidth: 3,
    strokeColor: STROKE_COLORS[0],
    strokeStyle: STROKE_STYLES[0].slug,
    fill: BACKGROUND_COLORS[0],
    opacity: 100,
  });

  // Writing state
  const [isWriting, setIsWriting] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [writingPosition, setWritingPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (session == null) {
      localStorage.setItem("elements", JSON.stringify(elements));
    }

    if (!getElementById(selectedElement?.id, elements)) {
      setSelectedElement(null);
    }
  }, [elements, session, selectedElement]);

  // Handles Zoom
  const onZoom = (delta) => {
    if (delta == "default") {
      setScale(1);
      return;
    }
    setScale((prevState) => minmax(prevState + delta, [0.1, 20]));
  };

  // Handle tool selection
  const toolAction = (slug) => {
    if (slug == "lock") {
      setLockTool((prevState) => !prevState);
      return;
    }
    setSelectedTool(slug);
  };

  // Handle mouse click to start writing
  const handleCanvasClick = (event) => {
    if (selectedTool !== "writing") return;

    setIsWriting(true);
    setCurrentText("");
    setWritingPosition({ x: event.clientX, y: event.clientY });
  };

  // Handle keyboard input for writing
  useEffect(() => {
    if (!isWriting) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsWriting(false);
        return;
      }

      if (event.key === "Enter") {
        setElements((prev) => [
          ...prev,
          {
            id: `text-${Date.now()}`,
            type: "text",
            x: writingPosition.x,
            y: writingPosition.y,
            text: currentText,
            color: style.strokeColor,
            fontSize: 16,
          },
        ]);
        setIsWriting(false);
        setCurrentText("");
        return;
      }

      if (event.key === "Backspace") {
        setCurrentText((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        setCurrentText((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWriting, currentText, writingPosition, setElements, style.strokeColor]);

  const tools = [
    [
      {
        slug: "lock",
        icon: Lock,
        title: "Keep selected tool active after drawing",
        toolAction,
      },
    ],
    [
      {
        slug: "hand",
        icon: Hand,
        title: "Hand",
        toolAction,
      },
      {
        slug: "selection",
        icon: Selection,
        title: "Selection",
        toolAction,
      },
      {
        slug: "rectangle",
        icon: Rectangle,
        title: "Rectangle",
        toolAction,
      },
      {
        slug: "diamond",
        icon: Diamond,
        title: "Diamond",
        toolAction,
      },
      {
        slug: "circle",
        icon: Circle,
        title: "Circle",
        toolAction,
      },
      {
        slug: "arrow",
        icon: Arrow,
        title: "Arrow",
        toolAction,
      },
      {
        slug: "line",
        icon: Line,
        title: "Line",
        toolAction,
      },
      {
        slug: "writing", // New Writing Tool
        icon: Writing, // Using imported Writing tool icon
        title: "Writing Tool",
        toolAction,
      },
    ],
  ];

  useEffect(() => {
    if (session) {
      socket.on("setElements", (data) => {
        setElements(data, true, false);
      });
    }
  }, [session]);

  return (
    <AppContext.Provider
      value={{
        action,
        setAction,
        tools,
        selectedTool,
        setSelectedTool,
        elements,
        setElements,
        translate,
        setTranslate,
        scale,
        setScale,
        onZoom,
        scaleOffset,
        setScaleOffset,
        lockTool,
        setLockTool,
        style,
        setStyle,
        selectedElement,
        setSelectedElement,
        undo,
        redo,
        session,
        setSession,
        handleCanvasClick, // Writing tool mouse handler
        currentText, // Live text preview
        writingPosition, // Track writing position
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
