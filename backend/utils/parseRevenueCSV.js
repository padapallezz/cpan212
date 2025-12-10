// utils/csvReader.js
const fs = require("fs");
const csv = require("csv-parser");
const RevenueModel = require("../modules/revenue/models/revenue-model"); 


/**
 * Read CSV file and transform into revenue records
 * @param {string} filePath - path to CSV file
 * @returns {Promise<Array>} - array of saved revenue objects
 */
// utils/csvReader.js
function parseRevenueCSV(filePath, month, year) {
  return new Promise((resolve, reject) => {
    const results = {};
    const savedDocs = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const key = row.company + "_" + row.invoice;

        if (!results[key]) {
          results[key] = {
            company: row.company,
            invoice: Number(row.invoice),
            fixed_cost: Number(row.fixed_cost),
            products: []
          };
        }

        results[key].products.push({
          name: row.product_name,
          units_sold: Number(row.units_sold),
          price: Number(row.price),
          variable_cost: Number(row.variable_cost)
        });
      })
      .on("end", async () => {
        try {
          for (const key in results) {
            const entry = results[key];

            const revenue = entry.products.reduce(
              (sum, p) => sum + p.units_sold * p.price,
              0
            );
            const variable_cost = entry.products.reduce(
              (sum, p) => sum + p.units_sold * p.variable_cost,
              0
            );
            const profit = revenue - variable_cost - entry.fixed_cost;

            const doc = new RevenueModel({
              ...entry,
              revenue,
              variable_cost,
              profit,
              month: Number(month),
              year: Number(year),
            });

            const saved = await doc.save();
            savedDocs.push(saved);
            console.log(`Saved invoice ${entry.invoice} for ${entry.company}`);
          }
          resolve(savedDocs);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}

module.exports = parseRevenueCSV;
