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
})

// Show Route: GET localhost:3000/plays/:id/edit
router.get('/:id/edit', (req, res) => {
    db.Team.findOne(
        { 'plays._id': req.params.id },
        { 'plays.$': true, _id: false }
    )
        .then(team => {
	        // format query results to appear in one object, 
	        // rather than an object containing an array of one object
            res.render('edit-play', {
                play: team.plays[0],
                team: team
            })
        })
        .catch(() => res.render('404'))
})

// New Route: GET localhost:3000/plays/new
router.get('/new/:teamId', (req, res) => {
    db.Team.findById(req.params.teamId)
        .then(team => {
            res.render('new-play', {
                team: team
            })
        })
        .catch(() => res.render('404'))
})

// Create Route: POST localhost:3000/plays/
router.post('/create/:teamId', (req, res) => {
    db.Team.findByIdAndUpdate(
        req.params.teamId,
        { $push: { plays: req.body } },
        { new: true }
    )
        .then(team => res.redirect('/plays'))
})

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route, 
// edits the specified team document using the form data,
// and redirects the user back to the show page for the updated location.
router.put('/:id', (req, res) => {
    const playId = req.params.id
    db.Team.findOneAndUpdate(
        { 'plays._id': playId },
        { $set: { 'plays.$': req.body } },
        { new: true }
    )
    .then(updatedTeam => {
        // Check if updatedTeam is null
        if (!updatedTeam || !updatedTeam.plays) {
            console.error('Team not found or plays array is missing')
            return res.render('404')
        }

        const updatedPlay = updatedTeam.plays.find(play => play._id.toString() === playId)

        // Log relevant information for debugging
        console.log('playId:', playId)
        console.log('updatedTeam:', updatedTeam)
        console.log('updatedPlay:', updatedPlay)

        // Check if updatedPlay is undefined
        if (!updatedPlay) {
            console.error('Play not found in updatedTeam.plays array')
            return res.render('404')
        }

        res.redirect(`/plays/${updatedPlay._id}`)
    })
    .catch((err) => {
        console.error('Error updating play:', err)
        res.render('404')
    })
})


// Destroy Route: DELETE localhost:3000/plays/:id
router.delete('/:id', (req, res) => {
    db.Team.findOneAndUpdate(
        { 'plays._id': req.params.id },
        { $pull: { plays: { _id: req.params.id } } },
        { new: true }
    )
        .then(team => res.send('You\'ve deleted PLAY ' + req.params.id))
        .catch(() => res.render('404'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router
