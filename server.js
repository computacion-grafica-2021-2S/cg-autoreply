"use strict";

const fs = require("fs");
const axios = require('axios');
const FormData = require('form-data');
const open = require('open');

const file = './modelo3d.pdf';
const baseUrl = 'https://cg-backend-api.herokuapp.com';
// const baseUrl = 'http://localhost:3000';

function sleep(ms) {
   return new Promise((resolve) => {
      setTimeout(resolve, ms);
   });
}

const getPriceQuotes = async () => {
   try {
      // const pendings = await axios.get(`${baseUrl}/api/v1/pricequotes/pendings`);
      const pendings = await axios.get(`https://cg-backend-api.herokuapp.com/api/v1/pricequotes/pendings`);
      const priceQuotes = pendings.data.data;

      if (Array.isArray(priceQuotes)) {
         for (let priceQuote of priceQuotes) {
            console.log(`Generando Cotización #${priceQuote._id}`);
            let name = priceQuote.product.name;
            let category = priceQuote.product.category;
            let path;

            switch (category) {
               case "Dron de Bajo Costo":
                  switch (name) {
                     case "Baja": path = "/Modelado Dron Lowcost/DroneLowCostProject/AssemblyDroneLowcost.iam"; break;
                     case "Alta": path = "/Modelado Dron Lowcost/DroneLowCostProject/AssemblyDroneLowcost-Alta.iam"; break;
                  }
                  break;

               case "Dron de Carga":
                  switch (name) {
                     case "Baja": path = "/Dron Carga final/Ensamble Dron Carga.iam"; break;
                     case "Media": path = "/Dron Carga final/Ensamble Dron Carga.iam"; break;
                     case "Alta": path = "/Dron Carga final/Ensamble Dron Carga.iam"; break;
                  }
                  break;

               case "Dron de Grabación":
                  switch (name) {
                     case "Bajo": path = "/Dron Grabacion Final/Dron Grabacion Bajo.iam"; break;
                     case "Medio": path = "/Dron Grabacion Final/Dron Grabacion Medio.iam"; break;
                     case "Super Ágil": path = "/Dron Grabacion Final/Dron Grabacion Agil.iam"; break;
                  }
                  break;

               case "Dron de Velocidad":
                  switch (name) {
                     case "29970": path = "/Modelado Dron velocidad/Velocidad baja.iam"; break;
                     case "34040": path = "/Modelado Dron velocidad/Velocidad baja.iam"; break;
                     case "39960": path = "/Modelado Dron velocidad/Velocidad alta.iam"; break;
                  }
                  break;
            }

            console.log(`Abriendo modelo: ./modelos${path}`);
            await open(`./modelos${path}`);

            while (true) {
               if (fs.existsSync(file)) {
                  await sleep(60000);
                  const form = new FormData();
                  form.append('file', fs.createReadStream(file));
                  console.log("Subiendo archivo...");
                  const result = await axios.post(`${baseUrl}/api/v1/pricequotes/${priceQuote._id}/send`, form, { headers: form.getHeaders() })
                  console.log("Eliminado copia de archivo local...");
                  fs.unlinkSync(file);
                  break;
               }
            }
         }
      }
   }
   catch (error) { /*console.error(error);*/ }
}

const start = async () => {
   console.log('Iniciando aplicación...');

   while (true) {
      console.log('Esperando cotizaciones a realizar...');
      await getPriceQuotes();
      await sleep(20000);
   }
}

start();