import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TodoList from "./components/todo/TodoList";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { TodoProvider } from "./context/TodoContext";

const App = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;
