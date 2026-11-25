function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const reverseText = function (value) {
  return [...value].reverse().join('');
};

const palindromeForm = document.getElementById('palindromeForm');
const textInput = document.getElementById('textInput');
const palindromeResult = document.getElementById('palindromeResult');
const attemptCounter = document.getElementById('attemptCounter');

function createPalindromeChecker() {
  let attempts = 0;

  return {
    check(value) {
      attempts += 1;
      const normalized = normalizeText(value);

      if (!normalized) {
        throw new Error('Enter at least one letter or number to check.');
      }

      const reversed = reverseText(normalized);
      return {
        isPalindrome: normalized === reversed,
        attempts
      };
    },
    getAttempts() {
      return attempts;
    }
  };
}

const checkPalindrome = createPalindromeChecker();

palindromeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  palindromeResult.classList.remove('error');

  try {
    const result = checkPalindrome.check(textInput.value);
    const message = result.isPalindrome
      ? 'Yes—this is a palindrome.'
      : 'No, this is not a palindrome.';
    palindromeResult.textContent = `${message} (${textInput.value.trim()})`;
    attemptCounter.textContent = `Checks: ${result.attempts}`;
  } catch (error) {
    palindromeResult.textContent = error.message;
    palindromeResult.classList.add('error');
    attemptCounter.textContent = `Checks: ${checkPalindrome.getAttempts()}`;
  }
});
