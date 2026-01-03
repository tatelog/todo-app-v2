const fs = require('fs');
const DATA_FILE = '/tmp/todos.json';
const defaultData = {
  todos: [],
  categories: [
    { id: 'cat-1', name: '仕事', color: '#3B82F6', createdAt: new Date().toISOString() },
    { id: 'cat-2', name: '個人', color: '#10B981', createdAt: new Date().toISOString() },
    { id: 'cat-3', name: '緊急', color: '#EF4444', createdAt: new Date().toISOString() }
  ],
  tags: [{ id: 'tag-1', name: '重要', createdAt: new Date().toISOString() }, { id: 'tag-2', name: '会議', createdAt: new Date().toISOString() }]
};

const readData = () => { if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData)); return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); };
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const data = readData();
  const { id } = req.query;

  if (req.method === 'GET') return res.json(id ? data.todos.find(t => t.id === id) : data.todos);
  if (req.method === 'POST') {
    const todo = { id: Date.now().toString(), title: req.body.title, description: req.body.description || '', completed: false, priority: req.body.priority || 'medium', startDate: req.body.startDate || null, dueDate: req.body.dueDate || null, categoryId: req.body.categoryId || null, tags: req.body.tags || [], parentId: req.body.parentId || null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    data.todos.push(todo);
    writeData(data);
    return res.status(201).json(todo);
  }
  if (req.method === 'PATCH' && id) {
    const idx = data.todos.findIndex(t => t.id === id);
    if (idx >= 0) { data.todos[idx] = { ...data.todos[idx], ...req.body, updatedAt: new Date().toISOString() }; writeData(data); return res.json(data.todos[idx]); }
    return res.status(404).json({ error: 'Not found' });
  }
  if (req.method === 'DELETE' && id) { data.todos = data.todos.filter(t => t.id !== id); writeData(data); return res.status(204).end(); }
  res.status(404).json({ error: 'Not found' });
};
