import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Sidebar } from "./components/Sidebar";
import { ContextMenu } from "./components/ContextMenu";
import "./styles.css";

const nodeTypes = {
  blockA: ({ data }) => (
    <div className="node block-a">
      {data.label}
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  ),
  blockB: ({ data }) => (
    <div className="node block-b">
      {data.label}
      <Handle type="target" position={Position.Left} id="b" />
    </div>
  ),
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const reactFlowWrapper = useRef(null);
  const invalidConnectionRef = useRef(false);

  const onConnect = useCallback(
    (params) => {
      if (!invalidConnectionRef.current) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        invalidConnectionRef.current = false;
      }
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { label: type === "blockA" ? "Block A" : "Block B" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="app">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          fitView
          isValidConnection={({ source, target }) => {
            const sourceNode = nodes.find((n) => n.id === source);
            const targetNode = nodes.find((n) => n.id === target);
            const isValid =
              sourceNode?.type === "blockA" && targetNode?.type === "blockB";

            if (!isValid) {
              setTimeout(() => {
                alert(" Only connections from Block A to Block B are allowed.");
              }, 10);
              invalidConnectionRef.current = true;
            }

            return isValid;
          }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
        {contextMenu && (
          <ContextMenu position={contextMenu} onClose={closeContextMenu} />
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default App;
