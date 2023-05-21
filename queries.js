import con from './database.js'

/*con.connect(function(err){
    if(err) throw err;
    console.log('connected');
});*/

//var que = null;
   /*var obj =  con.query('select * from users',function(err, result){
        if(err) throw err;
        que= result;
        //console.log("Going");
        console.log("queries",que);
        return result;
    });
    console.log(obj);*/
      function que(){
        var val=null;
        var sql = "select * from users";
        con.query(sql, async (err, result)=>{
            if(err) throw err;
            val= await result;
            console.log("Going");
            console.log("queries",result);
        });
    /*var obj =  con.query('select * from users',function(err, result){
        if(err) throw err;
        
        //console.log("Going");
        console.log("queries",result);
    });
    console.log(obj);
    //console.log(obj);*/
    return val;
    }

export default que;

