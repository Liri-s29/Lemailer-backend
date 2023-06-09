const csv = require("csv-parser");
const fs = require("fs");
const { sendMail } = require("./send_mail");

// const parse_csv = async (csv_file, auth) => {
// 	let emailData = [];
// 	fs.createReadStream(csv_file)
// 		.pipe(csv())
// 		.on("data", (row) => {
// 			emailData.push(row);
// 		})
// 		.on("end", async () => {
// 			console.log("CSV file successfully processed");
// 			sendMail(auth, emailData);
// 		});

// };

const parse_csv = async (csv_file) => {
	return new Promise((resolve, reject) => {
		let emailData = [];
		fs.createReadStream(csv_file)
			.pipe(csv())
			.on("data", (row) => {
				emailData.push(row);
			})
			.on("end", async () => {
				console.log("CSV file successfully processed");
				resolve(emailData);
			})
			.on("error", (error) => {
				reject(error);
			});
	});
};

module.exports = { parse_csv };
