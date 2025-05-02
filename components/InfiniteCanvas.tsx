"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStroke, undo, redo } from "../slices/canvasSlice";
import type { RootState, AppDispatch } from "../store/store";
import { v4 as uuidv4 } from "uuid";

interface Point {
  x: number;
  y: number;
}

const InfiniteCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const strokes = useSelector((state: RootState) => state.canvas.strokes);

  const [drawing, setDrawing] = useState(false);
  const [panning, setPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [cursor, setCursor] = useState<"pointer" | "grab" | "crosshair">(
    "pointer"
  );

  // Prevent scrolling the page with wheel
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    window.addEventListener("wheel", preventScroll, { passive: false });
    return () => window.removeEventListener("wheel", preventScroll);
  }, []);

  const getWorldCoords = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      setPanning(true);
      setStartPan({ x: e.clientX, y: e.clientY });
      setCursor("grab");
    } else if (e.button === 0) {
      setDrawing(true);
      setCursor("crosshair");
      setCurrentStroke([getWorldCoords(e)]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawing) {
      const newPoint = getWorldCoords(e);
      setCurrentStroke((prev) => [...prev, newPoint]);
    } else if (panning) {
      const dx = e.clientX - startPan.x;
      const dy = e.clientY - startPan.y;
      setStartPan({ x: e.clientX, y: e.clientY });
      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    }
  };

  const handleMouseUp = () => {
    if (drawing && currentStroke.length > 0) {
      dispatch(addStroke({ id: uuidv4(), points: currentStroke }));
    }
    setDrawing(false);
    setPanning(false);
    setCursor("crosshair");
    setCurrentStroke([]);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + zoomFactor, 5));
    } else {
      setScale((prev) => Math.max(prev - zoomFactor, 0.2));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }

    if (drawing && currentStroke.length) {
      ctx.beginPath();
      currentStroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }

    ctx.restore();
  }, [strokes, currentStroke, offset, scale, drawing]);

  return (
    <div
      onWheel={handleWheel}
      className="fixed inset-0 bg-black overflow-hidden z-0"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex">
        <button
          onClick={() => dispatch(undo())}
          className="bg-white text-black rounded"
        >
          Undo
        </button>
        <button
          onClick={() => dispatch(redo())}
          className="bg-white text-black rounded"
        >
          Redo
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 60}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute top-0 left-0 w-full h-full"
        style={{ cursor }}
      />
    </div>
  );
};

export default InfiniteCanvas;
