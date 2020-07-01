const express = require('express');

const app = express();

app.use(express.json());

let arrayDesafio = [];
let count = 0;

function contador(req, res, next) {
  console.log(++count);
  next();
}

function verficaExiste(req,res, next) {
  const { id } = req.params;
  const projeto = arrayDesafio.find(el => el.id === id)

  if (!projeto) {
    return res.status(400).json({ error: "Projeto não existe" })
  }
  next();
}

app.use(contador);

app.post('/projects', (req, res) => {
  const {id, title} = req.body;
  
  if (!id || !title) {
    return res.status(400).json({ error: "Parametros incorretos"})
  }
  
  arrayDesafio.push({
    id,
    title,
    tasks: []
  })  

  return res.json(arrayDesafio);
})

app.get('/projects', (req, res) => {
  return res.json(arrayDesafio);
})

app.put('/projects/:id', verficaExiste, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  if (!title) {
    return res.status(400).json({ error: "Parametros invalidos" })
  }

  arrayDesafio = arrayDesafio.map(el => {
    if (el.id === id) {
      el.title = title
    }
    return el;
  })
  
  return res.json(arrayDesafio);
})

app.delete('/projects/:id', verficaExiste, (req, res) => {
  const { id } = req.params;

  arrayDesafio = arrayDesafio.map(el => {
    if (el.id !== id) {
      return el;
    }
  }).filter(Boolean);

  return res.json(arrayDesafio);
  
})

app.post('/projects/:id/tasks', verficaExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Parametros invalidos" })
  }
  arrayDesafio = arrayDesafio.map(el => {
    if (el.id === id) {
      el.tasks.push(title);
    }
    return el;
  });

  return res.json(arrayDesafio);
})

app.listen(3333);