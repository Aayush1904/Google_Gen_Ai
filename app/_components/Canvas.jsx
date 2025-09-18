// import useCanvas from "../hooks/useCanvas";

// export default function Canvas() {
//   const {
//     canvasRef,
//     dimension,
//     handleMouseDown,
//     handleMouseMove,
//     handleMouseUp,
//     handleWheel,
//   } = useCanvas();

//   return (
//     <>
//       <canvas
//         id="canvas"
//         ref={canvasRef}
//         width={dimension.width}
//         height={dimension.height}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onWheel={handleWheel}
//       />
//     </>
//   );
// }


import useCanvas from "../hooks/useCanvas";
import { useAppContext } from "../provider/AppStates";
import { useState, useEffect } from "react";

export default function Canvas() {
  const {
    canvasRef,
    dimension,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  } = useCanvas();

  const { selectedTool, setElements, style } = useAppContext();

  // State to manage live text input
  const [isWriting, setIsWriting] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [writingPosition, setWritingPosition] = useState({ x: 0, y: 0 });

  // Handle click to start writing
  const handleCanvasClick = (event) => {
    if (selectedTool !== "writing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setWritingPosition({ x, y });
    setCurrentText("");
    setIsWriting(true);
  };

  // Handle keyboard input for writing
  useEffect(() => {
    if (!isWriting) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsWriting(false); // Cancel writing
        return;
      }

      if (event.key === "Enter") {
        if (currentText.trim() !== "") {
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
        }
        setIsWriting(false);
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

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      width={dimension.width}
      height={dimension.height}
      onMouseDown={(event) => {
        handleMouseDown(event);
        handleCanvasClick(event); // Enable writing when clicking
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}

