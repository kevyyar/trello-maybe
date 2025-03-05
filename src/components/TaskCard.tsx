import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import { PillCategory } from './pill-category/pill-category';

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
            border: '.8px solid #ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white',
          }}
        >
          <div className='flex'>
            <PillCategory category='Design' bgColor='bg-blue-200' />
            <PillCategory category='Development' bgColor='bg-green-200' />
          </div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;