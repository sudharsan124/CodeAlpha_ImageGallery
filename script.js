// Get HTML elements
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Store all images
const images = Array.from(galleryItems).map((item) => {
    const img = item.querySelector("img");

    return {
        src: img.src,
        alt: img.alt,
        title: img.dataset.title,
        category: img.dataset.category,
        element: item
    };
});

let visibleImages = [...images];
let currentIndex = 0;

// Filter images
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        // Update active button
        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Show matching images
        visibleImages = images.filter((image) => {
            return filter === "all" ||
                image.element.dataset.category === filter;
        });

        galleryItems.forEach((item) => {
            const category = item.dataset.category;

            if (filter === "all" || category === filter) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    });
});

// Open the lightbox
function openLightbox(index) {
    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

// Update the lightbox content
function updateLightbox() {
    const image = visibleImages[currentIndex];

    if (!image) {
        return;
    }

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;

    lightboxCounter.textContent =
        `${currentIndex + 1} / ${visibleImages.length}`;

    // Hide navigation if there is only one image
    prevBtn.hidden = visibleImages.length <= 1;
    nextBtn.hidden = visibleImages.length <= 1;
}

// Close the lightbox
function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// Show the previous image
function showPreviousImage() {
    if (visibleImages.length <= 1) {
        return;
    }

    currentIndex =
        (currentIndex - 1 + visibleImages.length) % visibleImages.length;

    updateLightbox();
}

// Show the next image
function showNextImage() {
    if (visibleImages.length <= 1) {
        return;
    }

    currentIndex =
        (currentIndex + 1) % visibleImages.length;

    updateLightbox();
}

// Open image when clicked
galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
        const imageIndex = visibleImages.findIndex(
            (image) => image.element === item
        );

        if (imageIndex !== -1) {
            openLightbox(imageIndex);
        }
    });
});

// Button events
closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", showPreviousImage);
nextBtn.addEventListener("click", showNextImage);

// Close when clicking outside the image
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }
});