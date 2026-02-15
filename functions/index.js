const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { MercadoPagoConfig, Preference } = require("mercadopago");

admin.initializeApp();

// Configura tu Access Token de MercadoPago aquí o usa variables de entorno
// const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
// Por ahora usaremos un placeholder para que el usuario lo rellene
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "PON_TU_ACCESS_TOKEN_AQUI";
const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

exports.createPreference = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      const { items, orderId } = req.body;

      if (!items || !orderId) {
        return res.status(400).send("Missing items or orderId");
      }

      const body = {
        items: items.map(item => ({
          title: item.name,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: "ARS",
          picture_url: item.image
        })),
        back_urls: {
          success: "http://localhost:5173/auraverde/success", // Cambiar por URL de producción al desplegar
          failure: "http://localhost:5173/auraverde/failure",
          pending: "http://localhost:5173/auraverde/pending"
        },
        auto_return: "approved",
        external_reference: orderId,
      };

      const preference = new Preference(client);
      const result = await preference.create({ body });

      res.json({ id: result.id });
    } catch (error) {
      console.error("Error creating preference:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
