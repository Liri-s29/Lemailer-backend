// const express = require("express");
// const cors = require("cors");
// const app = express();
// const { parse_tsv } = require("./utils/parse_tsv");
// const { OAuth2Client, auth } = require("google-auth-library");
// const multer = require("multer");
// const { sendMail } = require("./send_mail");
// const upload = multer({ dest: "uploads/" }); // This specifies that uploaded files will be stored in the 'uploads/' directory.
// const fs = require("fs");
// const path = require("path");
// // Allow Cross-Origin requests
// app.use(cors());

// // Allow JSON request body for PUT and POST requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// const oAuth2Client = new OAuth2Client();

// app.post("/send-email", upload.single("file"), async (req, res) => {
// 	const authorizationCode = req.headers.authorization.split(" ")[1]; // Extract the token
// 	const { file } = req;

// 	if (!file) {
// 		return res.status(400).send({ error: "No file uploaded" });
// 	}
// 	try {
// 		oAuth2Client.setCredentials({ access_token: authorizationCode });

// 		// console.log(tokens);
// 		try {
// 			const emailData = await parse_tsv(file.path);
// 			await sendMail(oAuth2Client, emailData, res).then(async (sent) => {
// 				// empty folder ./uploads
// 				await emptyUploads();
// 				if (sent) {
// 					res.status(200).send("Emails sent successfully");
// 				} else {
// 					res.status(400).send("Emails not sent");
// 				}
// 			});
// 		} catch (error) {
// 			res.status(500).send({ error: "Failed to send emails" });
// 			// Delete the file
// 			await emptyUploads();
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}

// 	async function emptyUploads() {
// 		return new Promise((resolve, reject) => {
// 			fs.readdir("./uploads", (err, files) => {
// 				if (err) throw err;
// 				for (const file of files) {
// 					fs.unlink(path.join("./uploads", file), (err) => {
// 						reject(err);
// 						if (err) throw err;
// 					});
// 				}
// 				resolve(true);
// 			});
// 		});
// 	}
// });

const express = require("express");
const cors = require("cors");
const emailRoutes = require("./routes/emailRoutes");
require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the routes
app.use("/api", emailRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
