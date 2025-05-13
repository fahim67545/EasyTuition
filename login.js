document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  const students = JSON.parse(localStorage.getItem('students')) || [];

  const teacher = teachers.find(t => t.email === email && t.password === password);
  const student = students.find(s => s.email === email && s.password === password);

  const successMessage = document.createElement('div');
  successMessage.classList.add('alert-success');
  successMessage.innerText = 'সফলভাবে লগইন হয়েছে!';
  document.body.appendChild(successMessage);

  if (teacher) {
    localStorage.setItem('loggedInUser', JSON.stringify({ role: 'teacher', email }));
    successMessage.style.display = 'block';
    setTimeout(() => {
      window.location.href = 'teacher-dashboard.html'; // ✅ redirect to teacher dashboard
    }, 2000);
  } else if (student) {
    localStorage.setItem('loggedInUser', JSON.stringify({ role: 'student', email }));
    successMessage.style.display = 'block';
    setTimeout(() => {
      window.location.href = 'student-dashboard.html';
    }, 2000);
  } else {
    document.getElementById('error').textContent = 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!';
  }
});
