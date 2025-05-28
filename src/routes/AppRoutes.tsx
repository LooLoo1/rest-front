import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import type { ReactNode } from "react";

// Layouts & Pages
import ProtectedLayout from "../layout/ProtectedLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RootPage from "../pages/RootPage";
import MoviesPage from "../pages/MoviesPage";
import MoviePage from "../pages/MoviePage";
import UserProfilePage from "../pages/UserProfilePage";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoutes = () => (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </>
);

const PrivateRoutes = () => (
  <>
    <Route path="movies/:id" element={<MoviePage />} />
    <Route path="dashboard" element={<>test</>} />
    <Route path="profile" element={<UserProfilePage />} />
  </>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route
          index
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <MoviesPage />
              </ProtectedRoute>
            ) : (
              <RootPage />
            )
          }
        />

        {PublicRoutes()}

        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          {PrivateRoutes()}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
