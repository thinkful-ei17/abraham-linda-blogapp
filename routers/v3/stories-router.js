'use strict';

const express = require('express');
const router = express.Router();
const Treeize = require('treeize');

const { DATABASE } = require('../../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res) => {
  if (req.query.search) {
    knex.select('stories.id', 'title', 'content', 'username', 'author_id', 'tags.name')
      .from('stories')
      .innerJoin('authors', 'stories.author_id','authors.id')
      .leftJoin('stories_tags', 'stories_tags.stories_id','stories.id')
      .innerJoin('tags', 'tags.id', 'stories_tags.tags_id')
      .where('title','like',`%${req.query.search}%`)
      .returning(['stories.id','title','content','username','author_id','name'])
      .then(results => {
        const r = new Treeize();
        r.grow(results);
        res.json(r.getData());
      });
  }

  knex.select('stories.id', 'title', 'content', 'username', 'author_id', 'tags.name as tags:name')
    .from('stories')
    .innerJoin('authors', 'stories.author_id','authors.id')
    .leftJoin('stories_tags','stories_tags.stories_id', 'stories.id')
    .innerJoin('tags','tags.id','stories_tags.tags_id')
    .returning(['stories.id','title','content','username', 'author_id', 'name'])
    .then(results => {
      const r = new Treeize();
      r.grow(results);
      res.json(r.getData());
    });

});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  knex.select('stories.id', 'title', 'content', 'username', 'author_id', 'tags.name as tags:name')
  .from('stories')
  .innerJoin('authors','stories.author_id', 'authors.id')
  .leftJoin('stories_tags','stories_tags.stories_id','stories.id')
  .innerJoin('tags','tags.id','stories_tags.tags_id')
  .where('stories.id', id)
  // .returning(['stories.id','title','content','username', 'author_id', 'name'])
  .then(results => {
    const r = new Treeize();
    r.grow(results);
    res.json(r.getData()[0]);
  });
});


/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res) => {
  const requiredFields = ['title','content', 'author_id'];
  for(let i=0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing required field ${field} in request body`;
      return res.status(400).send(message);
    }
  }

  const {title, content, author_id} = req.body;
  const newItem = {
    title,
    content,
    author_id
  };

  knex.insert(newItem)
  .into('stories')
  .returning(['stories.id','title','content', 'author_id'])
  .then(([results]) => {
    res.location(`${req.originalUrl}/${results.id}`).status(201).json(results);
  }
  );
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const {author_id, title, content} = req.body;
  const id = Number(req.params.id);
  knex('stories')
  .update({title, content, author_id})
  .where('stories.id', id)
  .returning(['stories.id'])
  .then(([r]) => {
    knex.select('stories.id','title','content','author_id','username')
    .from('stories')
    .innerJoin('authors','stories.author_id', 'authors.id')
    .where('stories.id',r.id)
    .returning(['id','title','content','author_id','username'])
    .then(([results]) => {
      res.json(results);
    });
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