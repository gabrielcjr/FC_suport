const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql')

const sql = `INSERT INTO people(name) values('Gabriel')`
const sqlSelect = `SELECT * FROM people`
const connection = mysql.createConnection(config)

let resultQuery;
connection.query(sql)
connection.query(sqlSelect,  (error, result, rows) => {
    resultQuery = result
}) 
connection.end()

app.get('/', (req, res) => {
    let html = '<ul>'
    resultQuery.map((item) => {
        html += `<li>${item.name}</li>`
    })
    html += '</ul>'

    res.send(`<h1>Full Cycle Rocks!</h1><br/>${html}`)

})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})