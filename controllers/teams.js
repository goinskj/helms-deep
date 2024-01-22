/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/teams`
---------------------------------------------------------------------------------------
*/

/* Require modules
--------------------------------------------------------------- */
const express = require('express')
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')


/* Require the states static data
--------------------------------------------------------------- */
const path = require('path');
const statesData = require(path.join(__dirname, '../public/data/states'));


/* Routes
--------------------------------------------------------------- */

// New Route (GET/Read): This route renders a form 
// which the user will fill out to POST (create) a new location
router.get('/new', (req, res) => {
    res.render('new-team')
})


// Show Route (GET/Read): Will display an individual team document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Team.findById(req.params.id)
        .then(team => {
            res.render('team-details', {
                team: team
            })
        })
        .catch(() => res.render('404'))
})

// Show Route (GET/Read): Will display an individual team document and allow to edit it
// using the URL parameter (which is the document _id)
router.get('/:id/edit', function (req, res) {
    db.Team.findById(req.params.id)
        .then(team => {
            res.render('edit-team', {
                team: team,
                usStates: statesData.usStates,
                canadaProvinces: statesData.canadaProvinces
            })
        })
        .catch(() => res.render('404'))
})

// Index Route (GET/Read): Will display all teams
router.get('/', function (req, res) {
    db.Team.find({})
        .then(teams => {
            res.render('team-index', {
                teams: teams
            })
        })
        .catch(() => res.render('404'))
})

// Create Route (POST/Create): This route receives the POST request sent from the new route,
// creates a new team document using the form data, 
// and redirects the user to the new team's show page
router.post('/', (req, res) => {
    db.Team.create(req.body)
        .then(() => {
            res.redirect('/teams')
        })
        .catch(() => res.render('404'))
})

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route, 
// edits the specified team document using the form data,
// and redirects the user back to the show page for the updated location.
router.put('/:id', (req, res) => {
    db.Team.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .then(() => res.redirect(`/teams/${req.params.id}`))
        .catch((err) => {
            console.error('Error updating team:', err);
            res.render('404')
        })
})

// Destroy Route (DELETE/Delete): This route deletes a team document 
// using the URL parameter (which will always be the team document's ID)
router.delete('/:id', (req, res) => {
    db.Team.findByIdAndDelete(req.params.id)
        .then(team => res.send('You\'ve deleted team ' + team._id))
        .catch(() => res.render('404'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router
