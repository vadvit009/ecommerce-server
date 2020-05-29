const app = require('express').Router();
const mysql = require('../database/mysql-connection');

app.get('/roles', async (req, res) => {
    // get all records
    const sql = 'SELECT * FROM roles';
    mysql.query(sql, (err, rows, fields) => {
        res.json(rows);
    });
});

app.get('/roles/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM roles WHERE roleId = ?';
    mysql.query(sql, [id], (err, rows, fields) => {
        res.json(rows);
    });
});

app.post('/roles/create', async (req, res) => {
    const { roleName, rolesPriority } = req.body;
    // get all records
    const sql = 'INSERT INTO roles (roleName, rolesPriority) VALUES (?,?)';
    mysql.query(sql, [roleName, rolesPriority], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json('added');
    });
});

app.patch('/roles/update/:id', async (req, res) => {
    const { roleName, rolesPriority } = req.body;
    const { id } = req.params;

    const sql = `UPDATE roles SET roleName='${roleName}', rolesPriority='${rolesPriority}' WHERE roleId=${id};`
    mysql.query(sql, [name, rolesPriority], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json('patched');
    });
});

app.patch('/roles/restore/:id', async (req, res) => {
    const { id } = req.params;
    // restore roles
    const sql = `UPDATE roles SET deletedAt = NULL WHERE roleId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted roles ${id}`);
    });
});


app.delete('/roles/soft-delete/:id', async (req, res) => {
    const { id } = req.params;
    // soft delete
    const sql = `UPDATE roles SET deletedAt = now() WHERE roleId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`soft deleted roles ${id}`);
    });
});

app.delete('/roles/delete/:id', async (req, res) => {
    const { id } = req.params;
    // hard delete
    const sql = `DELETE FROM roles WHERE roleId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted roles ${id}`);
    });
});


module.exports = app;