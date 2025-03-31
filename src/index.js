import express from "express";
import crypto from "crypto";
import { Payment } from "./model.js";
import connectDB from "./connectDB.js";

const app = express();
app.use(express.json());

const RAZORPAY_SECRET = "This_API_is_maintained_by_JUASCI";

connectDB();

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ error: "Something went wrong, please try again later." });
};

app.post("/webhook-handler", async (req, res, next) => {
  try {
    const sign =
      req.headers["x-razorpay-signature"] || req.headers["X-Razorpay-Signature"];
    const actualSign = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (sign !== actualSign) {
      console.log("Invalid signature received!");
      return res.status(401).send("Invalid Signature");
    }

    console.log("Webhook Received:", req.body);

    if (req.body.event === "payment.captured") {
      const paymentDetails = req.body.payload.payment.entity;
      const updatedAmount = paymentDetails.amount / 100;
      const details = {
        id: paymentDetails.id,
        amount: updatedAmount,
        status: paymentDetails.status,
        international: paymentDetails.international,
        method: paymentDetails.method,
        vpa: paymentDetails.vpa,
        email: paymentDetails.email,
        contact: paymentDetails.contact,
      };

      const data = new Payment(details);
      await data.save();
      console.log("Payment Captured:", paymentDetails);
    }
import express from "express";
import crypto from "crypto";
import { Payment } from "./model.js";
import connectDB from "./connectDB.js";

const app = express();
app.use(express.json());

const RAZORPAY_SECRET = "This_API_is_maintained_by_JUASCI";

connectDB();

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ error: "Something went wrong, please try again later." });
};

app.post("/webhook-handler", async (req, res, next) => {
  try {
    const sign =
      req.headers["x-razorpay-signature"] || req.headers["X-Razorpay-Signature"];
    const actualSign = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (sign !== actualSign) {
      console.log("Invalid signature received!");
      return res.status(401).send("Invalid Signature");
    }

    console.log("Webhook Received:", req.body);

    if (req.body.event === "payment.captured") {
      const paymentDetails = req.body.payload.payment.entity;
      const updatedAmount = paymentDetails.amount / 100;
      const details = {
        id: paymentDetails.id,
        amount: updatedAmount,
        status: paymentDetails.status,
        international: paymentDetails.international,
        method: paymentDetails.method,
        vpa: paymentDetails.vpa,
        email: paymentDetails.email,
        contact: paymentDetails.contact,
      };

      const data = new Payment(details);
      await data.save();
      console.log("Payment Captured:", paymentDetails);
    }


    res.status(200).send("Payment Received Successfully");
  } catch (err) {

    next(err); // Pass error to middleware
  }
});

app.get("/get-info/:paymentId", async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const response = await Payment.find({ id: paymentId, amount: 103 });

    if (!response.length) {
      return res.status(404).json({ error: "Payment NOT done" });
    }

    res.status(200).json({ paymentDetails: response[0] });
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Apply global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Webhook running on port ${PORT}`);
});

// Graceful shutdown for unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});

    res.status(200).send("Payment Received Successfully");
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

app.get("/get-info/:paymentId", async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const response = await Payment.find({ id: paymentId, amount: 103 });

    if (!response.length) {
      return res.status(404).json({ message: "Payment NOT done" });
    }

    res.status(200).json({ paymentDetails: response[0] });
  } catch (err) {
    next(err); // Pass error to middleware
  }
});

// Apply global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Webhook running on port ${PORT}`);
});

// Graceful shutdown for unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
