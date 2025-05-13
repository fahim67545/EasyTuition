document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];

  if (!loggedIn || loggedIn.role !== "teacher") {
    window.location.href = "login.html";
    return;
  }

  const teacher = teachers.find(t => t.email === loggedIn.email);
  if (!teacher) {
    alert("প্রোফাইল পাওয়া যায়নি!");
    return;
  }

  document.getElementById("teacherName").textContent = teacher.name;

  const profileCard = document.getElementById("profileCard");
  profileCard.innerHTML = `
    <img src="${teacher.photo}" alt="প্রোফাইল ছবি">
    <h3>${teacher.name}</h3>
    <p><strong>ইমেইল:</strong> ${teacher.email}</p>
    <p><strong>ফোন:</strong> ${teacher.phone}</p>
    <p><strong>ঠিকানা:</strong> ${teacher.address}</p>
    <p><strong>প্রতিষ্ঠান:</strong> ${teacher.institution}</p>
    <p><strong>বিষয়:</strong> ${teacher.subject}</p>
    <p><strong>অভিজ্ঞতা:</strong> ${teacher.experience} বছর</p>
    <p><strong>যোগ্যতা:</strong> ${teacher.qualification}</p>
    <p><strong>শ্রেণি:</strong> ${teacher.classRange}</p>
    <p><strong>সময়:</strong> ${teacher.availability}</p>
    <div class="rating-container">
      <h3>রেটিং দিন:</h3>
      <div class="star-rating" id="starRating">
        <span class="star" data-rating="1">&#9733;</span>
        <span class="star" data-rating="2">&#9733;</span>
        <span class="star" data-rating="3">&#9733;</span>
        <span class="star" data-rating="4">&#9733;</span>
        <span class="star" data-rating="5">&#9733;</span>
      </div>
      <p>বর্তমান রেটিং: <span id="current-rating">N/A</span></p>
    </div>
    <button class="delete-btn">প্রোফাইল মুছুন</button>
  `;

  // Rating functionality
  const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  const currentRating = ratings[teacher.email] || null;
  const currentRatingDisplay = document.getElementById("current-rating");

  if (currentRating) {
    currentRatingDisplay.textContent = `${currentRating}⭐`;
    highlightStars(currentRating);
  }

  function highlightStars(rating) {
    const stars = document.querySelectorAll(".star");
    stars.forEach(star => {
      const starRating = parseInt(star.dataset.rating);
      if (starRating <= rating) {
        star.classList.add("highlighted");
      } else {
        star.classList.remove("highlighted");
      }
    });
  }

  // Disable rating if the logged-in teacher is viewing their own profile
  if (loggedIn.email === teacher.email) {
    document.querySelectorAll(".star").forEach(star => {
      star.style.pointerEvents = "none";  // Disable click events on stars
    });
  } else {
    // Allow other users to rate the teacher
    document.querySelectorAll(".star").forEach(star => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.dataset.rating);
        ratings[teacher.email] = rating;
        localStorage.setItem("ratings", JSON.stringify(ratings));
        currentRatingDisplay.textContent = `${rating}⭐`;
        highlightStars(rating);
      });
    });
  }

  // Delete button
  profileCard.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("আপনি কি নিশ্চিতভাবে আপনার প্রোফাইল মুছতে চান?")) {
      const index = teachers.findIndex(t => t.email === loggedIn.email);
      if (index !== -1) {
        teachers.splice(index, 1);
        localStorage.setItem("teachers", JSON.stringify(teachers));
        localStorage.removeItem("loggedInUser");
        alert("প্রোফাইল মুছে ফেলা হয়েছে।");
        window.location.href = "role-selection.html";
      }
    }
  });

  // "Go to List" button
  const goToListButton = document.getElementById("goToList");
  if (goToListButton) {
    goToListButton.addEventListener("click", () => {
      window.location.href = "teacher-list.html";
    });
  }
  const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Clear the session
    window.location.href = "role-selection.html"; // Redirect to login page
  });
}

});
