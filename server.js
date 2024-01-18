/* Require modules
--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");


/* Require the db connection, models, and seed data
--------------------------------------------------------------- */
const db = require('./models');

/* Require the routes in the controllers folder
--------------------------------------------------------------- */
const teamsCtrl = require('./controllers/teams')

/* Create the Express app
--------------------------------------------------------------- */
const app = express();


/* Configure the app to refresh the browser when nodemon restarts
--------------------------------------------------------------- */
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    // wait for nodemon to fully restart before refreshing the page
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});


/* Configure the app (app.set)
--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Middleware (app.use)
--------------------------------------------------------------- */
app.use(express.static('public'))
app.use(connectLiveReload());
// Body parser: used for POST/PUT/PATCH routes: 
// this will take incoming strings from the body that are URL encoded and parse them 
// into an object that can be accessed in the request parameter as a property called body (req.body).
app.use(express.urlencoded({ extended: true }));



/* Mount routes
--------------------------------------------------------------- */
app.get('/', function (req, res) {
    db.Teams.find({ isFeatured: true })
        .then(teams => {
            res.render('home', {
                teams: teams
            })
        })
});


// When a GET request is sent to `/seed`, the team collection is seeded
app.get(`/seed`, function( req, res) {
    // Remove any existing teams
    db.Teams.deleteMany({})
        .then(removedTeams => {
            console.log(`Removed ${removedTeams.deletedCount} teams`)
            // Seed the teams collection with the seed data
            db.Teams.insertMany(db.seedTeams)
                .then(addedTeams => {
                    console.log(`Added ${addedTeams.length} teams to the database`)
                    res.json(addedTeams)
                })
    })
})

// This tells our app to look at the `controllers/teams.js` file 
// to handle all routes that begin with `localhost:3000/teams`
app.use('/teams', teamsCtrl)

/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
