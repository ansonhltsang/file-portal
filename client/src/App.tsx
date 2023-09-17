import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { Home } from './Home';
import { Session } from './Session';
import ErrorPage from './ErrorPage';
import Header from './Components/Header';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: ':id/',
    element: <Session />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}
