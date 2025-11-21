// ----------------------------
// READ URL PARAMETERS
// ----------------------------
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");
const fromPage = params.get("from"); 
// from can be: "home", "profile", "viewall" OR null


// ----------------------------
// FETCH AND SHOW BLOG DETAILS
// ----------------------------
fetch(`http://localhost:3000/api/blogs/${blogId}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            document.getElementById("blogTitle").textContent = "Blog not found";
            return;
        }

        const blog = data.blog;

        document.getElementById("blogTitle").textContent = blog.title;
        document.getElementById("blogContent").textContent = blog.content;

        document.getElementById("blogAuthor").textContent =
            `By ${blog.userId?.fullName || blog.userId?.username || "Unknown"}`;

        const date = new Date(blog.createdAt);
        document.getElementById("blogDate").textContent =
            date.toLocaleDateString();
    })
    .catch(() => {
        document.getElementById("blogTitle").textContent = "Error loading blog.";
    });


// ----------------------------
// SMART BACK BUTTON SYSTEM
// ----------------------------
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {

    // 1️⃣ If user came from HOME
    if (fromPage === "home") {
        window.location.href = "main.html";
        return;
    }

    // 2️⃣ If user came from VIEW ALL BLOGS page
    if (fromPage === "viewall") {
        window.location.href = "viewblog.html";
        return;
    }

    // 3️⃣ If user came from PROFILE → BLOGS tab
    if (fromPage === "profile") {
        window.location.href = "profile.html?tab=blogs";
        return;
    }

    // 4️⃣ ANY OTHER CASE → default back to home
    window.location.href = "main.html";
});