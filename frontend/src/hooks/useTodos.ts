import { useState, useEffect } from 'react';
import { todoApi } from '../services/api';
import { Todo } from '../types';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todo: Partial<Todo>) => {
    try {
      const newTodo = await todoApi.create(todo);
      await fetchTodos(); // 再取得して確実に反映
      return newTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, todo: Partial<Todo>) => {
    try {
      const updatedTodo = await todoApi.update(id, todo);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
      return updatedTodo;
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
      throw err;
    }
  };

  const toggleCompleted = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  return { todos, loading, error, createTodo, updateTodo, deleteTodo, toggleCompleted, refetch: fetchTodos };
};
