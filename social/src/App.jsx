import React from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import './app.css';
import Home from './pages/Home';
import LoginPage from '../Login';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		children: [
      		{
				path: '/Login',
				element: <LoginPage />
			},
		],
	},
]);

function App() {
	return (
	<>
		<RouterProvider router={routes} />
	</>		
	);
}

export default App