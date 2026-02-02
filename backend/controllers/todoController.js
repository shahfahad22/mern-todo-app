const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");

const getTodos = asyncHandler(async (req, res) => {
  const { filter } = req.query;
  let query = { user: req.user.id };

  // Apply filter if provided
  if (filter === "completed") {
    query.completed = true;
  } else if (filter === "pending") {
    query.completed = false;
  }

  const todos = await Todo.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: todos.length,
    data: todos,
  });
});

const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const todo = await Todo.create({
    title,
    description,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: todo,
  });
});

const updateTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: todo,
  });
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await todo.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  todo.completed = !todo.completed;
  await todo.save();

  res.json({
    success: true,
    data: todo,
  });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
};
