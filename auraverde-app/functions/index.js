const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { MercadoPagoConfig, Preference } = require("mercadopago");

admin.initializeApp();

// Configurar Access Token de MercadoPago
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
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

      console.log("Receiving items:", JSON.stringify(items)); // Debug logging

      const body = {
        items: items.map(item => {
          const rawPrice = item.price || item.unit_price;
          const title = item.name || item.title || "Item";
          const picture_url = item.image || item.picture_url;

          let price = Number(rawPrice);
          if (isNaN(price)) {
              // Try to parse string manually if needed, removing potential currency symbols
              price = parseFloat(String(rawPrice).replace(/[^0-9.-]+/g,""));
          }
          if (isNaN(price)) {
              console.error(`Invalid price for item ${title}: ${rawPrice}`);
              price = 0; // Or handle error
          }
          
          return {
            title: title,
            quantity: Number(item.quantity),
            unit_price: price, // Ensure it's a number
            currency_id: "ARS",
            picture_url: picture_url
          };
        }),
        back_urls: {
          success: "https://robertofiori.github.io/auraverde/success",
          failure: "https://robertofiori.github.io/auraverde/failure",
          pending: "https://robertofiori.github.io/auraverde/pending"
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

exports.uploadImage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method === "OPTIONS") {
        return res.status(204).send();
      }

      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      console.log("Request Body Keys:", Object.keys(req.body));
      const { base64Image, fileName, contentType } = req.body;
      
      if (!base64Image || !fileName) {
        console.error("Missing fields. Body keys:", Object.keys(req.body));
        return res.status(400).send(`Missing base64Image or fileName. Received keys: ${Object.keys(req.body).join(",")}`);
      }

      // Production bucket name for this project
      const BUCKET_NAME = "auraverde-db.firebasestorage.app";
      const bucket = admin.storage().bucket(BUCKET_NAME);

      const filePath = `products/${Date.now()}_${fileName}`;
      const file = bucket.file(filePath);
      const buffer = Buffer.from(base64Image, 'base64');
      
      await file.save(buffer, {
        metadata: {
          contentType: contentType || 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        }
      });

      // Construct the public URL (Requires rules to allow read for products/)
      const encodedPath = encodeURIComponent(filePath);
      const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media`;

      console.log(`Upload successful. URL: ${downloadURL}`);
      res.json({ url: downloadURL });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
