//import dependencies

//Express Framework used for handling Http Request
const express = require('express');


//Create an instance of the farmework
const app = express();

//DBMS Mysql
const mysql = require('mysql2');

//Cross origin resource sharing
const cors = require('cors');

//Environment Variable
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();


//Connecting to database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    insecureAuth: true,


});

//Check for Connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
       
        return; // Stop execution if there's an error
        
    }
    console.log("Connected Successfully with Id:", db.threadId);
});




//GET METHOD GOES HERE
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//GET METHOD EXAMPLE
app.get('/data', (req, res) => {

    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data')
        }
        else {
            //Display Patients Records to browser
            res.render('data', {results:results});
        }
    });
});


app.get('/data/search', (req, res) => {
    const firstName = req.query.firstName;
    if (!firstName) {
      res.status(400).send('First name is required');
      return;
    }
    const query = 'SELECT * FROM patients WHERE first_name LIKE ?';
    db.query(query, ['%' + firstName + '%'], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error Retrieving Data');
      } else {
        res.render('data', { results: results });
      }
    });
  });
  
  


app.get('/providers', (req, res) => {

    db.query('SELECT * FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data')
        }
        else {
            //Display Patients Records to browser
            res.render('providers', {results:results});
        }
    });
});


app.get('/providers/search', (req, res) => {
    const speciality = req.query.speciality;
    if (!speciality) {
      res.status(400).send('Speciality is required');
      return;
    }
    const query = 'SELECT * FROM providers WHERE provider_specialty LIKE ?';
    db.query(query, ['%' + speciality + '%'], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error Retrieving Data');
      } else {
        res.render('providers', { results: results });
      }
    });
  });












//Start Server
app.listen(process.env.PORT, () => {

    console.log(`Servrer is Listening on ${process.env.PORT}`);

    console.log("Sending message to the browser");
    app.get('/', (req, res) => {
        res.send("Server Started Successfully")
    })
})


//TO TEST THIS GO TO TERMINAL AND Type: node server.js