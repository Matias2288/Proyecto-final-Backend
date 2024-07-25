import express from "express";
import handlebars from "./config/handlebars.config.js";
import productsRouter from "./routes/api.products.router.js";
import cartsRouter from "./routes/api.carts.router.js";
import paths from "./utils/paths.js";
import productsViewRouter from "./routes/app.products.router.js";
import cartViewRouter from "./routes/app.cart.router.js";
import serverSocket from "./config/socket.config.js";
import mongoDB from "./config/mongoose.config.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

// Decodificadores del BODY
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Enrutadores
server.use("/", productsViewRouter);
server.use("/", cartViewRouter);
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

// Ruta estática
server.use(express.static(paths.public));

// Configuración Handlebars
handlebars.config(server);

// Rutas inexistentes
server.use("*", (req, res) => {
    res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Errores internos
server.use((error, req, res) => {
    console.log("Error:", error.message);
    res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

// Oyente de peticiones
const serverHTTP = server.listen(PORT, () => {
    console.log(`Servidor en http://${HOST}:${PORT}/products`) ;
    mongoDB.connectDB();
});

// Configuracion websocket
serverSocket.config(serverHTTP);