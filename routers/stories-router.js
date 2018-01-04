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
  knex.select('id','title', 'content')
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
    .return(['id','title','content'])
    .then(results => {
      res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
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
    .then(results => {
      res.json(results);
    });

});

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.findIndex((obj) => obj.id === id);
  data.splice(index, 1);
  res.status(204).end();
});

module.exports = router;

// ORIGINAL TEXT RETAINED FOR REVIEW PURPOSES - START
// /* ========== GET/READ ALL ITEMS ========== */
// router.get('/stories', (req, res) => {
//   if (req.query.search) {
//     const filtered = data.filter((obj) => obj.title.includes(req.query.search));
//     res.json(filtered);
//   } else {
//     res.json(data);
//   }
// });

// /* ========== GET/READ SINGLE ITEMS ========== */
// router.get('/stories/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const item = data.find((obj) => obj.id === id);
//   res.json(item);
// });

// /* ========== POST/CREATE ITEM ========== */
// router.post('/stories', (req, res) => {
//   const {title, content} = req.body;
  
//   /***** Never Trust Users! *****/  
//   const newItem = {
//     id: data.nextVal++,
//     title: title,
//     content: content
//   };
//   data.push(newItem);

//   res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(newItem);
// });

// /* ========== PUT/UPDATE A SINGLE ITEM ========== */
// router.put('/stories/:id', (req, res) => {
//   const {title, content} = req.body;
  
//   /***** Never Trust Users! *****/
  
//   const id = Number(req.params.id);
//   const item = data.find((obj) => obj.id === id);
//   Object.assign(item, {title, content});
//   res.json(item);
// });

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
// router.delete('/stories/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const index = data.findIndex((obj) => obj.id === id);
//   data.splice(index, 1);
//   res.status(204).end();
// });
// ORIGINAL TEXT RETAINED FOR REVIEW PURPOSES - STOP

// knex.select('title', 'content')
// .from('stories')
// .then(results => results.forEach(row => {
//   const hydrated = {};
//   if (!(row.id in hydrated)) {
//     hydrated[row.id] = {
//       id: row.id,
//       title: row.title,
//       content: row.content,