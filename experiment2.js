var lastCalculatedTotal = 0;

const billingForm = document.getElementById('billingForm');
const billingResult = document.getElementById('billingResult');
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

billingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  billingResult.classList.remove('error');

  const formData = new FormData(billingForm);
  const values = {
    unitPrice: Number(formData.get('price')),
    quantity: Number(formData.get('quantity')),
    taxRate: Number(formData.get('tax'))
  };
  const { unitPrice, quantity, taxRate } = values;

  if (
    !Number.isFinite(unitPrice) || unitPrice <= 0 ||
    !Number.isInteger(quantity) || quantity < 1 ||
    !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100
  ) {
    billingResult.textContent = 'Enter a positive price, a whole-number quantity, and a tax rate from 0 to 100%.';
    billingResult.classList.add('error');
    return;
  }

  let subtotal = unitPrice * quantity;
  let taxAmount = subtotal * (taxRate / 100);
  lastCalculatedTotal = subtotal + taxAmount;

  billingResult.textContent =
    `Subtotal: ${currency.format(subtotal)} · Tax: ${currency.format(taxAmount)} · Total: ${currency.format(lastCalculatedTotal)}`;
});
