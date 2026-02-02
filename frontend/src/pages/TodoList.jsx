/**
 * Todo List Page
 * Displays and manages todos with filtering, sorting, and pagination
 */

import React, { useState, useEffect } from "react";
import { useTodo } from "../context/TodoContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert,
  Pagination,
  Modal,
  ListGroup,
} from "react-bootstrap";
import { format } from "date-fns";
import TodoForm from "../components/TodoForm";

/**
 * Priority badge color mapping
 */
const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "secondary";
  }
};

/**
 * TodoList Component
 * Main page for viewing and managing todos
 */
const TodoList = () => {
  const { user } = useAuth();
  const {
    todos,
    loading,
    error,
    pagination,
    filters,
    stats,
    fetchTodos,
    fetchStats,
    deleteTodo,
    toggleTodo,
    applyFilters,
    clearFilters,
    setPagination,
  } = useTodo();

  // State for modals and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Fetch todos and stats on component mount
  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    applyFilters(newFilters);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        handleFilterChange("search", searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(page);
  };

  // Handle todo deletion
  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (todoToDelete) {
      await deleteTodo(todoToDelete._id);
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  // Handle todo toggle
  const handleToggleTodo = async (id) => {
    await toggleTodo(id);
  };

  if (loading && todos.length === 0) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading todos...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="h2">My Todos</h1>
          <p className="text-muted">Manage your tasks efficiently</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Todo
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      {stats && (
        <Row className="mb-4">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-primary">{stats.total}</h3>
                <p className="text-muted mb-0">Total Todos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-success">{stats.completed}</h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-warning">{stats.pending}</h3>
                <p className="text-muted mb-0">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h3 className="text-info">{stats.completionRate}%</h3>
                <p className="text-muted mb-0">Completion Rate</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}>
                    Clear
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.completed || ""}
                  onChange={(e) =>
                    handleFilterChange("completed", e.target.value || undefined)
                  }>
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={filters.priority || ""}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value || undefined)
                  }>
                  <option value="">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value)
                  }>
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => {}}>
          {error}
        </Alert>
      )}

      {/* Todos List */}
      {todos.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <h4 className="text-muted">No todos found</h4>
            <p className="text-muted">Create your first todo to get started</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Todo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row>
            {todos.map((todo) => (
              <Col key={todo._id} lg={4} md={6} className="mb-4">
                <Card
                  className={`h-100 border-0 shadow-sm ${todo.completed ? "border-success" : ""}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Badge
                          bg={getPriorityColor(todo.priority)}
                          className="me-2">
                          {todo.priority}
                        </Badge>
                        <Badge bg={todo.completed ? "success" : "warning"}>
                          {todo.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="dropdown">
                        <Button
                          variant="light"
                          size="sm"
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown">
                          ⋮
                        </Button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => handleToggleTodo(todo._id)}>
                              {todo.completed
                                ? "Mark as Pending"
                                : "Mark as Complete"}
                            </button>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/todos/${todo._id}`}>
                              View Details
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDeleteClick(todo)}>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Card.Title className="mb-3">
                      <Link
                        to={`/todos/${todo._id}`}
                        className="text-decoration-none text-dark">
                        {todo.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-muted mb-3">
                      {todo.description || "No description provided"}
                    </Card.Text>
                    {todo.dueDate && (
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          Due: {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                          {todo.isOverdue && !todo.completed && (
                            <Badge bg="danger" className="ms-2">
                              Overdue
                            </Badge>
                          )}
                        </small>
                      </div>
                    )}
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="mb-3">
                        {todo.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="me-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Created:{" "}
                        {format(new Date(todo.createdAt), "MMM dd, yyyy")}
                      </small>
                      <Form.Check
                        type="switch"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo._id)}
                        label=""
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                {[...Array(pagination.pages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === pagination.page}
                    onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Create Todo Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TodoForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchTodos();
              fetchStats();
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{todoToDelete?.title}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TodoList;
