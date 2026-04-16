let resources = [];
const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    menuBtn.textContent = isOpen ? "✕" : "☰";
    menuBtn.classList.toggle("open", isOpen);
  });
}

const container = document.querySelector("#resourcesContainer");

async function loadResources() {
  if (!container) return;

  try {
    const response = await fetch("data/resources.json");
    resources = await response.json(); // store globally

    displayResources(resources); // use one display system

  } catch (error) {
    container.innerHTML = "<p>Failed to load resources.</p>";
    console.error(error);
  }
}

const header = document.querySelector("header");

let isScrolled = false;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 40 && !isScrolled) {
    header.classList.add("scrolled");
    isScrolled = true;
  } else if (scrollY < 10 && isScrolled) {
    header.classList.remove("scrolled");
    isScrolled = false;
  }
});

/* Highlight active navigation link */
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

loadResources();

/* Modal elements */
const modal = document.querySelector("#resourceModal");
const closeModal = document.querySelector("#closeModal");

/* Handle card clicks */
document.addEventListener("click", function(e) {
  const button = e.target.closest(".detailsBtn");

  if (button) {
    const resourceData = {
      name: button.dataset.name,
      title: button.dataset.title,
      category: button.dataset.category,
      level: button.dataset.level,
      description: button.dataset.description,
      topics: JSON.parse(button.dataset.topics),
      link: button.dataset.link
    };

    localStorage.setItem("lastResource", JSON.stringify(resourceData));
    openModal(resourceData);
  }
});

/* Open modal helper */
function openModal(resource) {
  document.getElementById("modalTitle").textContent =
    resource.title;

  document.getElementById("modalCategory").textContent =
    resource.category + " • " + resource.level;

  document.getElementById("modalLevel").textContent =
    resource.description;

  // build topics list
  const topicsHTML = resource.topics
    .map(topic => `
      <li>
        <i class="fa-solid fa-circle-check"></i>
        ${topic}
      </li>
    `)
    .join("");

  document.getElementById("modalLink").innerHTML = `
    <ul class="modal-topics">
      ${topicsHTML}
    </ul>

    <a href="${resource.link}" target="_blank" class="modal-visit-btn explore-resources-btn">
      <i class="fa-solid fa-rocket"></i>
      Visit Course
    </a>
  `;

  modal.classList.add("show");
}

/* Close modal */
if (closeModal) {
  closeModal.onclick = () => {
    modal.classList.remove("show");
    localStorage.removeItem("lastResource");
  };
}

//filter view
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// const container = document.getElementById("resourcesContainer");
// function getPlatformIcon(name) {
//   const icons = {
//     "FreeCodeCamp": ["fa-brands", "fa-free-code-camp"],
//     "Codecademy": ["fa-solid", "fa-code"],
//     "Khan Academy": ["fa-solid", "fa-graduation-cap"],
//     "W3Schools": ["fa-solid", "fa-globe"],
//     "The Odin Project": ["fa-solid", "fa-fire"],
//     "CS50 Harvard": ["fa-solid", "fa-university"],
//     "Programiz": ["fa-brands", "fa-python"],
//     "MDN Web Docs": ["fa-brands", "fa-html5"],
//     "GeeksforGeeks": ["fa-solid", "fa-gears"],
//     "HackerRank": ["fa-solid", "fa-terminal"],
//     "LeetCode": ["fa-solid", "fa-code"],
//     "Coursera": ["fa-solid", "fa-c"],
//     "Udemy": ["fa-solid", "fa-u"],
//     "edX": ["fa-solid", "fa-book"],
//     "IBM": ["fa-solid", "fa-brain"]
//   };

//   return icons[name] || ["fa-solid", "fa-laptop-code"];
// }

