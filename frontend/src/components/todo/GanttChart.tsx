import { Todo } from '../../types';

interface GanttChartProps {
  todos: Todo[];
}

export const GanttChart = ({ todos }: GanttChartProps) => {
  const tasksWithDates = todos.filter(t => t.startDate || t.dueDate);
  if (!tasksWithDates.length) return <div className="text-center py-4 text-gray-400">日付が設定されたタスクがありません</div>;

  const allDates = tasksWithDates.flatMap(t => [t.startDate, t.dueDate].filter(Boolean) as string[]);
  const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const getPosition = (date: string) => {
    const d = new Date(date);
    return ((d.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
  };

  const getWidth = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24) + 1) / totalDays * 100, 2);
  };

  const sorted = [...tasksWithDates].sort((a, b) => (a.startDate || a.dueDate || '').localeCompare(b.startDate || b.dueDate || ''));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex text-xs text-gray-500 mb-2 border-b pb-2">
          <div className="w-40 flex-shrink-0">タスク</div>
          <div className="flex-1 flex justify-between px-2">
            <span>{minDate.toLocaleDateString('ja-JP')}</span>
            <span>{maxDate.toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
        {sorted.map(todo => {
          const start = todo.startDate || todo.dueDate!;
          const end = todo.dueDate || todo.startDate!;
          const left = getPosition(start);
          const width = getWidth(start, end);
          return (
            <div key={todo.id} className="flex items-center h-8 mb-1">
              <div className="w-40 flex-shrink-0 text-sm truncate pr-2" title={todo.title}>
                {todo.parentId && <span className="text-gray-400 mr-1">└</span>}
                {todo.completed ? <span className="line-through text-gray-400">{todo.title}</span> : todo.title}
              </div>
              <div className="flex-1 relative h-6 bg-gray-100 rounded">
                <div
                  className={`absolute h-full rounded ${todo.completed ? 'bg-green-400' : 'bg-blue-400'}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${start} → ${end}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
