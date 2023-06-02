import con from "./database.js";
import express from "express";
import cors from "cors";

import que from "./queries.js";

const app = express();
// const val = que();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API to post data from budget tab
app.post("/test", (request, response) => {
  let sql = "INSERT INTO test(month,data) values ('buhsbdhb','Sai')";
  let details = request.body;
  console.log(request);
  console.log("Post", details);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Row Inserted in post");
    response.send("POST");
  });
});

//Test API to get data
app.get("/getDetails", (request, response) => {
  let sql = "select * from users";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Row Fetched from get", result[0]);
    response.send(result);
  });
});

//--------------------------------------------------------------------------------------

//API to print data in Expenses table

app.get("/:user_id/expenseTable", (request, response) => {
  const {user_id} = request.params;
  let sql =
    "select id,amount, category,date_and_time,remarks from tracker where type<>'input' and user_id="+user_id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    response.send(result);
  });
});


//API to get data for viewSpend chart

app.get("/:user_id/viewSpends", (request, response) => {
  const {user_id} = request.params;
  console.log(request.params);
  console.log(user_id);
  let sql =
    "select category, sum(amount) as amount from tracker where type<>'input' and user_id="+user_id+" group by category";
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    console.log(result);
    response.send(result);
  });
});

//API to get data for viewBalance chart
app.get("/:user_id/viewBalance", (request, response) => {
  const {user_id} = request.params;
  let sql =
    "select (select sum(amount) from tracker group by type having type='debit') as expense,((select sum(amount) from tracker group by type having type='input')-(select sum(amount) from tracker group by type having type='debit')) as balance from tracker where user_id="+user_id+ " limit 1;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    console.log(result);
    response.send(result);
  });
});

//API to post data into database
app.post("/:user_id/addExpense", (request, response) => {
  let details = request.body;
  const {user_id} = request.params;
  // console.log(details);
  //let sql="insert into  tracker(user_id,amount,type,category)  values(1,5000,'debit','Groceries')";

  let sql =
    "insert into tracker(user_id,amount,type,category,date_and_time,remarks)  values("+user_id+"," +
    details.amount +
    ",'debit','" +
    details.category +
    "','" +
    details.date +
    "','" +
    details.remarks +
    "')";
  //console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
  });

  console.log("Added succesfully into ",user_id);
});

//API to delete data from Expenses Table
app.delete("/:user_id/delete-expense/:id", (request, response) => {
  let details = request.body;
  let { id,user_id } = request.params;
  console.log(id);
  console.log("params", request.params);

  let sql = "delete from tracker where id=" + id+" and user_id="+user_id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
  });
  console.log("Delete Working");
});

//API to edit data from Expenses Table

app.put("/:user_id/editExpense/:id", (request, response) => {
  let details = request.body;
  let { id,user_id } = request.params;
  console.log(id);
  console.log("params", request.params);
  let sql =
    "update tracker set amount=" +
    details.amount +
    ",category='" +
    details.category +
    "',date_and_time='" +
    details.date +
    "',remarks='" +
    details.remarks +
    "' where id=" +
    id +" and user_id="+user_id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
    console.log(result);
  });
  console.log("Update Working");
});

//API to search records using date parameter

app.get("/:user_id/dates/", (request, response) => {
  let to = request.query.start;
  let from = request.query.end;
 const {user_id} = request.params;
  //let to = '2023-05-23';
  //let from = '2023-05-23';

  let sql =
    "select id,amount, category,date_and_time,remarks from tracker where type<>'input' and (date_and_time between " +
    to +
    " and " +
    from +
    ") and user_id="+user_id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
    console.log(result);
  });
  console.log("Search Working");
});

//API to post signup information
/*app.post("/newUser", async (request, response) => {
  let { firstName, lastName, mail, password } = request.body;
  const checkUser = (mailId) => {
    return new Promise((resolve) => {
      //let sql = 'select * from users where email=?',[mailId];
      con.query(
        "select * from users where email=?",
        [mailId],
        (error, result) => {
          if (error) return reject(error);
          if (result && result[0]) {
            console.log("User Exists");
            return resolve(true);
          }
          resolve(false);
        }
      );
    });
  };

  const createUser = () => {
    return new Promise((resolve) => {
      let sql =
        "insert into users(firstname,lastname,email,password) values ('" +
        firstName +
        "','" +
        lastName +
        "','" +
        mail +
        "','" +
        password +
        "')";
      con.query(sql, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });
      console.log("Signup Working");
    });
  };
  try {
    const exists = await checkUser(mail);
    if (exists) throw new Error("User data already exists");
    const result = await createUser();
    response.send(result);
  } catch (error) {
    console.log("Error daaaa", error);
  }
});*/


app.post("/newUser", (request, response) => {

  let { firstName, lastName, mail, password } = request.body;
  let sql =
        "insert into users(firstname,lastname,email,password) values ('" +
        firstName +
        "','" +
        lastName +
        "','" +
        mail +
        "','" +
        password +
        "')";
      con.query(sql, function (err, result) {
        if(err){
          if (err.code==='ER_DUP_ENTRY'){
            console.log('Error working');
            response.send("false");
          }
        }
      else{
          response.send(result);
          console.log("Signup Working");
        }
        /*if(err) throw(err);
        response.send(result);
        console.log('signup working');*/
      });
      
      
});

//API to verify userdetails upon Log in
app.get("/existingUser/", (request, response) => {
  let email = request.query.mail;
  let password = request.query.password;
  console.log(email,password);
 let sql="select id from users where email="+email+" and password="+password;
  con.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length===0){
      response.send("false");
      console.log('inside this');
    }else{
      response.send(result);
      console.log('output',result);
    }
    
  });
  console.log("Login Working");
});



app.listen(5000);
