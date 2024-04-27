const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Establishing connection with database 
const myconn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "client@1920",
	database: "test"
});

// create table query
const createtable = "CREATE TABLE IF NOT EXISTS employee(emp_id int NOT NULL, name varchar(255) NOT NULL," +
	"job varchar(255) NOT NULL," +
	"phone numeric(10) NOT NULL, email varchar(255) NOT NULL, address varchar(255) NOT NULL," +
	"city varchar(255) NOT NULL, state varchar(255) NOT NULL, primary_contact varchar(255) NOT NULL," +
	"primary_phone numeric(10) NOT NULL, primary_relation varchar(255) NOT NULL," +
	"secondary_contact varchar(255) NOT NULL, secondary_phone numeric(10) NOT NULL, secondary_relation varchar(255) NOT NULL," +
	"PRIMARY KEY(emp_id))";

//Query for Creating new table
myconn.query(createtable, function (err, result) {
	if (err) {
		console.log(err);
	}
});

// setting route to render home page
app.get("/", function (req, res) {
	res.render("home");
});

// fetching data from database
app.get("/getData", function (req, res) {
	myconn.query("SELECT * FROM employee", function (err, result, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log("Database sync Successfull");
			res.send(result);
		}
	});
});

//  Render create employee page
app.get("/create", function (req, res) {
	res.render("create");
});

// Creating and saving new employee data
app.post("/create", function (req, res) {

	// fetching values from form 
	const name = req.body.empname;
	const job = req.body.jobtitle;
	const phone = parseInt(req.body.phonenumber);
	const email = String(req.body.email);
	const address = req.body.address;
	const city = req.body.city;
	const state = req.body.state;
	const primaryname = req.body.primarycontact;
	const primaryphone = parseInt(req.body.primaryphone);
	const primaryrelation = req.body.primaryrelation;
	const secondaryname = req.body.secondarycontact;
	const secondaryphone = parseInt(req.body.secondaryphone);
	const secondaryrelation = req.body.secondaryrelation;

	// insert query
	myconn.query("SELECT COUNT(*) AS total FROM employee", function (err, result) {
		if (!err) {
			const insert = "INSERT INTO employee(emp_id,name,job,phone,email,address,city,state,primary_contact," +
				"primary_phone,primary_relation,secondary_contact,secondary_phone,secondary_relation)" +
				"VALUES('" + result[0].total + "'+1,'" + name + "','" + job + "','" + phone + "','" + email + "','" + address + "','" + city + "'," +
				"'" + state + "','" + primaryname + "','" + primaryphone + "','" + primaryrelation + "'," +
				"'" + secondaryname + "','" + secondaryphone + "','" + secondaryrelation + "')";

			//executing insert query
			myconn.query(insert, function (err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log("Data Inserted Successfully");
					res.redirect("/");
				}
			});
		}
	});
});

// updating employee page
app.get("/update", function (req, res) {
	const id = req.query.updateButton;
	// fetch the current data to show in the update employee form
	myconn.query("SELECT * FROM employee where emp_id =" + id + "", function (err, result, fields) {
		if (!err) {
			res.render("update", {
				name: result[0].name, job: result[0].job, phone: result[0].phone, email: result[0].email,
				address: result[0].address, city: result[0].city, state: result[0].state, primarycontact: result[0].primary_contact,
				primaryphone: result[0].primary_phone, primaryrelation: result[0].primary_relation, secondarycontact: result[0].secondary_contact,
				secondaryphone: result[0].secondary_phone, secondaryrelation: result[0].secondary_relation, id: result[0].emp_id,
			});
		} else {
			console.log(err);
		}
	});
});

// Sending data from update employee details form
app.post("/update", function (req, res) {
	const id = req.body.updateButton;
	const empname = req.body.empname;
	const job = req.body.jobtitle;
	const phone = req.body.phonenumber;
	const email = req.body.email;
	const address = req.body.address;
	const city = req.body.city;
	const state = req.body.state;
	const primary_contact = req.body.primarycontact;
	const primary_phone = req.body.primaryphone;
	const primary_relation = req.body.primaryrelation;
	const secondary_contact = req.body.secondarycontact;
	const secondary_phone = req.body.secondaryphone;
	const secondary_relation = req.body.secondaryrelation;
	const query = "UPDATE employee SET name=" + "'" + empname + "'" + ",job=" + "'" + job + "'" + ",phone=" + "'" + phone + "'" +
		",address=" + "'" + address + "'" + ",city=" + "'" + city + "'" + ",state=" + "'" + state + "'" +
		",primary_contact=" + "'" + primary_contact + "'" + ",primary_phone=" + "'" + primary_phone + "'" +
		",primary_relation=" + "'" + primary_relation + "'" + ",secondary_contact=" + "'" + secondary_contact + "'" +
		",secondary_phone=" + "'" + secondary_phone + "'" + ",secondary_relation=" + "'" + secondary_relation + "'" +
		" WHERE emp_id=" + "'" + id + "'";
	

	//updating employee data	
	myconn.query(query, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Update Successful");
			res.redirect("/");
		}
	})
});

//  deleting selected employee
app.post("/delete", function (req, res) {
	myconn.query("DELETE FROM employee WHERE emp_id=" + "'" + req.body.deleteButton + "'", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Deleted Successfully");
			res.redirect("/");
		}
	});
});

//  setting the port of server
app.listen(3000, function (req, res) {
	console.log("Server running");
})