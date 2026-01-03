import { useState } from 'react';
import { Priority, Todo } from '../../types';

interface TodoFormProps {
  todos: Todo[];
  onSubmit: (todo: { title: string; description?: string; priority: Priority; startDate?: string; dueDate?: string; parentId?: string }) => void;
}

export const TodoForm = ({ todos, onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority, startDate: startDate || undefined, dueDate: dueDate || undefined, parentId: parentId || undefined });
    setTitle(''); setDescription(''); setPriority(Priority.MEDIUM); setStartDate(''); setDueDate(''); setParentId('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タスクを入力..." className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="説明（オプション）" className="w-full p-3 mb-3 border border-gray-300 rounded-md" rows={2} />
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block mb-1 text-xs font-bold text-gray-600">優先度</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value={Priority.LOW}>低</option>
            <option value={Priority.MEDIUM}>中</option>
            <option value={Priority.HIGH}>高</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-bold text-gray-600">親タスク</label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">なし</option>
            {todos.filter(t => !t.parentId).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-xs font-bold text-gray-600">開始日</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block mb-1 text-xs font-bold text-gray-600">期限日</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
        </div>
      </div>
      <button type="submit" className="w-full p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition">追加</button>
    </form>
  );
};
