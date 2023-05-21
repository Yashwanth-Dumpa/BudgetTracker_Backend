import con from './database.js';
import express from 'express';
import cors from 'cors';

import que from './queries.js';

const app = express();
// const val = que();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API to post data from budget tab
app.post('/test', (request, response) => {
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
app.get('/getDetails', (request, response) => {
    let sql = "select * from users";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Row Fetched from get",result[0]);
      response.send(result);
    });
  });

//--------------------------------------------------------------------------------------

//API to print data in Expenses table

app.get('/expenseTable', (request, response) => {
    let sql = "select id,amount, category,date_and_time from tracker where type<>'input'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("Row Fetched from get",result[0]);
      response.send(result);
    });
  });



//API to get data for viewSpend chart

app.get('/viewSpends', (request, response) => {
    let sql = "select category, sum(amount) as amount from tracker where type<>'input' group by category";
    con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("Row Fetched from get",result[0]);
      //console.log(result);
      response.send(result);
    });
  });

//API to get data for viewBalance chart  
app.get('/viewBalance', (request, response) => {
    let sql = "select category, sum(amount) as amount from tracker where type<>'input' group by category";
    con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("Row Fetched from get",result[0]);
      //console.log(result);
      response.send(result);
    });
  });

 //API to post data into database
 app.post('/addExpense', (request, response) => {
  let details = request.body;
 // console.log(details);
  //let sql="insert into  tracker(user_id,amount,type,category)  values(1,5000,'debit','Groceries')";
 
  let sql = "insert into tracker(user_id,amount,type,category,date_and_time,remarks)  values(1,"+details.amount+",'debit','" +details.category+"','"+details.date+"','"+details.remarks+"')";
  //console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
  });
});


//API to delete data from Expenses Table
app.delete('/delete-expense/:id', (request, response) => {
  let details = request.body;
  let {id} = request.params;
  console.log(id);
  console.log("params",request.params)

  let sql = "delete from tracker where id="+id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
  });
  console.log("Delete Working");
});


//API to edit data from Expenses Table

app.put('/editExpense/:id', (request, response) => {
  let details = request.body;
  let {id} = request.params;
  console.log(id);
  console.log("params",request.params)
  let sql = "update tracker set amount="+details.amount+",category='"+details.category+"',date_and_time='"+details.date+"',remarks='"+details.remarks+"' where id="+id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    response.send(result);
    console.log(result);
  });
  console.log("Update Working");
});


app.listen(5000);