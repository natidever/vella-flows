
import React from "react"
import GenericNode from "../../components/GenericNode"


interface NodeProps {
  data: { label: string };
}

const SendMessage: React.FC<NodeProps> = ({ data }) => {
  return (
    <GenericNode
      title="Send message"
      label={data.label}
      icon={<span>📩</span>}
      borderColor="#1a73e8"
      backgroundColor="#e8f0fe"
      handleColor="#1a73e8"
    />
  );
};




export default SendMessage