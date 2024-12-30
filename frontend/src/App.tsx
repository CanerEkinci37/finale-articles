import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserState } from './types/User';
import {useAppSelector } from './hooks/appSelector';
import Me from './pages/Me';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const {isAuthenticated, isLoading } = useAppSelector<UserState>((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
};


function App() {
  // const dispatch = useAppDispatch();
  // const { token } = useAppSelector((state) => state.auth);


  // useEffect(() => {
  //   if (token) {
  //     dispatch(getCurrentUser(());
  //   }
  // }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path='/me' element={<Me />} />
      </Routes>
    </Router>
  );
}

export default App;
