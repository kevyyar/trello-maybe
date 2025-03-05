import { Droppable } from '@hello-pangea/dnd';
import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { ColumnData, Task } from '../App';
import Column from './Column';

interface BoardProps {
  state: {
    tasks: Record<string, Task>;
    columns: Record<string, ColumnData>;
    columnOrder: string[];
  };
  onAddColumn: (title: string) => void;
}

const NewColumnForm: React.FC<{
  onCreate: (title: string) => void;
  onCancel: () => void;
}> = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-[300px] p-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter column title"
        className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
    </form>
  );
};

const Board: React.FC<BoardProps> = ({ state, onAddColumn }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleCreateColumn = (title: string) => {
    if (state.columnOrder.length >= 5) {
      alert("Maximum number of columns (5) reached.");
      setIsAddingColumn(false);
      return;
    }
    onAddColumn(title);
    setIsAddingColumn(false);
  };

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
      <div className="flex items-start">
        {state.columnOrder.length < 5 && (
          <>
            {isAddingColumn ? (
              <NewColumnForm
                onCreate={handleCreateColumn}
                onCancel={() => setIsAddingColumn(false)}
              />
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex items-center gap-2 bg-white shadow min-w-[300px] border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Plus size={20} />
                <span>Add Column</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Board;