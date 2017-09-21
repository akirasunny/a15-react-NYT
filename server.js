// Dependencies

var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");
var body = require("body-parser");
var url = require("url");

// Mongoose

var Note = require("./models/Note");
var Article = require("./models/Article");
var databaseUrl = 'mongodb://localhost/nytreact';

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
}
else {
	mongoose.connect(databaseUrl);
};

mongoose.Promise = Promise;
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

var app = express();
var port = process.env.PORT || 3000;

// app set-ups

app.use(logger("dev"));
app.use(express.static("public"));
app.use(body.urlencoded({extended: true}));
app.use(body.json());

app.listen(port, function() {
	console.log("Listening on port " + port);
})

// Routes
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/saved", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/advanced-search", function(req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/data", function(req, res) {
	Article.find({}, null, {sort: {date: -1}}, function(err, data) {
		if(data.length === 0) {
			res.send({message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
		}
		else{
			res.send(data);
		}
	});
})

app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/world", function(error, response, html) {
		var $ = cheerio.load(html);
		var result = {};
		$("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			var img = $(element).parent().find("figure.media").find("img").attr("src");
			var time = $(element).find("time").attr("datetime");
			result.link = link;
			result.title = title;
			if (summary) {
				result.summary = summary;
			};
			if (img) {
				result.img = img;
			}
			else {
				result.img = $(element).find(".wide-thumb").find("img").attr("src");
			};
			if (time !== undefined) {
				time = moment.unix(parseInt(time));
				result.date = time;
				var entry = new Article(result);
				Article.find({title: result.title}, function(err, data) {
					if (data.length === 0) {
						entry.save(function(err, data) {
							if (err) throw err;
						});
					}
				});
			}
		});
		console.log("Scrape finished." + moment().format("HH:mm"));
		res.redirect("/");
	});
});

app.get("/api/saved", function(req, res) {
	Article.find({issaved: true}, null, {sort: {date: -1}}, function(err, data) {
		if(data.length === 0) {
			res.send({message: "You have not saved any articles yet. Try to save some delicious news by simply clicking \"Save Article\"!"});
		}
		else {
			res.send(data);
		}
	});
});

app.post("/advanced-search", function(req, res) {
	var start;
	var end;
	var now = moment().add(1, "day");
	if (req.body.startdate) {
		start = moment(req.body.startdate, "YYYY-MM-DD");
	}
	else {
		start = moment("1970-01-01", "YYYY-MM-DD");
	};
	if (req.body.enddate) {
		end = moment(req.body.enddate, "YYYY-MM-DD").add(1, "day");
	}
	else {
		end = now;
	};
	var diff1 = end.isSameOrAfter(start);
	var diff2 = now.isSameOrAfter(end);
	if (diff1 && diff2) {
		Article.find({$text: {$search: req.body.keyword, $caseSensitive: false}}, null, {sort: {date: -1}}, function(err, data) {
		if (data.length === 0) {
			res.send({message: "Nothing has been found. Please try other keywords."});
		}
		else {
			var newdata = data.filter(function(data) {
				var articledate = moment(parseInt(data.date));
				if (start !== undefined) {
					return articledate.isSameOrAfter(start) && articledate.isSameOrBefore(end);
				}
				else {
					return end.isSameOrAfter(articledate);
				}
			})
			res.send(newdata);
		}
	});
	}
	else {
		res.send({err: ""});
	}
});

app.post("/save/:id", function(req, res) {
	Article.findById(req.params.id, function(err, data) {
		if (data.issaved) {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err, data) {
				res.redirect("/");
			});
		}
		else {
			Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Unsave"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
			});
		}
	});
});

app.post("/note/:id", function(req, res) {
	var note = new Note(req.body);
	note.save(function(err, doc) {
		if (err) throw err;
		Article.findByIdAndUpdate(req.params.id, {$push: {"note": doc._id}}, {new: true}, function(err, newdoc) {
			if (err) throw err;
			else {
				res.send(newdoc);
			}
		});
	});
});

app.get("/note/:id", function(req, res) {
	var id = req.params.id;
	Article.findById(id).populate("note").exec(function(err, data) {
		res.send(data.note);
	})
})