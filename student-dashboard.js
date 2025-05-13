document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.dashboard-section');
  const menuItems = document.querySelectorAll('.sidebar a');
  const studentList = JSON.parse(localStorage.getItem('students')) || [];
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const studentInfo = studentList.find(student => student.email === loggedInUser?.email);

  // Show student info
  if (studentInfo) {
    document.getElementById('student-name').innerText = studentInfo.name;
    document.getElementById('student-email').innerText = studentInfo.email;
    document.getElementById('student-phone').innerText = studentInfo.phone;
    document.getElementById('student-address').innerText = studentInfo.address;
    document.getElementById('student-grade').innerText = studentInfo.grade;
    document.getElementById('student-subjects').innerText = studentInfo.subjects;
    document.getElementById('student-availability').innerText = studentInfo.availability;
  }

  // Redirect to teacher list
  document.getElementById('go-to-teacher-list').addEventListener('click', () => {
    window.location.href = 'teacher-list.html';
  });

  // Sidebar navigation
  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      sections.forEach(section => section.style.display = 'none');
      const targetId = this.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.style.display = 'block';
      menuItems.forEach(link => link.classList.remove('active'));
      this.classList.add('active');
    });
  });

  if (sections.length > 0) {
    sections.forEach(section => section.style.display = 'none');
    sections[0].style.display = 'block';
    menuItems[0].classList.add('active');
  }

  // Load teachers and display them for rating
  function loadTeachersForRating() {
    const teacherList = JSON.parse(localStorage.getItem('teachers')) || [];
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    const container = document.getElementById('teacher-rating-list');
    container.innerHTML = '';

    teacherList.forEach(teacher => {
      const teacherDiv = document.createElement('div');
      teacherDiv.classList.add('teacher-rating-item');
      teacherDiv.innerHTML = `
        <h4>${teacher.name} (${teacher.subject})</h4>
        <div class="stars" data-email="${teacher.email}">
          ${[1, 2, 3, 4, 5].map(star => `<span class="star" data-value="${star}">&#9733;</span>`).join('')}
        </div>
        <p>বর্তমান রেটিং: <span class="rating-value">${teacher.rating || 'N/A'}</span></p>
      `;

      // Check if this student already rated this teacher
      const studentEmail = loggedInUser?.email;
      const ratingKey = `${studentEmail}_${teacher.email}`;
      if (ratings[ratingKey]) {
        const stars = teacherDiv.querySelectorAll('.star');
        stars.forEach(star => {
          if (parseInt(star.dataset.value) <= ratings[ratingKey]) {
            star.classList.add('rated');
          }
        });
      }

      // Add click event for rating
      const starContainer = teacherDiv.querySelector('.stars');
      starContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
          const selectedRating = parseInt(e.target.dataset.value);
          const teacherEmail = starContainer.dataset.email;
          const studentEmail = loggedInUser?.email;
          const ratingKey = `${studentEmail}_${teacherEmail}`;

          if (!ratings[ratingKey]) {
            // Update teacher's average rating (simplified)
            const teacherIndex = teacherList.findIndex(t => t.email === teacherEmail);
            if (!teacherList[teacherIndex].ratingCount) teacherList[teacherIndex].ratingCount = 0;
            if (!teacherList[teacherIndex].totalRating) teacherList[teacherIndex].totalRating = 0;

            teacherList[teacherIndex].ratingCount += 1;
            teacherList[teacherIndex].totalRating += selectedRating;
            const average = teacherList[teacherIndex].totalRating / teacherList[teacherIndex].ratingCount;
            teacherList[teacherIndex].rating = average.toFixed(1);

            localStorage.setItem('teachers', JSON.stringify(teacherList));
            ratings[ratingKey] = selectedRating;
            localStorage.setItem('ratings', JSON.stringify(ratings));
            loadTeachersForRating(); // Reload UI
          } else {
            alert("আপনি এই শিক্ষককে ইতিমধ্যেই রেট করেছেন।");
          }
        }
      });

      container.appendChild(teacherDiv);
    });
  }

  loadTeachersForRating();
  const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); 
    window.location.href = "role-selection.html";
  });
}

});

