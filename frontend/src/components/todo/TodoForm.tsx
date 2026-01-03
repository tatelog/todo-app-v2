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
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority, dueDate: dueDate || undefined });
    setTitle(''); setDescription(''); setPriority(Priority.MEDIUM); setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクを入力..."
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明（オプション）"
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={2}
      />
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block mb-1 text-xs font-bold text-gray-600">優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value={Priority.LOW}>低</option>
            <option value={Priority.MEDIUM}>中</option>
            <option value={Priority.HIGH}>高</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-xs font-bold text-gray-600">期限日</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button type="submit" className="w-full p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition">
        追加
      </button>
    </form>
  );
};
