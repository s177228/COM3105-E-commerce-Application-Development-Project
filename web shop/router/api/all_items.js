var express = require('express');
var router = express.Router();

// define the home page route
router.get('/items/all', function(req, res) {
    res.send({
        body: [
          { id: 1, name: "apple", price: 10, desc: "this is an apple." },
          { id: 2, name: "banana", price: 20, desc: "this is a banana." },
          { id: 3, name: "cat", price: 253.5, desc: "this is a cat." },
          { id: 4, name: "dog", price: 130.5, desc: "this is a dog." },
          { id: 5, name: "egg", price: 14, desc: "this is an egg." }
        ],
      });
});

module.exports = router;