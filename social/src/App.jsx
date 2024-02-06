import React, {useState, useMemo} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import { LoginContext } from "./context/LoginContext/LoginContext";
import Profile from './pages/Profile/Profile';
import AllChannels from './pages/AllChannels/AllChannels';
import Smm from './pages/Smm/Smm';
import HomePage from './pages/HomePage/HomePage';
import Keywords from './pages/Keywords/Keywords'
import { PostsContext } from './context/PostsContext/PostsContext';
import { SidebarProvider } from './context/SidebarContext/SidebarContext';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/Homepage',
				element: <HomePage />
			},
      		{
				path: '/Login',
				element: <LoginPage />
			},
			{
				path:'/Register',
				element: <RegisterPage />
			},
			{
				path: '/Profile/:id',
				element: <Profile />
			},
			{
				path: '/AllChannels/:id',
				element: <AllChannels />
			},
			{
				path: '/Smm',
				element: <Smm />
			},
			{
				path: '/Keywords/:keyword',
				element : <Keywords />
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
		<SidebarProvider>
			<LoginContext.Provider value={loginContextValue}>
				<PostsContext.Provider value={postsContextValue}>
					<RouterProvider router={routes} />
				</PostsContext.Provider>
			</LoginContext.Provider>
		</SidebarProvider>
	);
}

export default App;