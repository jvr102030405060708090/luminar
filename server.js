require('dotenv').config();
const express = require('express');
require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// Configuración de la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Luminar'
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Función middleware para verificar admin
function isAdmin(req, res, next) {
    // Por ahora, permitimos el acceso sin verificación
    next();
}

  connection.connect();

// Ruta para obtener productos populares
// API para productos populares
app.get('/api/productos-populares', (req, res) => {
    const query = `
        SELECT p.nombre_producto, p.descripcion, p.imagen, SUM(d.cantidad) AS total_vendido
        FROM Productos p
        JOIN Detalle_Ordenes d ON p.producto_id = d.producto_id
        GROUP BY p.producto_id
        ORDER BY total_vendido DESC
        LIMIT 4;
    `;
  
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});


// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL');
    } catch (err) {
        console.error('Error de conexión a MySQL:', err.message);
        process.exit(1);
    }
})();

// Definir el modelo de Usuario
const User = sequelize.define('Usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Definir el modelo de Rol
const Role = sequelize.define('Rol', {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Roles',
    timestamps: false,
});

// Relación entre Usuarios y Roles
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

// Sincronizar los modelos con la base de datos
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados');
    } catch (err) {
        console.error('Error sincronizando modelos:', err.message);
        process.exit(1);
    }
})();

// Importar y usar el módulo de autenticación
try {
    const authRoutes = require('./controllers/auth')(sequelize);
    app.use('/', authRoutes);
} catch (err) {
    console.error('Error al cargar las rutas de autenticación:', err.message);
}

// Ruta para obtener productos populares
app.get('/api/productos-populares', (req, res) => {
  const query = `
    SELECT p.nombre_producto, p.descripcion, p.imagen, SUM(d.cantidad) AS total_vendido
    FROM Productos p
    JOIN Detalle_Ordenes d ON p.producto_id = d.producto_id
    GROUP BY p.producto_id
    ORDER BY total_vendido DESC
    LIMIT 4;
  `;
  
  connection.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
  });
});

const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
    // Supongamos que tienes un token JWT con información del usuario
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Acceso no autorizado');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.rol_id === 1) { // Suponiendo que 1 es el rol de administrador
            req.user = decoded; // Guarda la información del usuario en la solicitud
            return next();
        } else {
            return res.status(403).send('Acceso denegado');
        }
    } catch (err) {
        return res.status(403).send('Token inválido');
    }
}

// Rutas para vistas HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login-register.html')));
app.get('/', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'accounts.html'));});
app.get('/detalles-cuenta', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'detalles-cuenta.html'));});
app.get('/mis-pedidos', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'mis-pedidos.html'));});
app.get('/preferencias', (req, res) => {res.sendFile(path.join(__dirname, 'views', 'preferencias.html'));});
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'views', 'cart.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'views', 'checkout.html')));
app.get('/dashboard-admin', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-admin.html')));
app.get('/dashboard-cliente', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-cliente.html')));
app.get('/dashboard-vendedor', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard-vendedor.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/productos', (req, res) => res.sendFile(path.join(__dirname, 'views', 'productos.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'views', 'shop.html')));
app.get('/whishlist', (req, res) => res.sendFile(path.join(__dirname, 'views', 'whishlist.html'))); 
// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
