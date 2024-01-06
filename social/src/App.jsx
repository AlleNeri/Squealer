import React, {useState} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import './app.css';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import { LoginContext } from "./context/LoginContext/LoginContext";
import MyPosts from './pages/MyPosts/MyPosts';
import { PostsContext } from './context/PostsContext/PostsContext';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
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
				path: '/MyPosts',
				element: <MyPosts />
			}
		],
	},
]);

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [posts, setPosts] = useState([]);
	return (
		<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
			<PostsContext.Provider value={{posts, setPosts}}>
				<>
					<RouterProvider router={routes} />
				</>	
			</PostsContext.Provider>
		</LoginContext.Provider>
	);
}

export default App;