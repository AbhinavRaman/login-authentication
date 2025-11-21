// Load all blogs on page load
document.addEventListener("DOMContentLoaded", () => {
    loadAllBlogs();
});

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

                // Click → full blog page (from = viewall)
                card.addEventListener("click", () => {
                    window.location.href = `viewFullBlog.html?id=${blog._id}&from=viewall`;
                });

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.log(err);
            container.innerHTML = "<p>Error loading blogs.</p>";
        });
}