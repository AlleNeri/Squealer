import React from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import './app.css';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
const routes = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
		children: [
      		{
				path: '/Login',
				element: <LoginPage />
			},
			{
				path:'/Register',
				element: <RegisterPage />
			}
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