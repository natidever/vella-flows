

import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Initial nodes
const initialNodes = [
  {
    id: 'n1',
    type: 'emailListener',
    position: { x: 50, y: 50 },
    data: { label: 'Listen to Incoming Emails' },
  },
  {
    id: 'n2',
    type: 'extractBody',
    position: { x: 300, y: 50 },
    data: { label: 'Extract Email Body' },
  },
  {
    id: 'n3',
    type: 'send',
    position: { x: 550, y: 50 },
    data: { label: 'Send to API' },
  },
];

// Initial edges
const initialEdges = [];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Node/edge handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((es) => addEdge(params, es)),
    []
  );


  const nodeTypes = {
    emailListener: ({ data }) => (
      <div style={{ padding: 10, border: '2px solid #1a73e8', borderRadius: 8, background: '#e8f0fe' }}>
        <strong>Email Listener</strong>
        <div style={{ fontSize: 12 }}>{data.label}</div>
        <Handle type="source" position={Position.Right} id="out" style={{ background: '#1a73e8' }} />
      </div>
    ),
    extractBody: ({ data }) => (
      <div style={{ padding: 10, border: '2px solid #fbbc05', borderRadius: 8, background: '#fff7e6' }}>
        <Handle type="target" position={Position.Left} id="in" style={{ background: '#fbbc05' }} />
        <strong>Extract Body</strong>
        <div style={{ fontSize: 12 }}>{data.label}</div>
        <Handle type="source" position={Position.Right} id="out" style={{ background: '#fbbc05' }} />
      </div>
    ),
    send: ({ data }) => (
      <div style={{ padding: 10, border: '2px solid #34a853', borderRadius: 8, background: '#e6f4ea' }}>
        <Handle type="target" position={Position.Left} id="in" style={{ background: '#34a853' }} />
        <strong>Send Node</strong>
        <div style={{ fontSize: 12 }}>{data.label}</div>
      </div>
    ),

  
  };



  const saveWorkflow = () => {

    fetch('http://localhost:8000/api/save-workflow', {
       method:'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name: 'My Email Workflow', workflow }) 
    }).then(res=>res.json).
      then(data=>{console.log("Workflow saved",data)}).
      catch(error=>console.log("Error while saving ",error))

  }



const workflow = {
  nodes: nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data
  })),
  edges: edges.map(e => ({
    source: e.source,
    target: e.target,
    type: e.type
  }))
};


  return (
    <div style={{ height: '100vh', width: '100vw' }}>
  <button  type="button" onClick={saveWorkflow} style={{position: 'absolute', bottom:10, right: 50,color:'black',background:'grey',zIndex:10}}>Save Workflow</button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
