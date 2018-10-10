'use strict';

const router = require('express').Router(),
      Buyer = require('../../models/Buyer'),
      perPage = 20;

router.get('/', (req, res) => {
  if (req.query.apiKey == 1) {
    let page = req.query.page || 1;

    Buyer
      .find({})
      .select('buyerId')
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec( async (err, buyers) => {
        if (err) {
          console.error('ERROR FINDING ALL THE Buyers');
          req.flash('error', 'An Error occurred while locating the products.');
          res.status(500).send({ message: 'Server Error!' });
        } else {
          // Get the total number of Products that can be retrieved
          await Buyer
          .find({})
          .count()
          .exec((err, count) => {
          if (err) {
            console.error('ERROR COUNTING ITEMS IN all_products.js\n\n' + err);
            return res.status(500).send({ message: 'Server Error!' });
          } else {
            // console.log(products);
            res.send({ buyers: buyers, pages: Math.ceil(count / perPage),
              currentPage: page });
          }
        });
        }
      });
    } else {
      res.status(403).send({ message: 'You\'re not supposed to be here. Go Away!' });
    }

});

router.get('/:id', (req, res) => {
  if (req.query.apiKey == 1) {
    Buyer
      .findById(req.params.id)
      .then( (buyer) => {
        if (!buyer) {
          res.status(404).send({ message: 'No such buyer' });
        } else {
          Purchase
            .findAll({buyer: buyer.id})
            .populate('buyer')
            .populate('product')
            .exec((err, purchase) => {
              if (err) {
                console.error('\n\nERROR RETRIEVING PURCHASES \n\n' + err);
                res.status(500).send({ message: 'Server Error!' });
              } else if (!purchases) {
                res.send({ buyer: buyer, purchases: 0 });
              } else {
                res.send({ buyer: buyer, purchases: purchase });
              }
            });
          res.send({})
        }
      })
      .catch((err) => {
        console.error('\n\nError retrieving user id in api/buyer.js\n\n' + err);
        res.status(500).send({ message: 'Server Error!' });
      });
    } else {
      res.status(403).send({ message: 'You\'re not supposed to be here. Go Away!' });
    }
});


router.post('/', (req, res) => {
  console.log(req.query.apiKey);
  if (req.query.apiKey == 1) {
    const buyer = Buyer();

    buyer.save((err) => {
      if (err) {
        console.error('\n\n error creating new buyer! \n\n' + err);
        res.status(500).send({ message: 'Error creating Buyer Try Again!' });
      } else {
        res.send({ buyer: buyer.buyerId });
      }
    })
  } else {
    res.status(403).send({ message: 'You\'re not supposed to be here. Go Away!' });
  }
});

module.exports = router;
