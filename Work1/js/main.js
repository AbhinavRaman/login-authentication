// Load blogs on home page
document.addEventListener("DOMContentLoaded", () => {
    loadBlogsToHome();
});

/* Fetch blogs from backend and show on home page */
function loadBlogsToHome() {
    const blogCardContainer = document.querySelector(".blog-card-container");

    fetch("http://localhost:3000/api/blogs/all")
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.blogs.length === 0) {
                blogCardContainer.innerHTML = `<p>No blogs available.</p>`;
                return;
            }

            // Show only latest 4 blogs on home page
            const latestBlogs = data.blogs.slice(0, 4);

            latestBlogs.forEach(blog => {
                const card = document.createElement("div");
                card.classList.add("home-blog-card");

                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 120)}...</p>
                `;

                // Click → open full blog page (from = home)
                card.addEventListener("click", () => {
                    window.location.href = `viewFullBlog.html?id=${blog._id}&from=home`;
                });

                blogCardContainer.appendChild(card);
            });

            // "View All Blogs" button → all blogs page
            const viewAllBlogsBtn = document.getElementById("viewAllBlogsBtn");
            if (viewAllBlogsBtn) {
                viewAllBlogsBtn.addEventListener("click", () => {
                    window.location.href = "viewblog.html";
                });
            }

        })
        .catch(err => {
            console.error("Blog load error:", err);
            blogCardContainer.innerHTML += `<p>Error loading blogs.</p>`;
        });
}

// HOME PAGE BLOG POPUP (old modal – only used if you still have the HTML)
const homeModal = document.getElementById("homeBlogModal");
const closeHomeModal = document.getElementById("closeHomeModal");

function openHomeBlogModal(blog) {
    if (!homeModal) return;

    document.getElementById("homeModalBlogTitle").textContent = blog.title;

    const author =
        blog.userId?.fullName ||
        blog.userId?.fullname ||
        blog.userId?.username ||
        "Unknown Author";

    document.getElementById("homeModalBlogAuthor").textContent = "By: " + author;

    const date = new Date(blog.createdAt).toLocaleDateString();
    document.getElementById("homeModalBlogDate").textContent = "Posted on: " + date;

    document.getElementById("homeModalBlogContent").textContent = blog.content;

    homeModal.classList.remove("hidden");
}

if (closeHomeModal && homeModal) {
    closeHomeModal.addEventListener("click", () => {
        homeModal.classList.add("hidden");
    });

    homeModal.addEventListener("click", (e) => {
        if (e.target === homeModal) homeModal.classList.add("hidden");
    });
}

// Local user review (not connected to backend)
document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");
    const reviewCards = document.querySelector(".review-cards");

    if (!reviewForm) return; // ensures this part doesn’t run on other pages

    reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const userName = document.getElementById("userName").value.trim();
        const userReview = document.getElementById("userReview").value.trim();

        if (!userName || !userReview) {
            alert("Please fill in all fields");
            return;
        }

        // Create new review card
        const newCard = document.createElement("div");
        newCard.className = "card";

        const reviewText = document.createElement("p");
        reviewText.textContent = `"${userReview}"`;

        const authorName = document.createElement("span");
        authorName.textContent = `- ${userName}`;

        newCard.appendChild(reviewText);
        newCard.appendChild(authorName);

        // Animation
        newCard.style.opacity = "0";
        newCard.style.transform = "translateY(20px)";
        reviewCards.insertBefore(newCard, reviewCards.firstChild);

        setTimeout(() => {
            newCard.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            newCard.style.opacity = "1";
            newCard.style.transform = "translateY(0)";

            setTimeout(() => {
                newCard.style.transition = "";
                newCard.style.transform = "";
                newCard.style.opacity = "";
            }, 600);
        }, 10);

        reviewForm.reset();
    });
});
