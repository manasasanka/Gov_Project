
'use strict'

var express = require('express'),
    bodyParser= require('body-parser'),
    url = require('url'),
    mysql=require('mysql'),
    app = express();	//express object instantiated

//Serve static files
//app.use(express.static('app'));


//Parse application/json
app.use(bodyParser.json())	//bodyParser has build in middlewares thata interpret urls, json, etc! 	//json is a key-value pairs, a 'hash' in curly braces!
app.use(express.static("public"))

var conn;
var pg = require('pg');
pg.defaults.ssl = true;
//pg.connect
//app.get('/db', function (request, response) {
	var str = "postgres://yzimshomxoavkr:cbWI1Z7M-vXcSxMg0aZPcK6zsA@ec2-54-225-103-29.compute-1.amazonaws.com:5432/d5015hg2jnkb1i"
    var connectionString = "pg://yzimshomxoavkr:cbWI1Z7M-vXcSxMg0aZPcK6zsA@ec2-54-225-103-29.compute-1.amazonaws.com/d5015hg2jnkb1i"
    pg.connect(connectionString, function(err,client,done){//process.env.str, function(err, client, done) {
    	if (err) {
    		console.log(err);
    	}
  		conn = client
    /*client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    //});*/
  //});
})



/*var conn = mysql.createConnection({	//create connection to database ritevote on the cpanel host
		host: 'datapuffgirls.web.engr.illinois.edu',
		user: 'datapuff_manasa',
		password: 'database',
		database: 'datapuff_ritevote'
})

conn.connect(function(err) {
	if (err) {
		console.log("Error connecting to database");
		//process.exit();
	}
}); */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use allows middlewares to be used (ie. get, post, add, etc are all middlewares. using use() allows u to use a different custom middleware)
//global to the web server part, kind of like an app
			//create route like request, response   
		/*app.use(function(rq, res, next))	
			try { 
				req.body= JSON.parse (req.body)}
			catch (e) {

			}
			next()	//goes to next middlware
		}
		app.use(function(...) {
			var start = new Data()
			next()
		})
	*/

//Perform queries using sql	


//Post route for inserting a politician to the database
app.post('/insertPoliticalRep', function(req, res) {
	console.log("is doing something")
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "INSERT INTO politicalrepresentative (name, state, termbegin, termend, partyaffiliation, housename) VALUES (?,?,?,?,?,?)";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = 
	[body.polname,		//CHANGE THE NAME OF THIS VAR!!!
	body.state,
	body.termBegin,
	body.termEnd,
	body.partyAffiliation,
	body.houseName
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not insert data to database"
			})
		}
		res.send({
			success:true
		})
	})
	//console.log('Body: ', req.body)
	//res.send(req.body)	//send info to server
})

//delete a politcical rep query
app.post('/deletePoliticalRep', function(req,res){
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "DELETE FROM politicalrepresentative WHERE name = ? AND state = ?";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = 
	[body.polname, body.state
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		res.send({
			success:true
		})
	})
})



//search for a politcical rep entry
app.post('/searchPoliticalRepbyState', function(req,res){
	console.log("here in search")
	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT * FROM politicalrepresentative WHERE state = ?";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})


//search for all bills sponsored by a legislator
app.post('/search/billByLegislator', function(req,res){

	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT legislation.title, legislation.link, legislation.topic FROM legislation, sponsors WHERE sponsors.name = ? AND sponsors.title = legislation.title";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.polname ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//search for all the committees served on by your state
app.post('/search/committeeByState', function(req,res){

	var body = req.body
	//console.log('Body: ', body)
	var stmt = "SELECT DISTINCT committee.committeename, committee.housename FROM belongs, committee, politicalrepresentative WHERE politicalrepresentative.state = ? AND politicalrepresentative.name = belongs.name AND committee.committeename = belongs.committeename";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		//console.log("THE OBJECT IS: " + result.rows[0].committeename)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//search for a list of bills based on state
app.post('/search/billByState', function(req,res){

	var body = req.body
	console.log('Body: ', body)
	var stmt = "SELECT legislation.title, legislation.link, legislation.topic FROM legislation, sponsors WHERE sponsors.state = ? AND sponsors.title = legislation.title";	//put values into database table, can also hardcode (firstname,lastname.....)
	var inserts = [ body.state ]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not delete data from database"
			})
		}
		console.log(result)
		var ret = JSON.stringify(result);
		res.send(ret);
			//{success:true
		//})
	})
})

//update query
app.post('/updatePoliticalRep', function(req, res) {
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();
	var stmt = "UPDATE politicalrepresentative SET name = ?, state = ?, termbegin = ?, termend = ?, partyaffiliation = ?, housename = ? WHERE name = ?";
	var inserts = 
	[body.polname,		
	body.state,
	body.termBegin,
	body.termEnd,
	body.partyAffiliation,
	body.houseName,
	body.polname
	]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not udpate data in database"
			})
		}
		res.send({
			success:true
		})
	})
})



