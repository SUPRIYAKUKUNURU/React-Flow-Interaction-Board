import React from "react";
import { blocks } from "../data/blocks";
import "../styles.css";

export const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    
  };

  return (
    <aside className="sidebar">
      <h3>Block Panel</h3>
      {blocks.map((block) => (
        <div
          key={block.id}
          className="dndnode"
          onDragStart={(event) => onDragStart(event, block.type)}
          draggable
        >
          {block.label}
        </div>
      ))}
    </aside>
  );
};
