export const Heading = ({ onAddTask }: { onAddTask: () => void }) => {
  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Project Board</h1>
        <p className="text-sm text-gray-400">Manage your project tasks</p>
      </div>
      <div className="flex gap-2 text-sm font-semibold">
        <button className="bg-white p-2 rounded-md hover:cursor-pointer">Filter</button>
        <button className="bg-white p-2 rounded-md hover:cursor-pointer">Sort</button>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer hover:bg-blue-600 transition-colors" onClick={onAddTask}>Add Task</button>
      </div>
    </div>
  );
};
