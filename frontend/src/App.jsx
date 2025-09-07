import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { ChromePicker } from 'react-color';
import "./App.css"
import InstrumentButton from "./compoments/InstrumentButton";
import Grid from "./compoments/Grid";

import { FaHandPaper, FaPaintBrush } from "react-icons/fa";

function App() {
  const [instrument, setInstrument] = useState("hand");

  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const wsRef = useRef(null);
  const [colorState, setColorState] = useState("#ff0000")

  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(40);
  const [colorActive, setColorActive] = useState(false);

  const stageRef = useRef();

  useEffect(() => {
    const stage = stageRef.current;

    const handleWheel = (e) => {
      e.evt.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();

      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    };

    stage.on("wheel", handleWheel);

    return () => {
      stage.off("wheel", handleWheel);
    };
  }, []);


  useEffect(() => {
  // Use the Django server's port (8000)
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${protocol}://${window.location.hostname}:8000/ws/room/test/`);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "stroke_broadcast") {
        setLines((prev) => [...prev, data.stroke]);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
}, []);

  const handleMouseDown = (e) => {
  if (instrument !== "paint") return;
  isDrawing.current = true;
  const stage = e.target.getStage();
  const pos = stage.getRelativePointerPosition(); // Get relative position
  const newLine = { points: [pos.x, pos.y], color: colorState };
  setLines([...lines, newLine]);
};

const handleMouseMove = (e) => {
  if (instrument !== "paint") return;
  if (!isDrawing.current) return;
  const stage = e.target.getStage();
  const point = stage.getRelativePointerPosition(); // Get relative position
  let lastLine = lines[lines.length - 1];
  lastLine.points = lastLine.points.concat([point.x, point.y]);

  const newLines = lines.slice(0, lines.length - 1).concat(lastLine);
  setLines(newLines);

  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        type: "stroke_broadcast",
        stroke: lastLine,
      })
    );
  }
};

// handleMouseUp remains the same
const handleMouseUp = () => {
  if (instrument !== "paint") return;
  isDrawing.current = false;
};

const clampScale = (s) => Math.max(0.1, Math.min(4, s));

  // wheel zoom handler (zoom to mouse)
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1; // deltaY>0 means scroll down
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = clampScale(newScale);

    stage.scale({ x: newScale, y: newScale });

    // calculate new position to keep zoom centered at mouse
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div style={{position: "relative"}}>
      <h1 className="unselectable-element ">Active instrument: {instrument}</h1>
      <div className="instrument-buttons">
        <InstrumentButton buttonInstrument = {"hand"} handleSetInstrument = {setInstrument} Icon={FaHandPaper}>
        </InstrumentButton>
        <InstrumentButton buttonInstrument = {"paint"} handleSetInstrument = {setInstrument} Icon={FaPaintBrush}>
        </InstrumentButton>
        <div className="color"
         style={{
          backgroundColor: colorState,
          width: 20,
          height: 20,
          padding: 8,
          border: "2px solid",
          borderRadius: 8,
          position: "relative",
          }}
          onClick={() => setColorActive(!colorActive)}>
          
        </div>
          <ChromePicker 
            className={"unselectable-element color-pallet" + (!colorActive ? " hide" : "")} 
            color={ colorState }
            onChangeComplete={ (color) => setColorState(color.hex) }
          />
      </div>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={instrument==="hand"}
        onMouseDown={handleMouseDown }
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
      >
        <Grid stageRef={stageRef} gridSize={gridSize} enabled={gridEnabled} />
        <Layer>
          
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
