import { useState } from "react";
import { useTodos } from "../../context/TodoContext";

const TodoForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const { createTodo } = useTodos();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const result = await createTodo({
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    if (result.success) {
      setFormData({
        title: "",
        description: "",
      });
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Add New Todo</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              maxLength="200"
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              rows="2"
              maxLength="500"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="bi bi-plus-circle me-1"></i>
            Add Todo
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
