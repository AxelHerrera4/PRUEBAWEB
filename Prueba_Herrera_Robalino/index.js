const express = require('express');
const app = express();
const db = require('./db');

app.use(express.json());



app.get('/', (req, res) => {
    res.send('API de Gestión de Libros');
});


app.get('/libros', (req, res) => {
    db.query('SELECT * FROM libros', (err, results) => {
        if (err) {
            return res.status(500).send('Error al consultar la base de datos');
        }
        res.send(results);
    });
});


app.get('/libros/:id', (req, res) => {
    const libroId = req.params.id;
    db.query('SELECT * FROM libros WHERE id = ?', [libroId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al consultar la base de datos');
        }
        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }
        res.send(results[0]);
    });
});


app.post('/libros', (req, res) => {
    const { titulo, autor, anio } = req.body;
    if (!titulo || !autor || !anio) {
        return res.status(400).send('Datos incompletos');
    }

    db.query('INSERT INTO libros (titulo, autor, anio) VALUES (?, ?, ?)', [titulo, autor, anio], (err, results) => {
        if (err) {
            return res.status(500).send('Error al insertar el libro');
        }
        res.status(201).send({ id: results.insertId, titulo, autor, anio });
    });
});


app.put('/libros/:id', (req, res) => {
    const libroId = req.params.id;
    const { titulo, autor, anio } = req.body;

    db.query('SELECT * FROM libros WHERE id = ?', [libroId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al consultar la base de datos');
        }
        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        const updatedLibro = {
            titulo: titulo || results[0].titulo,
            autor: autor || results[0].autor,
            anio: anio || results[0].anio
        };

        db.query('UPDATE libros SET titulo = ?, autor = ?, anio = ? WHERE id = ?', 
            [updatedLibro.titulo, updatedLibro.autor, updatedLibro.anio, libroId], 
            (err, results) => {
                if (err) {
                    return res.status(500).send('Error al actualizar el libro');
                }
                res.send(updatedLibro);
            });
    });
});


app.delete('/libros/:id', (req, res) => {
    const libroId = req.params.id;

    db.query('SELECT * FROM libros WHERE id = ?', [libroId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al consultar la base de datos');
        }
        if (results.length === 0) {
            return res.status(404).send('Libro no encontrado');
        }

        db.query('DELETE FROM libros WHERE id = ?', [libroId], (err, results) => {
            if (err) {
                return res.status(500).send('Error al eliminar el libro');
            }
            res.send(results);
        });
    });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}...`));
