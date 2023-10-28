import {React, useState} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import './app.css';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { LoginContext } from "./pages/LoginContext";

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
	const [loggedIn, setLoggedIn] = useState(false);
	return (
	<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
      	<>
			<RouterProvider router={routes} />
		</>	
    </LoginContext.Provider>
		
	);
}

export default App