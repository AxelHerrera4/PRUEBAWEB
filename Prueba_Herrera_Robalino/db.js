const mysql = require('mysql2');


const conexion = mysql.createConnection({
    host: 'localhost',  
    user: 'root',       
    password: '',      
    database: 'biblioteca' 
});


conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos como ID ' + conexion.threadId);
});

module.exports = conexion; 
