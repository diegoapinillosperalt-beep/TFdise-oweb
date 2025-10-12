// backend/routes/pedido.js
import express from 'express';
import { getConnection } from '../db.js';

export const router = express.Router();

// =========================
// POST /api/pedido → crear pedido
// =========================
router.post('/', async (req, res) => {
  const { idUsuario, idDistrito, total, detalles } = req.body;

  try {
    const pool = await getConnection();

    // Insertar pedido principal (idEstado fijo = 1)
    const pedidoResult = await pool.request()
      .input('idUsuario', idUsuario)
      .input('idDistrito', idDistrito)
      .input('total', total)
      .input('idEstado', 1)
      .query(`
        INSERT INTO Pedidos (idUsuario, idDistrito, Total, idEstado)
        VALUES (@idUsuario, @idDistrito, @total, @idEstado);
        SELECT SCOPE_IDENTITY() AS idPedido;
      `);

    const idPedido = pedidoResult.recordset[0].idPedido;

    // Insertar detalles del pedido
    for (const item of detalles) {
      await pool.request()
        .input('idPedido', idPedido)
        .input('idPlato', item.idPlato)
        .input('Cantidad', item.cantidad)
        .input('PrecioUnitario', item.precioUnitario)
        .input('Subtotal', item.subtotal)
        .query(`
          INSERT INTO DetallesPedido (idPedido, idPlato, Cantidad, PrecioUnitario, Subtotal)
          VALUES (@idPedido, @idPlato, @Cantidad, @PrecioUnitario, @Subtotal);
        `);
    }

    res.status(201).json({ ok: true, idPedido });
  } catch (error) {
    console.error('❌ Error al registrar pedido:', error);
    res.status(500).json({ error: 'Error al registrar el pedido' });
  }
});

// =========================
// GET /api/pedido?emailUsuario=… → obtener pedidos de un usuario
// =========================
// backend/routes/pedido.js
router.get('/', async (req, res) => {
  const { idUsuario } = req.query;

  if (!idUsuario) {
    return res.status(400).json({ error: 'Falta idUsuario' });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idUsuario', parseInt(idUsuario))
      .query(`
        SELECT 
          p.idPedido, 
          p.FechaPedido, 
          p.Total, 
          p.idEstado,
          dp.idPlato,
          pl.Plato AS nombrePlato,  -- ⚡ nombre del plato
          dp.Cantidad, 
          dp.PrecioUnitario, 
          dp.Subtotal
        FROM Pedidos p
        LEFT JOIN DetallesPedido dp ON dp.idPedido = p.idPedido
        LEFT JOIN Platos pl ON pl.idPlato = dp.idPlato
        WHERE p.idUsuario = @idUsuario
        ORDER BY p.FechaPedido DESC
      `);

    // Agrupar detalles por pedido
    const rows = result.recordset;
    const pedidosMap = {};
    rows.forEach(row => {
      if (!pedidosMap[row.idPedido]) {
        pedidosMap[row.idPedido] = {
          idPedido: row.idPedido,
          FechaPedido: row.FechaPedido,
          Total: row.Total,
          idEstado: row.idEstado,
          detalles: []
        };
      }
      if (row.idPlato) {
        pedidosMap[row.idPedido].detalles.push({
          idPlato: row.idPlato,
          nombrePlato: row.nombrePlato,  // ⚡ nombre del plato
          Cantidad: row.Cantidad,
          PrecioUnitario: row.PrecioUnitario,
          Subtotal: row.Subtotal
        });
      }
    });

    res.json(Object.values(pedidosMap));
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

