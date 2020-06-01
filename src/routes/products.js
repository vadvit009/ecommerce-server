const app = require('express').Router();
const mysql = require('../database/mysql-connection');

app.get('/products/:lang/', async (req, res) => {
    const { lang } = req.params;
    // get all records
    const sql = `SELECT * FROM product_${lang}`;
    mysql.query(sql, (err, rows, fields) => {
        res.json(rows);
    });
});

app.get('/product/:lang/:id', async (req, res) => {
    const { id, lang } = req.params;
    const sql = `SELECT * FROM product_${lang} WHERE productId = ?`;
    mysql.query(sql, [id], (err, rows, fields) => {
        res.json(rows);
    });
});

app.post('/product/:lang/create', (req, res) => {

    const { title, description, price, mainImg, categoryId, keywords } = req.body;
    const { lang } = req.params;

    // post records
    const sql = `INSERT INTO product_${lang} (title, description, price, mainImg, categoryId, keywords) VALUES (?,?,?,?,?,?)`;
    mysql.query(sql, [title, description, price, mainImg, categoryId, keywords], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        // console.log('ID ===================== ',rows.insertId);
        res.json(rows.insertId);
    });
});

// SET checkout
app.patch('/product/:lang/update/:id', async (req, res) => {
    const { checkout } = req.body;
    const { id, lang } = req.params;

    const sql = `UPDATE product_${lang} SET checkout='${checkout}' WHERE productId=${id};`
    mysql.query(sql, [checkout], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json('patched');
    });
});

app.patch('/product/:lang/update/:id', async (req, res) => {
    const { title, description, price, mainImg, categoryId, keywords } = req.body;
    const { id, lang } = req.params;

    const sql = `UPDATE product_${lang} SET title='${title}', description='${description}' ,price='${price}', mainImg='${mainImg}', categoryId='${categoryId}', keywords='${keywords}' WHERE productId=${id};`
    mysql.query(sql, [title, description, price, mainImg, categoryId, keywords], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json('patched');
    });
});

app.patch('/product/:lang/restore/:id', async (req, res) => {
    const { id,lang } = req.params;
    // restore user
    const sql = `UPDATE product_${lang} SET deletedAt = NULL WHERE productId = ${id}`;
    mysql.query(sql, [id], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted user ${id}`);
    });
});

app.delete('/product/:lang/delete/:id', async (req, res) => {
    const { id, lang } = req.params;
    const sql = `DELETE FROM product_${lang} WHERE productId = ${id}`;
    mysql.query(sql, [], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted product ${id}`);
    });
});

app.delete('/product/:lang/soft-delete/:id', async (req, res) => {
    const { id, lang } = req.params;
    const sql = `UPDATE product_${lang} SET deletedAt = now() WHERE productId = ${id}`;
    mysql.query(sql, [], (err, rows, fields) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(rows);
        res.json(`deleted product ${id}`);
    });
});


module.exports = app;