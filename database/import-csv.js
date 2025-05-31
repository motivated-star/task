const fs = require("fs");
const csv = require("csv-parser");
const Property = require("../models/property");

async function importCSV(filePath = "db424fd9fb74_1748258398689.csv") {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        try {
          const record = {
            id: data.id,
            title: data.title,
            type: data.type,
            price: Number(data.price),
            state: data.state,
            city: data.city,
            areaSqFt: Number(data.areaSqFt),
            bedrooms: Number(data.bedrooms),
            bathrooms: Number(data.bathrooms),
            amenities: data.amenities ? data.amenities.split("|") : [],
            furnished: data.furnished,
            availableFrom: new Date(data.availableFrom),
            listedBy: data.listedBy,
            tags: data.tags ? data.tags.split("|") : [],
            colorTheme: data.colorTheme,
            rating: Number(data.rating),
            isVerified: data.isVerified === "true" || data.isVerified === true,
            listingType: data.listingType,
            createdBy: data.createdBy,
          };
          results.push(record);
        } catch (err) {
          console.error("Error parsing row:", err);
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function upsertData(records) {
  const upsertPromises = records.map((record) =>
    Property.updateOne(
      { id: record.id },
      { $setOnInsert: record },
      { upsert: true }
    )
  );

  await Promise.all(upsertPromises);
}

module.exports = { importCSV, upsertData };
