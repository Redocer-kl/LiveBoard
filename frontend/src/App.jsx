import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { ChromePicker } from "react-color";
import "./App.css"
import InstrumentButton from "./compoments/InstrumentButton";
import Grid from "./compoments/Grid";

import { FaHandPaper, FaPaintBrush } from "react-icons/fa";

const uid = () => Math.random().toString(36).slice(2, 10);

function App() {
  const [instrument, setInstrument] = useState("hand");
  const [lines, setLines] = useState([]); // strokes: { points: [...], color, clientId, strokeId }
  const isDrawing = useRef(false);
  const wsRef = useRef(null);
  const [colorState, setColorState] = useState("#ff0000");

  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(40);
  const [colorActive, setColorActive] = useState(false);

  const stageRef = useRef();

  // ids
  const clientIdRef = useRef(uid());
  const strokeIdRef = useRef(0);

  useEffect(() => {
    // WebSocket setup (same server expectations as before)
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${window.location.hostname}:8000/ws/room/test/`);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = (e) => console.error("WebSocket error", e);
    ws.onclose = () => console.log("WebSocket closed");

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        // server sends final strokes as: { type: "stroke_broadcast", clientId, strokeId, color, points: [{x,y}] , finished:true }
        if ((data.type === "stroke_broadcast" || data.type === "stroke_update") && data.clientId !== clientIdRef.current) {
          // Insert remote stroke into state
          // If the server sends a whole stroke at once, we just append it as a finished stroke
          setLines((prev) => [
            ...prev,
            {
              points: flattenPointsArray(data.points),
              color: data.color || "#000",
              clientId: data.clientId,
              strokeId: data.strokeId,
              finished: true,
            },
          ]);
        }
      } catch (err) {
        console.error("ws parse", err);
      }
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  // ----- Helpers: point conversions & Catmull-Rom smoothing -----
  function flattenPointsArray(pointsObjs) {
    // from [{x,y},...] to [x,y,x,y,...]
    if (!pointsObjs || !pointsObjs.length) return [];
    return pointsObjs.flatMap((p) => [p.x, p.y]);
  }

  function pairify(flatPoints) {
    // from [x,y,x,y,...] to [{x,y},...]
    const arr = [];
    for (let i = 0; i < flatPoints.length; i += 2) {
      arr.push({ x: flatPoints[i], y: flatPoints[i + 1] });
    }
    return arr;
  }

  // Catmull-Rom interpolation: returns array of {x,y}
  // samplesPerSegment controls density (higher -> smoother but more points)
  function catmullRomSpline(points, samplesPerSegment = 6) {
    if (!points || points.length < 2) return points ? [...points] : [];

    // For endpoints, duplicate first and last to create p0,p1,p2,p3
    const pts = points.slice();
    if (pts.length === 2) {
      // simple straight line: just interpolate linearly
      const [a, b] = pts;
      const out = [];
      for (let i = 0; i <= samplesPerSegment; i++) {
        const t = i / samplesPerSegment;
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
      return out;
    }

    // make a padded array
    const padded = [];
    padded.push(pts[0]); // p0 = p1
    padded.push(...pts);
    padded.push(pts[pts.length - 1]); // p{n+1} = pn

    const out = [];
    for (let i = 0; i < padded.length - 3; i++) {
      const p0 = padded[i];
      const p1 = padded[i + 1];
      const p2 = padded[i + 2];
      const p3 = padded[i + 3];

      for (let j = 0; j <= samplesPerSegment; j++) {
        const t = j / samplesPerSegment;
        // Catmull-Rom to cubic polynomial (alpha = 0.5 standard)
        const t2 = t * t;
        const t3 = t2 * t;

        const x =
          0.5 *
          ((-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3 +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + p2.x) * t +
            2 * p1.x);
        const y =
          0.5 *
          ((-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3 +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + p2.y) * t +
            2 * p1.y);

        // note: the formula gives coordinates centered on p1; dividing by 2 already in formula
        out.push({ x, y });
      }
    }

    // Optionally, remove near-duplicate consecutive points
    return dedupeNearby(out, 0.5);
  }

  function dedupeNearby(points, minDist = 0.5) {
    if (!points.length) return points;
    const out = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const a = out[out.length - 1];
      const b = points[i];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (Math.hypot(dx, dy) >= minDist) out.push(b);
    }
    return out;
  }

  // ----- Drawing handlers -----
  const handleMouseDown = (e) => {
    if (instrument !== "paint") return;
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getRelativePointerPosition();
    const strokeId = ++strokeIdRef.current;

    const newLine = {
      points: [pos.x, pos.y], // flat array
      color: colorState,
      clientId: clientIdRef.current,
      strokeId,
      finished: false,
    };

    // add to local state (optimistic)
    setLines((prev) => [...prev, newLine]);
  };

  const handleMouseMove = (e) => {
    if (instrument !== "paint") return;
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const pos = stage.getRelativePointerPosition();

    // append to last line's points (fast state update)
    setLines((prev) => {
      if (!prev.length) return prev;
      const lastIndex = prev.length - 1;
      const last = prev[lastIndex];

      // protect against cases where instrument changed
      if (last.clientId !== clientIdRef.current || last.finished) return prev;

      const updated = {
        ...last,
        points: last.points.concat([pos.x, pos.y]),
      };

      const out = prev.slice(0, lastIndex).concat(updated);
      return out;
    });
  };

  const handleMouseUp = () => {
    if (instrument !== "paint") return;
    if (!isDrawing.current) return;
    isDrawing.current = false;

    // find active stroke
    setLines((prev) => {
      // Work on the copy before returning new state
      const idx = prev.map((s) => s.clientId === clientIdRef.current && !s.finished).indexOf(true);
      // The above is a bit awkward: walk to find last unfinished stroke by this client:
      let foundIndex = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].clientId === clientIdRef.current && !prev[i].finished) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex === -1) return prev; // nothing to do

      const stroke = prev[foundIndex];
      // convert flat points to pair objects
      const rawPairs = pairify(stroke.points);

      // Smooth via Catmull-Rom spline (samplesPerSegment controls smoothness)
      const samplesPerSegment = 8; // tune: higher -> smoother & more points
      const smoothedPairs = catmullRomSpline(rawPairs, samplesPerSegment);

      // convert back to flat array for Konva
      const flatSmoothed = smoothedPairs.flatMap((p) => [p.x, p.y]);

      // Create updated stroke object (mark finished)
      const updatedStroke = {
        ...stroke,
        points: flatSmoothed,
        finished: true,
      };

      // replace in array
      const newArr = prev.slice(0, foundIndex).concat(updatedStroke).concat(prev.slice(foundIndex + 1));

      // send final stroke to server (one single message)
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "stroke_update",
            clientId: clientIdRef.current,
            strokeId: stroke.strokeId,
            color: stroke.color,
            points: smoothedPairs, // send as [{x,y},...]
            finished: true,
          })
        );
      }

      return newArr;
    });
  };

  // wheel zoom handler (copy of your existing, unchanged)
  const clampScale = (s) => Math.max(0.1, Math.min(4, s));
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
        <InstrumentButton buttonInstrument = {"hand"} handleSetInstrument = {setInstrument} Icon={FaHandPaper} />
        <InstrumentButton buttonInstrument = {"paint"} handleSetInstrument = {setInstrument} Icon={FaPaintBrush} />
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <Grid stageRef={stageRef} gridSize={gridSize} enabled={gridEnabled} />
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={`${line.clientId || "local"}-${line.strokeId ?? i}`}
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