//app.get('/', function(req,res) {
//	res.render('shuffle/index');
//})
var port = process.env.PORT || 8080;
//create basic express server
app.listen(port, function () {
	console.log('Listening on localhost/')
})




//user inputs up to 5 candidates to compare
//do calculations for candidate similarity analysis statistics
app.post('/candidateComparison', function(req, res) {
	var body = req.body
	console.log('Body: ', body)
	//conn.connect();

	//will contain how many bills were sponsored by each candidate in regards to each of these topics
	//these topics are used to consider similarity between candidates
	var numabortionsponsored = 0
	var numabortionsponsored2 = 0

	var numdeathpenalty = 0
	var numdeathpenalty2 = 0

	var numguncontrol = 0 
	var numguncontrol2 = 0 

	var nummarijuana = 0
	var nummarijuana2 = 0

	var numaffordablecare=0
	var numaffordablecare2=0

	
	//find number of bills sponsored by each legislator about abortion
	var stmt = "SELECT COUNT(*) AS numabortions FROM sponsors,legislation WHERE (sponsors.name = ? ) AND sponsors.title=legislation.title AND legislation.topic='Abortion'";
	var inserts = 
	[body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {

		//connection.end();
		if (err){
			console.error("Error: ", err)
			return res.send({
				error:true,
				mesg:"Could not query data in database for statistical analysis"
			})
		}
		numabortionsponsored = result.rows[0].numAbortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM sponsors,legislation WHERE (sponsors.name = ?) AND sponsors.title=legislation.title AND legislation.topic='Abortion'";
	var inserts = 
	[body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numabortionsponsored2 = result.rows[0].numabortions2;
	})

	//find number of bills sponsored by each legislator about affordable care
	var stmt = "SELECT COUNT(*) AS numabortions FROM sponsors,legislation WHERE (sponsors.name = ? ) AND sponsors.title=legislation.title AND legislation.topic='Affordable Care'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numaffordablecare = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM sponsors,legislation WHERE (sponsors.name = ?) AND sponsors.title=legislation.title AND legislation.topic='Affordable Care'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numaffordablecare2 = result.rows[0].numabortions2;
	})

	//find number of bills sponsored by each legislator about gun control
	var stmt = "SELECT COUNT(*) AS numabortions FROM sponsors,legislation WHERE (sponsors.name = ? ) AND sponsors.title=legislation.title AND legislation.topic='Gun Control'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numguncontrol = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM sponsors,legislation WHERE (sponsors.name = ?) AND sponsors.title=legislation.title AND legislation.topic='Gun Control'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numguncontrol2 = result.rows[0].numabortions2;
	})

	//find number of bills sponsored by each legislator about Marijuana
	var stmt = "SELECT COUNT(*) AS numabortions FROM sponsors,legislation WHERE (sponsors.name = ? ) AND sponsors.title=legislation.title AND legislation.topic='Marijuana'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		nummarijuana = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM sponsors,legislation WHERE (sponsors.name = ?) AND sponsors.title=legislation.title AND legislation.topic='Marijuana'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		nummarijuana2 = result.rows[0].numabortions2;
	})

	//find number of bills sponsored by each legislator about death penalty
	var stmt = "SELECT COUNT(*) AS numabortions FROM sponsors,legislation WHERE (sponsors.name = ? ) AND sponsors.title=legislation.title AND legislation.topic='Death Penalty'";
	var inserts = [body.polname1]
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numdeathpenalty = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM sponsors,legislation WHERE (sponsors.name = ?) AND sponsors.title=legislation.title AND legislation.topic='Death Penalty'";
	var inserts = [body.polname2]
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numdeathpenalty2 = result.rows[0].numabortions2;
		//package data to return
		var returndata = {"numabort1": numabortionsponsored, "numabort2": numabortionsponsored2, "numaffcare1": numaffordablecare, "numaffcare2": numaffordablecare2, "nummarijuana1": nummarijuana, "nummarijuana2": nummarijuana2, "numgun1": numguncontrol, "numgun2": numguncontrol2, "numdeath1": numdeathpenalty, "numdeath2": numdeathpenalty2};
		res.send(returndata);
	})
}) 


