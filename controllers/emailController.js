const Email = require("../models/email");
const { OAuth2Client } = require("google-auth-library");
const { parse_tsv } = require("../utils/parse_tsv");
const emptyUploads = require("../utils/empty_uploads");
const { createEmailBody, makeBody } = require("../utils/create_email_body");
const { google } = require("googleapis");
const uuid = require("uuid");
const sleep = require("../utils/sleep");

const oAuth2Client = new OAuth2Client();

exports.sendEmails = async (req, res) => {
	const accessToken = req.headers.authorization.split(" ")[1]; // Extract the token
	oAuth2Client.setCredentials({ access_token: accessToken });
	const { file, attachment } = req.files;
	if (!file) {
		await emptyUploads();
		return res.status(400).json("No file uploaded");
	}
	try {
		const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
		const emailData = await parse_tsv(file[0].path);
		for (let data of emailData) {
			const email = new Email({
				uuid: uuid.v4(), // Generate a new UUID
				from: "me", // Replace with the sender's email
				to: data.Email,
				subject: data.Subject,
			});
			const trackingImage = `<img src="https://lemailer-backend.onrender.com/api/track/${email.uuid}" />`;
			const bodyWithTracking = `${createEmailBody(data)}${trackingImage}`;
			const raw = makeBody(data.Email, "me", data.Subject, bodyWithTracking, attachment ? attachment : false);
			const encodedMessage = Buffer.from(raw)
				.toString("base64")
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=+$/, "");
			try {
				await gmail.users.messages.send({
					userId: "me",
					requestBody: {
						raw: encodedMessage,
					},
				});

				// Create and save a new Email document

				await email.save();

				// Wait for 5 seconds before sending the next email
				await sleep(5000);
			} catch (err) {
				console.log("Failed to send email:", err);
				await emptyUploads();
				return res.status(500).json("Failed to send email");
			}
		}
		await emptyUploads();
		return res.status(200).json("Emails sent successfully");
	} catch (error) {
		await emptyUploads();
		console.log("Error sending emails:", error);
		return res.status(500).json("Error sending emails");
	}
};

exports.trackEmail = async (req, res) => {
	const email = await Email.findOne({ uuid: req.params.uuid });
	if (email) {
		email.opens.push({ openedAt: new Date() });
		await email.save();
	}
	// Respond with a 1x1 pixel transparent gif
	const img = new Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
	res.writeHead(200, {
		"Content-Type": "image/gif",
		"Content-Length": img.length,
	});
	res.end(img);
};

exports.getEmailStats = async (req, res) => {
	const { from } = req.query; // We filter by sender's email
	const emails = await Email.find({ from }).lean().exec();
	res.json(
		emails.map((email) => ({
			to: email.to,
			subject: email.subject,
			sentAt: email.sent,
			opens: email.opens.map((open) => open.openedAt),
		}))
	);
};
