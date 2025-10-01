import React from "react";
import "./Tooltip.css";
import { playTooltipText } from "./toolTipTexts";

export default function HelpTooltip({ tipText, style }) {
  return (
    <div className="tooltip" style={style}>
      <span className="icon">how to play</span>
      <span className="text">{playTooltipText}</span>
    </div>
  );
}
