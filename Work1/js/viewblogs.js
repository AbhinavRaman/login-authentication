// Load all blogs on page load
document.addEventListener("DOMContentLoaded", () => {
    loadAllBlogs();
});

// LOAD ALL BLOG CARDS

function loadAllBlogs() {
    const container = document.getElementById("allBlogs");

    fetch("http://localhost:3000/api/blogs/all")
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.blogs.length === 0) {
                container.innerHTML = "<p>No blogs found.</p>";
                return;
            }

            data.blogs.forEach(blog => {
                const card = document.createElement("div");
                card.className = "blog-card";

                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 150)}...</p>
                `;

                // open modal on click
                card.addEventListener("click", () => openBlogModal(blog));

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.log(err);
            container.innerHTML = "<p>Error loading blogs.</p>";
        });
}

// BLOG MODAL

const modal = document.getElementById("blogModal");
const closeBtn = document.getElementById("closeModal");

function openBlogModal(blog) {
    document.getElementById("modalBlogTitle").textContent = blog.title;
    document.getElementById("modalBlogContent").textContent = blog.content;

    // AUTHOR NAME
    const author =
        blog.userId?.fullName ||
        blog.userId?.username ||
        "Unknown Author";

    document.getElementById("modalBlogAuthor").textContent = "By: " + author;

    // DATE
    const date = new Date(blog.createdAt).toLocaleDateString();
    document.getElementById("modalBlogDate").textContent = "Posted on: " + date;

    modal.classList.remove("hidden");
}

// close modal on X click
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// close modal on outside click
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});