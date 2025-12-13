// utils/csvReader.js
const fs = require("fs");
const csv = require("csv-parser");
const RevenueModel = require("../modules/revenue/models/revenue-model");

/**
 * Read CSV file and transform it into revenue records
 *
 * @param {string} filePath - Path to CSV file
 * @param {number} month - Revenue month
 * @param {number} year - Revenue year
 * @param {string} createdBy - User ID who uploads the CSV
 * @returns {Promise<Array>} - Array of saved revenue documents
 */
function parseRevenueCSV(filePath, month, year, createdBy) {
  return new Promise((resolve, reject) => {
    const groupedData = {};
    const savedDocs = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Group by company + invoice
        const key = `${row.company}_${row.invoice}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            company: row.company,
            invoice: Number(row.invoice),
            fixed_cost: Number(row.fixed_cost),
            products: [],
          };
        }

        groupedData[key].products.push({
          name: row.product_name,
          units_sold: Number(row.units_sold),
          price: Number(row.price),
          variable_cost: Number(row.variable_cost),
        });
      })
      .on("end", async () => {
        try {
          for (const key in groupedData) {
            const entry = groupedData[key];

            // Calculate revenue
            const revenue = entry.products.reduce(
              (sum, p) => sum + p.units_sold * p.price,
              0
            );

            // Calculate variable cost
            const variable_cost = entry.products.reduce(
              (sum, p) => sum + p.units_sold * p.variable_cost,
              0
            );

            // Calculate profit
            const profit =
              revenue - variable_cost - entry.fixed_cost;

            // Create revenue document
            const doc = new RevenueModel({
              company: entry.company,
              invoice: entry.invoice,
              revenue,
              variable_cost,
              fixed_cost: entry.fixed_cost,
              profit,
              products: entry.products,
              month: Number(month),
              year: Number(year),
              createdBy, // 🔥 REQUIRED for ownership & RBAC
            });

            const saved = await doc.save();
            savedDocs.push(saved);
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
