import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/todo/TodoForm';
import { TodoList } from './components/todo/TodoList';
import { Priority } from './types';

function App() {
  const { todos, loading, error, createTodo, deleteTodo, toggleCompleted } = useTodos();

  const handleCreateTodo = async (todoData: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
  }) => {
    try {
      await createTodo(todoData);
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('このタスクを削除しますか？')) {
      try {
        await deleteTodo(id);
      } catch (err) {
        console.error('Failed to delete todo:', err);
      }
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Todo App
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          株式会社建ログ - 社内業務効率化ツール
        </p>
        {totalCount > 0 && (
          <p style={{ fontSize: '14px', color: '#3B82F6', marginTop: '8px', fontWeight: 'bold' }}>
            完了: {completedCount} / {totalCount} ({Math.round((completedCount / totalCount) * 100)}%)
          </p>
        )}
      </header>

      <main>
        <TodoForm onSubmit={handleCreateTodo} />

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#3B82F6' }}>
            読み込み中...
          </div>
        )}

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', marginBottom: '16px' }}>
            エラー: {error}
          </div>
        )}

        {!loading && (
          <TodoList
            todos={todos}
            onToggle={toggleCompleted}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;
