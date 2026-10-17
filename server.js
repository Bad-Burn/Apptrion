/**
 * Apptrion Website Backend Server
 * Express.js API for handling form submissions and static files
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50kb' }));

// Serve only the public site folders, not server code or config
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Email configuration (optional - uses console logging if not configured)
const nodemailer = require('nodemailer');

let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} else {
    console.log('Email configuration not found. Contact form submissions will be logged to the console.');
}

const LIMITS = { name: 120, email: 200, company: 160, projectType: 60, message: 5000 };

function clean(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Contact Form API Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const body = req.body || {};

        // Hidden spam-trap field: real visitors never fill it in
        if (clean(body.website, 200)) {
            return res.status(200).json({
                success: true,
                message: 'Thanks for reaching out. We will be in touch soon.'
            });
        }

        const name = clean(body.name, LIMITS.name);
        const email = clean(body.email, LIMITS.email);
        const company = clean(body.company, LIMITS.company);
        const projectType = clean(body.projectType, LIMITS.projectType);
        const message = clean(body.message, LIMITS.message);

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in your name, email and project details.'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        const submittedAt = new Date().toISOString();

        // Log the submission
        console.log('New contact form submission:');
        console.log(`   Name: ${name}`);
        console.log(`   Email: ${email}`);
        if (company) console.log(`   Company: ${company}`);
        if (projectType) console.log(`   Project type: ${projectType}`);
        console.log(`   Message: ${message}`);
        console.log(`   Time: ${submittedAt}`);

        // Send email if configured
        if (transporter) {
            const details = [
                ['Name', name],
                ['Email', email],
                ['Company', company],
                ['Project type', projectType]
            ].filter(([, value]) => value);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
                replyTo: email,
                subject: `New project inquiry from ${name}`,
                text: [
                    ...details.map(([label, value]) => `${label}: ${value}`),
                    '',
                    message,
                    '',
                    `Submitted at: ${submittedAt}`
                ].join('\n'),
                html: `
                    <h2>New project inquiry</h2>
                    ${details.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join('')}
                    <p><strong>Message:</strong></p>
                    <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
                    <p><small>Submitted at: ${submittedAt}</small></p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('Notification email sent.');
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Don't fail the API response if email fails
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Thanks for reaching out. We have your message and will be in touch soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Unknown API routes return JSON; everything else serves the site
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\nApptrion server running on http://localhost:${PORT}`);
    console.log(`Contact form endpoint: POST http://localhost:${PORT}/api/contact`);
    console.log(`Health check: GET http://localhost:${PORT}/api/health\n`);
});