app.post('/dataviz', function(req,res) {
	console.log("YAASS")
	var numaff=0
	var numabort=0
	var numdeath =0
	var nummarijuana=0
	var numgun=0
	var totalaff=0
    var totalabort=0
    var totaldeath =0
    var totalmarijuana=0
    var totalgun=0  
    var numdemo = 0
    var numrepub =0
    var numindep=0

	//find number of bills for each topic that have been enacted
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Abortion' AND legislation.status='Enacted '";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numabort = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Affordable Care' AND legislation.status='Enacted '";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numaff = result.rows[0].numabortions; 
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Death Penalty' AND legislation.status='Enacted '";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numdeath = result.rows[0].numabortions;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Marijuana' AND legislation.status='Enacted '";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		nummarijuana = result.rows[0].numabortions;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Gun Control' AND legislation.status='Enacted '";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numgun = result.rows[0].numabortions;
		//var returndata = {"numabort": numabort, "numaff": numaff, "numgun": numgun, "numdeath": numdeath, "nummarijuana": nummarijuana};
		//res.send(returndata);
	})

	//get TOTAL bills enacted
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Abortion'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalabort = result.rows[0].numabortions;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions2 FROM legislation WHERE legislation.topic='Affordable Care'";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		totalaff = result.rows[0].numabortions2;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Death Penalty'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totaldeath = result.rows[0].numabortions;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Marijuana'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalmarijuana = result.rows[0].numabortions;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM legislation WHERE legislation.topic='Gun Control' ";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		totalgun = result.rows[0].numabortions;
	})

	//get political reps by party
	var stmt = "SELECT COUNT(*) AS numrepublican FROM politicalrepresentative WHERE politicalrepresentative.partyaffiliation='Republican'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numrepub = result.rows[0].numrepublican;
	})
	var stmt2 = "SELECT COUNT(*) AS numabortions FROM politicalrepresentative WHERE politicalrepresentative.partyaffiliation='Democrat'";
	var inserts = []
	var stmt2 = mysql.format(stmt2, inserts)
	conn.query(stmt2, function(err, result) {
		numdemo = result.rows[0].numabortions;
	})
	var stmt = "SELECT COUNT(*) AS numabortions FROM politicalrepresentative WHERE politicalrepresentative.partyaffiliation='Independent'";
	var inserts = []
	var stmt = mysql.format(stmt, inserts)
	conn.query(stmt, function(err, result) {
		numindep = result.rows[0].numabortions;
		var returndata = {"numrepub":numrepub,"numdemo":numdemo,"numindep":numindep, "numabort": numabort, "numaff": numaff, "numgun": numgun, "numdeath": numdeath, "nummarijuana": nummarijuana, "totalabort": totalabort, "totalaff": totalaff, "totalgun": totalgun, "totalmarijuana":totalmarijuana,"totaldeath":totaldeath}
		res.send(returndata);
	}) 
})


