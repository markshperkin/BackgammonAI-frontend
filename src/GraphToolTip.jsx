import React from 'react';
import './Tooltip.css';
import { graphTooltipText } from './toolTipTexts';

export default function GraphTooltip({ tipText, style }) {
  return (
    <div className="tooltip" style={style}>
      <span className="icon"> (?) </span>
      <span className="text">{graphTooltipText}</span>
    </div>
  );
}




