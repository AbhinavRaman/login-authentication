document.addEventListener("DOMContentLoaded", () => {
    // Check login
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // Setting user profile info
    document.getElementById("welcomeText").textContent = "Welcome, " + user.fullName;
    document.getElementById("fullName").textContent = user.fullName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("username").textContent = user.username;

    // Elements
    const menuProfile = document.getElementById("menuProfile");
    const menuBlogs = document.getElementById("menuBlogs");

    const profileSection = document.getElementById("profileSection");
    const blogSection = document.getElementById("blogSection");
    const blogList = document.getElementById("blogList");

    const blogModal = document.getElementById("blogModal");

    // EDIT MODAL
    const editModal = document.getElementById("editModal");
    const editBlogTitleInput = document.getElementById("editBlogTitleInput");
    const editBlogContentInput = document.getElementById("editBlogContentInput");
    const saveEditBlogBtn = document.getElementById("saveEditBlogBtn");
    const closeEditBtn = document.getElementById("closeEditBtn");

    let editingBlogId = null;

    // Menu Switching
    menuProfile.addEventListener("click", () => {
        setActive(menuProfile);
        profileSection.style.display = "block";
        blogSection.style.display = "none";
    });

    menuBlogs.addEventListener("click", () => {
        setActive(menuBlogs);
        profileSection.style.display = "none";
        blogSection.style.display = "block";
        loadBlogs();
    });

    function setActive(activeItem) {
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
        activeItem.classList.add("active");
    }

    // Load blogs from MongoDB
    async function loadBlogs() {
        blogList.innerHTML = "<p>Loading blogs...</p>";

        try {
            const res = await fetch("http://localhost:3000/api/blogs/myblogs", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await res.json();

            if (!data.success || data.blogs.length === 0) {
                blogList.innerHTML = "<p>No blogs posted yet.</p>";
                return;
            }

            blogList.innerHTML = "";

            data.blogs.forEach(blog => {
                const card = document.createElement("div");
                card.classList.add("blog-card");

                card.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.content.substring(0, 80)}...</p>

                    <div class="blog-actions">
                        <button class="editBlogBtn" data-id="${blog._id}">Edit</button>
                        <button class="deleteBlogBtn" data-id="${blog._id}">Delete</button>
                    </div>
                `;

                // Click → open full blog page (from = profile)
                card.addEventListener("click", (e) => {
                    // Ignore clicks on edit/delete buttons
                    if (e.target.classList.contains("editBlogBtn") || e.target.classList.contains("deleteBlogBtn")) {
                        return;
                    }

                    window.location.href = `viewFullBlog.html?id=${blog._id}&from=profile`;
                });

                blogList.appendChild(card);
            });

        } catch (err) {
            blogList.innerHTML = "<p>Error loading blogs.</p>";
        }
    }

    // 🔹 If coming from full blog page with ?tab=blogs → open Blogs tab directly
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab === "blogs") {
        setActive(menuBlogs);
        profileSection.style.display = "none";
        blogSection.style.display = "block";
        loadBlogs();
    }

    // Open blog creation modal
    document.getElementById("createBlogBtn").addEventListener("click", () => {
        blogTitleInput.value = "";
        blogContentInput.value = "";
        blogModal.classList.remove("hidden");
    });

    // Close blog creation modal
    document.getElementById("cancelBlogBtn").addEventListener("click", () => {
        blogModal.classList.add("hidden");
    });

    // Publish blog
    document.getElementById("publishBlogBtn").addEventListener("click", async () => {
        const title = blogTitleInput.value.trim();
        const content = blogContentInput.value.trim();

        if (!title || !content) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/blogs/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ title, content })
            });

            const data = await res.json();

            if (data.success) {
                blogModal.classList.add("hidden");
                loadBlogs();
                alert("Blog Published!");
            } else {
                alert("Error publishing blog");
            }

        } catch (err) {
            alert("Failed to publish blog");
        }
    });

    // EDIT BLOG — OPEN EDIT MODAL
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("editBlogBtn")) {
            e.stopPropagation();
            const id = e.target.getAttribute("data-id");
            editingBlogId = id;

            fetch(`http://localhost:3000/api/blogs/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        alert("Error loading blog for edit");
                        return;
                    }

                    editBlogTitleInput.value = data.blog.title;
                    editBlogContentInput.value = data.blog.content;

                    editModal.classList.remove("hidden");
                })
                .catch(() => alert("Error fetching blog for edit"));
        }
    });

    // Save edited blog
    saveEditBlogBtn.addEventListener("click", async () => {
        const updatedTitle = editBlogTitleInput.value.trim();
        const updatedContent = editBlogContentInput.value.trim();

        if (!updatedTitle || !updatedContent) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/blogs/update/${editingBlogId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ title: updatedTitle, content: updatedContent })
            });

            const data = await res.json();

            if (data.success) {
                alert("Blog updated!");
                editModal.classList.add("hidden");
                loadBlogs();
            } else {
                alert(data.message || "Error updating blog");
            }

        } catch (err) {
            alert("Error updating blog");
        }
    });

    // Close edit modal
    closeEditBtn.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });

    editModal.addEventListener("click", (e) => {
        if (e.target === editModal) {
            editModal.classList.add("hidden");
        }
    });

    // DELETE BLOG
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("deleteBlogBtn")) {
            e.stopPropagation();
            const id = e.target.getAttribute("data-id");

            if (!confirm("Are you sure you want to delete this blog?")) return;

            try {
                const res = await fetch(`http://localhost:3000/api/blogs/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                const data = await res.json();

                if (data.success) {
                    alert("Blog deleted!");
                    loadBlogs();
                } else {
                    alert(data.message || "Error deleting blog");
                }
            } catch (err) {
                alert("Error deleting blog");
            }
        }
    });
});

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}