//post for the quiz (still need to complete what we are doing with quiz information)
app.post('/quiz', function(req, res) {
	var body = req.body
	console.log('Body: ', body)
	//quiz values out of five
	//numbillsab = body.abortion
	//numbillsaff = body.affordable
	//numbillsgun = body.gun
	//numbillsmari = body.marijuana
	//numbillsdeath = body.death

	var retdata = [{"abort":"http://www.cnn.com/2016/04/06/politics/mike-pence-indiana-abortion-bill/index.html", "aff":"http://inhealth.cnn.com/living-life-to-the-fullest-with-copd/what-the-affordable-care-act-means-to-copd-patients", "gunc":"http://www.cnn.com/2016/02/18/politics/bernie-sanders-gun-control/index.html", "weed":"http://www.cnn.com/2016/04/20/health/trinidad-colorado-small-town-marijuana/", "deathP":"http://www.cnn.com/2016/04/06/opinions/death-penalty-numbers-shetty/index.html"}, { "abort": "http://www.cnn.com/2016/04/06/opinions/northern-ireland-abortion/index.html", "aff": "http://www.cnn.com/2016/02/05/health/voters-guide-affordable-care-act/index.html", "gunc":"http://www.cnn.com/videos/politics/2016/01/18/democratic-debate-bernie-sanders-gun-control-sot-vstan-orig-bb.nbc-news", "weed":"http://www.cnn.com/2016/04/20/politics/politicians-marijuana-talk-about-getting-high-420/index.html", "deathp":"http://www.cnn.com/2016/04/06/opinions/death-penalty-numbers-shetty/index.html"},{"abort":"http://www.cnn.com/2016/04/05/health/northern-ireland-abortion-sentence/index.html", "aff":"http://www.cnn.com/2015/06/24/opinions/walker-affordable-care-act-decision/index.html", "gunc":"http://www.cnn.com/2016/01/12/politics/state-of-the-union-gun-control-empty-seat/index.html", "weed":"http://www.cnn.com/2015/04/20/politics/being-moody-pot-laws/index.html", "deathp":"http://www.cnn.com/2015/11/12/us/california-death-penalty/index.html"},{"abort":"http://www.cnn.com/2016/04/04/politics/2016-election-delegate-race-weekend-wrap/index.html", "aff":"http://inhealth.cnn.com/getting-schizophrenia-under-control/how-the-affordable-care-act-affects-people-with-mental-illness", "gunc":"http://www.cnn.com/2016/01/08/opinions/robbins-obama-gun-town-hall/index.html", "weed":"http://www.cnn.com/2015/04/16/opinions/medical-marijuana-revolution-sanjay-gupta/index.html", "deathp":"http://www.cnn.com/2015/11/01/politics/jeb-bush-death-penalty/index.html"},{"abort":"http://www.cnn.com/videos/politics/2016/04/04/donald-trump-flip-flop-abortion-wisconsin-pkg-newday-carroll.cnn", "aff":"http://www.cnn.com/2014/03/18/politics/obamacare-sign-up/index.html", "gunc":"http://money.cnn.com/2016/01/07/news/gun-control-high-capacity-states/index.html", "weed":"http://www.cnn.com/2015/02/26/politics/obama-dc-pot/index.html", "deathp":"http://www.cnn.com/2015/10/23/politics/obama-death-penalty-deeply-troubling/index.html"}, {"abort":"http://www.cnn.com/2016/04/03/politics/john-kasich-abortion-punishment/index.html", "aff":"http://www.cnn.com/2012/07/19/us/embed-america-arkansas-health-care/index.html", "gunc":"http://money.cnn.com/2016/01/07/news/gun-control-bullets/index.html", "weed":"http://www.cnn.com/2014/07/10/opinion/sabet-colorado-marijuana/index.html", "deathp":"http://www.cnn.com/2015/10/07/politics/supreme-court-death-penalty-kansas/index.html"}, {"abort":"http://www.cnn.com/videos/tv/2016/04/03/snl-weekend-update-trump-abortion-seg.cnn", "aff":"http://ireport.cnn.com/docs/DOC-807789", "gunc":"http://www.cnn.com/2016/01/07/opinions/taya-kyle-gun-control/index.html", "weed":"http://www.cnn.com/videos/politics/2016/02/04/nh-democratic-town-hall-hillary-clinton-marijuana-drug-addiction-09.cnn/video/playlists/iowa-democratic-town-hall/", "deathp":"http://www.cnn.com/2015/10/01/opinions/callan-cevallos-death-penalty-debate/index.html"}, {"abort": "http://www.cnn.com/videos/politics/2016/04/03/sotu-tapper-panel-trump-abortion-comments-anger-both-sides.cnn", "aff":"http://www.cnn.com/2012/01/13/justice/scotus-affordable-care/index.html", "gunc":"http://www.cnn.com/2016/01/07/politics/gun-control-america-history-timeline/index.html", "weed":"http://www.cnn.com/2015/12/16/politics/supreme-court-marijuana-colorado-obama/index.html", "deathp":"http://www.cnn.com/2015/09/25/opinions/callan-pope-supreme-court-death-penalty/index.html"},{"abort":"http://www.cnn.com/2016/04/02/politics/donald-trump-abortion-cbs-face-the-nation/index.html", "aff":"http://www.cnn.com/2016/04/19/health/end-of-life-care-discussions/index.html", "gunc":"http://www.cnn.com/2016/01/05/politics/obama-executive-action-gun-control/index.html", "weed":"http://money.cnn.com/2016/02/03/smallbusiness/women-in-marijuana-industry/index.html", "deathp":"http://www.cnn.com/2015/07/17/opinions/holloway-death-penalty-future/index.html"},{"abort":"http://www.cnn.com/videos/politics/2016/04/02/donald-trump-abortion-new-comments-ac360.cnn", "aff":"http://www.cnn.com/videos/politics/2013/11/06/atw-johns-sebelius-obamacare-documents.cnn", "gunc":"http://www.cnn.com/2016/01/05/politics/obama-gun-control-evolution-executive-order/index.html", "weed":"http://www.cnn.com/2015/11/06/us/colorado-marijuana-college-scholarship/index.html", "deathp":"http://www.cnn.com/2015/06/29/politics/scotus-death-penalty-justice-scalia-breyer/index.html"}]

	res.send(retdata)
    
	//computer how many articles we will display of each


	//code for what we are doing with the information
	//console.log('Body: ', req.body)
	//res.send(req.body)	//send info to server
})
