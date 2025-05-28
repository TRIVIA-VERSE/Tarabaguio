// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Navigation Toggle =====
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ===== Booking Form Functionality =====
  const form = document.getElementById('booking-form');
  const packageSelect = document.getElementById('selectedPackage');
  const priceDisplay = document.getElementById('priceDisplay');
  const guestInput = document.querySelector('input[name="guests"]');
  const packageDescription = document.getElementById('packageDescription');
  const popup = document.getElementById('thankyou-popup');
  const closeBtn = document.getElementById('close-popup');

  // Load selected package from other pages
  const savedPackage = localStorage.getItem("selectedPackage");
  if (packageSelect && savedPackage) {
    for (let option of packageSelect.options) {
      if (option.text === savedPackage) {
        option.selected = true;
        break;
      }
    }
    localStorage.removeItem("selectedPackage");
  }

  // Dynamic Pricing and Description
  function updatePackageDetails() {
    if (packageSelect && priceDisplay && guestInput && packageDescription) {
      const selectedOption = packageSelect.options[packageSelect.selectedIndex];
      const basePrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
      const guests = parseInt(guestInput.value) || 1;
      const total = basePrice * guests;
      const description = selectedOption.getAttribute('data-description');

      priceDisplay.textContent = `Total Price: ₱${total.toLocaleString()}`;
      packageDescription.textContent = description ? `Includes: ${description}` : '';
    }
  }

  if (packageSelect && priceDisplay && guestInput) {
    packageSelect.addEventListener("change", updatePackageDetails);
    guestInput.addEventListener("input", updatePackageDetails);
    updatePackageDetails();
  }

  // ✅ FIXED: Handle booking form submit and save to localStorage
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullname = form.querySelector('input[name="fullname"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const contact = form.querySelector('input[name="contact"]').value.trim();
      const guests = parseInt(form.querySelector('input[name="guests"]').value.trim());
      const date = form.querySelector('input[name="date"]').value;
      const selectedPackage = packageSelect?.options[packageSelect.selectedIndex]?.text || '';
      const notes = form.querySelector('textarea[name="notes"]')?.value.trim() || '';

      const newBooking = {
        fullname,
        email,
        contact,
        guests,
        date,
        package: selectedPackage,
        notes,
        timestamp: Date.now()
      };

      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(bookings));

      // Show thank-you popup
      popup.classList.remove('hidden');

      // Reset form and pricing display
      form.reset();
      updatePackageDetails();
    });

    closeBtn?.addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    popup?.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.add('hidden');
      }
    });
  }

  // ===== Travel Package "Book Now" Buttons =====
  const bookButtons = document.querySelectorAll(".package .btn");
  bookButtons.forEach(button => {
    button.addEventListener("click", () => {
      const packageName = button.parentElement.querySelector("h3").textContent;
      localStorage.setItem("selectedPackage", packageName);
      window.location.href = "booking.html";
    });
  });

  // ===== Visitor Reviews: Star Rating Click =====
  document.querySelectorAll('#star-rating span').forEach(star => {
    star.addEventListener('click', function () {
      const value = this.getAttribute('data-value');
      document.getElementById('rating').value = value;

      document.querySelectorAll('#star-rating span').forEach(s => {
        s.classList.remove('selected');
      });

      for (let i = 0; i < value; i++) {
        document.querySelectorAll('#star-rating span')[i].classList.add('selected');
      }
    });
  });

  // ===== Visitor Reviews: Submit Review and Display =====
  const reviewForm = document.getElementById('reviewForm');
  const userReviews = document.getElementById('userReviews');

  reviewForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const location = document.getElementById('location').value.trim();
    const message = document.getElementById('message').value.trim();
    const rating = document.getElementById('rating').value;
    const imageInput = document.getElementById('imageUpload');
    const imageFile = imageInput.files[0];

    if (!name || !location || !message || !rating) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review');

    let imageHTML = '';
    if (imageFile) {
      const imageURL = URL.createObjectURL(imageFile);
      imageHTML = `<img src="${imageURL}" alt="User Image" class="review-image" />`;
    }

    reviewDiv.innerHTML = `
      <p class="stars">${stars}</p>
      <blockquote>“${message}”</blockquote>
      <p>– ${name}, ${location}</p>
      ${imageHTML}
    `;

    userReviews?.appendChild(reviewDiv);

    reviewForm.reset();
    document.getElementById('rating').value = '';
    document.querySelectorAll('#star-rating span').forEach(s => s.classList.remove('selected'));
  });

});

// Scroll animation logic
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const revealTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Run on load too
