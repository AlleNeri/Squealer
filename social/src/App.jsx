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
import { TimeProvider } from './context/TimeContext/TimeContext';

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
	const [posts, setPosts] = useState([]);
	const [updateInterval, setUpdateInterval] = useState(0);
	const [updateTimes, setUpdateTimes] = useState(0);
	const loginContextValue = useMemo(() => ({ loggedIn, setLoggedIn }), [loggedIn, setLoggedIn]);
	const postsContextValue = useMemo(() => ({ posts, setPosts }), [posts, setPosts]);
	const timeContextValue = useMemo(() => ({ updateInterval, setUpdateInterval, updateTimes, setUpdateTimes }), [updateInterval, setUpdateInterval, updateTimes, setUpdateTimes]);

	return (
		<TimeProvider value={{timeContextValue}}>
			<SidebarProvider>
				<LoginContext.Provider value={loginContextValue}>
					<PostsContext.Provider value={postsContextValue}>
						<RouterProvider router={routes} />
					</PostsContext.Provider>
				</LoginContext.Provider>
			</SidebarProvider>
		</TimeProvider>
	);
}

export default App;