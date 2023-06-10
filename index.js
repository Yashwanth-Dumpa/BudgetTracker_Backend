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
    "select id,amount, category,date_and_time,remarks from tracker where type<>'input' and user_id="+user_id+" order by date_and_time desc";
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

//API to get data for monthly budget on budget tab collapsible table
app.get("/:user_id/viewSpendsMonth/", (request, response) => {
  const {user_id} = request.params;
  const month = request.query.start;
  console.log(request.params);
  
  console.log(user_id);
  let sql =
    "select * from tracker where type<>'input' and user_id="+user_id+" and month='"+month+"' order by date_and_time desc, amount desc";
    console.log(sql);
  
    con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    console.log("Monthly budget",result);
    response.send(result);
  });
});

//API to get data for viewBalance chart
app.get("/:user_id/viewBalance", (request, response) => {
  const {user_id} = request.params;
  let sql =
    "select (select sum(amount) from tracker where user_id="+user_id
    +" group by type having type='debit') as expense,((select sum(amount) from tracker where user_id="+user_id
    +" group by type having type='input')-(select sum(amount) from tracker where user_id="+user_id+" group by type having type='debit')) as balance from tracker where user_id="
    +user_id+ " limit 1;";
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    console.log(result);
    response.send(result);
  });
});
//API to get data for viewSpendschart from dates
app.get("/:user_id/viewSpendsDates/", (request, response) => {
  let to = request.query.start;
  let from = request.query.end;
 const {user_id} = request.params;
  //let to = '2023-05-23';
  //let from = '2023-05-23';

  let sql =
    "select category, sum(amount) as amount from tracker where type<>'input' and user_id="+user_id+" and (date_and_time between " +
    to +
    " and " +
    from +
    ")"+  "group by category";
    console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log("Row Fetched from get",result[0]);
    console.log(result);
    response.send(result);
  });
  console.log("Dates Showing Budget graph Working");
});




//API to create accounts into database on Signup
app.get("/insertBudget/:user_id", (request, response) => {
  const {user_id} = request.params;
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "Febrauary",
    "March",
  ];
  console.log(user_id);

  
  let sql =  "insert into tracker(user_id,amount,type,category,month) values";
  var vals='';
  let values='';
  
     for(let i=0;i<months.length;i++){
      if(i===months.length-1){
        values = "("+user_id+","+0+",'input','salary','"+months[i]+"');";
      }else{
        values = "("+user_id+","+0+",'input','salary','"+months[i]+"'),";
      }
      
      vals = vals+values;
      //console.log(i,parseInt(details[i]));
     
    }//for loop end
    sql = sql+vals;
    console.log(sql);
    con.query(sql,function (err,result){
      if(err) throw err;
      //request.setHeader('Content-Type', 'application/json'),  
      response.send(result);
    });
 console.log("Inserted all the details successfully");
});

//API to post data into database for amount credit of type Input;
app.post("/:user_id/addExpense-Credit", (request, response) => {
  let details = request.body;
  const {user_id} = request.params;
  
  console.log(details);
 /* let sql =  "insert into tracker(user_id,amount,type,category,month) values";
  var vals='';
  let values='';
  const entry = Object.entries(details);
     for(let i=0;i<entry.length;i++){
      if(i===entry.length-1){
        values = "("+user_id+","+parseInt(entry[i][1])+",'input','salary','"+entry[i][0]+"');";
      }else{
        values = "("+user_id+","+parseInt(entry[i][1])+",'input','salary','"+entry[i][0]+"'),";
      }
      
      vals = vals+values;
      //console.log(i,parseInt(details[i]));
     
    }//for loop end
    sql = sql+vals;
    console.log(sql);
    con.query(sql,function (err,result){
      if(err) throw err;
      //request.setHeader('Content-Type', 'application/json'),  
      response.send(result);
    });*/
    const entry = Object.entries(details);
    for(let i=0;i<entry.length;i++){
      let sql = "update tracker set amount="+parseInt(entry[i][1])+" where month='"+entry[i][0]+"' and user_id="+user_id+" and type='input'";

      con.query(sql,function (err,result){
        if(err) throw err;
        //request.setHeader('Content-Type', 'application/json'),  
        //response.send(result);
      });
    }
    console.log("Entries Noted for",user_id);
    response.send("Success");

  /*console.log('OutsideLoop',out);
  response.send(out); 
  console.log("ente3red succesfully into ",user_id);*/
});

//API to post data into database
app.post("/:user_id/addExpense", (request, response) => {
  let details = request.body;
  const {user_id} = request.params;

  let date = new Date(details.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    month: "long"
  });
  let month=formattedDate;
  // console.log(details);
  //let sql="insert into  tracker(user_id,amount,type,category)  values(1,5000,'debit','Groceries')";

  let sql =
    "insert into tracker(user_id,amount,type,category,date_and_time,remarks,month)  values("+user_id+"," +
    details.amount +
    ",'debit','" +
    details.category +
    "','" +
    details.date +
    "','" +
    details.remarks +"','"+month+
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

  let date = new Date(details.date);
  const formattedDate = date.toLocaleDateString("en-GB", {
    month: "long"
  });
  let month=formattedDate;

  console.log("params", request.params);
  let sql =
    "update tracker set amount=" +
    details.amount +
    ",category='" +
    details.category +
    "',date_and_time='" +
    details.date +
    "',remarks='" +
    details.remarks +"', month='" +month+
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

//API to display the budget from database whenever the budget tab is loaded
app.get("/:user_id/getBudget", (request, response) => {
  
  let {user_id } = request.params;
  let sql =
    "select month,amount from tracker where user_id=" +
    user_id +" and type='input'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
    //console.log(result);
  });
  console.log("Fetching data for Budget Table Working");
});


//API to display the balance from database whenever the budget tab is loaded
app.get("/:user_id/getBudget/spends", (request, response) => {
  
  let {user_id } = request.params;
  let obj={};
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "Febrauary",
    "March",
  ];
  for(let i of months){
    //let sql="select (select sum(amount) from tracker where user_id="+user_id+" and month='"+i+"' group by type having type='input')-(select sum(amount) from tracker where user_id="+user_id+" and month='"+i+"' group by type having type='debit') as Balance;"
   let sql = "select sum(amount) as Spends from tracker where user_id="+user_id+" and month='"+i+"' group by type having type='debit'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("SPEND ",result);
      obj[i] = result.length===0?0 :result[0].Spends;
      if(i==='March'){
        response.send(obj);
        console.log(obj,"After everything");
      }
    });
 
  }
  console.log("Showing balance data for Budget Table Working");
});
//API to display the corresponding data when EDIT button is clicked
app.get("/:user_id/displayExpense/:id", (request, response) => {
  let details = request.body;
  let { id,user_id } = request.params;
  let sql =
    "select * from tracker where id=" +
    id +" and user_id="+user_id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
    console.log(result);
  });
  console.log("Displaying Working");
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

//API to get userName;
app.get("/:user_id/userName", (request, response) => {
  const {user_id} = request.params;
 
 let sql="select firstname from users where id="+user_id;
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result)
    
  });
  console.log("UserName fetched");
});



app.listen(5000);
