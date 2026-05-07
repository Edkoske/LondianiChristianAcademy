const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const counters = document.querySelectorAll(".counter");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const admissionForm = document.getElementById("admissionForm");
const formMessage = document.getElementById("formMessage");
const faqQuestions = document.querySelectorAll(".faq-question");
const testimonials = document.querySelectorAll(".testimonial");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 860) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 80));

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          return;
        }
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(updateCounter);
      };

      updateCounter();
      observer.unobserve(counter);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const handleScroll = () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
};

window.addEventListener("scroll", handleScroll);

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

if (admissionForm) {
  admissionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(admissionForm);
    const parentName = String(data.get("parentName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const level = String(data.get("level") || "").trim();
    const message = String(data.get("message") || "").trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d[\d\s-]{7,14}\d$/;

    if (!parentName || !email || !phone || !level || !message) {
      formMessage.textContent = "Please fill in all required fields.";
      formMessage.style.color = "#b42318";
      return;
    }

    if (!emailRegex.test(email)) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.style.color = "#b42318";
      return;
    }

    if (!phoneRegex.test(phone)) {
      formMessage.textContent = "Please enter a valid phone number.";
      formMessage.style.color = "#b42318";
      return;
    }

    formMessage.textContent = "Inquiry submitted successfully. We will contact you shortly.";
    formMessage.style.color = "#047857";
    admissionForm.reset();
  });
}

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("open");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

let testimonialIndex = 0;

const showTestimonial = (index) => {
  testimonials.forEach((item, idx) => {
    item.classList.toggle("active", idx === index);
  });
};

const nextSlide = () => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  showTestimonial(testimonialIndex);
};

const prevSlide = () => {
  testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(testimonialIndex);
};

if (nextTestimonial && prevTestimonial) {
  nextTestimonial.addEventListener("click", nextSlide);
  prevTestimonial.addEventListener("click", prevSlide);
  setInterval(nextSlide, 6000);
}
