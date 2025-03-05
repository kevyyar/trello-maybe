import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import { Task } from '../App';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: Task[];
  innerRef: (element: HTMLElement | null) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, innerRef, ...props }) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          ref={(node) => {
            provided.innerRef(node);
            innerRef(node);
          }}
          {...provided.droppableProps}
          {...props}
          className={`bg-white shadow min-w-[300px] border border-gray-300 p-2 rounded-lg transition-all duration-200 ${
            snapshot.isDraggingOver 
              ? 'min-h-[300px]'
              : 'min-h-[180px]'
          }`}
        >
          <h2 className='mb-2 font-medium'>
            {column.title}{' '}
            <span className='text-xs bg-gray-200 rounded-full px-2 py-1'>
              {tasks.length}
            </span>
          </h2>
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={index} 
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;