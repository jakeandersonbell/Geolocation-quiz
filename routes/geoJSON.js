// This file sets up all the functions to serve JSON, obtained from the database, at specific URLs so they can be
// used in the app

// set up the database connection
var express = require('express');
var pg = require('pg');
var geoJSON = require('express').Router();
var fs = require('fs');

var configtext = "" + fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

// now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
    var split = configarray[i].split(':');
    config[split[0].trim()] = split[1].trim();
}
var pool = new pg.Pool(config);

// The following get functions are similar in that they all make data available at the URL by building up a
// query string, sometimes taking in parameters via the URL, and querying specified databases

// Serve the quiz questions data from the database, using port ID as a parameter
// Use a get request
geoJSON.get('/getQuizQuestions/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        // If error log it
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        // get the param from the URL and set it to a variable
        var param1 = req.params.portid;
        console.log(param1);
        // Set up the column names that we want to access
        var colnames = "id, question_title, question_text, answer_1,";
        colnames = colnames + "answer_2, answer_3, answer_4, port_id, correct_answer";
        console.log("colnames are " + colnames);

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
        querystring += "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
        querystring += "row_to_json((SELECT l FROM (SELECT " + colnames + " ) As l      )) As properties";
        querystring += "   FROM public.quizquestions As lg ";
        querystring += " where port_id = $1 limit 100  ) As f ";
        console.log(querystring);

        // run the query with the port ID parameter
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);

        });
    });
});

// Serve the users answers, depending on port ID
geoJSON.get('/getQuizAnswers/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var param1 = req.params.portid;
        console.log(param1);
        var colnames = "id, port_id, question_id, answer_selected,";
        colnames = colnames + "correct_answer, timestamp";
        console.log("colnames are " + colnames);

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
        querystring += "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.user_location)::json As geometry, ";
        querystring += "row_to_json((SELECT l FROM (SELECT " + colnames + " ) As l      )) As properties";
        querystring += "   FROM public.quizanswers As lg ";
        querystring += " where port_id = $1 limit 100  ) As f ";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);

        });
    });
});

// Get the number of correctly answered questions for a particular user
geoJSON.get('/getCorrectAnswers/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var param1 = req.params.portid;
        console.log(param1);

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select array_to_json (array_agg(c)) from (SELECT COUNT(*) AS num_questions from " +
            "public.quizanswers where (answer_selected = correct_answer) and port_id = $1) c;";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);

        });
    });
});

// Get the users rank out of all users
geoJSON.get('/getUserRank/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var param1 = req.params.portid;
        console.log(param1);

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select array_to_json (array_agg(hh)) from (select c.rank from " +
            "(SELECT b.port_id, rank()over (order by num_questions desc) as rank from " +
            "(select COUNT(*) AS num_questions, port_id from public.quizanswers where answer_selected = correct_answer" +
            " group by port_id) b) c where c.port_id = $1) hh";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get the most difficult questions
geoJSON.get('/topFive', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select array_to_json (array_agg(c)) from (select rank() over (order by num_questions desc)" +
            " as rank , port_id from (select COUNT(*) AS num_questions, port_id from public.quizanswers where " +
            "answer_selected = correct_answer group by port_id) b limit 5) c";
        console.log(querystring);

        // run the query
        client.query(querystring, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get users daily participation
geoJSON.get('/myDailyParticipation/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var param1 = req.params.portid;

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select array_to_json (array_agg(c)) from (select * from public.participation_rates where " +
            "port_id = $1) c";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get all user daily participation
geoJSON.get('/dailyParticipation', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select  array_to_json (array_agg(c)) from (select day, sum(questions_answered) as " +
            "questions_answered, sum(questions_correct) as questions_correct from public.participation_rates " +
            "group by day) c";
        console.log(querystring);

        // run the query
        client.query(querystring, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get questions added in the past week
geoJSON.get('/weekQuestions', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM " +
            "(SELECT 'Feature' As type, ST_AsGeoJSON(lg.location)::json As geometry, row_to_json((SELECT l FROM " +
            "(SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) " +
            "As l)) As properties FROM public.quizquestions  As lg where timestamp > NOW()::DATE-EXTRACT(DOW FROM NOW())" +
            "::INTEGER-7  limit 100  ) As f ";
        console.log(querystring);

        // run the query
        client.query(querystring, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get questions closest to the user, take in lat long parameters for user position
geoJSON.get('/nearQuestions/:lat/:lng', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var lat = req.params.lat;
        var lng = req.params.lng;

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM " +
            "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, row_to_json((SELECT l FROM " +
            "(SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, " +
            "correct_answer) As l)) As properties FROM (select c.* from public.quizquestions c inner join (select id, " +
            "st_distance(a.location, st_geomfromtext('POINT(";
        // querystring += userPos.getLatLng()['lat'].toString() + ", " + userPos.getLatLng()['lng'].toString();
        querystring += lat + " " + lng;
        querystring += ")',4326)) as distance from public.quizquestions a " +
            "order by distance asc limit 5) b on c.id = b.id ) as lg) As f";
        console.log(querystring);

        // run the query
        client.query(querystring, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get the questions most commonly answered incorrectly by all users
geoJSON.get('/hardQuestions', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "select array_to_json (array_agg(d)) from (select c.* from public.quizquestions c inner join " +
            "(select count(*) as incorrectanswers, question_id from public.quizanswers where " +
            "answer_selected <> correct_answer group by question_id order by incorrectanswers desc limit 5) b " +
            "on b.question_id = c.id) d";
        console.log(querystring);

        // run the query
        client.query(querystring, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get the 5 questions last answered by the user
geoJSON.get('/lastAnswered/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        let param1 = req.params.portid;

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM " +
            "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, " +
            "row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, " +
            "answer_4, port_id, correct_answer, answer_correct) As l )) As properties FROM " +
            "(select a.*, b.answer_correct from public.quizquestions a inner join (select question_id, " +
            "answer_selected=correct_answer as answer_correct from public.quizanswers where port_id = $1 " +
            "order by timestamp desc limit 5) b on a.id = b.question_id) as lg) As f";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// Get questions the user has not answered correctly
geoJSON.get('/notAnswered/:portid', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        let param1 = req.params.portid;

        // note that query needs to be a single string with no line breaks so built it up bit by bit
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM " +
            "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, row_to_json((SELECT l FROM " +
            "(SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, " +
            "correct_answer) As l)) As properties FROM (select * from public.quizquestions where id in (select " +
            "question_id from public.quizanswers where port_id = $1 and answer_selected <> correct_answer union all " +
            "select id from public.quizquestions where id not in (select question_id from public.quizanswers) " +
            "and port_id = $2)) as lg) As f";
        console.log(querystring);

        // run the query
        client.query(querystring, [param1, param1], function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});


// make sure that the last line of the code us the export function
// so that the route can be published to the dataAPI.js server
module.exports = geoJSON;