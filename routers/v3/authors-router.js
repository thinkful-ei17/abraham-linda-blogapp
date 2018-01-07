'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL AUTHORS ========== */
router.get('/authors', (req, res) =>{
  knex.select(knex.raw("id, username"))
  .from('authors')
  .then(results => {
    res.json(results);
  });
});


module.exports = router;