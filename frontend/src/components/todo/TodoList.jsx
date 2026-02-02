import { useEffect, useState } from "react";
import { useTodos } from "../../context/TodoContext";
import { FILTER_OPTIONS } from "../../utils/constants";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

const TodoList = () => {
  const { todos, loading, error, filter, setFilter, fetchTodos } = useTodos();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    if (error) {
      setToast({
        show: true,
        message: error,
        type: "error",
      });
    }
  }, [error]);

  const getFilteredTodos = () => {
    if (filter === FILTER_OPTIONS.ALL) return todos;
    return todos.filter((todo) =>
      filter === FILTER_OPTIONS.COMPLETED ? todo.completed : !todo.completed,
    );
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchTodos(newFilter);
  };

  const filteredTodos = getFilteredTodos();

  if (loading && todos.length === 0) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2">My Todos</h1>
          <p className="text-muted">Manage your daily tasks efficiently</p>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
            {Object.values(FILTER_OPTIONS).map((option) => (
              <button
                key={option}
                className={`btn btn-outline-primary btn-sm filter-btn ${
                  filter === option ? "active" : ""
                }`}
                onClick={() => handleFilterChange(option)}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
                {option !== FILTER_OPTIONS.ALL && (
                  <span className="badge bg-secondary ms-1">
                    {
                      todos.filter((todo) =>
                        option === FILTER_OPTIONS.COMPLETED
                          ? todo.completed
                          : !todo.completed,
                      ).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TodoForm />

      {filteredTodos.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i
              className="bi bi-check-all"
              style={{ fontSize: "3rem", color: "#6c757d" }}></i>
          </div>
          <h5 className="text-muted">No todos found</h5>
          <p className="text-muted">
            {filter === FILTER_OPTIONS.ALL
              ? "Start by adding a new todo above!"
              : `No ${filter} todos found`}
          </p>
        </div>
      ) : (
        <div className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
      )}

      {toast.show && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            className={`toast show bg-${toast.type === "error" ? "danger" : "success"} text-white`}>
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast({ ...toast, show: false })}></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;
