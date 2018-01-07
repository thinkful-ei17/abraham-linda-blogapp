'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res) => {
  if (req.query.search) {
    knex.select('title','content')
      .from('stories')
      .where('title','like',`%${req.query.search}%`)
      .then( results => {
        res.json(results);
      });
  }

  knex.select('id','title','content')
    .from('stories')
    .then( results => {
      res.json(results);
    });

});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  knex.first('id','title','content')
  .from('stories')
  .where('id', id)
  // .returning(['id','title','content'])
  .then(results => {
    res.json(results);
  });
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res) => {
  const requiredFields = ['title','content'];
  for(let i=0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing required field ${field} in request body`;
      return res.status(400).send(message);
    }
  }

  const {title, content} = req.body;
  const newItem = {
    title,
    content
  };

  knex.insert(newItem)
  .into('stories')
  .returning(['id','title','content'])
  .then(([results]) => {
    res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
  }
  );
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const {title, content} = req.body;
  const id = Number(req.params.id);
  knex('stories')
  .update({title: title, content: content})
  .where('id', id)
  .returning(['id','title','content'])
  .then(([results]) => {
    res.json(results);
  });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  knex
  .from('stories')
  .del()
  .where('id',id)
  .then(
    res.status(204).end()
  );
  });

module.exports = router;