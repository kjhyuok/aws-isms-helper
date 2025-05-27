# AWS ISMS Helper Frontend

This repository contains the frontend code for the AWS ISMS Helper application, built with React, TypeScript, and Material UI.

## Prerequisites

Before running the frontend application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v8 or later)

## Installation

Follow these steps to set up and run the frontend application:

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd aws-isms-helper/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the development server:

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

The page will automatically reload if you make changes to the code. You will also see any lint errors in the console.

## Building for Production

To build the app for production:

```bash
npm run build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include hashes for cache management.

## Project Structure

- `public/` - Contains static files like HTML, images, and other assets
- `src/` - Contains the source code
  - `components/` - React components
  - `pages/` - Page components
  - `services/` - API services and utilities
  - `App.tsx` - Main application component
  - `index.tsx` - Application entry point

## AWS Amplify Configuration

This project uses AWS Amplify for authentication and API integration. Make sure your Amplify configuration is properly set up in the project.

## Testing

To run tests:

```bash
npm test
```

This launches the test runner in interactive watch mode.

## Additional Information

- This project was bootstrapped with [Create React App](https://create-react-app.dev/)
- UI components are from [Material UI](https://mui.com/)
- Routing is handled by [React Router](https://reactrouter.com/)
