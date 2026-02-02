import Header from "./Header";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <Header />
      <main className="flex-grow-1 py-4">
        <div className="container">{children}</div>
      </main>
      <footer className="bg-dark text-white py-3 mt-4">
        <div className="container text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
