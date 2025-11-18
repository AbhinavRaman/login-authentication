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
    const viewModal = document.getElementById("viewModal");

    const blogTitleInput = document.getElementById("blogTitleInput");
    const blogContentInput = document.getElementById("blogContentInput");

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
        loadBlogs();  // ← load blogs from DB
    });

    function setActive(activeItem) {
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
        activeItem.classList.add("active");
    }

    // Load blogs to mongodb

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
                `;

                // Open full blog view on click
                card.addEventListener("click", () => viewBlog(blog._id));

                blogList.appendChild(card);
            });

        } catch (err) {
            blogList.innerHTML = "<p>Error loading blogs.</p>";
        }
    }


    // View full blog details

    async function viewBlog(blogId) {
        try {
            const res = await fetch(`http://localhost:3000/api/blogs/${blogId}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const data = await res.json();

            if (!data.success) {
                alert("Error loading blog");
                return;
            }

            document.getElementById("viewBlogTitle").textContent = data.blog.title;
            document.getElementById("viewBlogContent").textContent = data.blog.content;

            viewModal.classList.remove("hidden");

        } catch (err) {
            alert("Error fetching blog data");
        }
    }


    // Opem blog creation modal

    document.getElementById("createBlogBtn").addEventListener("click", () => {
        blogTitleInput.value = "";
        blogContentInput.value = "";
        blogModal.classList.remove("hidden");
    });

    // CLOSE CREATION MODAL
    document.getElementById("cancelBlogBtn").addEventListener("click", () => {
        blogModal.classList.add("hidden");
    });

    // PUBLISH BLOG → BACKEND

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

    // CLOSE VIEW MODAL

    document.getElementById("closeViewBtn").addEventListener("click", () => {
        viewModal.classList.add("hidden");
    });

});


// Logout

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}