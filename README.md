# Trello-like Application Architecture Plan

## 1. Project Overview

-   **Objective**: Create a simple Trello-like application with drag-and-drop functionality for task cards across columns.
-   **Columns**: On Deck, Todo, Development, Ready for QA, On Prod.
-   **Features**:
    -   Drag and drop cards between columns.
    -   Create new tasks.
    -   Display tasks in columns.
    -   Basic task details (title, description).

## 2. Technology Stack

-   **Frontend**:
    -   React (for building the UI components)
    -   React DnD (for drag and drop functionality)
    -   TypeScript (for type safety)
    -   CSS (for styling)

## 3. Component Structure

```
src/
  App.tsx          # Main application component
  components/      # Reusable components
    Board.tsx       # The main board component
    Column.tsx      # Individual column component
    TaskCard.tsx    # Task card component
  data/            # Data structures
    tasks.ts        # Initial tasks data
  utils/           # Utility functions
    dnd.ts         # DnD configuration
```

## 4. Data Structure

```typescript
// src/data/tasks.ts
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'on-deck' | 'todo' | 'development' | 'ready-for-qa' | 'on-prod';
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implement Login',
    description: 'Create login functionality',
    status: 'todo',
  },
  // Add more tasks...
];

```

## 5. Implementation Plan

1.  Set up React DnD with HTML5 backend.
2.  Create the Board component with columns.
3.  Implement Column component with drag-and-drop functionality.
4.  Create TaskCard component.
5.  Add state management for tasks.
6.  Implement drag-and-drop logic.
7.  Add basic styling.
