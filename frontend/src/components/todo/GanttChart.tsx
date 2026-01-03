import { useState, useMemo } from 'react';
import { Todo, Priority } from '../../types';

interface GanttChartProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

export const GanttChart = ({ todos, onToggle }: GanttChartProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  
  const tasksWithDates = useMemo(() => 
    todos.filter(t => t.startDate || t.dueDate).sort((a, b) => 
      (a.startDate || a.dueDate || '').localeCompare(b.startDate || b.dueDate || '')
    ), [todos]);

  const { minDate, days } = useMemo(() => {
    if (!tasksWithDates.length) return { minDate: new Date(), maxDate: new Date(), days: [] };
    const allDates = tasksWithDates.flatMap(t => [t.startDate, t.dueDate].filter(Boolean) as string[]);
    const min = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
    const max = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
    // 前後に余裕を持たせる
    min.setDate(min.getDate() - 2);
    max.setDate(max.getDate() + 2);
    const dayList: Date[] = [];
    for (let d = new Date(min); d <= max; d.setDate(d.getDate() + 1)) {
      dayList.push(new Date(d));
    }
    return { minDate: min, maxDate: max, days: dayList };
  }, [tasksWithDates]);

  if (!tasksWithDates.length) {
    return <div className="text-center py-8 text-gray-400 bg-white rounded-lg border">日付が設定されたタスクがありません</div>;
  }

  const totalDays = days.length;
  const dayWidth = viewMode === 'week' ? 40 : 24;

  const getPosition = (date: string) => {
    const d = new Date(date);
    const diff = Math.floor((d.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff * dayWidth;
  };

  const getWidth = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(diff * dayWidth, dayWidth);
  };

  const getPriorityColor = (priority: Priority, completed: boolean) => {
    if (completed) return 'bg-gray-300';
    switch (priority) {
      case Priority.HIGH: return 'bg-red-400';
      case Priority.MEDIUM: return 'bg-blue-400';
      case Priority.LOW: return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const months = useMemo(() => {
    const m: { month: string; days: number; start: number }[] = [];
    let currentMonth = '';
    let count = 0;
    let start = 0;
    days.forEach((d, i) => {
      const monthKey = `${d.getFullYear()}/${d.getMonth() + 1}`;
      if (monthKey !== currentMonth) {
        if (currentMonth) m.push({ month: currentMonth, days: count, start });
        currentMonth = monthKey;
        count = 1;
        start = i;
      } else {
        count++;
      }
    });
    if (currentMonth) m.push({ month: currentMonth, days: count, start });
    return m;
  }, [days]);

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const isToday = (d: Date) => {
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <h3 className="font-bold text-gray-700">📊 ガントチャート</h3>
        <div className="flex gap-1">
          <button onClick={() => setViewMode('month')} className={`px-3 py-1 text-sm rounded ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>月</button>
          <button onClick={() => setViewMode('week')} className={`px-3 py-1 text-sm rounded ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>週</button>
        </div>
      </div>

      <div className="flex">
        {/* タスク名列 */}
        <div className="w-48 flex-shrink-0 border-r bg-gray-50">
          <div className="h-12 border-b flex items-center px-3 font-bold text-sm text-gray-600">タスク</div>
          {tasksWithDates.map(todo => (
            <div key={todo.id} className="h-10 border-b flex items-center px-3 hover:bg-gray-100">
              <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} className="mr-2 cursor-pointer" />
              <span className={`text-sm truncate ${todo.completed ? 'line-through text-gray-400' : ''}`} title={todo.title}>
                {todo.parentId && <span className="text-gray-400 mr-1">└</span>}
                {todo.title}
              </span>
            </div>
          ))}
        </div>

        {/* タイムライン */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: totalDays * dayWidth }}>
            {/* 月ヘッダー */}
            <div className="h-6 flex border-b bg-gray-100">
              {months.map((m, i) => (
                <div key={i} style={{ width: m.days * dayWidth }} className="text-xs font-bold text-gray-600 px-1 border-r flex items-center">
                  {m.month}
                </div>
              ))}
            </div>
            {/* 日付ヘッダー */}
            <div className="h-6 flex border-b">
              {days.map((d, i) => (
                <div key={i} style={{ width: dayWidth }} className={`text-xs text-center border-r ${isWeekend(d) ? 'bg-red-50 text-red-400' : 'text-gray-500'} ${isToday(d) ? 'bg-blue-100 font-bold' : ''}`}>
                  {d.getDate()}
                </div>
              ))}
            </div>
            {/* バー */}
            {tasksWithDates.map(todo => {
              const start = todo.startDate || todo.dueDate!;
              const end = todo.dueDate || todo.startDate!;
              const left = getPosition(start);
              const width = getWidth(start, end);
              return (
                <div key={todo.id} className="h-10 relative border-b" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent ' + (dayWidth - 1) + 'px, #f3f4f6 ' + (dayWidth - 1) + 'px, #f3f4f6 ' + dayWidth + 'px)' }}>
                  {/* 週末背景 */}
                  {days.map((d, i) => isWeekend(d) && (
                    <div key={i} className="absolute top-0 bottom-0 bg-red-50 opacity-50" style={{ left: i * dayWidth, width: dayWidth }} />
                  ))}
                  {/* 今日線 */}
                  {days.map((d, i) => isToday(d) && (
                    <div key={`today-${i}`} className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10" style={{ left: i * dayWidth + dayWidth / 2 }} />
                  ))}
                  {/* タスクバー */}
                  <div
                    className={`absolute top-2 h-6 rounded-full shadow-sm cursor-pointer hover:opacity-80 transition flex items-center justify-center ${getPriorityColor(todo.priority, todo.completed)}`}
                    style={{ left, width }}
                    title={`${todo.title}\n${start} → ${end}`}
                  >
                    {width > 60 && <span className="text-xs text-white font-medium truncate px-2">{todo.title}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
