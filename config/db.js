const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    driver: process.env.DRIVER,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Connect to MSSQL
sql.connect(config, function (err) {
    if (err) {
        console.error('Database Connection Failed:', err);
    } else {
        console.log('Database Connected Successfully');
    }
});

module.exports = sql;
