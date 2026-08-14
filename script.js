// Muneeb Ahmed Khan - Portfolio interactions

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Contact form submission and clipboard helpers
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = form.elements;
    const status = document.getElementById('copy-status');
    const previewSubject = document.getElementById('preview-subject');
    const previewMessage = document.getElementById('preview-message');
    const copyMessage = document.getElementById('copy-message');
    const submitButton = document.getElementById('form-submit');
    const topicButtons = document.querySelectorAll('.signal-choice');
    const copyEmail = document.querySelector('.copy-email');

    const setStatus = (text, sticky = false) => {
      if (!status) return;
      status.textContent = text;
      window.clearTimeout(status.dataset.timer);
      if (!sticky) {
        status.dataset.timer = window.setTimeout(() => {
          status.textContent = 'Ready';
        }, 2200);
      }
    };

    const buildMessage = () => {
      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const subject = fields.subject.value.trim() || 'Portfolio contact';
      const message = fields.message.value.trim();
      return {
        subject,
        body: `Name: ${name || '-'}\nEmail: ${email || '-'}\n\n${message || '-'}`
      };
    };

    const updatePreview = () => {
      const draft = buildMessage();
      if (previewSubject) previewSubject.textContent = draft.subject;
      if (previewMessage) previewMessage.textContent = fields.message.value.trim() || 'Your message preview will appear here as you type.';
    };

    const copyText = async (text, success) => {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
        } else {
          const fallback = document.createElement('textarea');
          fallback.value = text;
          fallback.setAttribute('readonly', '');
          fallback.style.position = 'fixed';
          fallback.style.opacity = '0';
          document.body.appendChild(fallback);
          fallback.select();
          document.execCommand('copy');
          document.body.removeChild(fallback);
        }
        setStatus(success);
      } catch {
        setStatus('Copy failed');
      }
    };

    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', updatePreview);
    });

    topicButtons.forEach(button => {
      button.addEventListener('click', () => {
        topicButtons.forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        fields.subject.value = button.dataset.subject;
        updatePreview();
      });
    });

    if (copyEmail) {
      copyEmail.addEventListener('click', () => {
        copyText(copyEmail.dataset.copy, 'Email copied to clipboard');
      });
    }

    if (copyMessage) {
      copyMessage.addEventListener('click', () => {
        const draft = buildMessage();
        copyText(`Subject: ${draft.subject}\n\n${draft.body}`, 'Message copied');
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const botcheck = fields.botcheck;
      if (botcheck && botcheck.checked) return;

      const originalText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      setStatus('Sending message...');

      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);
        payload.message = fields.message.value.trim();
        payload.subject = fields.subject.value.trim() || 'Portfolio contact';

        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Message could not be sent');
        }

        form.reset();
        fields.subject.value = 'AI/ML Opportunity';
        topicButtons.forEach(item => item.classList.remove('active'));
        topicButtons[0]?.classList.add('active');
        updatePreview();
        setStatus('Message sent. I will get back to you soon.', true);
      } catch (error) {
        setStatus(error.message || 'Message failed. Please try again.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });

    updatePreview();
  }
});
