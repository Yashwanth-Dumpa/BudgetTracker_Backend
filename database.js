import mysql from 'mysql'
import config_details from './config.js'

//const mysql = require('mysql');

const con = mysql.createConnection(config_details);


export default con;