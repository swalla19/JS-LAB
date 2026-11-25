const userForm = document.getElementById('userForm');
const welcomeMessage = document.getElementById('welcomeMessage');
const userInfo = document.getElementById('userInfo');

userForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(userForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();

  welcomeMessage.textContent = `Welcome, ${name}! We’re glad you’re here.`;
  userInfo.textContent = `Name: ${name} · Email: ${email}`;

  console.log('Welcome message displayed.');
  console.table([{ name, email }]);
});

console.warn('Tip: submit the form to display the entered user information.');
