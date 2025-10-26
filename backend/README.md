# Backend - Express + Drizzle ORM + PostgreSQL

This is the backend API server for the Vue TanStack Todo application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Ensure PostgreSQL is running (use Docker):

```bash
# From project root
npm run docker:up
```

3. Run migrations to create database tables:

```bash
npm run migrate
```

## Development

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Todos

- `GET /api/todos` - List all todos
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create todo
- `PATCH /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Assignees

- `GET /api/assignees` - List all assignees
- `GET /api/assignees/:id` - Get single assignee
- `POST /api/assignees` - Create assignee
- `PATCH /api/assignees/:id` - Update assignee
- `DELETE /api/assignees/:id` - Delete assignee (cascades to todos)

## Database Schema

The database uses Drizzle ORM with PostgreSQL. See `src/db/schema.ts` for the schema definition.

**Cascade delete**: When an assignee is deleted, all todos assigned to that assignee are automatically deleted by PostgreSQL foreign key constraints.

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/todo_db
PORT=3000
```

## Drizzle Commands

- `npm run generate` - Generate migration files
- `npm run migrate` - Push schema changes to database
- `npm run studio` - Open Drizzle Studio (database GUI)
