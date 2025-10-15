  import express from 'express';
  import cors from 'cors';
  import authRoutes from './routes/auth.js'; // <-- Asegúrate de que la ruta y el nombre coinciden
  import { router as menuRouter } from './routes/menu.js';
  import { router as pedidoRouter } from './routes/pedido.js';
  import { router as adminPedidosRouter } from './routes/admin-pedido.js';
  import categoriasRouter from './routes/categorias.js';
  import path from 'path';               // ⚡ Importa path
import { fileURLToPath } from 'url';   // ⚡ Para definir __dirname

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



  const app = express();
  app.use(cors());
  app.use(express.json());

  // Ruta base
  app.get('/', (req, res) => {
    res.send('✅ API Doña Beny funcionando');
  });

  // Rutas
  app.use('/api/auth', authRoutes); // <-- Esto conecta /api/auth/register y /api/auth/login
  app.use('/api/menu', menuRouter);
  app.use('/api/categorias', categoriasRouter);
  app.use('/api/pedido', pedidoRouter);
  app.use('/api/admin/pedidos', adminPedidosRouter);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
