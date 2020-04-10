var http = require("http");
var fs = require("fs");
var mysql = require("mysql");
var credentials = require("./credentials");
var qs = require("querystring");
var keys = ['bla boo bla'];
var Cookies = require("cookies");
var http = require('http');

http.createServer(function(req, res) {
  try {
    var path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
    if (path === "/users") {
      users(req, res);
    }
    else if (path === "/user_login") {
      userLogin(req, res);
		}
    else if (path === "/userinformation") {
      userinformation(req, res);
    }
    else if (path === "/userdailycalorieintake") {
      userdailycalorieintake(req, res);
    }
    else if (path === "/add_user") {
      addUser(req, res);
    }
    else if (path === "/add_meal") {
      addMeal(req, res);
    }
    else if (path === "/add_drink") {
      addDrink(req, res);
    }
    else if (path === "/add_new_user") {
      addNewUser(req, res);
    }
    else if (path === "/user_report") {
      userReport(req, res);
    }
    else {
      serveStaticFile(res, path);
    }
  }
  catch (e) {
    try {
      console.log("ERROR(500): " + e);
      res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("500 Internal Server error");
    }
    catch (e) {
      console.log("ERROR(^^^): " + e);
    }
  }
}).listen(3000);

function serveStaticFile(res, path, contentType, responseCode) {
  if (!path) path = "/index.html";
  if (!responseCode) responseCode = 200;
  if (!contentType) {
    contentType = "application/octet-stream";
    if (path.endsWith(".html")) {
      contentType = "text/html; charset=utf-8";
    }
    else if (path.endsWith(".js")) {
      contentType = "application/javascript; charset=utf-8";
    }
    else if (path.endsWith(".json")) {
      contentType = "application/json; charset=utf-8";
    }
    else if (path.endsWith(".css")) {
      contentType = "text/css; charset=utf-8";
    }
    else if (path.endsWith(".png")) {
      contentType = "image/png";
    }
    else if (path.endsWith(".jpg")) {
      contentType = "text/jpeg";
    }
  }
  fs.readFile(__dirname + "/public" + path, function(err, data) {
    if (err) {
      res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
      res.end("404 Not Found");
    }
    else {
      res.writeHead(200, {"Content-Type": contentType});
      res.end(data);
    }
  });
}

function sendResponse(req, res, data) {
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
  res.end(JSON.stringify(data));
}



function userLogin(req, res) {
  var body = "";
  req.on("data", function(data) {
    body += data;
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      req.connection.destroy();
    }
  });
  req.on("end", function() {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);
    // connect to database
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      // query the database
      //console.log(injson);
      conn.query("SELECT * FROM userInformation WHERE userEmail = ? AND userPassword = ?", [injson.email, injson.password], function(err, rows, fields) {
        //// DEBUG
        //not seeing this in the console
        if (err) {
          console.log(err);
        }
        var outjson = {};
        if (err) {
          // query failed
          outjson.success = false;
          outjson.message = "Query failed: " + err;
          console.log("Login failed " + err);
        } else {
          if (rows.length > 0) {
            var cookies = new Cookies(req, res, { keys: keys });
            cookies.set('UserID', rows[0].userID, { signed: true });
            console.log(rows[0]);
            //debugging
            console.log("Test:" + rows);
            outjson.success = true;
            outjson.message = 'Login Successful!'
            console.log("Login success!");
            // ... and navigate to other page
            location = "/userinformationpage.html"
          } else {
						outjson.success = false;
						outjson.message = 'Login Failed!'
						console.log("Login Failed!");
					}
        }
        // return json object that contains the result of the query
        sendResponse(req, res, outjson);
      })
      conn.end();
    });
  });
}

function users(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM USERS", function(err, rows, fields) {
      // build json result object
      var outjson = {};
      if (err) {
        // query failed
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        // query successful
        outjson.success = true;
        outjson.message = "Query successful!";
        outjson.data = rows;
      }
      // return json object that contains the result of the query
      sendResponse(req, res, outjson);
    });
    conn.end();
  });
}

function userinformation(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM userInformation", function(err, rows, fields) {
      // build json result object
      var outjson = {};
      if (err) {
        // query failed
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        // query successful
        outjson.success = true;
        outjson.message = "Query successful!";
        outjson.data = rows;
      }
      // return json object that contains the result of the query
      sendResponse(req, res, outjson);
    });
    conn.end();
  });
}

function userdailycalorieintake(req, res) {
  var conn = mysql.createConnection(credentials.connection);
  // connect to database
  conn.connect(function(err) {
    if (err) {
      console.error("ERROR: cannot connect: " + e);
      return;
    }
    // query the database
    conn.query("SELECT * FROM userDailyCalorieIntake", function(err, rows, fields) {
      // build json result object
      var outjson = {};
      if (err) {
        // query failed
        outjson.success = false;
        outjson.message = "Query failed: " + err;
      }
      else {
        // query successful
        outjson.success = true;
        outjson.message = "Query successful!";
        outjson.data = rows;
      }
      // return json object that contains the result of the query
      sendResponse(req, res, outjson);
    });
    conn.end();
  });
}

