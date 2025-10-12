import express from 'express';
import { getConnection } from '../db.js';

export const router = express.Router();

// GET /api/admin/pedidos → obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT p.idPedido, p.FechaPedido, p.Total, p.idEstado,
             dp.idPlato, pl.Plato AS nombrePlato,
             dp.Cantidad, dp.PrecioUnitario, dp.Subtotal,
             u.Nombre AS cliente
      FROM Pedidos p
      LEFT JOIN DetallesPedido dp ON dp.idPedido = p.idPedido
      LEFT JOIN Platos pl ON pl.idPlato = dp.idPlato
      LEFT JOIN Usuarios u ON u.idUsuario = p.idUsuario
      ORDER BY p.FechaPedido DESC
    `);

    const rows = result.recordset;
    const pedidosMap = {};

    rows.forEach(row => {
      if (!pedidosMap[row.idPedido]) {
        pedidosMap[row.idPedido] = {
          idPedido: row.idPedido,
          FechaPedido: row.FechaPedido,
          Total: row.Total,
          idEstado: row.idEstado,
          cliente: row.cliente,
          detalles: []
        };
      }
      if (row.idPlato) {
        pedidosMap[row.idPedido].detalles.push({
          idPlato: row.idPlato,
          nombrePlato: row.nombrePlato,
          Cantidad: row.Cantidad,
          PrecioUnitario: row.PrecioUnitario,
          Subtotal: row.Subtotal
        });
      }
    });

    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error('❌ Error al obtener pedidos admin:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// PATCH /api/admin/pedidos/:id → actualizar estado
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { idEstado } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('idPedido', parseInt(id))
      .input('idEstado', idEstado)
      .query(`UPDATE Pedidos SET idEstado = @idEstado WHERE idPedido = @idPedido`);

    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { idEstado } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('idPedido', parseInt(id))
      .input('idEstado', idEstado)
      .query(`UPDATE Pedidos SET idEstado = @idEstado WHERE idPedido = @idPedido`);

    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});