function displayResources(resourcesArray) {
  container.innerHTML = "";

  resourcesArray.forEach(resource => {
    const card = document.createElement("div");
    card.classList.add("card");

    const domain = new URL(resource.website).hostname;
    const logoUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

    card.innerHTML = `
  <h3>
    <img src="${logoUrl}" alt="${resource.name} logo" class="card-logo">
    ${resource.name}
  </h3>

  <p>
    <i class="fa-solid fa-laptop-code"></i>
    <strong>Course:</strong> ${resource.title}
  </p>

  <p>
    <i class="fa-solid fa-code"></i>
    <strong>Category:</strong> ${resource.category}
  </p>

  <p class="level ${resource.level.toLowerCase()}">
    ${resource.level}
  </p>

  <button class="detailsBtn explore-resources-btn"
    data-name="${resource.name}"
    data-title="${resource.title}"
    data-category="${resource.category}"
    data-level="${resource.level}"
    data-description="${resource.description}"
    data-topics='${JSON.stringify(resource.topics)}'
    data-link="${resource.website}">
    <i class="fa-solid fa-arrow-up-right-from-square"></i> 
    View Details
  </button>
`;

    container.appendChild(card);
  });
}

function filterResources() {
  const search = searchInput.value.toLowerCase();
  const level = categoryFilter.value;

  const filtered = resources.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search) ||
      r.category.toLowerCase().includes(search);

    const matchesLevel =
      level === "all" ||
      r.level.toLowerCase() === level.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  // Animate out
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.classList.add("fade-out");
  });

  // Wait for fade-out, then update
  setTimeout(() => {
    displayResources(filtered);

    // Animate in
    const newCards = document.querySelectorAll(".card");
    newCards.forEach((card, index) => {
      card.classList.add("fade-out"); // start hidden

      setTimeout(() => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
      }, index * 80); // stagger effect
    });

  }, 200);
}

if (searchInput && categoryFilter) {
  searchInput.addEventListener("input", filterResources);
  categoryFilter.addEventListener("change", filterResources);
}

//auto carousel
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

if (track && slides.length > 0) {
  let currentIndex = 0;
  const dots = document.querySelectorAll(".dot");

  slides.forEach(slide => {
    slide.style.minWidth = "100%";
  });

  function updateDots(index) {
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  function moveSlide(index) {
    currentIndex = index;
    track.style.transition = "transform 0.8s ease-in-out";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots(currentIndex);
  }

  // Click on dot to jump to slide
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => moveSlide(i));
  });

  setInterval(() => {
    moveSlide((currentIndex + 1) % slides.length);
  }, 4000);
}

// Platform logos carousel
async function loadPlatformLogos() {
  const track = document.getElementById("platformsTrack");
  if (!track) return;

  try {
    const response = await fetch("data/platforms.json");
    const resources = await response.json();

    resources.forEach(resource => {
      const domain = new URL(resource.website).hostname;
      const logoUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

      const a = document.createElement("a");
      a.classList.add("platform-logo");
      a.href = resource.website;
      a.target = "_blank";

      a.innerHTML = `
        <img src="${logoUrl}" alt="${resource.name} logo">
        <span>${resource.name}</span>
      `;

      track.appendChild(a);
    });

    // Arrow navigation
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    let position = 0;
    const step = 200; // px to scroll per click
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

    leftArrow.addEventListener("click", () => {
      track.parentElement.scrollBy({ left: -200, behavior: "smooth" });
    });

    rightArrow.addEventListener("click", () => {
      track.parentElement.scrollBy({ left: 200, behavior: "smooth" });
    });

  } catch (error) {
    console.error("Failed to load platform logos:", error);
  }
}

loadPlatformLogos();

//Steps Card
const stepCards = document.querySelectorAll(".step-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // stagger animation
      setTimeout(() => {
        entry.target.classList.add("show");
      }, index * 150);

      observer.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.2
});

stepCards.forEach(card => observer.observe(card));

const whyItems = document.querySelectorAll(".why-item");

whyItems.forEach(item => observer.observe(item));

//Contact Form

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const successModal = document.getElementById("successModal");
    successModal.classList.add("show");

    contactForm.reset();
  });
}

const closeSuccess = document.getElementById("closeSuccess");
if (closeSuccess) {
  closeSuccess.addEventListener("click", () => {
    document.getElementById("successModal").classList.remove("show");
  });
}

// close if user clicks outside the modal
window.addEventListener("click", (e) => {
  const successModal = document.getElementById("successModal");
  if (e.target === successModal) {
    successModal.classList.remove("show");
  }
});