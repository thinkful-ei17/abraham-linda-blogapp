'use strict';

const express = require('express');
const router = express.Router();

const {DATABASE} = require('../../config');
const knex = require('knex')(DATABASE);

router.get('/tags', (req, res) =>{
  knex.select('id', 'name')
  .from('tags')
  .then(results => res.json(results));
});

module.exports = router;