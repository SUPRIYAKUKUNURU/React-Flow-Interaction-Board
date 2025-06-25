import React from "react";

export const ContextMenu = ({ position, onClose }) => {
  return (
    <div
      className="context-menu"
      style={{ top: position.y, left: position.x }}
      onClick={onClose}
    >
      Hello World
    </div>
  );
};
