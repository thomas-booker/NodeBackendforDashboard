var express = require('express');
var router = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'IT@peakybl1nders',
    database: 'ithelp'
});

var http = require('http');


/*http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello');
    res.end();
}).listen(7000);*/

/* GET home page. */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




/*
http.createServer(function(req, res) {
    //console.log('request received');
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-type': 'text/html'});
        }
        res.writeHead(200, {'Content-Type': 'txt/html'});
        res.write(data);
        return res.end();
    });
}).listen(8124); */

// sql get request - tb

router.get('/fetchdata', function(req, res) {
    var data = {
        "Data":""
    };

    connection.query("SELECT * FROM test_table", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
        } else {
            data["Data"] = "No data found...';";
            res.jsonp(data);
        }
    });
});


/*
    Team info
 */
router.get('/getteaminfo', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM info", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
        } else {
            data["Data"] = "No data found...';";
        }
    });
});
router.post('/putteaminfo', function(req, res) {
    console.log(req.body.text);
    //console.log(req);
    connection.query("UPDATE info SET info ='" + req.body.teaminfo + "' WHERE idinfo = 1");
    res.redirect('http://localhost:80/admin.html');
    res.end();

});

/*
    Alerts
 */

router.get('/getalerts', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM alerts", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
        } else {
            data["Data"] = "No data found...';";
        }
    });
});
router.post('/addalert', function(req, res) {

    console.log("Title: " + req.body.title);
    console.log("Alert msg: " + req.body.alert);
    var item = req.body;

    connection.query("INSERT INTO alerts (alerttitle, alertmsg)" +
        "VALUES ('" + item.title + "','" + item.alert + "')");
    res.redirect('http://localhost:80/alerts.html');
    res.end();
});

router.post('/deletealert', function(req, res) {
    connection.query("DELETE FROM alerts WHERE id='" + req.body.text + "'");
    console.log(req.body.text);
    res.end();
});

router.post('/editalert', function(req, res) {
    console.log(req);
    console.log("UPDATE alerts SET alerttitle='" + req.body.title + "', alert='" +
        req.body.alert + "' WHERE id='" + req.body.id + "'");
    connection.query("UPDATE alerts SET alerttitle='" + req.body.title + "', alertmsg='" +
        req.body.alert + "' WHERE id='" + req.body.id + "'");
    res.redirect('http://localhost:80/alerts.html');
    res.end();
});

/*
    Tip of the Week
 */
router.get('/gettip', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM totw WHERE id='" + req.body.id + "'", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
        } else {
            data["Data"] = "No data found...';";

        }
    });
});

router.get('/gettips', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM totw", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
        } else {
            data["Data"] = "No data found...';";

        }
    });
});

router.post('/addtip', function(req, res) {

    console.log("Title: " + req.body.title);
    console.log("Tip msg: " + req.body.tip);
    console.log(req);
    var item = req.body;

    connection.query("INSERT INTO totw (title, tip)" +
        "VALUES ('" + item.title + "','" + item.tip + "')");
    res.redirect('http://localhost:80/totw.html');
    res.end();
});

router.post('/deletetip', function(req, res) {
    connection.query("DELETE FROM totw WHERE id='" + req.body.text + "'");
    console.log(req.body.text);
    res.end();
});

router.post('/edittip', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    console.log("UPDATE totw SET title='" + req.body.title + "', tip='" +
        req.body.tip + "' WHERE id='" + req.body.id + "'");
    connection.query("UPDATE totw SET title='" + req.body.title + "', tip='" +
        req.body.tip + "' WHERE id='" + req.body.id + "'");
    res.redirect('http://localhost:80/totw.html');
    res.end();
});

/*
Planned Maintenance
 */
router.get('/getmaint', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM maintenance ORDER BY datefrom", function(err, rows, fields) {
        /*if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
            //console.log(data);
        } else {
            data["Data"] = "No data found...';";

        }*/
        data["Data"] = rows;
        res.jsonp(data);
    });
});
router.post('/addmaint', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    var query = "INSERT INTO maintenance (title, datefrom, dateto)" +
        "VALUES ('" + item.title + "','" +
        item.datefrom + " " + item.timefrom + "','" +
        item.dateto + " " + item.timeto + "')";
    connection.query(query);
    res.redirect('http://localhost:80/maint.html');
    res.end();
});
router.post('/deletemaint', function(req, res) {
    connection.query("DELETE FROM maintenance WHERE id='" + req.body.text + "'");
    console.log(req.body.text);
    res.end();
});

router.post('/editmaint', function(req, res) {
    //console.log(req);
    var item = req.body;
    //console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    connection.query("UPDATE maintenance SET title='" + item.title + "', " +
        "datefrom='" + item.datef + " " + item.timef + "', " +
        "dateto='" + item.datet + " " + item.timet + "'" +
        " WHERE id='" + item.id + "'");
    //res.redirect('http://localhost:80/maint.html');
    res.end();
});

/*
 Applications Status
 */

router.get('/getapps', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM apps ORDER BY appname", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
            //console.log(data);
        } else {
            data["Data"] = "No data found...';";

        }
    });
});
router.post('/addapp', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    console.log("INSERT INTO apps (appname, appstatus)" +
        " VALUES ('" + item.name  + "," + item.status + ")");
    connection.query("INSERT INTO apps (appname, appstatus)" +
        " VALUES ('" + item.name  + "'," + item.status + ")");
    //res.redirect('http://localhost:80/apps.html');
    res.end();
});
router.post('/editappstatus', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    connection.query("UPDATE apps SET appstatus='" + req.body.item +
        "' WHERE appid='" + req.body.id + "'");
    //res.redirect('http://localhost:80/apps.html');
    res.end();
});
router.post('/editappname', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    connection.query("UPDATE apps SET appname='" + req.body.name +
        "' WHERE appid='" + req.body.id + "'");
    //res.redirect('http://localhost:80/apps.html');
    res.end();
});
router.post('/deleteapp', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    connection.query("DELETE FROM apps WHERE appid='" + req.body.id + "'");
    //res.redirect('http://localhost:80/apps.html');
    res.end();
});

/*
    Page change functions
 */
router.get('/getpagechange', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM pagechange", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
            //console.log(data);
        } else {
            data["Data"] = "No data found...';";

        }
    });
});
router.post('/changepage', function(req, res) {
    //console.log(req);
    var item = req.body;
    console.log(item);
    /* console.log("UPDATE maintenance SET title='" + req.body.title + "', msg='" +
        req.body.maint + "' WHERE id='" + req.body.id + "'"); */
    connection.query("UPDATE pagechange SET state='" + req.body.status +
        "' WHERE id='" + req.body.id + "'");
    //res.redirect('http://localhost:80/apps.html');
    res.end();
});

/*
 Team Meeting
 */

router.get('/getmeeting', function(req, res) {
    var data = {
        "Data":""
    };
    connection.query("SELECT * FROM meeting", function(err, rows, fields) {
        if (rows.length != 0) {
            data["Data"] = rows;
            res.jsonp(data);
            //console.log(data);
        }
        res.jsonp(data);
    });
});

module.exports = router;
