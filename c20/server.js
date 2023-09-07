const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { name } = require('ejs')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(path.join(__dirname, 'db', 'data.db'))

const app = express()
const port = 3000



app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => { //create router read
    const { name, height, weight, birthdate, married } = req.query
    const queries = []
    const params = []

    if(name) {
        queries.push(`name like '%' || ? || '%'`)
        params.push(name)
    }

    if(height) {
        queries.push(`height = ?`)
        params.push(height)
    }

    if(weight) {
        queries.push(`weight = ?`)
        params.push(weight)
    }

    if(birthdate) {
        queries.push(`birthdate = ?`)
        params.push(birthdate)
    }

    if(married) {
        queries.push(`married like = ?`)
        params.push(married)
    }

    let sql = 'SELECT * FROM data'
    if(queries.length > 0) {
        sql += ` WHERE ${queries.join(' or ')}`
    }

    db.all(sql, params,(err, rows) => {
        if (err) {
            console.log(err)
            res.send('Gagal dapat data')
        }
        res.render('list', { data: rows, query: req.query })
    })
})

app.get('/add', (req, res) => {//create router add
    res.render('add')
})

app.post('/add', (req, res) => {
    let dataGet = {
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight,
        birthdate: req.body.birthdate,
        married: req.body.married
    };
    const data = []
    if (dataGet.married == 'true') {
        dataGet.married = true;
        data.push(dataGet)
    } else {
        dataGet.married = false;
        data.push(dataGet)
    }
    db.run('INSERT INTO data (name, height, weight, birthdate, married) VALUES (?, ?, ?, ?, ?)', [dataGet.name, dataGet.height, dataGet.weight, dataGet.birthdate, dataGet.married], (err) => {
        if (err) return res.send(err)
        else res.redirect('/')
    })
})

app.get('/delete/:index', (req, res) => {
    const index = req.params.index
    db.run('DELETE FROM data WHERE id = ?', [index], (err) => {
        if (err) return res.send(err)
        else res.redirect('/')
    })
})

app.get('/edit/:index', (req, res) => {
    const index = req.params.index
    const item = db.get('SELECT * FROM data WHERE id = ?', [index], (err, rows) => {
        if (err) return res.send(err)
        else res.render('edit', { item: rows })
    })
})

app.post('/edit/:index', (req, res) => {
    const dataBaru = []
    const index = req.params.index
    dataBaru[index] = {
        name: req.body.name,
        height: req.body.height,
        weight: req.body.weight,
        birthdate: req.body.birthdate,
        married: req.body.married
    };
    db.run('UPDATE data SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?', [req.body.name, req.body.height, req.body.weight, req.body.birthdate, req.body.married, index], (err, data) => {
        if (err) return res.send(err)
        else res.redirect('/')
    })
}
)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})