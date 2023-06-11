const { google } = require("googleapis");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMail(auth, emailData) {
	try {
		const gmail = google.gmail({ version: "v1", auth });
		for (let data of emailData) {
			const raw = makeBody(data.Email, "me", data.Subject, createEmailBody(data));
			const encodedMessage = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
			try {
				await gmail.users.messages.send({
					userId: "me",
					requestBody: {
						raw: encodedMessage,
					},
				});
				console.log("Email sent to:", data.Email);
				// Wait for 5 seconds before sending the next email
				await sleep(5000);
			} catch (err) {
				console.log("Failed to send email:", err);
				return false;
			}
		}
		return true;
	} catch (error) {
		console.log("Error sending emails:", error);
		return false;
	}
}

function makeBody(to, from, subject, message) {
	let str = [
		'Content-Type: text/html; charset="UTF-8"\n',
		"MIME-Version: 1.0\n",
		"Content-Transfer-Encoding: 7bit\n",
		"to: ",
		to,
		"\n",
		"from: ",
		from,
		"\n",
		"subject: ",
		subject,
		"\n\n",
		message,
	].join("");

	return str;
}

function createEmailBody(data) {
	// Modify the body as per your needs
	return `
    <p>Dear ${data["Recipient Name"]},</p>
    <p>${data["Body"]}</p>
    <p>Best Regards,<br>${data["Sender Name"]}</p>
  `;
}

module.exports = { sendMail };
