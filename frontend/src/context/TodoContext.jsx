import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../services/api";
import { FILTER_OPTIONS } from "../utils/constants";

const TodoContext = createContext({});

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);

  const fetchTodos = useCallback(
    async (filterOption = filter) => {
      try {
        setLoading(true);
        setError(null);
        const params =
          filterOption !== FILTER_OPTIONS.ALL ? { filter: filterOption } : {};
        const response = await api.get("/todos", { params });
        setTodos(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  const createTodo = async (todoData) => {
    try {
      setError(null);
      const response = await api.post("/todos", todoData);
      setTodos([response.data.data, ...todos]);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create todo");
      return { success: false, message: err.response?.data?.error };
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      setError(null);
      const response = await api.put(`/todos/${id}`, todoData);
      setTodos(
        todos.map((todo) => (todo._id === id ? response.data.data : todo)),
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update todo");
      return { success: false, message: err.response?.data?.error };
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete todo");
      return { success: false, message: err.response?.data?.error };
    }
  };

  const toggleTodo = async (id) => {
    try {
      setError(null);
      const response = await api.patch(`/todos/${id}/toggle`);
      setTodos(
        todos.map((todo) => (todo._id === id ? response.data.data : todo)),
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to toggle todo");
      return { success: false, message: err.response?.data?.error };
    }
  };

  const value = {
    todos,
    loading,
    error,
    filter,
    setFilter,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
