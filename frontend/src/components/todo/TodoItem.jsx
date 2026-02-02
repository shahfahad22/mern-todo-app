import { useState } from "react";
import { useTodos } from "../../context/TodoContext";

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
  });
  const { updateTodo, deleteTodo, toggleTodo } = useTodos();

  const handleToggle = async () => {
    await toggleTodo(todo._id);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      await deleteTodo(todo._id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: todo.title,
      description: todo.description,
    });
  };

  const handleSave = async () => {
    if (!editData.title.trim()) return;

    const result = await updateTodo(todo._id, editData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  if (isEditing) {
    return (
      <div className="card todo-item shadow-sm mb-2 border-primary">
        <div className="card-body">
          <div className="mb-2">
            <input
              type="text"
              className="form-control form-control-sm"
              name="title"
              value={editData.title}
              onChange={handleChange}
              maxLength="200"
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control form-control-sm"
              name="description"
              value={editData.description}
              onChange={handleChange}
              rows="2"
              maxLength="500"
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              <i className="bi bi-check-lg me-1"></i>
              Save
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              <i className="bi bi-x-lg me-1"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card todo-item shadow-sm mb-2 ${todo.completed ? "completed" : ""}`}>
      <div className="card-body">
        <div className="d-flex align-items-start">
          <div className="form-check me-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              id={`todo-${todo._id}`}
            />
            <label className="form-check-label" htmlFor={`todo-${todo._id}`}>
              <span className="todo-title fw-medium">{todo.title}</span>
            </label>
          </div>

          <div className="ms-auto d-flex gap-1">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleEdit}
              title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
              title="Delete">
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        {todo.description && (
          <p className="text-muted mb-0 mt-2 small">{todo.description}</p>
        )}

        <div className="text-muted small mt-2">
          <i className="bi bi-clock me-1"></i>
          {new Date(todo.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
