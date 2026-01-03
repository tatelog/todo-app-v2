#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_FILE = path.join(__dirname, 'data/todos.json');
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const tools = {
  list_todos: () => ({ todos: readData().todos }),
  add_todo: ({ title, parentId, startDate, dueDate, priority }) => {
    const data = readData();
    const todo = { id: Date.now().toString(), title, description: '', completed: false, priority: priority || 'medium', startDate, dueDate, tags: [], parentId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.todos.push(todo);
    writeData(data);
    return todo;
  },
  complete_todo: ({ id }) => {
    const data = readData();
    const todo = data.todos.find(t => t.id === id || t.id.endsWith(id));
    if (todo) { todo.completed = true; todo.updatedAt = new Date().toISOString(); writeData(data); return todo; }
    return { error: 'not found' };
  },
  delete_todo: ({ id }) => {
    const data = readData();
    const idx = data.todos.findIndex(t => t.id === id || t.id.endsWith(id));
    if (idx >= 0) { const [removed] = data.todos.splice(idx, 1); writeData(data); return removed; }
    return { error: 'not found' };
  },
  get_gantt: () => {
    const { todos } = readData();
    return { tasks: todos.filter(t => t.startDate || t.dueDate).map(t => ({ id: t.id, title: t.title, startDate: t.startDate, dueDate: t.dueDate, completed: t.completed, parentId: t.parentId })) };
  }
};

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');

const handle = (msg) => {
  const { id, method, params } = msg;
  if (method === 'initialize') return send({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'todo-mcp', version: '1.0.0' } } });
  if (method === 'tools/list') return send({ jsonrpc: '2.0', id, result: { tools: [
    { name: 'list_todos', description: 'List all todos with hierarchy', inputSchema: { type: 'object', properties: {} } },
    { name: 'add_todo', description: 'Add a new todo', inputSchema: { type: 'object', properties: { title: { type: 'string' }, parentId: { type: 'string' }, startDate: { type: 'string' }, dueDate: { type: 'string' }, priority: { type: 'string', enum: ['high', 'medium', 'low'] } }, required: ['title'] } },
    { name: 'complete_todo', description: 'Mark todo as complete', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { name: 'delete_todo', description: 'Delete a todo', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
    { name: 'get_gantt', description: 'Get tasks for gantt chart view', inputSchema: { type: 'object', properties: {} } }
  ] } });
  if (method === 'tools/call') {
    const fn = tools[params.name];
    const result = fn ? fn(params.arguments || {}) : { error: 'unknown tool' };
    return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] } });
  }
  if (method === 'notifications/initialized') return;
  send({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
};

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => { try { handle(JSON.parse(line)); } catch {} });
