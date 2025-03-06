import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { Heading } from "./components/heading";
import TaskModal from "./components/task-modal";
import { useAuth } from "./lib/auth-context";
import { tasksCollection, userBoardsCollection } from "./lib/firebase";

export interface Task {
  id: string;
  title: string;
  description: string;
  userId?: string;
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
    "task-1": {
      id: "task-1",
      title: "Example Task",
      description: "This is a test",
    },
    "task-2": {
      id: "task-2",
      title: "Another Task",
      description: "This is another test",
    },
    "task-3": {
      id: "task-3",
      title: "Yet Another Task",
      description: "This is yet another test",
    },
    "task-4": {
      id: "task-4",
      title: "One More Task",
      description: "This is one more test",
    },
  },
  columns: {
    "column-on-deck": {
      id: "column-on-deck",
      title: "On Deck",
      taskIds: [],
    },
    "column-todo": {
      id: "column-todo",
      title: "Todo",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-development": {
      id: "column-development",
      title: "Development",
      taskIds: [],
    },
    "column-ready-for-qa": {
      id: "column-ready-for-qa",
      title: "Ready for QA",
      taskIds: [],
    },
  },
  columnOrder: [
    "column-on-deck",
    "column-todo",
    "column-development",
    "column-ready-for-qa",
  ],
};

const moveTasks = (
  state: AppState,
  source: DropResult["source"],
  destination: DropResult["destination"],
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
      [destinationColumn.id]: {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      },
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

const renameColumn = (
  state: AppState,
  columnId: string,
  newTitle: string
): AppState => {
  if (!state.columns[columnId]) return state;

  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...state.columns[columnId],
        title: newTitle,
      },
    },
  };
};

const deleteColumn = (state: AppState, columnId: string): AppState => {
  if (!state.columns[columnId]) return state;

  const remainingColumns = { ...state.columns };

  const newColumnOrder = state.columnOrder.filter((id) => id !== columnId);

  return {
    ...state,
    columns: remainingColumns,
    columnOrder: newColumnOrder,
  };
};

const App: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : INITIAL_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define saveState before it's used in the useEffect hooks
  const saveState = useCallback(
    (newState: AppState) => {
      setState(newState);
      localStorage.setItem("appState", JSON.stringify(newState));

      // Save to Firestore if user is logged in
      if (user) {
        // Save user's board state
        const userBoardRef = doc(userBoardsCollection, user.uid);
        setDoc(userBoardRef, {
          columns: newState.columns,
          columnOrder: newState.columnOrder,
          updatedAt: new Date(),
        });

        // Save only user's tasks
        Object.values(newState.tasks).forEach(async (task) => {
          if (task.userId === user.uid) {
            await setDoc(doc(tasksCollection, task.id), {
              ...task,
              updatedAt: new Date(),
            });
          }
        });
      }
    },
    [user]
  );

  // Load user data from Firestore when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load user's board configuration
          const userBoardRef = doc(userBoardsCollection, user.uid);
          const userBoardDoc = await getDoc(userBoardRef);

          // Load user's tasks
          const userTasksQuery = query(
            tasksCollection,
            where("userId", "==", user.uid)
          );
          const userTasksSnapshot = await getDocs(userTasksQuery);

          if (userBoardDoc.exists() && !userTasksSnapshot.empty) {
            const userBoardData = userBoardDoc.data();
            const userTasks: Record<string, Task> = {};

            userTasksSnapshot.forEach((doc) => {
              const taskData = doc.data() as Task;
              userTasks[taskData.id] = taskData;
            });

            // Merge with current state
            const mergedState: AppState = {
              tasks: { ...state.tasks, ...userTasks },
              columns: userBoardData.columns || state.columns,
              columnOrder: userBoardData.columnOrder || state.columnOrder,
            };

            setState(mergedState);
            localStorage.setItem("appState", JSON.stringify(mergedState));
          }
        } catch (error) {
          console.error("Error loading user data from Firestore:", error);
        }
      }
    };

    loadUserData();
  }, [user]);

  // Handle user logout - remove user-created tasks
  useEffect(() => {
    if (!user) {
      // User logged out, remove their tasks
      const initialTaskIds = Object.keys(INITIAL_DATA.tasks);

      setState((currentState) => {
        // Filter out user-created tasks
        const filteredTasks = Object.entries(currentState.tasks).reduce(
          (acc, [taskId, task]) => {
            if (initialTaskIds.includes(taskId) || !task.userId) {
              acc[taskId] = task;
            }
            return acc;
          },
          {} as Record<string, Task>
        );

        // Update column taskIds to remove references to deleted tasks
        const updatedColumns = Object.entries(currentState.columns).reduce(
          (acc, [columnId, column]) => {
            acc[columnId] = {
              ...column,
              taskIds: column.taskIds.filter(
                (taskId) =>
                  initialTaskIds.includes(taskId) || filteredTasks[taskId]
              ),
            };
            return acc;
          },
          {} as Record<string, ColumnData>
        );

        const newState = {
          ...currentState,
          tasks: filteredTasks,
          columns: updatedColumns,
        };

        // Save to localStorage and Firestore
        localStorage.setItem("appState", JSON.stringify(newState));
        return newState;
      });
    }
  }, [user]);

  const handleCreateTask = useCallback(
    (taskData: Omit<Task, "id">) => {
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newTaskId,
        ...taskData,
        userId: user?.uid,
      };

      const newState = {
        ...state,
        tasks: {
          ...state.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...state.columns,
          "column-on-deck": {
            ...state.columns["column-on-deck"],
            taskIds: [...state.columns["column-on-deck"].taskIds, newTaskId],
          },
        },
      };

      saveState(newState);
    },
    [state, saveState]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
      ) {
        return;
      }

      saveState(moveTasks(state, source, destination, draggableId));
    },
    [state, saveState]
  );

  const handleAddColumn = useCallback(
    (title: string) => {
      saveState(addColumn(state, title));
    },
    [state, saveState]
  );

  const handleRenameColumn = useCallback(
    (columnId: string, newTitle: string) => {
      saveState(renameColumn(state, columnId, newTitle));
    },
    [state, saveState]
  );

  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      const columnTitle = state.columns[columnId]?.title || columnId;

      const alertUserOnDeletion = () => {
        if (
          window.confirm(
            `Are you sure you want to delete column ${columnTitle} column?`
          )
        ) {
          saveState(deleteColumn(state, columnId));
        }
      };
      alertUserOnDeletion();
    },
    [state, saveState]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app-container">
        <Heading onAddTask={() => setIsModalOpen(true)} />
        <Board
          state={state}
          onAddColumn={handleAddColumn}
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
        />
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
