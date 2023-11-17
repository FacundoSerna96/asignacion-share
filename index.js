require("dotenv").config(); // Cargar variables de entorno desde .env

const bodyParser = require("body-parser");

const fileUpload = require("express-fileupload");

const express = require("express");
const writeToLog = require("./log");
const app = express();
const port = process.env.PORT || 3000;

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());


app.post("/asignarTarea/:id", (req, res) => {
  let EDFile = req.files.file;
  let nuevoAsignado = req.params.id

  EDFile.mv(`./files/${EDFile.name}`, (err) => {
    if (err) return res.status(500).send({ message: err });

    // require csvtojson
    var csv = require("csvtojson");
    let ListaIDs = [];

    // Convert a csv file with csvtojson
    csv()
      .fromFile(`./files/${EDFile.name}`)
      .then(function (jsonArrayObj) {
        //when parse finished, result will be emitted here.
        jsonArrayObj.forEach((e) => {
          ListaIDs.push(e.ID_);
        });
        console.log("lista de ids: ", ListaIDs);
        cambiarAsignados(ListaIDs, nuevoAsignado);
      });
  });
});

const cambiarAsignados = (ListaIDs, nuevoAsignado) => {
  ListaIDs.forEach(async (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic YWRtaW46VDFnMEMwbDBtYjE0MjAq");
    myHeaders.append("Cookie", "alf_aps=084959b4bfa9c7be5df263e88ba15c7c");

    var raw = JSON.stringify({
      assignee: nuevoAsignado,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      `${process.env.API}/enterprise/tasks/${id}/action/assign`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => writeToLog(`Se cambia el asignado de la tarea ${id} al usuario con id ${nuevoAsignado}`))
      .catch((error) => writeToLog(`Error al asignar la tarea ${id} al usuario con id ${nuevoAsignado}`));
  });
};

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
