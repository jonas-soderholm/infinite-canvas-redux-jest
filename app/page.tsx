"use client";

import { useState } from "react";
import InfiniteCanvas from "../components/InfiniteCanvas";
import ToolSwitchButtons from "@/components/ToolSwitchButtons";

export default function Home() {
  const [activeTool, setActiveTool] = useState("draw");

  const renderTool = () => {
    switch (activeTool) {
      case "draw":
        return <InfiniteCanvas />;
      case "voice":
        return <div>Voice</div>;
      case "paint":
        return <div>Paint</div>;
      default:
        break;
    }
  };

  return (
    <>
      <ToolSwitchButtons onClick={setActiveTool} />
      {renderTool()}
    </>
  );
}
