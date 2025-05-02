"use client";

type onClickProps = {
  onClick: (tool: string) => void;
};

const ToolSwitchButtons = ({ onClick }: onClickProps) => {
  return (
    <div>
      <button onClick={() => onClick("draw")}>Draw</button>
      <button onClick={() => onClick("voice")}>Voice</button>
      <button onClick={() => onClick("paint")}>Paint</button>
    </div>
  );
};

export default ToolSwitchButtons;
