import { Todo, Priority } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  [Priority.HIGH]: { color: 'bg-red-500', label: '高' },
  [Priority.MEDIUM]: { color: 'bg-yellow-500', label: '中' },
  [Priority.LOW]: { color: 'bg-green-500', label: '低' },
};

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const { color, label } = priorityConfig[todo.priority] || { color: 'bg-gray-500', label: todo.priority };
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
  const borderColor = todo.priority === Priority.HIGH ? 'border-l-red-500' : todo.priority === Priority.MEDIUM ? 'border-l-yellow-500' : 'border-l-green-500';

  return (
    <div className={`flex items-center p-3 bg-white border border-gray-200 rounded-lg border-l-4 ${borderColor}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 mr-3 cursor-pointer accent-blue-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {todo.title}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${color}`}>{label}</span>
        </div>
        {todo.description && <p className="text-xs text-gray-500">{todo.description}</p>}
        {todo.dueDate && (
          <p className={`text-xs ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
            期限: {todo.dueDate} {isOverdue && '⚠️ 期限超過'}
          </p>
        )}
      </div>
      <button onClick={() => onDelete(todo.id)} className="ml-3 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition">
        削除
      </button>
    </div>
  );
};
