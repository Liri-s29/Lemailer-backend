const fs = require("fs");

const parse_tsv = async (tsv_file) => {
	return new Promise((resolve, reject) => {
		const emailData = [];
		let headers;

		const processRow = (row) => {
			const values = row.split("\t");
			const rowObject = {};

			for (let j = 0; j < headers.length; j++) {
				const columnName = headers[j].trim(); // Trim column name
				const value = values[j].trim(); // Trim value
				rowObject[columnName] = value;
			}

			emailData.push(rowObject);
		};

		fs.createReadStream(tsv_file, { encoding: "utf-8" })
			.on("data", (data) => {
				const rows = data.split("\n");

				if (!headers) {
					headers = rows[0].split("\t");
					headers = headers.map((header) => header.replace(/\r/g, "")); // Remove \r from column names
					rows.splice(0, 1);
				}

				for (let i = 0; i < rows.length; i++) {
					processRow(rows[i]);
				}
			})
			.on("end", () => {
				// console.log(emailData);
				resolve(emailData);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
};

module.exports = { parse_tsv };
