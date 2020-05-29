const app = require('express').Router();
const mysql = require('../database/mysql-connection');
const crypto = require('crypto');

// const key = crypto.createCipher('aes-128-cbc', 'begemot_ternopil');
// const str = key.update(password, 'utf8', 'hex');
// str += str.final('hex');

app.get('/users', async (req, res) => {
    // get all records
    const sql = 'SELECT * FROM user';
    mysql.query(sql, (err, rows, fields) => {
        res.json(rows);
    });
});

app.post('/user/', async (req, res) => {

    const { email, password } = req.body;
    const key = crypto.createHash('md5').update(password).digest('hex');
    const sql = `SELECT * FROM user WHERE email='${email}' AND password='${key}'`;
    mysql.query(sql, [email, key], (err, rows, fields) => {
        if (rows.length != 0) {
            res.redirect('/api/products/en')
            // res.json({ message: 'ok' });
        }
        else {
            res.json({ message: 'err' })
        }
        if (err) {
            console.log(err)
            return;
        }
    });
});

app.post('/user/create', async (req, res) => {
    const { firstName, lastName, email, phone, password, roleId } = req.body;

    const regUser = `SELECT email FROM user WHERE email='${email}'`;
    mysql.query(regUser, [email], (err, rows, fields) => {

        const dbUserEmail = rows.length;
        if (dbUserEmail != 0) {
            res.json(false)
        }
        else {
            //  post user
            const key = crypto.createHash('md5').update(password).digest('hex');
            const sql = `INSERT INTO user (firstName, lastName, email, phone, roleId, password) VALUES (?,?,?,?,?,?)`;
            mysql.query(sql, [firstName, lastName, email, phone, roleId, key], (err, rows, fields) => {
                if (err) {
                    console.log(err)
                    return;
                }
                res.json('added');
            });
        }
    })
});

app.patch('/user/update/:id', async (req, res) => {
    const { firstName, lastName, email, phone, roleId } = req.body;
    const { id } = req.params;

    const sql = `UPDATE user SET firstName='${firstName}', lastName='${lastName}' ,email='${email}', phone='${phone}', roleId='${roleId}' WHERE productId=${id};`
    mysql.query(sql, [firstName, lastName, email, phone, roleId], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json('patched');
    });
});

app.patch('/user/restore/:id', async (req, res) => {
    const { id } = req.params;
    // restore user
    const sql = `UPDATE user SET deletedAt = NULL WHERE userId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted user ${id}`);
    });
});


app.delete('/user/soft-delete/:id', async (req, res) => {
    const { id } = req.params;
    // soft delete
    const sql = `UPDATE user SET deletedAt = now() WHERE userId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted user ${id}`);
    });
});

app.delete('/user/delete/:id', async (req, res) => {
    const { id } = req.params;
    // hard delete
    const sql = `DELETE FROM user WHERE userId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted user ${id}`);
    });
});


module.exports = app;