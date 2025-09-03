import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded BEFORE creating the transporter.
// Without this, Nodemailer may default to localhost:587 (127.0.0.1) if SMTP_HOST is undefined.
dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT || 587),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendEmail({ to, subject, html, text }) {
	if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
		console.warn('Email not configured: missing SMTP envs');
		return { skipped: true };
	}

	const from = process.env.SMTP_FROM || 'no-reply@bhumi.local';
	await transporter.sendMail({ from, to, subject, html, text });
	return { ok: true };
}