function addUser(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      req.connection.destroy();
    }
  });
  req.on("end", function () {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);
    // connect to database
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      // query the database
      conn.query("INSERT INTO USERS (NAME) VALUE (?)", [injson.name], function(err, rows, fields) {
        // build json result object
        var outjson = {};
        if (err) {
          // query failed
          outjson.success = false;
          outjson.message = "Query failed: " + err;
        }
        else {
          // query successful
          outjson.success = true;
          outjson.message = "Query successful!";
        }
        // return json object that contains the result of the query
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
  });
}

function addMeal(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      req.connection.destroy();
    }
  });
  req.on("end", function () {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);
    // connect to database

    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      var cookies = new Cookies(req, res, { keys: keys });
      var userId = cookies.get('UserID');
      // query the database
      conn.query("INSERT INTO userDailyCalorieIntake (userID,userMealMealOrDrinkCalories,userMealOrDrinkDescription) VALUE (?,?,?)", [userId,injson.meals[0].calories, injson.meals[0].description], function(err, rows, fields) {        // build json result object
        var outjson = {};
        if (err) {
          // query failed
          outjson.success = false;
          outjson.message = "Query failed: " + err;
        }
        else {
          // query successful
          outjson.success = true;
          outjson.message = "Query successful!";
        }
        // return json object that contains the result of the query
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
  });
}

function addDrink(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on("end", function() {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      var cookies = new Cookies(req, res, { keys: keys });
      var userId = cookies.get('UserID');
      conn.query("INSERT INTO userDailyCalorieIntake (userID,userMealMealOrDrinkCalories,userMealOrDrinkDescription) VALUE (?,?,?)",[userId,injson.water[0].calories, injson.water[0].description], function(err, rows, fields) {
        var outjson = {};
        if (err) {
          outjson.success = false;
          outjson.message = "Query failed: " + err;
        }
        else {
          outjson.success = true;
          outjson.message = "Query successful!";
        }
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
  });
}

function addNewUser(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    if (body.length > 1e6) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      req.connection.destroy();
    }
  });
  req.on("end", function () {
    var injson = JSON.parse(body);
    var conn = mysql.createConnection(credentials.connection);
    // connect to database
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      // query the database
      console.log(injson);
      conn.query("INSERT INTO userInformation (userName,userEmail,userPassword,userSecretQuestion,userAnswer,userStreetAddress,userCity,userState,userZip,userDateOfBirth,userGender,userBMI,userWeight,userHeight,userExerciseLevel,userCalorieLimit,userCalorieGoal) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [injson.userCreationInfo[0], injson.userCreationInfo[1], injson.userCreationInfo[2], injson.userCreationInfo[3], injson.userCreationInfo[4], injson.userCreationInfo[5], injson.userCreationInfo[6], injson.userCreationInfo[7], injson.userCreationInfo[8], injson.userCreationInfo[9], injson.userCreationInfo[10], injson.userCreationInfo[11], injson.userCreationInfo[12], injson.userCreationInfo[13], injson.userCreationInfo[14], injson.userCreationInfo[15], injson.userCreationInfo[16]], function(err, rows, fields) {        // build json result object
        var outjson = {};
        if (err) {
          // query failed
          outjson.success = false;
          outjson.message = "Query failed: " + err;
        }
        else {
          // query successful
          outjson.success = true;
          outjson.message = "Query successful!";
        }
        // return json object that contains the result of the query
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
  });
}

function userReport(req, res) {
    var conn = mysql.createConnection(credentials.connection);
    conn.connect(function(err) {
      if (err) {
        console.error("ERROR: cannot connect: " + e);
        return;
      }
      var parms = qs.parse(req.url.split("?")[1] || "");
      var cookies = new Cookies(req, res, { keys: keys });
      var userId = cookies.get('UserID');

      console.log(req.url);
      console.log(parms.start_date);
      console.log(parms.end_date);
      console.log(parms);
      console.log(userId);
      conn.query("select userMealMealOrDrinkCalories as 'Calories', userMealOrDrinkDescription as 'Description', userMealOrDrinkEntryDate as 'Date' from userDailyCalorieIntake where (userID = ?) and (userMealOrDrinkEntryDate BETWEEN ? and ?) order by userMealMealOrDrinkCalories desc", [userId,parms.start_date,parms.end_date], function(err, rows, fields) {

        var outjson = {};
        if (err) {
          outjson.success = false;
          outjson.message = "Query failed: " + err;
          console.log(outjson.data);
        }
        else {
          outjson.success = true;
          outjson.message = "Query successful!";
          outjson.data = rows;
          console.log(outjson.data);
        }
        sendResponse(req, res, outjson);
      });
      conn.end();
    });
}

console.log("Server started on localhost: 3000; press Ctrl-C to terminate....");
