import { Todo, Priority } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return '#EF4444';
      case Priority.MEDIUM: return '#F59E0B';
      case Priority.LOW: return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return '高';
      case Priority.MEDIUM: return '中';
      case Priority.LOW: return '低';
      default: return priority;
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        borderLeft: `4px solid ${getPriorityColor(todo.priority)}`
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer' }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#9CA3AF' : '#111827'
            }}
          >
            {todo.title}
          </span>
          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: getPriorityColor(todo.priority),
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {getPriorityLabel(todo.priority)}
          </span>
        </div>

        {todo.description && (
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0' }}>
            {todo.description}
          </p>
        )}

        {todo.dueDate && (
          <p
            style={{
              fontSize: '12px',
              color: isOverdue ? '#EF4444' : '#6B7280',
              fontWeight: isOverdue ? 'bold' : 'normal',
              margin: '4px 0'
            }}
          >
            期限: {todo.dueDate} {isOverdue && '⚠️ 期限超過'}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#EF4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          marginLeft: '12px'
        }}
      >
        削除
      </button>
    </div>
  );
};
