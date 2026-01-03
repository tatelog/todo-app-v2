#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data/todos.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const [,, cmd, ...args] = process.argv;

const commands = {
  list: () => {
    const { todos } = readData();
    if (!todos.length) return console.log('タスクがありません');
    const tree = buildTree(todos);
    printTree(tree, 0);
  },
  add: () => {
    const title = args.filter(a => !a.startsWith('--')).join(' ');
    if (!title) return console.log('使用法: todo add <タイトル> [--parent=ID] [--start=YYYY-MM-DD] [--due=YYYY-MM-DD]');
    const data = readData();
    const parentId = args.find(a => a.startsWith('--parent='))?.split('=')[1];
    const startDate = args.find(a => a.startsWith('--start='))?.split('=')[1];
    const dueDate = args.find(a => a.startsWith('--due='))?.split('=')[1];
    const todo = { id: Date.now().toString(), title, description: '', completed: false, priority: 'medium', startDate, dueDate, tags: [], parentId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.todos.push(todo);
    writeData(data);
    console.log(`追加: ${title} (ID: ${todo.id.slice(-4)})`);
  },
  done: () => {
    const id = args[0];
    if (!id) return console.log('使用法: todo done <ID>');
    const data = readData();
    const todo = data.todos.find(t => t.id.endsWith(id));
    if (todo) { todo.completed = true; todo.updatedAt = new Date().toISOString(); writeData(data); console.log(`完了: ${todo.title}`); }
    else console.log('タスクが見つかりません');
  },
  delete: () => {
    const id = args[0];
    if (!id) return console.log('使用法: todo delete <ID>');
    const data = readData();
    const idx = data.todos.findIndex(t => t.id.endsWith(id));
    if (idx >= 0) { const [removed] = data.todos.splice(idx, 1); writeData(data); console.log(`削除: ${removed.title}`); }
    else console.log('タスクが見つかりません');
  },
  gantt: () => {
    const { todos } = readData();
    const withDates = todos.filter(t => t.startDate || t.dueDate);
    if (!withDates.length) return console.log('日付が設定されたタスクがありません');
    const sorted = withDates.sort((a, b) => (a.startDate || a.dueDate).localeCompare(b.startDate || b.dueDate));
    console.log('\n📊 ガントチャート\n');
    sorted.forEach(t => {
      const start = t.startDate || t.dueDate;
      const end = t.dueDate || t.startDate;
      const status = t.completed ? '✓' : '○';
      console.log(`${status} [${start}] → [${end}] ${t.title}`);
    });
  },
  help: () => console.log(`コマンド:
  list                    - タスク一覧（ツリー表示）
  add <タイトル>          - タスク追加
    --parent=ID           - 親タスク指定
    --start=YYYY-MM-DD    - 開始日
    --due=YYYY-MM-DD      - 期限日
  done <ID>               - 完了にする
  delete <ID>             - 削除
  gantt                   - ガントチャート表示`)
};

function buildTree(todos, parentId = undefined) {
  return todos.filter(t => t.parentId === parentId).map(t => ({ ...t, children: buildTree(todos, t.id) }));
}

function printTree(nodes, depth) {
  nodes.forEach(n => {
    const indent = '  '.repeat(depth);
    const status = n.completed ? '✓' : '○';
    const due = n.dueDate ? ` (期限: ${n.dueDate})` : '';
    console.log(`${indent}${status} [${n.id.slice(-4)}] ${n.title}${due}`);
    if (n.children.length) printTree(n.children, depth + 1);
  });
}

(commands[cmd] || commands.help)();
