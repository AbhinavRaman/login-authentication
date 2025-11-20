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

            // Show only latest 3 blogs on home page
            const latestBlogs = data.blogs.slice(0, 3);

            latestBlogs.forEach(blog => {
                const card = document.createElement("div");
                card.classList.add("home-blog-card");

                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 120)}...</p>
                `;

                blogCardContainer.appendChild(card);
            });

            // Add event listener to "View All Blogs" button
            const viewAllBlogsBtn = document.getElementById("viewAllBlogsBtn");
            viewAllBlogsBtn.addEventListener("click", () => {
                window.location.href = "viewblog.html";
            });

        })
        .catch(err => {
            console.error("Blog load error:", err);
            blogCardContainer.innerHTML += `<p>Error loading blogs.</p>`;
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
