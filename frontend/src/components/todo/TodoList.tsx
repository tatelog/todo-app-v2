import { Todo } from '../../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>タスクがありません</p>
        <p style={{ fontSize: '14px' }}>上のフォームから新しいタスクを追加してください</p>
      </div>
    );
  }

  // ソート: 未完了→完了、優先度高→低、作成日新→旧
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div style={{ marginTop: '20px' }}>
      {sortedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
