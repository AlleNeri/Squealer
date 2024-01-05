import {React, useState} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import './app.css';
import Home from './layout/Layout';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import { LoginContext } from "./context/LoginContext/LoginContext";
import NewPost from './components/NewPost/NewPost';

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
			},
			{
				path: '/NewPost',
				element: <NewPost />
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

export default App;