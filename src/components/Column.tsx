import { Droppable } from "@hello-pangea/dnd";
import { Ellipsis } from "lucide-react";
import React, { useState } from "react";
import { Task } from "../App";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: {
    id: string;
    title: string;
  };
  tasks: Task[];
  innerRef: (element: HTMLElement | null) => void;
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  innerRef,
  isMenuOpen,
  onToggleMenu,
  onRename,
  onDelete,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const menuIsOpen = isMenuOpen !== undefined ? isMenuOpen : isOpen;

  const handleOpenOptions = () => {
    if (onToggleMenu) {
      onToggleMenu();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && onRename) {
      onRename(newTitle.trim());
      setIsRenaming(false);
      // Close the menu after renaming
      if (onToggleMenu) {
        onToggleMenu();
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

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
            snapshot.isDraggingOver ? "min-h-[300px]" : "min-h-[180px]"
          }`}
        >
          <div className="flex justify-between items-center relative">
            {isRenaming ? (
              <form onSubmit={handleRenameSubmit} className="mb-2 flex-1">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onBlur={() => setIsRenaming(false)}
                />
              </form>
            ) : (
              <h2 className="mb-2 font-medium">
                {column.title}{" "}
                <span className="text-xs bg-gray-200 rounded-full px-2 py-1">
                  {tasks.length}
                </span>
              </h2>
            )}
            <button onClick={handleOpenOptions} className="cursor-pointer">
              <Ellipsis size={20} />
            </button>
            {menuIsOpen && (
              <div className="absolute top-6 right-[-25px] bg-emerald-50 shadow-lg rounded-md z-10">
                <div className="flex flex-col items-start gap-2 min-w-[120px]">
                  <button
                    onClick={handleRename}
                    className="text-sm hover:bg-emerald-100 py-3 px-2 transition-colors cursor-pointer w-full text-left"
                  >
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm hover:bg-emerald-100 py-3 px-2 transition-colors cursor-pointer w-full text-left text-red-600"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
