var express = require('express');
var router = express.Router();
var createError = require('http-errors');

const todos = [{ id: 1, name: 'Do Something', completed: false }];
let _id = 1;
let todo2 = [
  { id: _id++, name: 'buy milk', completed: false },
  { id: _id++, name: 'read a book', completed: false }
];

const findById = (id) => todo2.find(t => t.id === Number(id));
const isString = (v) => typeof v === 'string' && v.trim().length > 0;


// GET /todos?completed=true|false&q=term&page=1&pageSize=10
router.get('/todos', (req, res) => {
  let list = [...todo2];

  if ('completed' in req.query) {
    const flag = ['true','1','yes','on'].includes(String(req.query.completed).toLowerCase());
    list = list.filter(t => t.completed === flag);
  }

  if (req.query.q) {
    const q = String(req.query.q).toLowerCase();
    list = list.filter(t => t.name.toLowerCase().includes(q));
  }

  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || list.length || 10);
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize);

  res.json({
    total: list.length,
    page,
    pageSize,
    items
  });
});

// /todos/
router.get('/', function (req, res, next) {
    res.json(todos);
});

router.get('/:id', function (req, res, next) {
    const foundTodo = todos.find(todo => todo.id === Number(req.params.id));
    if(!foundTodo){
        return next(createError(404, 'Not Found'));
    }
    res.json(foundTodo);
});

router.post('/', function (req, res, next) {
    const {body} = req;
    if(typeof body.name !== 'string'){
        return next(createError(422, 'Validation Error'));
    };
    const newTodo = {
        id: todos.length +1,
        name: body.name,
        completed: false
    };
    todos.push(newTodo);

    res.status(201).json(newTodo);
});

router.delete('/todos/:id', (req, res) => {
  const before = todos.length;
  todos = todos.filter(t => t.id !== Number(req.params.id));
  if (todos.length === before) return res.status(404).end();
  res.status(204).end();
});

module.exports = router;
