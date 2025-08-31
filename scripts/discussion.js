document.addEventListener("DOMContentLoaded", () => {
  // -------------------- Initialization --------------------
  let posts = JSON.parse(localStorage.getItem("posts"));
  if (!posts || posts.length === 0) {
    posts = [
      {
        user: "Sandra16012007",
        title: "Tech News",
        postContent:
          "Generative AI is reshaping industries by automating creative and customer tasks. 5G expansion boosts connectivity for IoT and autonomous technologies. Quantum computing advances promise breakthroughs in cryptography and drug discovery.",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tags: ["Tech Updates"],
        replies: [],
        upvotes: 24,
      },
      {
        user: "Alex431",
        title: "Tips to learn Data Structures",
        postContent:
          "Hi all, I’m starting to learn data structures. Can anyone suggest easy resources or tips for beginners? Thanks!",
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tags: ["Data Structures"],
        replies: [],
        upvotes: 13,
      },
    ];
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  // -------------------- Render Posts --------------------
  function renderPosts(postsToRender = posts) {
  const list = document.getElementById("posts-container");
  list.innerHTML = "";

  let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];

  postsToRender.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "card";
    postElement.setAttribute("data-user", post.user);
    postElement.setAttribute("data-title", post.title);
    postElement.setAttribute("data-date", post.date);

    // Check if post is saved
    const isSaved = savedPosts.some(
      (savedPost) =>
        savedPost.user === post.user &&
        savedPost.title === post.title &&
        savedPost.date === post.date
    );

    const isUpvoted = post.isUpvoted || false;

    postElement.innerHTML = `
      <div class="card-header">
        <div class="avatar"></div>
        <div style="flex:1;">
          <p class="username">${post.user}</p>
          <p class="time">Posted on <span class="time-posted">${post.date}</span></p>
        </div>
      </div>
      <p class="post-title">${post.title}</p>
      <p class="post-content">${post.postContent}</p>
      <div class="card-footer">
        <div class="footer-btn-save ${isSaved ? "active" : ""}">
          <img src="../assets/discussion/tag-white-icon.png" alt="Save Icon">
        </div>
        <div class="footer-btn-upvote ${isUpvoted ? "active" : ""}">
          <img src="../assets/discussion/upvote-icon.png" alt="Upvote Icon">
          <span class="upvotes-count">${post.upvotes}</span>
        </div>
        <div class="footer-btn-reply">
          <img src="../assets/discussion/reply-icon.png" alt="Reply Icon">
          <p>Post reply</p>
        </div>
      </div>
    `;

    // Click on post content → go to preview page
    postElement.querySelector(".post-content").addEventListener("click", () => {
      localStorage.setItem("selectedPost", JSON.stringify(post));
      window.location.href = "../pages/discussion-post-preview.html";
    });

    // Save button functionality
    postElement.querySelector(".footer-btn-save").addEventListener("click", function () {
        let savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
        const existsIndex = savedPosts.findIndex(
            (savedPost) =>
            savedPost.user === post.user &&
            savedPost.title === post.title &&
            savedPost.date === post.date
        );

        if (existsIndex === -1) {
            // Not saved → Save it
            savedPosts.push(post);
            localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
            this.classList.add("active"); // Apply green
        } else {
            // Already saved → Remove it
            savedPosts.splice(existsIndex, 1);
            localStorage.setItem("savedPosts", JSON.stringify(savedPosts));
            this.classList.remove("active"); // Remove green
        }
    });


    // Upvote button functionality
    const upvoteBtn = postElement.querySelector(".footer-btn-upvote");
    const upvoteCount = postElement.querySelector(".upvotes-count");

    upvoteBtn.addEventListener("click", function () {
      if (post.isUpvoted) {
        post.upvotes--;
        post.isUpvoted = false;
        upvoteBtn.classList.remove("active");
      } else {
        post.upvotes++;
        post.isUpvoted = true;
        upvoteBtn.classList.add("active");
      }

      upvoteCount.textContent = post.upvotes;
      localStorage.setItem("posts", JSON.stringify(posts));
    });

    list.appendChild(postElement);
  });
}

  // -------------------- Search --------------------
  document.querySelector(".search-btn").onclick = function () {
    const searchInput = document.querySelector("#search-input");
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      renderPosts(posts);
    } else {
      const results = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.postContent.toLowerCase().includes(query)
      );
      renderPosts(results);
    }
  };

  // -------------------- Add New Post --------------------
  const addPostButton = document.querySelector(".add-post-btn");
  if (addPostButton) {
    addPostButton.onclick = function () {
      window.location.href = "../pages/discussion-new-post.html";
    };
  }

  // -------------------- Sidebar Home Redirect --------------------
  const homeLink = document.querySelector(".home-link");
  if (homeLink) {
    homeLink.addEventListener("click", () => {
      window.location.href = "../pages/discussion.html";
    });
  }

  // Initial Render
  renderPosts();
});

// -------------------- Add Post Page (Call this in new post page script) --------------------
function addPost() {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  const username = "PranavK2025"; // Example username
  const title = document.getElementById("post-title").value;
  const postContent = document.getElementById("post-content").value;

  if (!username || !title || !postContent) {
    alert("Fill all fields!");
    return;
  }

  posts.push({
    user: username,
    title: title,
    postContent: postContent,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    tags: [],
    replies: [],
    upvotes: 0,
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  window.location.href = "../pages/discussion.html"; // Redirect after adding
}