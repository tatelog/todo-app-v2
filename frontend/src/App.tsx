import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/todo/TodoForm';
import { TodoList } from './components/todo/TodoList';
import { GanttChart } from './components/todo/GanttChart';
import { Priority } from './types';
import './index.css';

function App() {
  const { todos, loading, error, createTodo, deleteTodo, toggleCompleted } = useTodos();
  const [view, setView] = useState<'list' | 'gantt'>('list');

  const handleCreateTodo = async (todoData: { title: string; description?: string; priority: Priority; startDate?: string; dueDate?: string; parentId?: string }) => {
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
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-sm text-gray-500">株式会社建ログ - 社内業務効率化ツール</p>
        {totalCount > 0 && (
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-600">{completedCount}/{totalCount} 完了</span>
            </div>
          </div>
        )}
      </header>

      <main>
        <TodoForm todos={todos} onSubmit={handleCreateTodo} />

        <div className="flex gap-2 mb-4">
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-md font-medium transition ${view === 'list' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
            📋 リスト
          </button>
          <button onClick={() => setView('gantt')} className={`px-4 py-2 rounded-md font-medium transition ${view === 'gantt' ? 'bg-blue-500 text-white shadow' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
            📊 ガントチャート
          </button>
        </div>

        {loading && <div className="text-center py-5 text-blue-500">読み込み中...</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">エラー: {error}</div>}
        {!loading && view === 'list' && <TodoList todos={todos} onToggle={toggleCompleted} onDelete={handleDelete} />}
        {!loading && view === 'gantt' && <GanttChart todos={todos} onToggle={toggleCompleted} />}
      </main>
    </div>
  );
}

export default App;
