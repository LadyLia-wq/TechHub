let resources = [];
const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");
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
  if (e.target.classList.contains("detailsBtn")) {

    const resourceData = {
      name: e.target.dataset.name,
      category: e.target.dataset.category,
      level: e.target.dataset.level,
      link: e.target.dataset.link
    };

    /* Save to local storage */
    localStorage.setItem("lastResource", JSON.stringify(resourceData));

    openModal(resourceData);
  }
});

/* Open modal helper */
function openModal(resource) {
  document.getElementById("modalTitle").textContent =
    resource.name;

  document.getElementById("modalCategory").textContent =
    "Category: " + resource.category;

  document.getElementById("modalLevel").textContent =
    "Level: " + resource.level;

  document.getElementById("modalLink").innerHTML =
    `<a href="${resource.link}" target="_blank" class="modal-visit-btn">
      Visit Website
    </a>`;

  modal.style.display = "block";
}

/* Close modal */
// closeModal.onclick = () => {
//   modal.style.display = "none";
//   localStorage.removeItem("lastResource");
// };

// window.onclick = e => {
//   if (e.target === modal) {
//     modal.style.display = "none";
//     localStorage.removeItem("lastResource");
//   }
// };

//filter view
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
// const container = document.getElementById("resourcesContainer");

function displayResources(resourcesArray) {
  container.innerHTML = "";

  resourcesArray.forEach(resource => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3><i class="fa-solid fa-laptop-code"></i> ${resource.name}</h3>

      <p>
        <i class="fa-solid fa-layer-group"></i>
        <strong>Category:</strong> ${resource.category}
      </p>

      <p class="level ${resource.level.toLowerCase()}">
        ${resource.level}
      </p>

      <button class="detailsBtn"
        data-name="${resource.name}"
        data-category="${resource.category}"
        data-level="${resource.level}"
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

  displayResources(filtered);
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
    const response = await fetch("data/resources.json");
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
      position = Math.max(position - step, 0);
      track.style.transform = `translateX(-${position}px)`;
    });

    rightArrow.addEventListener("click", () => {
      position = Math.min(position + step, maxScroll);
      track.style.transform = `translateX(-${position}px)`;
    });

  } catch (error) {
    console.error("Failed to load platform logos:", error);
  }
}

loadPlatformLogos();