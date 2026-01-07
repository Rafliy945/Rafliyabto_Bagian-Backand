const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const seriesRoutes = require('./routes/series');
const movieRoutes = require('./routes/movie');

app.get('/', (req, res) => {
  res.json({ message: 'Server Aktif' });
});

app.use('/api/series', seriesRoutes);
app.use('/api/movies', movieRoutes);

console.log('✅ Routes terpasang: /api/series dan /api/movies');

// 404 handler (HARUS PALING BAWAH)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Alamat URL tidak ditemukan',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});