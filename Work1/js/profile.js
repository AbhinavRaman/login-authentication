 document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Update profile info
    document.getElementById("welcomeText").textContent = "Welcome, " + user.fullName;
    document.getElementById("fullName").textContent = user.fullName;
    document.getElementById("email").textContent = user.email;
    document.getElementById("username").textContent = user.username;

    // BLOG SYSTEM
    let blogs = JSON.parse(localStorage.getItem("blogs_" + user.username)) || [];

    const menuProfile = document.getElementById("menuProfile");
    const menuBlogs = document.getElementById("menuBlogs");

    const profileSection = document.getElementById("profileSection");
    const blogSection = document.getElementById("blogSection");
    const blogList = document.getElementById("blogList");

    // Switch to Profile View
    menuProfile.addEventListener("click", () => {
        setActive(menuProfile);
        profileSection.style.display = "block";
        blogSection.style.display = "none";
    });

    // Switch to Blog View
    menuBlogs.addEventListener("click", () => {
        setActive(menuBlogs);
        profileSection.style.display = "none";
        blogSection.style.display = "block";
        loadBlogs();
    });

    // Set Active Menu Styling
    function setActive(activeBtn) {
        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
        activeBtn.classList.add("active");
    }

    // Load Blogs into List
    function loadBlogs() {
        blogList.innerHTML = "";

        if (blogs.length === 0) {
            blogList.innerHTML = "<p>No blogs posted yet.</p>";
            return;
        }

        blogs.forEach(blog => {
            const card = document.createElement("div");
            card.classList.add("blog-card");
            card.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
            `;
            blogList.appendChild(card);
        });
    }

    // Create Blog Handler
    document.getElementById("createBlogBtn").addEventListener("click", () => {
        const title = prompt("Enter blog title:");
        if (!title) return;

        const content = prompt("Enter blog content:");
        if (!content) return;

        blogs.push({ title, content });
        localStorage.setItem("blogs_" + user.username, JSON.stringify(blogs));

        loadBlogs();
        alert("Blog created!");
    });
});

// Logout function

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
