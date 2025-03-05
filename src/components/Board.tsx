import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import { ColumnData, Task } from '../App';
import Column from './Column';

interface BoardProps {
  state: {
    tasks: { [key: string]: Task };
    columns: { [key: string]: ColumnData };
    columnOrder: string[];
  };
}

const Board: React.FC<BoardProps> = ({ state }) => {
  return (
    <div className="flex gap-4 justify-center px-4">
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
        
        return (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div>
                <Column 
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );
      })}
    </div>
  );
};

export default Board;