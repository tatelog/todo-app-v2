import { useState } from 'react';
import { Priority } from '../../types';

interface TodoFormProps {
  onSubmit: (todo: { title: string; description?: string; priority: Priority; dueDate?: string }) => void;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined
    });

    // フォームリセット
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクを入力..."
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明（オプション）"
          style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '60px' }}
          rows={2}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value={Priority.LOW}>低</option>
            <option value={Priority.MEDIUM}>中</option>
            <option value={Priority.HIGH}>高</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>期限日</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        追加
      </button>
    </form>
  );
};
