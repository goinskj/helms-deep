/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/plays`
---------------------------------------------------------------------------------------
*/


/* Require modules
--------------------------------------------------------------- */
const express = require('express')
// Router allows us to handle routing outisde of server.js
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')


/* Routes
--------------------------------------------------------------- */
// Index Route (All Plays): 
// GET localhost:3000/plays/
router.get('/', (req, res) => {
	db.Team.find({}, { plays: true, _id: false })
        .then(teams => {
		    // format query results to appear in one array, 
		    // rather than an array of objects containing arrays 
	    	const flatList = []
	    	for (let team of teams) {
	        	flatList.push(...team.plays)
	    	}
	    	res.render('plays-index', {
                plays: flatList
            })
		})
        .catch(()=> res.render('404'))
});

// New Route: GET localhost:3000/plays/new
router.get('/new/:teamId', (req, res) => {
    res.render('new-play')
})

// Show Route: GET localhost:3000/plays/:id
router.get('/:id', (req, res) => {
    db.Team.findOne(
        { 'plays._id': req.params.id },
        { 'plays.$': true, _id: false }
    )
        .then(team => {
	        // format query results to appear in one object, 
	        // rather than an object containing an array of one object
            res.render('play-details', {
                play: team.plays[0],
                team: team
            })
        })
        .catch(() => res.render('404'))
});

// Create Route: POST localhost:3000/plays/
router.post('/create/:teamId', (req, res) => {
    db.Team.findByIdAndUpdate(
        req.params.teamId,
        { $push: { plays: req.body } },
        { new: true }
    )
        .then(team => res.json(team))
});

// Destroy Route: DELETE localhost:3000/plays/:id
router.delete('/:id', (req, res) => {
    db.Pet.findOneAndUpdate(
        { 'plays._id': req.params.id },
        { $pull: { plays: { _id: req.params.id } } },
        { new: true }
    )
        .then(team => res.json(team))
});


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router
