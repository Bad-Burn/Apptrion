/**
 * Apptrion website
 * Theme switching, navigation, scroll effects and the contact form.
 */
(function () {
    'use strict';

    const root = document.documentElement;
    const THEME_KEY = 'theme';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initHeader();
        initMobileMenu();
        initScrollSpy();
        initReveal();
        initCopyButtons();
        initContactForm();
        setCurrentYear();
    });

    /* ------------------------------------------------------------------
       Theme
       The initial theme is applied by an inline script in <head>.
       ------------------------------------------------------------------ */

    function readStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);

        const toggle = document.querySelector('[data-theme-toggle]');
        if (toggle) {
            toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        }

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', theme === 'dark' ? '#0b0b0c' : '#fafaf8');
        }
    }

    function initTheme() {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

        const toggle = document.querySelector('[data-theme-toggle]');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                try {
                    localStorage.setItem(THEME_KEY, next);
                } catch (e) {
                    /* Storage unavailable: the choice lasts for this page view only */
                }
            });
        }

        // Follow the operating system setting until the visitor picks a theme
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
        const onSystemChange = (event) => {
            if (!readStoredTheme()) {
                applyTheme(event.matches ? 'dark' : 'light');
            }
        };
        if (systemDark.addEventListener) {
            systemDark.addEventListener('change', onSystemChange);
        } else if (systemDark.addListener) {
            systemDark.addListener(onSystemChange);
        }
    }

    /* ------------------------------------------------------------------
       Header
       ------------------------------------------------------------------ */

    function initHeader() {
        const header = document.querySelector('[data-header]');
        if (!header) return;

        const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    function initMobileMenu() {
        const header = document.querySelector('[data-header]');
        const toggle = document.querySelector('[data-menu-toggle]');
        const menu = document.getElementById('mobile-menu');
        if (!header || !toggle || !menu) return;

        const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            menu.hidden = !open;
            header.classList.toggle('is-menu-open', open);
            root.classList.toggle('menu-open', open);
        };

        toggle.addEventListener('click', () => setOpen(!isOpen()));

        menu.addEventListener('click', (event) => {
            if (event.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isOpen()) {
                setOpen(false);
                toggle.focus();
            }
        });

        // Close the panel if the viewport grows past the mobile breakpoint
        const desktop = window.matchMedia('(min-width: 901px)');
        const onDesktop = (event) => {
            if (event.matches) setOpen(false);
        };
        if (desktop.addEventListener) {
            desktop.addEventListener('change', onDesktop);
        } else if (desktop.addListener) {
            desktop.addListener(onDesktop);
        }
    }

    /* ------------------------------------------------------------------
       Highlight the nav link for the section in view
       ------------------------------------------------------------------ */

    function initScrollSpy() {
        const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
        const sections = document.querySelectorAll('main section[id]');
        if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

        const setActive = (id) => {
            links.forEach((link) => {
                if (link.getAttribute('href') === '#' + id) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach((section) => observer.observe(section));
    }

    /* ------------------------------------------------------------------
       Reveal elements as they scroll into view
       ------------------------------------------------------------------ */

    function initReveal() {
        const elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

        elements.forEach((el) => observer.observe(el));
    }

    /* ------------------------------------------------------------------
       Copy to clipboard
       ------------------------------------------------------------------ */

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {
            const field = document.createElement('textarea');
            field.value = text;
            field.setAttribute('readonly', '');
            field.style.position = 'fixed';
            field.style.opacity = '0';
            document.body.appendChild(field);
            field.select();
            const ok = document.execCommand('copy');
            field.remove();
            if (ok) {
                resolve();
            } else {
                reject(new Error('Copy failed'));
            }
        });
    }

    function initCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach((button) => {
            const label = button.querySelector('[data-copy-label]');
            const original = label ? label.textContent : '';
            let timer;

            button.addEventListener('click', () => {
                copyText(button.getAttribute('data-copy'))
                    .then(() => {
                        if (label) label.textContent = 'Copied';
                    })
                    .catch(() => {
                        if (label) label.textContent = 'Copy failed';
                    })
                    .finally(() => {
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            if (label) label.textContent = original;
                        }, 2000);
                    });
            });
        });
    }

    /* ------------------------------------------------------------------
       Contact form
       Posts to the Node API when it is available. On static hosting
       (GitHub Pages, or opening the file directly) there is no API, so the
       form falls back to opening the visitor's email app with the message
       already filled in.
       ------------------------------------------------------------------ */

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const REQUEST_TIMEOUT_MS = 12000;

    const validators = {
        name: (value) => (value ? '' : 'Please enter your name.'),
        email: (value) => {
            if (!value) return 'Please enter your email address.';
            return EMAIL_PATTERN.test(value) ? '' : 'Please enter a valid email address.';
        },
        message: (value) => {
            if (!value) return 'Please tell us a little about your project.';
            return value.length >= 10 ? '' : 'Please add a little more detail.';
        }
    };

    const ICONS = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/></svg>'
    };

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const status = form.querySelector('[data-form-status]');
        const submitButton = form.querySelector('[type="submit"]');
        const submitLabel = form.querySelector('[data-submit-label]');
        const fallbackEmail = form.getAttribute('data-fallback-email');

        const fieldValue = (name) => (form.elements[name] ? form.elements[name].value.trim() : '');

        const setFieldError = (name, message) => {
            const input = form.elements[name];
            const field = input.closest('.field');
            const error = field.querySelector('.field-error');
            field.classList.toggle('has-error', Boolean(message));
            input.setAttribute('aria-invalid', message ? 'true' : 'false');
            if (error) error.textContent = message;
        };

        const validate = () => {
            let firstInvalid = null;
            Object.keys(validators).forEach((name) => {
                const message = validators[name](fieldValue(name));
                setFieldError(name, message);
                if (message && !firstInvalid) firstInvalid = form.elements[name];
            });
            return firstInvalid;
        };

        // Re-check a field as the visitor fixes it
        Object.keys(validators).forEach((name) => {
            form.elements[name].addEventListener('input', () => {
                if (form.elements[name].closest('.field').classList.contains('has-error')) {
                    setFieldError(name, validators[name](fieldValue(name)));
                }
            });
        });

        const showStatus = (type, message, link) => {
            status.className = 'form-status is-' + type;
            status.innerHTML = ICONS[type];
            const text = document.createElement('p');
            text.textContent = message;
            if (link) {
                text.append(' ');
                const anchor = document.createElement('a');
                anchor.href = link.href;
                anchor.textContent = link.label;
                text.append(anchor, '.');
            }
            status.append(text);
        };

        const clearStatus = () => {
            status.className = 'form-status';
            status.textContent = '';
        };

        const setLoading = (loading) => {
            submitButton.classList.toggle('is-loading', loading);
            submitButton.setAttribute('aria-disabled', String(loading));
            submitLabel.textContent = loading ? 'Sending' : 'Send message';
        };

        const buildMailto = (data) => {
            const subject = 'Project inquiry from ' + data.name + (data.company ? ' (' + data.company + ')' : '');
            const lines = [data.message, '', '---', 'Name: ' + data.name, 'Email: ' + data.email];
            if (data.company) lines.push('Company: ' + data.company);
            if (data.projectType) lines.push('Project type: ' + data.projectType);
            return 'mailto:' + fallbackEmail +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(lines.join('\n'));
        };

        const sendToApi = async (data) => {
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timeout = controller ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : null;

            try {
                const response = await fetch(form.getAttribute('data-endpoint'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller ? controller.signal : undefined
                });

                const isJson = (response.headers.get('content-type') || '').includes('application/json');
                const body = isJson ? await response.json() : null;

                if (body && response.ok && body.success) {
                    return { ok: true, message: body.message };
                }
                if (body && response.status === 400 && body.message) {
                    return { ok: false, message: body.message };
                }
                // Anything else means there is no working API behind this page
                return null;
            } catch (error) {
                return null;
            } finally {
                if (timeout) clearTimeout(timeout);
            }
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (submitButton.classList.contains('is-loading')) return;
            clearStatus();

            const firstInvalid = validate();
            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            // Bots tend to fill every field, including the hidden one
            if (fieldValue('website')) {
                form.reset();
                showStatus('success', 'Thanks for reaching out. We will be in touch soon.');
                return;
            }

            const selectedType = form.querySelector('input[name="projectType"]:checked');
            const data = {
                name: fieldValue('name'),
                email: fieldValue('email'),
                company: fieldValue('company'),
                projectType: selectedType ? selectedType.value : '',
                message: fieldValue('message')
            };

            setLoading(true);
            const result = await sendToApi(data);
            setLoading(false);

            if (result && result.ok) {
                form.reset();
                showStatus('success', result.message || 'Thanks for reaching out. We will be in touch soon.');
            } else if (result) {
                showStatus('error', result.message);
            } else {
                window.location.href = buildMailto(data);
                showStatus(
                    'success',
                    'Your email app should open with your message ready to send. If it doesn’t, write to us at',
                    { href: 'mailto:' + fallbackEmail, label: fallbackEmail }
                );
            }
        });
    }

    /* ------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------ */

    function setCurrentYear() {
        const year = String(new Date().getFullYear());
        document.querySelectorAll('[data-year]').forEach((el) => {
            el.textContent = year;
        });
    }
})();
