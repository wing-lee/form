/**
 * @jest-environment jsdom
 */
import { validateEmail, validatePhone } from '../assets/form.js';

describe('Form validation', () => {
  test('validates correct email format', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+test@domain.co.uk')).toBe(true);
  });

  test('invalid email returns false', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@com')).toBe(false);
  });

  test('validates 11-digit phone numbers', () => {
    expect(validatePhone('01234567890')).toBe(true);
  });

  test('rejects non-numeric or short phone numbers', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('abcde123456')).toBe(false);
  });
});

describe('DOM interactions', () => {
let testForm, emailInput, phoneInput, dobInput, nameInput, output, emailError, phoneError;

  // Simulate minimal HTML for the form
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="testForm">
        <input id="name" />
        <input id="email" />
        <span id="emailError"></span>
        <input id="dob" type="date" />
        <input id="phone" />
        <span id="phoneError"></span>
        <button type="submit">Submit</button>
      </form>
      <table id="usersTable">
        <tbody></tbody>
      </table>
    `;

    // Import script dynamically after DOM ready
    require('../assets/form.js');

    // Grab elements
    testForm = document.getElementById('testForm');
    emailInput = document.getElementById('email');
    phoneInput = document.getElementById('phone');
    dobInput = document.getElementById('dob');
    nameInput = document.getElementById('name');
    output = document.querySelector('#usersTable tbody');
    emailError = document.getElementById('emailError');
    phoneError = document.getElementById('phoneError');

    // Trigger window load event to run main code
    window.dispatchEvent(new Event('load'));
  });

  test('should add a user to the table after valid submission', () => {
    nameInput.value = 'John Doe';
    emailInput.value = 'john@example.com';
    dobInput.value = '1990-01-01';
    phoneInput.value = '01234567890';

    testForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const rows = output.querySelectorAll('tr');
    expect(rows.length).toBe(1);

    const firstRow = rows[0].querySelectorAll('td');
    expect(firstRow[0].textContent).toBe('John Doe');
    expect(firstRow[1].textContent).toBe('john@example.com');
  });

  test('should not add user with invalid email', () => {
    nameInput.value = 'Jane';
    emailInput.value = 'bademail';
    dobInput.value = '1990-01-01';
    phoneInput.value = '01234567890';

    testForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(output.querySelectorAll('tr').length).toBe(0);
    expect(emailError.textContent).toBe('Please enter a valid email address.');
  });

  test('should not add user with invalid phone', () => {
    nameInput.value = 'Jane';
    emailInput.value = 'jane@example.com';
    dobInput.value = '1990-01-01';
    phoneInput.value = '1234';

    testForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(output.querySelectorAll('tr').length).toBe(0);
    expect(phoneError.textContent).toBe('Please enter a 11-digit phone number');
  });

  test('should delete a user when delete is clicked', () => {
    // Add user
    nameInput.value = 'Mark';
    emailInput.value = 'mark@example.com';
    dobInput.value = '1985-02-02';
    phoneInput.value = '01234567890';
    testForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    let rows = output.querySelectorAll('tr');
    expect(rows.length).toBe(1);

    // Simulate clicking DELETE
    const deleteButton = rows[0].querySelector('.delete-user');
    deleteButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    rows = output.querySelectorAll('tr');
    expect(rows.length).toBe(0);
  });
});