import { Handle, Position } from '@xyflow/react';
import React from 'react';

interface GenericNodeProps {
  title: string;
  label: string;
  icon?: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  handleColor?: string;
}

const GenericNode: React.FC<GenericNodeProps> = ({
  title,
  label,
  icon,
  borderColor = '#000',
  backgroundColor = '#fff',
  handleColor = '#000',
}) => {
  return (
    <div
      style={{
        padding: 10,
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        background: backgroundColor,
        minWidth: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon && <span>{icon}</span>}
      <div>
        <strong>{title}</strong>
        <div style={{ fontSize: 12 }}>{label}</div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ background: handleColor }}
      />
    </div>
  );
};

export default GenericNode;
