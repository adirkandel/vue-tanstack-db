# Vue TanStack DB - Todo App

A modern, feature-rich Todo application built with Vue.js and TanStack DB using localStorage persistence.

## Features

- ✅ **Local Storage Persistence**: All todos are stored locally in the browser using TanStack DB's localStorage collection
- ✅ **Real-time Updates**: Reactive data management with automatic UI updates
- ✅ **Priority Levels**: Assign priorities (low, medium, high) to your todos
- ✅ **Categories**: Organize todos by custom categories
- ✅ **Due Dates**: Set and track due dates with overdue highlighting
- ✅ **Completion Status**: Mark todos as complete/incomplete
- ✅ **Advanced Filtering**: Filter by status, priority, category, and search query
- ✅ **Flexible Sorting**: Sort by date, priority, or alphabetically
- ✅ **Inline Editing**: Edit todos directly from the list
- ✅ **Statistics Dashboard**: View total, active, and completed todo counts
- ✅ **TypeScript Support**: Full type safety throughout the application
- ✅ **Modern UI**: Clean, responsive interface built with PrimeVue and Tailwind CSS

## Technology Stack

- **Vue 3** - Frontend framework
- **TanStack DB** - Reactive data management with localStorage persistence
- **TypeScript** - Type safety
- **PrimeVue** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Todos

1. **Quick Add**: Use the "Add New Todo" form
2. Fill in the title (required)
3. Optionally add description, priority, category, and due date
4. Click "Add Todo" to save

### Managing Todos

- **View**: All todos are displayed in a responsive list
- **Edit**: Click the "Edit" button on any todo to modify it inline
- **Complete**: Check the checkbox to mark a todo as complete
- **Delete**: Use the delete button to remove todos

### Filtering and Searching

- **Status Filter**: Show all, active, or completed todos
- **Priority Filter**: Filter by priority level (all, high, medium, low)
- **Category Filter**: Filter by specific categories
- **Search**: Search todos by title or description
- **Sort**: Sort by date, priority, or alphabetically

### Data Persistence

All todo data is automatically saved to your browser's localStorage. This means:

- Data persists between browser sessions
- No server or database required
- Data is private to your browser
- Works offline

## Project Structure

```
src/
├── collections/          # TanStack DB collections
│   └── todoCollection.ts
├── components/          # Vue components
│   ├── TodoForm.vue    # Form to add new todos
│   ├── TodoItem.vue    # Individual todo item with editing
│   ├── TodoList.vue    # List of todos with filtering
│   └── TodoFilters.vue # Filtering and sorting controls
├── volt/                # Custom UI components
├── views/               # Page components
│   └── Home.vue        # Main application view
└── main.ts              # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Features

- **TanStack DB localStorage Collection**: Provides reactive, persistent data management
- **Optimistic Updates**: UI updates immediately while data persists in background
- **Type Safety**: Full TypeScript support with Zod schema validation
- **Responsive Design**: Works on desktop and mobile devices

## Data Schema

Todos include the following fields:

- `id` - Unique identifier
- `title` - Todo title (required)
- `description` - Detailed description (optional)
- `completed` - Completion status (default: false)
- `priority` - Priority level: low, medium, or high (default: medium)
- `category` - Custom category for organization (optional)
- `dueDate` - Date and time when the todo is due (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Browser Compatibility

This application uses modern browser APIs including:

- localStorage for data persistence
- ES6+ features
- Modern CSS features

Recommended browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT
