import express from 'express';
import { getConnection } from '../db.js';
import sql from 'mssql';  // necesario para las consultas

const router = express.Router();

// Registro: siempre cliente (idRol = 2)
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, direccion, telefono } = req.body;

  try {
    const pool = await getConnection();

    // Verificar si el correo ya existe
    const existing = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE Correo = @correo');

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    // Insertar usuario en texto plano
    await pool.request()
      .input('idRol', sql.Int, 2)
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('contrasena', sql.VarChar, contrasena)
      .input('direccion', sql.VarChar, direccion)
      .input('telefono', sql.VarChar, telefono)
      .query(`INSERT INTO Usuarios (idRol, Nombre, Correo, Contrasena, Direccion, Telefono)
              VALUES (@idRol, @nombre, @correo, @contrasena, @direccion, @telefono)`);

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
// Login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE Correo = @correo');

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const usuario = result.recordset[0];

    if (usuario.Contrasena !== contrasena) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // ✅ Enviar idUsuario también
    res.json({
      idUsuario: usuario.idUsuario,   // ⚡ importante
      correo: usuario.Correo,
      isAdmin: usuario.idRol === 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;



// ==========================================================
// ADMIN: Gestión de Usuarios
// ==========================================================

// 📋 Obtener todos los usuarios
router.get('/admin/usuarios', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT idUsuario, Nombre, Correo, Telefono, Direccion, idRol
              FROM Usuarios`);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// 🗑️ Eliminar usuario por ID
router.delete('/admin/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE idUsuario = @idUsuario');

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// ✏️ Editar usuario (por ejemplo nombre, correo, rol)
router.put('/admin/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, direccion, idRol } = req.body;

  try {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('telefono', sql.VarChar, telefono)
      .input('direccion', sql.VarChar, direccion)
      .input('idRol', sql.Int, idRol)
      .query(`
        UPDATE Usuarios
        SET Nombre = @nombre, Correo = @correo,
            Telefono = @telefono, Direccion = @direccion, idRol = @idRol
        WHERE idUsuario = @idUsuario
      `);

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});
