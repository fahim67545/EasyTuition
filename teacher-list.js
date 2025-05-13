document.addEventListener("DOMContentLoaded", () => {
  const teacherList = document.getElementById("teacher-list");
  const searchBar = document.getElementById("search-bar");
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (teachers.length === 0) {
    teacherList.innerHTML = "<p style='text-align: center;'>কোনো শিক্ষক প্রোফাইল খুঁজে পাওয়া যায়নি।</p>";
    return;
  }

  function displayTeachers(filteredTeachers) {
    teacherList.innerHTML = "";
    if (filteredTeachers.length === 0) {
      teacherList.innerHTML = "<p style='text-align: center;'>কোনো শিক্ষক প্রোফাইল খুঁজে পাওয়া যায়নি।</p>";
    } else {
      filteredTeachers.forEach((teacher, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const favIcon = document.createElement("span");
        favIcon.className = "favorite-icon";
        favIcon.innerHTML = "★";
        if (teacher.favorite) favIcon.classList.add("active");

        favIcon.addEventListener("click", () => {
          teacher.favorite = !teacher.favorite;
          favIcon.classList.toggle("active");
          saveTeachers(teachers);
        });

        const img = document.createElement("img");
        img.src = teacher.photo;
        img.alt = "Profile Picture";

        const name = document.createElement("h3");
        name.textContent = teacher.name;

        const institution = document.createElement("p");
        institution.textContent = teacher.institution;

        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-profile";
        toggleBtn.textContent = "See Profile";

        const details = document.createElement("div");
        details.className = "card-details";
        details.innerHTML = `
          <p><strong>বিষয়:</strong> ${teacher.subject}</p>
          <p><strong>অভিজ্ঞতা:</strong> ${teacher.experience}</p>
          <p><strong>শিক্ষাগত যোগ্যতা:</strong> ${teacher.qualification}</p>
          <p><strong>ঠিকানা:</strong> ${teacher.address}</p>
          <p><strong>মোবাইল:</strong> ${teacher.phone}</p>
          <p><strong>ইমেইল:</strong> ${teacher.email}</p>
          <p><strong>লিঙ্গ:</strong> ${teacher.gender || "N/A"}</p>
        `;

        toggleBtn.addEventListener("click", () => {
          details.classList.toggle("show");
          toggleBtn.textContent = details.classList.contains("show") ? "Hide Profile" : "See Profile";
        });

        if (
          loggedInUser &&
          loggedInUser.role === "teacher" &&
          loggedInUser.email === teacher.email
        ) {
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.style.backgroundColor = "#d32f2f";
          deleteBtn.style.marginTop = "10px";
          deleteBtn.style.color = "white";
          deleteBtn.style.border = "none";
          deleteBtn.style.borderRadius = "10px";
          deleteBtn.style.padding = "8px 16px";
          deleteBtn.style.cursor = "pointer";

          deleteBtn.addEventListener("click", () => {
            if (confirm("আপনি কি এই প্রোফাইল মুছে ফেলতে চান?")) {
              teachers.splice(index, 1);
              saveTeachers(teachers);
              localStorage.removeItem("loggedInUser");
              window.location.href = "role-selection.html";
            }
          });

          card.appendChild(deleteBtn);
        }

        card.appendChild(favIcon);
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(institution);
        card.appendChild(toggleBtn);
        card.appendChild(details);

        teacherList.appendChild(card);
      });
    }
  }

  function saveTeachers(updatedList) {
    localStorage.setItem("teachers", JSON.stringify(updatedList));
  }

  searchBar.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filteredTeachers = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(query) ||
      teacher.subject.toLowerCase().includes(query) ||
      teacher.institution.toLowerCase().includes(query)
    );
    displayTeachers(filteredTeachers);
  });

  displayTeachers(teachers);

  // ✅ Back to dashboard logic for both teacher and student
  const backBtn = document.getElementById("back-to-dashboard");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (loggedInUser) {
        if (loggedInUser.role === "teacher") {
          window.location.href = "teacher-dashboard.html";
        } else if (loggedInUser.role === "student") {
          window.location.href = "student-dashboard.html";
        } else {
          alert("অজানা ব্যবহারকারীর ধরন। আবার লগইন করুন।");
          window.location.href = "role-selection.html";
        }
      } else {
        alert("অনুগ্রহ করে প্রথমে লগইন করুন।");
        window.location.href = "role-selection.html";
      }
    });
  }
});
