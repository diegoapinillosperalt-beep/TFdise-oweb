import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getConnection } from '../db.js';

export const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); //Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});

const upload = multer({ storage });


router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Platos');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener el menú:', err);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
});

// ---------------------
// GET /api/menu/:id → detalle de un plato

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Platos WHERE idPlato = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Plato no encontrado' });
    }
  } catch (err) {
    console.error('❌ Error al obtener el plato:', err);
    res.status(500).json({ error: 'Error al obtener el plato' });
  }
});

// ---------------------
// POST /api/menu → crear un nuevo plato con imagen
// ---------------------
router.post('/', upload.single('imagen'), async (req, res) => {
  console.log('⚡ POST /api/menu recibido:', req.body);

  const { idCategoria, Plato, Descripcion, Precio } = req.body;
  const URLImagen = req.file ? req.file.filename : null;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('idCategoria', idCategoria)
      .input('Plato', Plato)
      .input('Descripcion', Descripcion)
      .input('Precio', Precio)
      .input('URLImagen', URLImagen)
      .query(`
        INSERT INTO Platos (idCategoria, Plato, Descripcion, Precio, URLImagen)
        VALUES (@idCategoria, @Plato, @Descripcion, @Precio, @URLImagen)
      `);

    console.log('✅ Plato insertado en BD con imagen');
    res.status(201).json({ message: 'Plato creado correctamente', URLImagen });
  } catch (err) {
    console.error('❌ Error al crear plato:', err);
    res.status(500).json({ error: 'Error al crear plato' });
  }
});

// ---------------------
// PUT /api/menu/:id → actualizar un plato
// ---------------------
router.put('/:id', upload.single('imagen'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { idCategoria, Plato, Descripcion, Precio } = req.body;
  const URLImagen = req.file ? req.file.filename : req.body.URLImagen;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idCategoria', idCategoria)
      .input('Plato', Plato)
      .input('Descripcion', Descripcion)
      .input('Precio', Precio)
      .input('URLImagen', URLImagen)
      .input('id', id)
      .query(`
        UPDATE Platos
        SET idCategoria=@idCategoria,
            Plato=@Plato,
            Descripcion=@Descripcion,
            Precio=@Precio,
            URLImagen=@URLImagen
        WHERE idPlato=@id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }

    res.json({ message: 'Plato actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar plato:', err);
    res.status(500).json({ error: 'Error al actualizar plato' });
  }
});

// ---------------------
// DELETE /api/menu/:id → eliminar un plato
// ---------------------
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const pool = await getConnection();

    // 1️⃣ Buscar la imagen actual
    const result = await pool.request()
      .input('id', id)
      .query('SELECT URLImagen FROM Platos WHERE idPlato = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }

    const imagen = result.recordset[0].URLImagen;

    // 2️⃣ Eliminar el plato
    await pool.request()
      .input('id', id)
      .query('DELETE FROM Platos WHERE idPlato = @id');

    // 3️⃣ Eliminar imagen física si existe
    if (imagen) {
      const rutaImagen = `./uploads/${imagen}`;
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
        console.log(`🖼️ Imagen eliminada: ${rutaImagen}`);
      }
    }

    res.json({ message: 'Plato eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar plato:', err);
    res.status(500).json({ error: 'Error al eliminar plato' });
  }
});
