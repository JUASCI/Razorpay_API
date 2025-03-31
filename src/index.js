import express from "express";
import crypto from "crypto";
import { Payment } from "./model.js";
import connectDB from "./connectDB.js";

const app = express();
app.use(express.json());

const RAZORPAY_SECRET = "This_API_is_maintained_by_JUASCI";

connectDB();

app.post("/webhook-handler", async (req, res) => {
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
    const amount = paymentDetails.amount;
    const updatedAmount = amount / 100;
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
    const data = await new Payment(details);
    await data.save();
    console.log("Payment Captured:", paymentDetails);
  }

  res.status(200).send("Payment Received Successfully");
});

app.get("/get-info/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const response = await Payment.find({ id: paymentId, amount: 103 });
    if (response.length == 0) {
      return res.status(400).send("Payment NOT done");
    }
    res.status(200).json({
      paymentDetails: response[0],
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("Webhook running on port 3000");
});
