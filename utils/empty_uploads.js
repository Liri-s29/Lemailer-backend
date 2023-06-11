const fs = require("fs");
const path = require("path");

async function emptyUploads() {
	return new Promise((resolve, reject) => {
		fs.readdir("./uploads", (err, files) => {
			if (err) throw err;
			for (const file of files) {
				fs.unlink(path.join("./uploads", file), (err) => {
					reject(err);
					if (err) throw err;
				});
			}
			resolve(true);
		});
	});
}

module.exports = emptyUploads;
