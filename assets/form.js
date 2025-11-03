// form.js

/* ======= Validation functions ======= */

// Email format checking
export const validateEmail = email => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

// Phone number validate (11 digit format)
export const validatePhone = phone => /^\d{11}$/.test(phone);

/* ======= Main codes ======= */

window.addEventListener('load', () => {
  // Data
  const users = [];
  const testForm = document.getElementById('testForm');
  const output = document.querySelector('#usersTable tbody');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const dobInput = document.getElementById('dob');
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');

  // Prevent future date
  const today = new Date().toISOString().split('T')[0];
  dobInput.setAttribute('max', today);

  // function to display user information
  const renderInfo = () => {
    output.innerHTML = users.map((user, index) => `
      <tr>
        <td>${user.userName}</td>
        <td>${user.userEmail}</td>
        <td>${user.userDOB}</td>
        <td>${user.userPhone}</td>
        <td><span class="delete-user" data-index="${index}">DELETE</span></td>
      </tr>
    `).join('');
  };

  // Delete funcion
  output.addEventListener('click', e => {
    if (e.target.classList.contains('delete-user')) {
      const index = e.target.dataset.index;
      users.splice(index, 1);
      renderInfo();
    }
  });
  
  // when click submit
  testForm.addEventListener('submit', e => {
    e.preventDefault(); // prevent form reload
    
    // collect form values
    const userName = document.getElementById('name').value.trim();
    const userEmail = emailInput.value.trim();
    const userDOB = dobInput.value;
    const userPhone = document.getElementById('phone').value.trim();
    
    // create object for the entry
    const user = { userName, userEmail, userDOB, userPhone };

    // Email validation
    if (validateEmail(userEmail)) {
      emailError.textContent = '';
    } else {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }

    // phone validation
    if (validatePhone(userPhone)) {
      phoneError.textContent = '';
    } else {
      phoneError.textContent = 'Please enter a 11-digit phone number';
      phoneInput.focus();
      return;
    }

    users.push(user); // add input to array
    renderInfo();
      
  });

});