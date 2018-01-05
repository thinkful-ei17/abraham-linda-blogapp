'use strict';

const express = require('express');
const router = express.Router();

//var data = require('../db/dummy-data');

// const { DATABASE } = require('../config');
// const knex = require('knex')(DATABASE);

const { DATABASE } = require ('../config.js');
const knex = require('knex')(DATABASE);

// clear the console before each run
process.stdout.write('\x1Bc');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res) => {
  knex.select('id','title', 'content')
    .from('stories')
    .then(results => res.json(results));
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res) => {
  knex.first('id','title', 'content')
    .from('stories')
    .where('stories.id', req.params.id)
    .then(results => res.json(results));
});

// /* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res) => {

  const requiredFields = ['title', 'content'];

  for(let i = 0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const errorMessage = `You're missing a required field: ${field}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  }

  const {title, content} = req.body; //foreach on body; get...etc.

  const newItem = {
    title,
    content
  };

  knex
    .insert(newItem)
    .into('stories')
    .returning(['id','title','content'])
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results[0]);
    });
});
  
// /* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const requiredFields = ['title', 'content'];

  for(let i = 0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const errorMessage = `You're missing a required field: ${field}`;
      console.error(errorMessage);
      res.status(400).end();
      return;
    }
  }

  const {title, content} = req.body;

  knex('stories')
    .update({title: title, content: content})
    .where('stories.id', req.params.id)
    .returning(['id','title','content'])
    .then(results => {
      res.json(results[0]);
      
    });

});

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  knex
    .del()
    .from('stories')
    .where('id',req.params.id)
    .then(res.status(204).end());
});


module.exports = router;