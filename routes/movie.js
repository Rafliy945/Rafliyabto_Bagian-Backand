const express = require('express');
console.log('🔥 movies route loaded');
const router = express.Router();
const db = require('../config/db');

console.log('🔥 server start');

// POST SINGLE MOVIE (BARU)
// Endpoint: POST /api/movies
router.post('/', async (req, res) => {
  try {
    const { id, title, image, rating, year, isNew, top } = req.body;

    // Validasi input
    if (!id || !title) {
      return res.status(400).json({
        success: false,
        message: 'ID dan Title wajib diisi!',
      });
    }

    const sql = `
      INSERT INTO movies (id, title, image, rating, year, isNew, top)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      id,
      title,
      image || null,
      rating || 0,
      year || new Date().getFullYear(),
      isNew ? 1 : 0,
      top ? 1 : 0,
    ]);

    res.status(201).json({
      success: true,
      message: 'Film berhasil ditambahkan!',
      data: {
        id,
        title,
        image,
        rating,
        year,
        isNew,
        top,
      },
    });
  } catch (err) {
    // Handle duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'ID film sudah ada di database!',
      });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST BULK MOVIES
// Endpoint: POST /api/movies/bulk
router.post('/bulk', async (req, res) => {
  try {
    const movies = req.body;

    const sql =
      'INSERT INTO movies (id, title, image, rating, year, isNew, top) VALUES ?';

    const values = movies.map(m => [
      m.id,
      m.title,
      m.image,
      m.rating,
      m.year,
      m.isNew ? 1 : 0,
      m.top ? 1 : 0,
    ]);

    const [result] = await db.query(sql, [values]);

    res.json({
      success: true,
      message: `${result.affectedRows} film berhasil disimpan!`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET ALL MOVIES
// Endpoint: GET /api/movies
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM movies ORDER BY id DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET MOVIE BY ID
// Endpoint: GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Movie tidak ditemukan',
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE MOVIE
// Endpoint: PATCH /api/movies/:id

router.patch('/:id', async (req, res) => {
  try {
    const { title, image, rating, year, isNew, top } = req.body;

    const sql = `
      UPDATE movies
      SET title=?, image=?, rating=?, year=?, isNew=?, top=?
      WHERE id=?
    `;

    const [result] = await db.query(sql, [
      title,
      image,
      rating,
      year,
      isNew ? 1 : 0,
      top ? 1 : 0,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ID tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Data film berhasil diperbarui!',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE MOVIE
// Endpoint: DELETE /api/movies/:id
router.delete('/:id', async (req, res) => {
  console.log('🗑️ DELETE request diterima untuk ID:', req.params.id);
  try {
    // Convert string to integer
    const movieId = parseInt(req.params.id, 10);
    console.log('📌 ID dikonversi ke integer:', movieId);

    const [result] = await db.query(
      'DELETE FROM movies WHERE id = ?',
      [movieId]
    );
    console.log('📊 Hasil delete:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ID tidak ditemukan di DB',
      });
    }

    res.json({
      success: true,
      message: 'Film berhasil dihapus!',
    });
  } catch (err) {
    console.error('❌ Error delete:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;