import { useState } from 'react';
import { Todo } from '../../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

interface TodoNode extends Todo {
  children: TodoNode[];
}

const buildTree = (todos: Todo[], parentId?: string | null): TodoNode[] => {
  return todos
    .filter(t => (!t.parentId && !parentId) || t.parentId === parentId)
    .map(t => ({ ...t, children: buildTree(todos, t.id) }));
};

const TreeItem = ({ node, depth, onToggle, onDelete, collapsed, toggleCollapse }: { node: TodoNode; depth: number; onToggle: (id: string) => void; onDelete: (id: string) => void; collapsed: Set<string>; toggleCollapse: (id: string) => void }) => {
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.id);

  return (
    <div className="mb-1">
      <div className="flex items-center">
        {hasChildren ? (
          <button onClick={() => toggleCollapse(node.id)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded mr-1 flex-shrink-0">
            {isCollapsed ? '▶' : '▼'}
          </button>
        ) : (
          <div className="w-6 mr-1 flex-shrink-0" />
        )}
        <div className="flex-1">
          <TodoItem todo={node} onToggle={onToggle} onDelete={onDelete} />
        </div>
      </div>
      {!isCollapsed && hasChildren && (
        <div className="ml-6 pl-2 border-l-2 border-gray-200">
          {node.children.map(child => (
            <TreeItem key={child.id} node={child} depth={depth + 1} onToggle={onToggle} onDelete={onDelete} collapsed={collapsed} toggleCollapse={toggleCollapse} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-lg mb-2">タスクがありません</p>
        <p className="text-sm">上のフォームから新しいタスクを追加してください</p>
      </div>
    );
  }

  const tree = buildTree(todos);

  return (
    <div>
      {tree.map(node => (
        <TreeItem key={node.id} node={node} depth={0} onToggle={onToggle} onDelete={onDelete} collapsed={collapsed} toggleCollapse={toggleCollapse} />
      ))}
    </div>
  );
};
