// LOAD BLOGS ON HOME PAGE

document.addEventListener("DOMContentLoaded", () => {
    loadBlogsToHome();
});

// Fetch blogs from backend and show on home page
function loadBlogsToHome() {
    // const blogContainer = document.querySelector(".blogs");
    const blogCardContainer = document.querySelector(".blog-card-container");

    fetch("http://localhost:3000/api/blogs/all")
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.blogs.length === 0) {
                blogCardContainer.innerHTML += `<p>No blogs available.</p>`;
                return;
            }

            data.blogs.forEach(blog => {
                const card = document.createElement("div");
                card.classList.add("home-blog-card");

                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 120)}...</p>
                    <button class="readMoreBtn" data-id="${blog._id}">Read More</button>
                `;

                blogCardContainer.appendChild(card);
            });

            // Add click events to read more buttons
            document.querySelectorAll(".readMoreBtn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = e.target.getAttribute("data-id");
                    window.location.href = "viewblog.html?id=" + id;
                });
            });
        })
        .catch(err => {
            console.error("Blog load error:", err);
            blogCardContainer.innerHTML += `<p>Error loading blogs.</p>`;
        });
}

// ADD USER REVIEWS (LOCAL)

document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("reviewForm");
    const reviewCards = document.querySelector(".review-cards");

    if (!reviewForm) return; // Prevent errors on other pages

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