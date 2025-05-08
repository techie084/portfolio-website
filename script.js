// Always use strict mode
"use strict";

// --------------------- Variable Declaration -------------------------------------
const selectBody = document.querySelector("body");
const selectHeader = document.querySelector("#header");
const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
let scrollTop = document.querySelector(".scroll-top");

// --- Existing Functions ---
function toggleScrolled() {
  if (
    !selectHeader.classList.contains("scroll-up-sticky") &&
    !selectHeader.classList.contains("sticky-top") &&
    !selectHeader.classList.contains("fixed-top")
  )
    return;
  window.scrollY > 100
    ? selectBody.classList.add("scrolled")
    : selectBody.classList.remove("scrolled");
}

// Mobile nav toggle
function mobileNavToogle() {
  document.querySelector("body").classList.toggle("mobile-nav-active");
  mobileNavToggleBtn.classList.toggle("bi-list");
  mobileNavToggleBtn.classList.toggle("bi-x");
}

// Scroll top button
function toggleScrollTop() {
  if (scrollTop) {
    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  }
}

// --- Event Listeners ---
document.addEventListener("scroll", toggleScrolled);
window.addEventListener("load", toggleScrolled);

if (mobileNavToggleBtn) {
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
}

document.querySelectorAll("#navmenu a").forEach((navmenu) => {
  navmenu.addEventListener("click", () => {
    if (document.querySelector(".mobile-nav-active")) {
      mobileNavToogle();
    }
  });
});

document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
  navmenu.addEventListener("click", function (e) {
    e.preventDefault();
    this.parentNode.classList.toggle("active");
    this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
    e.stopImmediatePropagation();
  });
});

// Preloader
const preloader = document.querySelector("#preloader");
if (preloader) {
  window.addEventListener("load", () => {
    preloader.remove();
  });
}

if (scrollTop) {
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);
}

// --- Animations ---
function aosInit() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
}
window.addEventListener("load", aosInit);

// Skills animation
let skillsAnimation = document.querySelectorAll(".skills-animation");
skillsAnimation.forEach((item) => {
  if (typeof Waypoint !== "undefined") {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }
});

// Pure Counter
if (typeof PureCounter !== "undefined") {
  new PureCounter();
}

// Swiper sliders
function initSwiper() {
  if (typeof Swiper !== "undefined") {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      if (swiperElement.classList.contains("swiper-tab")) {
        // Custom pagination logic if needed
        new Swiper(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
}
window.addEventListener("load", initSwiper);

// GLightbox
if (typeof GLightbox !== "undefined") {
  const glightbox = GLightbox({
    selector: ".glightbox",
  });
}

// Isotope layout
if (typeof Isotope !== "undefined" && typeof imagesLoaded !== "undefined") {
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            aosInit();
          },
          false
        );
      });
  });
}

// --- NEW: Formspree Form Handling ---
const form = document.querySelector(".php-email-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const loading = form.querySelector(".loading");
    const error = form.querySelector(".error-message");
    const success = form.querySelector(".sent-message");

    loading.style.display = "block";
    error.style.display = "none";
    success.style.display = "none";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest", // Helps Formspree identify AJAX
      },
    })
      .then((response) => {
        loading.style.display = "none";
        if (response.ok) {
          success.style.display = "block";
          form.reset();
          // Re-init animations if needed
          if (typeof aosInit === "function") {
            aosInit();
          }
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch(() => {
        loading.style.display = "none";
        error.style.display = "block";
      });
  });
}
