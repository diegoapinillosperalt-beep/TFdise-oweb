import { Router } from 'express';
import { getConnection } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection(); // Obtenemos la conexión
    const result = await pool.request().query('SELECT idCategoria, Categoria FROM Categorias');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar categorías' });
  }
});

export default router;
