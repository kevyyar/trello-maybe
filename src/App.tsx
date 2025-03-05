import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useCallback, useState } from 'react';
import './App.css';
import Board from './components/Board';
import { Heading } from './components/heading/heading';

export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

export interface AppState {
  tasks: Record<string, Task>;
  columns: Record<string, ColumnData>;
  columnOrder: string[];
}

const INITIAL_DATA: AppState = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Example Task', description: 'This is a test' },
    'task-2': { id: 'task-2', title: 'Another Task', description: 'This is another test' },
    'task-3': { id: 'task-3', title: 'Yet Another Task', description: 'This is yet another test' },
    'task-4': { id: 'task-4', title: 'One More Task', description: 'This is one more test' },
  },
  columns: {
    'column-on-deck': {
      id: 'column-on-deck',
      title: 'On Deck',
      taskIds: [],
    },
    'column-todo': {
      id: 'column-todo',
      title: 'Todo',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-development': {
      id: 'column-development',
      title: 'Development',
      taskIds: [],
    },
    'column-ready-for-qa': {
      id: 'column-ready-for-qa',
      title: 'Ready for QA',
      taskIds: [],
    },
  },
  columnOrder: ['column-on-deck', 'column-todo', 'column-development', 'column-ready-for-qa'],
};

const moveTasks = (
  state: AppState,
  source: DropResult['source'],
  destination: DropResult['destination'],
  draggableId: string
): AppState => {
  const sourceColumn = state.columns[source.droppableId];
  const destinationColumn = state.columns[destination!.droppableId];

  if (sourceColumn.id === destinationColumn.id) {
    const newTaskIds = [...sourceColumn.taskIds];
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination!.index, 0, draggableId);

    return {
      ...state,
      columns: {
        ...state.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          taskIds: newTaskIds,
        },
      },
    };
  }

  const sourceTaskIds = [...sourceColumn.taskIds];
  const destinationTaskIds = [...destinationColumn.taskIds];
  
  sourceTaskIds.splice(source.index, 1);
  destinationTaskIds.splice(destination!.index, 0, draggableId);

  return {
    ...state,
    columns: {
      ...state.columns,
      [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTaskIds },
      [destinationColumn.id]: { ...destinationColumn, taskIds: destinationTaskIds },
    },
  };
};

const addColumn = (state: AppState, title: string): AppState => {
  const newColumnId = `column-${Date.now()}`;
  const newColumn: ColumnData = {
    id: newColumnId,
    title,
    taskIds: [],
  };

  return {
    ...state,
    columns: {
      ...state.columns,
      [newColumnId]: newColumn,
    },
    columnOrder: [...state.columnOrder, newColumnId],
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_DATA);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    setState(prevState => moveTasks(prevState, source, destination, draggableId));
  }, []);

  const handleAddColumn = useCallback((title: string) => {
    setState(prevState => addColumn(prevState, title));
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <Heading />
        <Board state={state} onAddColumn={handleAddColumn} />
      </div>
    </DragDropContext>
  );
};

export default App;