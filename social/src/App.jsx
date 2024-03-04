import React, {useState, useMemo, useEffect} from 'react';
import { createBrowserRouter,  RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import { LoginContext } from "./context/LoginContext/LoginContext";
import Profile from './pages/Profile/Profile';
import AllChannels from './pages/AllChannels/AllChannels';
import Smm from './pages/Smm/Smm';
import HomePage from './pages/HomePage/HomePage';
import Keywords from './pages/Keywords/Keywords';
import UserLandingPage from './pages/UserLandingPage/UserLandingPage';
import UserBlockedLandingPage from './pages/UserBlockedLandingPage/UserBlockedLandingPage';
import Settings from './pages/Settings/Settings';
import NewPost from './pages/NewPost/NewPost';
import Controversial from './pages/AllChannels/Controversial/Controversial';
import Popular from './pages/AllChannels/Popular/Popular';
import Unpopular from './pages/AllChannels/Unpopular/Unpopular';
import { PostsContext } from './context/PostsContext/PostsContext';
import { UserPostsContext } from './context/UserPostsContext/UserPostsContext';
import { SidebarProvider } from './context/SidebarContext/SidebarContext';
import { TimeProvider } from './context/TimeContext/TimeContext';
import { SearchProvider } from './context/SearchContext/SearchContext';


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
			{
				path: '/AllChannels/Controversial',
				element: <Controversial />
			},
			{
				path: '/AllChannels/Popular',
				element: <Popular />
			},
			{
				path: '/AllChannels/Unpopular',
				element: <Unpopular />
			},
			{
				path: '/Settings/:id',
				element: <Settings />
			},
			{
				path: '/NewPost',
				element: <NewPost />
			},
			{
				path: '/UserLandingPage',
				element: <UserLandingPage />
			},
			{
				path: '/UserBlockedLandingPage',
				element: <UserBlockedLandingPage />
			},
		],
	},
]);

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [justRegistered, setJustRegistered] = useState(false);
	const [posts, setPosts] = useState([]);
	const [userPosts, setUserPosts] = useState([]);
	const [updateInterval, setUpdateInterval] = useState(0);
	const [updateTimes, setUpdateTimes] = useState(0);
	const loginContextValue = useMemo(() => ({ loggedIn, setLoggedIn, justRegistered, setJustRegistered }), [loggedIn, setLoggedIn, justRegistered, setJustRegistered]);
	const postsContextValue = useMemo(() => ({ posts, setPosts }), [posts, setPosts]);
	const timeContextValue = useMemo(() => ({ updateInterval, setUpdateInterval, updateTimes, setUpdateTimes }), [updateInterval, setUpdateInterval, updateTimes, setUpdateTimes]);
	
	useEffect(() => {
		console.log('%c WELCOME TO SQUEALER', 'font-size: 40px; color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)');
	}, []);
	
	return (
		<UserPostsContext.Provider value={{userPosts, setUserPosts}}>
			<SearchProvider>
				<TimeProvider value={{timeContextValue}}>
					<SidebarProvider>
						<LoginContext.Provider value={loginContextValue}>
							<PostsContext.Provider value={postsContextValue}>
								<RouterProvider router={routes} />
							</PostsContext.Provider>
						</LoginContext.Provider>
					</SidebarProvider>
				</TimeProvider>
			</SearchProvider>
		</UserPostsContext.Provider>
	);
}

export default App;