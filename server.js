
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/api", (req, res) => {
    res.send("Servidor MUTUA funcionando correctamente");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MUTUA conectada a MongoDB");

        app.listen(3000, () => {
            console.log("Servidor activo en http://localhost:3000");
        });
    })
    .catch(error => {
        console.error("Error de conexión:", error.message);
    });
