import { Draggable } from '@hello-pangea/dnd';
import React from 'react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white border p-2.5 rounded-md"
          style={{
            ...provided.draggableProps.style,
            marginTop: '10px',
            backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white',
          }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;