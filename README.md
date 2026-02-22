# Apptrion Website

A modern, responsive website for Apptrion Company featuring dynamic animations, dark/light theme switcher, and a Node.js backend API for contact form handling.

## Project Structure

```
Apptrion Company/
├── index.html                 # Main HTML file
├── server.js                  # Express.js backend server
├── package.json               # Node.js dependencies
├── .env.example               # Environment variables template
├── README.md                  # Project documentation
├── BACKEND_SETUP.md           # Backend setup guide
├── css/
│   └── styles.css            # All styles (1200+ lines, responsive, animations)
├── js/
│   └── main.js               # Frontend JS (dynamic loading, forms, animations)
├── includes/                 # HTML partials (dynamically loaded)
│   ├── header.html
│   ├── hero.html
│   ├── products.html
│   ├── why-apptrion.html
│   ├── team.html
│   ├── contact.html
│   └── footer.html
└── assets/
    └── img/                  # Images (logo, team photos)
        ├── ApptrionLogo.png
        ├── Profile.png
        ├── Profile1.png
        └── Profile2.png
```

## Key Features

✨ **Modern UI/UX Design**
- Smooth entrance animations (AOS library)
- Scroll-triggered effects
- Staggered card animations
- Interactive hover effects
- Gradient accents and shadows

🌙 **Theme System**
- Dark mode (default)
- Light mode with toggle button
- Persistent theme preference (localStorage)
- Smooth color transitions

📱 **Responsive Design**
- Mobile-first approach
- Tablet breakpoint (768px)
- Mobile breakpoint (480px)
- Fixed sticky header on all devices
- Optimized navigation for mobile

🔌 **Backend API**
- Express.js server
- Contact form submission endpoint
- Optional email notifications (Nodemailer)
- Health check endpoint
- CORS enabled

📸 **Image Integration**
- Logo in header with hover animation
- Team member profile photos
- Profile images in dedicated assets folder
- Optimized for all formats

## Quick Start

### Frontend Only (No Backend)
```bash
# Simply open in browser
Open index.html directly in your web browser
# All features work except contact form email
```

### With Backend API

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Configure Environment (Optional for email)
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your email configuration
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-specific-password
```

#### 3. Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technology Stack

**Frontend:**
- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- AOS (Animate On Scroll) library

**Backend:**
- Node.js
- Express.js
- Nodemailer (optional)
- CORS support

3. **No build process required** - it's a static HTML/CSS website

## File Organization Benefits

- **Scalability**: Easy to add more CSS files, images, and JavaScript
- **Maintainability**: Clear separation of concerns
- **Performance**: Better caching and organization
- **Professionalism**: Industry-standard project structure

## Sections Included

- **Header/Navigation**: Sticky header with logo
- **Hero Section**: Eye-catching banner with CTAs
- **Mission & Vision**: Company values
- **Products**: Feature cards for three main products
- **Why Apptrion**: Value propositions
- **Team**: Team member cards with photos
- **Contact**: Contact form and email
- **Footer**: Links and copyright

## Responsive Breakpoints

- Desktop: Full layout
- Tablet (≤768px): Adjusted spacing and font sizes
- Mobile (≤480px): Optimized for smaller screens

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

---

**Last Updated:** February 20, 2026
