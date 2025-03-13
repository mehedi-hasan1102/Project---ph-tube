const API_BASE = "https://openapi.programming-hero.com/api/phero-tube";
const categoryContainer = document.getElementById("categoryButtons");
const videoContainer = document.getElementById("videoContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortBtn = document.getElementById("sortBtn");
let allVideos = [];
let activeCategory = "1001";

// Load Categories with Error Handling
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        categoryContainer.innerHTML = data.categories.map(cat => 
            `<button class="category-btn" data-id="${cat.id}">${cat.name}</button>`
        ).join("");
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// Load Videos by Category with Error Handling
async function loadVideos(categoryId = "1001") {
    activeCategory = categoryId;
    try {
        const res = await fetch(`${API_BASE}/category/${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        allVideos = data.videos;
        renderVideos(allVideos);
        updateActiveCategory(categoryId);
    } catch (error) {
        console.error("Error loading videos:", error);
        videoContainer.innerHTML = `<p>Failed to load videos. Please try again.</p>`;
    }
}

// Render Videos
function renderVideos(videos) {
    videoContainer.innerHTML = videos.length ? videos.map(video => `
        <div class="video-card" onclick="showVideoDetails('${video.video_id}')">
            <img src="${video.thumbnail}" alt="${video.title}">
            <h3>${video.title}</h3>
            <p>${video.views} views</p>
            ${video.verified ? '<span class="verified">✔ Verified</span>' : ''}
        </div>`).join("") : `<p>No videos available</p>`;
}

// Update Active Category Button
function updateActiveCategory(categoryId) {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.id === categoryId);
    });
}

// Search Videos with Error Handling
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    try {
        const res = await fetch(`${API_BASE}/videos?title=${query}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        renderVideos(data.videos);
        updateActiveCategory(null);
    } catch (error) {
        console.error("Error searching videos:", error);
        videoContainer.innerHTML = `<p>Search failed. Please try again.</p>`;
    }
});

// Category Click Event
categoryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
        loadVideos(e.target.dataset.id);
    }
});

// Sort Videos by Views
sortBtn.addEventListener("click", () => {
    allVideos.sort((a, b) => parseInt(b.views) - parseInt(a.views));
    renderVideos(allVideos);
});

// Show Video Details in Modal with Error Handling
async function showVideoDetails(videoId) {
    try {
        const res = await fetch(`${API_BASE}/video/${videoId}`);
        if (!res.ok) throw new Error("Failed to fetch video details");
        const data = await res.json();
        const video = data.video;
        alert(`Title: ${video.title}\nAuthor: ${video.author.name}\nViews: ${video.views}`);
    } catch (error) {
        console.error("Error loading video details:", error);
        alert("Failed to load video details. Please try again.");
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadVideos();
});
