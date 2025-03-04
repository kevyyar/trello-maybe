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
    <div 
      ref={innerRef} 
      {...props}
      className="bg-white shadow w-50 border border-gray-300 p-2.5 rounded-lg h-[500px] overflow-y-auto pt-8"
    >
      <h2 className='mb-2'>{column.title}</h2>
      {tasks.map((task, index) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default Column;