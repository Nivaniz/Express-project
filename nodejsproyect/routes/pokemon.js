const express = require('express');
const pokemon = express.Router();
const db = require('../config/database.js');

// Add pokemons
pokemon.post("/", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = "INSERT INTO pokemon (pok_name, pok_height, pok_weight, pok_base_experience)";
        query += ` VALUES ('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience});`;

        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(201).json({code: 201, message: "Pokemon insertado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"})
});

// Borrar pokemon
pokemon.delete("/:id([0-9]{1,3})", async (req, res, next) => {
    const query = `DELETE FROM pokemon WHERE pok_id=${req.params.id}`;

    const rows = await db.query(query);

    if(rows.affectedRows == 1){
        return res.status(201).json({code: 201, message: "Pokemon borrado correctamente"});
    }
    res.status(404).send({ code: 404, message: "Pokemon no encontrado"});

});

// Actualizar todas filas de pokemon
pokemon.put("/:id([0-9]{1,3})", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = `UPDATE pokemon SET pok_name='${pok_name}',pok_height='${pok_height}',pok_weight='${pok_weight}',`;
        query += `pok_base_experience='${pok_base_experience}' WHERE pok_id=${req.params.id};`;

        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"})

});

// Actualizar una fila de pokemon
pokemon.patch("/:id([0-9]{1,3})", async (req, res, next) => {
    if(req.body.pok_name) {
        let query = `UPDATE pokemon SET pok_name='${req.body.pok_name}' WHERE pok_id=${req.params.id};`;
        const rows = await db.query(query);

        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

// Every pokemon 
pokemon.get("/", async (req, res, next) => {
    const pkmn = await db.query("SELECT * FROM pokemon");
    res.status(201).json({ code: 201, message: pkmn});
});

// By id
pokemon.get("/:id([0-9]{1,3})", async (req, res, next) => {
    const id = req.params.id;
    if(id >= 1 && id <= 724){ // Lo cambie es 722
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id="+id+";");
        return res.status(201).json({code: 201, message: pkmn})
    }
    res.status(404).send({ code: 404, message: "Pokemon no encontrado"});
    
});


// By name
pokemon.get("/:name([A-Za-z]+)", async (req, res, next) => {
    const name = req.params.name;
    const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_name='"+name+"';");
   if (pkmn.length > 0 ) {
        return res.status(201).json({code: 201, message: pkmn})
    };
    res.status(404).send({ code: 404, message: "Pokemon no encontrado"});
});


module.exports = pokemon;