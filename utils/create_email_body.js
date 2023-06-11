const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const uuid = require("uuid");

function makeBody(to, from, subject, message, attachment) {
	const boundary = uuid.v4();
	const str = [
		"MIME-Version: 1.0",
		"to: " + to,
		"from: " + from,
		"subject: " + subject,
		'Content-Type: multipart/mixed; boundary="' + boundary + '"',
		"",
		"--" + boundary,
		'Content-Type: text/html; charset="UTF-8"',
		"MIME-Version: 1.0",
		"Content-Transfer-Encoding: 7bit",
		"",
		message,
	];

	if (attachment[0]) {
		// const filePath = path.join(__dirname, "../uploads", attachment[0].path);
		const base64file = fs.readFileSync(attachment[0].path).toString("base64");
		// const mimeType = mime.lookup(filePath) || "application/octet-stream";
		str.push(
			"",
			"--" + boundary,
			`Content-Type: ${attachment[0].mimetype}; name="${attachment[0].path}"`,
			"Content-Transfer-Encoding: base64",
			'Content-Disposition: attachment; filename="' + attachment[0].originalname + '"',
			"",
			base64file
		);
	}

	str.push("--" + boundary + "--");
	return str.join("\n");
}

function createEmailBody(data) {
	// Modify the body as per your needs
	return `
    <p>Dear ${data["Recipient Name"]},</p>
    <p>${data["Body"]}</p>
    <p>Best Regards,<br>${data["Sender Name"]}</p>
  `;
}

module.exports = { makeBody, createEmailBody };
