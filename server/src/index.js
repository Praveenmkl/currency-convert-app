const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Config
require("dotenv").config();

console.log(process.env.APP_ID);

// Middleware
app.use(express.json());
app.use(cors());

// Route
app.get("/convert", async (req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } =
    req.query;

    console.log(req.query)
  const currencyURL = `https://openexchangerates.org/api/historical/2023-04-04.json?app_id=acb5260b336242a6a92a9dc4fc66bf4f`;
  const namesURl = `https://openexchangerates.org/api/currencies.json?app_id=${process.env.APP_ID}`;
  try {
    const response = await axios.get(currencyURL);
    const data = response.data;

    console.log('currency data on date ' , data )

    // Check the data is valid
    if (!data || response.status !== 200) {
      throw new Error("Unable to fetch exchange rates");
    }

    const rates = data.rates;

    // Check if the entered sourceCurrency and targetCurrency are available
    if (
      !rates.hasOwnProperty(sourceCurrency) ||
      !rates.hasOwnProperty(targetCurrency)
    ) {
      throw new Error(
        "The entered sourceCurrency and targetCurrency are not available"
      );
    }

    //get the names of the currencies
    const namesResponse = await axios.get(namesURl);
    const namesData = namesResponse.data;

    //sourceCurrency name
    const sourceCurrencyName = namesData[sourceCurrency];
    //targetCurrency name
    const targetCurrencyName = namesData[targetCurrency];

    // Perform the conversion
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    const targetValue = (targetRate / sourceRate) * amountInSourceCurrency;

    return res.json({
      amountInTargetCurrency: targetValue.toFixed(2),
      sourceCurrencyName,
      targetCurrencyName,
    });
  } catch (err) {
    console.error( 'eroor' ,err);
    res.status(500).json({ error: "An error occurred" });
  }
});
//all currences
app.get("/getAllCurrencies", async (req, res) => {
  const namesURl = `https://openexchangerates.org/api/currencies.json?app_id=${process.env.APP_ID}`;
  try {
    const namesResponse = await axios.get(namesURl);
    const namesData = namesResponse.data;

    return res.json(namesData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Port
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
