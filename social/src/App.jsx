import { createBrowserRouter,  RouterProvider } from 'react-router-dom'

import Header from './components/header/header';
import LoginPage from './Login';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Header />,
		children: [
      		{ path: '/Login', element: <LoginPage /> },
		],
	},
]);

function App() {
	return <>
		<RouterProvider router={routes} />
	</>;
}

export default App