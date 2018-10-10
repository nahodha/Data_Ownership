'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('base_routes/home', {title: 'DATA.ONE'});
});

module.exports = router;
