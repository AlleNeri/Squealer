import React, {useState, useMemo} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import { LoginContext } from "./context/LoginContext/LoginContext";
import MyProfile from './pages/MyProfile/MyProfile';
import AllChannels from './pages/AllChannels/AllChannels';
import MyChannels from './pages/MyChannels/MyChannels';
import Smm from './pages/Smm/Smm';
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
				path: '/Home',
				element: <h1>HOME PAGE</h1>
			},
			{
				path: '/MyProfile/:id',
				element: <MyProfile />
			},
			{
				path: '/AllChannels/:id',
				element: <AllChannels />
			},
			{
				path: '/MyChannels/:id',
				element: <MyChannels />
			},
			{
				path: '/Smm',
				element: <Smm />
			},
		],
	},
]);

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const loginContextValue = useMemo(() => ({ loggedIn, setLoggedIn }), [loggedIn, setLoggedIn]);
	const [posts, setPosts] = useState([]);
	const postsContextValue = useMemo(() => ({ posts, setPosts }), [posts, setPosts]);
	return (
		<LoginContext.Provider value={loginContextValue}>
			<PostsContext.Provider value={postsContextValue}>
				<RouterProvider router={routes} />
			</PostsContext.Provider>
		</LoginContext.Provider>
	);
}

export default App;