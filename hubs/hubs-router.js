const express = require('express');
const router = express.Router();
const Hubs = require('./hubs-model.js');

router.post('/:owner/:repo/git/refs', (req, res) => {
    res.status(200).send('yay! you did it!')
});

router.get('/', (req, res) => {
    console.log(req.query);
    Hubs.find(req.query)
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});

router.get('/:id', (req, res) => {
    Hubs.findById(req.params.id)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub);
            } else {
                res.status(404).json({ message: 'Hub not found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hub',
            });
        });
});

router.post('/', (req, res) => {
    Hubs.add(req.body)
        .then(hub => {
            res.status(201).json(hub);
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error adding the hub',
            });
        });
});

router.delete('/:id', (req, res) => {
    Hubs.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The hub has been nuked' });
            } else {
                res.status(404).json({ message: 'The hub could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the hub',
            });
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    Hubs.update(req.params.id, changes)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub);
            } else {
                res.status(404).json({ message: 'The hub could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error updating the hub',
            });
        });
});

router.get('/:id/messages', async (req, res) => {
    try {
        const messages = await Hubs.findHubMessages(req.params.id);

        if (messages.length > 0) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ message: 'No messages for this hub' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the messages for this hub',
        });
    }
});

// create a way to create messages for a hub
router.post('/:id/messages', async (req, res) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    try {
        const message = await Hubs.addMessage(messageInfo);
        res.status(201).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
})


module.exports = router;