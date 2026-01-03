import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/todo/TodoForm';
import { TodoList } from './components/todo/TodoList';
import { Priority } from './types';
import './index.css';

function App() {
  const { todos, loading, error, createTodo, deleteTodo, toggleCompleted } = useTodos();

  const handleCreateTodo = async (todoData: { title: string; description?: string; priority: Priority; dueDate?: string }) => {
    try { await createTodo(todoData); } catch (err) { console.error('Failed to create todo:', err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('このタスクを削除しますか？')) {
      try { await deleteTodo(id); } catch (err) { console.error('Failed to delete todo:', err); }
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-sm text-gray-500">株式会社建ログ - 社内業務効率化ツール</p>
        {totalCount > 0 && (
          <p className="text-sm text-blue-500 font-bold mt-2">
            完了: {completedCount} / {totalCount} ({Math.round((completedCount / totalCount) * 100)}%)
          </p>
        )}
      </header>

      <main>
        <TodoForm onSubmit={handleCreateTodo} />
        {loading && <div className="text-center py-5 text-blue-500">読み込み中...</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">エラー: {error}</div>}
        {!loading && <TodoList todos={todos} onToggle={toggleCompleted} onDelete={handleDelete} />}
      </main>
    </div>
  );
}

export default App;
