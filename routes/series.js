const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. GET: Ambil data film BESERTA nama genrenya
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                series_films.id, 
                series_films.judul, 
                series_films.deskripsi, 
                series_films.rating,
                series_films.genre_id,
                genres.nama_genre AS genre
            FROM series_films
            INNER JOIN genres ON series_films.genre_id = genres.id
            ORDER BY series_films.id DESC
        `;
        
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows }); 
    } catch (err) { 
        res.status(500).json({ success: false, error: err.message }); 
    }
});
// Ganti bagian POST di series.js kamu dengan ini
router.post('/', async (req, res) => {
    const { genre_id, judul, deskripsi, rating } = req.body;
    try {
        // Urutan harus sama: genre_id, judul, deskripsi, rating
        const [result] = await db.query(
            'INSERT INTO series_films (genre_id, judul, deskripsi, rating) VALUES (?, ?, ?, ?)', 
            [genre_id, judul, deskripsi, rating]
        );
        res.status(201).json({ success: true, message: "Berhasil!" });
    } catch (err) { 
        console.error("ERROR DI TERMINAL:", err.message);
        res.status(500).json({ success: false, error: err.message }); 
    }
});

// 3. PATCH: Update data
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { genre_id, judul, deskripsi, rating } = req.body;
    try {
        const query = 'UPDATE series_films SET genre_id = ?, judul = ?, deskripsi = ?, rating = ? WHERE id = ?';
        const [result] = await db.query(query, [genre_id, judul, deskripsi, rating, id]);
        res.json({ success: true, message: "Data berhasil diperbarui!" });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ success: false, error: err.message }); 
    }
});
// 4. DELETE: Menghapus film
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM series_films WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data tidak ditemukan!" });
        }
        
        res.json({ success: true, message: "Data berhasil dihapus!" });
    } catch (err) { 
        res.status(500).json({ success: false, error: err.message }); 
    }
});

module.exports = router;