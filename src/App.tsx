import { DragDropContext } from '@hello-pangea/dnd';
import { useState } from 'react';
import './App.css';
import Board from './components/Board';
import { Heading } from './components/heading/heading';

// Task type definition
export interface Task {
  id: string;
  title: string;
  description: string;
}

// Column data structure
export interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

// Application state structure
interface AppState {
  tasks: { [key: string]: Task };
  columns: { [key: string]: ColumnData };
  columnOrder: string[];
}

// Initial data
const initialData: AppState = {
  tasks: {
    '1': { id: '1', title: 'Example Task', description: 'This is a test' },
    '2': { id: '2', title: 'Another Task', description: 'This is another test' },
    '3': { id: '3', title: 'Yet Another Task', description: 'This is yet another test' },
    '4': { id: '4', title: 'One More Task', description: 'This is one more test' },
  },
  columns: {
    'on-deck': {
      id: 'on-deck',
      title: 'On Deck',
      taskIds: [],
    },
    'todo': {
      id: 'todo',
      title: 'Todo',
      taskIds: ['1', '2', '3', '4'],
    },
    'development': {
      id: 'development',
      title: 'Development',
      taskIds: [],
    },
    'ready-for-qa': {
      id: 'ready-for-qa',
      title: 'Ready for QA',
      taskIds: [],
    },
    'on-prod': {
      id: 'on-prod',
      title: 'On Prod',
      taskIds: [],
    },
  },
  columnOrder: ['on-deck', 'todo', 'development', 'ready-for-qa', 'on-prod'],
};

function App() {
  const [state, setState] = useState<AppState>(initialData);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Drop outside any droppable
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get source and destination columns
    const sourceColumn = state.columns[source.droppableId];
    const destinationColumn = state.columns[destination.droppableId];

    // Moving within the same column
    if (sourceColumn.id === destinationColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      
      // Remove from old position and insert at new position
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      // Create new column with updated taskIds
      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      // Update state with new column data
      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      });
      
      return;
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);
    
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };

    // Update state with new column data for both columns
    setState({
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Heading />
      <Board state={state} />
    </DragDropContext>
  );
}

export default App;