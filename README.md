# User Dashboard

A responsive User Dashboard built using React, TypeScript, and Redux Toolkit for centralized state management.

## Features

* Add User
* Edit User
* Delete User
* Search Users
* Sort Users (ID, First Name, Last Name, Email)
* Pagination
* Form Validation
* Responsive Design
* Loading Animation
* Local Storage Persistence
* Redux Toolkit State Management
* Reusable Components (Pagination, Delete Modal)

## Technologies Used

* React
* TypeScript
* Redux Toolkit
* React Redux
* CSS

## Project Structure

```text
src
│
├── app
│   └── store.ts
│
├── features
│   └── user
│       └── userSlice.ts
│
├── components
│   ├── Table.tsx
│   ├── Pagination.tsx
│   └── DeleteModal.tsx
│
├── data
│   └── mockData.ts
│
├── types
│   └── User.ts
```

## State Management

Redux Toolkit is used to manage:

* Users Data
* Search State
* Sorting State
* Pagination State

Local component state is used only for UI-related functionality such as modals, loading indicators, and form inputs.

## Run Project

```bash
npm install
npm start
```

## Future Improvements

* Backend Integration
* Authentication & Authorization
* Advanced Filtering
* API Integration
* User Profile Management