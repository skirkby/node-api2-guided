const express = require('express');
const router = express.Router();

const Dog = require('./dogs-model.js');

// DOGS ENDPOINTS
router.get('/', (req, res) => {
    Dog.find()
        .then(dogs => {
            res.status(200).json(dogs);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the dogs',
            });
        });
});

module.exports = router;