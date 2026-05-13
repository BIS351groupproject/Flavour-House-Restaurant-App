//LOGIN VALIDATION
const loginForm = document.getElementById('loginForm');
const loginUser = document.getElementById('loginUser');
const loginPassword = document.getElementById('loginPassword');

const storedUser =
JSON.parse(localStorage.getItem("user"));

if (storedUser) {

window.location.hash = 'home';

document.getElementById("welcomeUser").textContent =
"Welcome, " + storedUser.username;

}

function showError(input, errorId, message) {
input.classList.add('input-error');
input.classList.remove('input-valid');
document.getElementById(errorId).textContent = message;
}

function clearError(input, errorId) {
input.classList.remove('input-error');
input.classList.add('input-valid');
document.getElementById(errorId).textContent = '';
}

function validateUsername() {
const value = loginUser.value.trim();

if (value === '') return showError(loginUser, 'loginUserError', 'Username is required'), false;
if (value.length < 5) return showError(loginUser, 'loginUserError', 'Minimum 5 characters required'), false;

clearError(loginUser, 'loginUserError');
return true;
}

function validatePassword() {
const value = loginPassword.value.trim();

if (value === '') return showError(loginPassword, 'loginPasswordError', 'Password is required'), false;
if (value.length < 8) return showError(loginPassword, 'loginPasswordError', 'Password must be at least 8 characters'), false;

clearError(loginPassword, 'loginPasswordError');
return true;
}

loginUser.addEventListener('blur', validateUsername);
loginPassword.addEventListener('blur', validatePassword);

loginForm.addEventListener('submit', function (event) {
event.preventDefault();

const userValid = validateUsername();
const passValid = validatePassword();

if (userValid && passValid) {

const user = {
username: loginUser.value
};

localStorage.setItem("user", JSON.stringify(user));
document.getElementById("welcomeUser").textContent =
"Welcome, " + loginUser.value;
window.location.hash = 'home';
}

});


//CART STATE
let cart = JSON.parse(localStorage.getItem('cart')) || [];


//MENU 
function updateMenuWithCart() {
foodCards.forEach((card) => {

const name = card.querySelector('.food-card3 p').textContent;
const quantityText = card.querySelector('.food-card2 p');

const item = cart.find(i => i.name === name);

quantityText.textContent = item ? item.quantity : 0;

});
}

const foodCards = document.querySelectorAll('.food-card');

function getQuantity(name) {
const item = cart.find(i => i.name === name);
return item ? item.quantity : 0;
}

foodCards.forEach((card) => {

const plusBtn = card.querySelector('.plus-btn');
const minusBtn = card.querySelector('.minus-btn');

const quantityText = card.querySelector('.food-card2 p');

const name = card.querySelector('.food-card3 p').textContent;

const price = parseInt(
card.querySelectorAll('.food-card3 p')[1].textContent.replace('$', '')
);

const image = card.querySelector('img').src;

quantityText.textContent = getQuantity(name);

plusBtn.addEventListener('click', () => {
const current = getQuantity(name);
updateCart(name, price, current + 1, image);
quantityText.textContent = current + 1;
});

minusBtn.addEventListener('click', () => {
const current = getQuantity(name);

if (current > 0) {
updateCart(name, price, current - 1, image);
quantityText.textContent = current - 1;
}
});

});


//UPDATE CART
function updateCart(name, price, quantity, image) {

const item = cart.find(i => i.name === name);

if (item) {

item.quantity = quantity;
item.total = quantity * price;
item.image = image;

} else {

cart.push({
name,
price,
image,
quantity,
total: quantity * price
});

}

cart = cart.filter(i => i.quantity > 0);

localStorage.setItem('cart', JSON.stringify(cart));

displayCart();
updateTotalPrice();
displayCheckoutTotal();
updateMenuWithCart();
}


//DISPLAY CART
const cartItemsContainer = document.getElementById('cartItems');

function displayCart() {

if (!cartItemsContainer) return;

cartItemsContainer.innerHTML = '';

let totalPrice = 0;

cart.forEach((item) => {

totalPrice += item.total;

const cartCard = document.createElement('article');
cartCard.classList.add('food-card');

cartCard.innerHTML = `
<figure>
<img src="${item.image}" alt="${item.name}">
</figure>

<section class="food-card3">
<p>${item.name}</p>
<p>$${item.total}</p>
</section>

<section class="food-card2">
<button class="minus">-</button>
<p>${item.quantity}</p>
<button class="plus">+</button>
<button class="delete">🗑</button>
</section>
`;

cartCard.querySelector('.plus').addEventListener('click', () => {
updateCart(item.name, item.price, item.quantity + 1, item.image);
});

cartCard.querySelector('.minus').addEventListener('click', () => {
updateCart(item.name, item.price, item.quantity - 1, item.image);
});

cartCard.querySelector('.delete').addEventListener('click', () => {
cart = cart.filter(i => i.name !== item.name);
localStorage.setItem('cart', JSON.stringify(cart));
displayCart();
updateTotalPrice();
displayCheckoutTotal();
});

cartItemsContainer.appendChild(cartCard);

});

const totalEl = document.querySelector('.total strong');
if (totalEl) {
totalEl.textContent = `Total Price: $${totalPrice}`;
}

}

displayCart();
updateMenuWithCart();


//TOTAL PRICE
function updateTotalPrice() {

let total = 0;

cart.forEach(item => total += item.total);

const el = document.querySelector('.total strong');
if (el) el.textContent = `Total Price: $${total}`;

}


//SEARCH
const searchInput = document.querySelector('.search-form input');

if (searchInput) {

searchInput.addEventListener('keyup', () => {

const value = searchInput.value.toLowerCase();

foodCards.forEach((card) => {

const name = card
.querySelector('.food-card3 p')
.textContent
.toLowerCase();

if (name.includes(value)) {
card.style.display = 'flex';
} else {
card.style.display = 'none';
}

});

});

}

//CHECKOUT
const addressInput = document.getElementById('address');
const nameInput = document.getElementById('cardName');
const expiryInput = document.getElementById('expiryDate');
const cardInput = document.getElementById('cardNumber');
const cvvInput = document.getElementById('cvvNumber');

function validateCard() {

const value = cardInput.value.trim();

if (value === '') {

document.getElementById('cardError')
.textContent = 'Card number is required';

return false;
}

if (value.length !== 16) {

document.getElementById('cardError')
.textContent =
'Card number must be 16 digits';

return false;
}

document.getElementById('cardError')
.textContent = '';

return true;
}

function validateCVV() {

const value = cvvInput.value.trim();

if (value === '') {

document.getElementById('cvvError')
.textContent = 'CVV is required';

return false;
}

if (value.length !== 6) {

document.getElementById('cvvError')
.textContent =
'CVV must be 6 digits';

return false;
}

document.getElementById('cvvError')
.textContent = '';

return true;
}

const checkoutButton = document.querySelector('#checkout .btn-checkout');

function validateField(input, errorId, message) {

if (!input) return false;

if (input.value.trim() === '') {
document.getElementById(errorId).textContent = message;
return false;
}

document.getElementById(errorId).textContent = '';
return true;
}

if (checkoutButton) {

checkoutButton.addEventListener('click', function (event) {
event.preventDefault();

const addressValid = validateField(addressInput, 'addressError', 'Address is required');
const nameValid = validateField(nameInput, 'nameError', 'Cardholder name is required');
const expiryValid = validateField(expiryInput, 'dateError', 'Expiry date is required');

const cardValid = validateCard();
const cvvValid = validateCVV();

if (addressValid && cardValid && cvvValid && nameValid && expiryValid) {

const orderNumber = Math.floor(Math.random() * 100000);

alert(
`Payment Completed Successfully
Order Number: #${orderNumber}
Your order is being prepared.`
);

localStorage.removeItem('cart');
cart = [];

displayCart();
displayCheckoutTotal();
updateTotalPrice();
}

});

}

function displayCheckoutTotal() {

const el = document.querySelector('.total-row strong');
if (!el) return;

let total = 0;

cart.forEach(item => total += item.total);

el.textContent = `Total Price: $${total}`;

}

//Profile
const profileName =
document.getElementById('profileName');

const profilePhone =
document.getElementById('profilePhone');

const profileEmail =
document.getElementById('profileEmail');

const profileAge =
document.getElementById('profileAge');

const saveProfileButton =
document.getElementById('saveProfile');

const profileGender =
document.querySelector('#profileGender');

function validateProfileEmail() {

const value = profileEmail.value.trim();

if (value === '') {
alert('Email is required');
return false;
}

if (!value.includes('@')) {
alert(`Please include an '@' in the email address. '${value}' is missing an '@'.`);
return false;
}

const atIndex = value.indexOf('@');
const dotIndex = value.lastIndexOf('.');

if (dotIndex === value.length - 1) {
alert(`Invalid email format: '${value}'`);
return false;
}

if (dotIndex < atIndex + 2) {
alert(`'.' is in the wrong place in '${value}'`);
return false;
}

if (atIndex === 0 || atIndex === value.length - 1) {
alert(`Invalid email format: '${value}'`);
return false;
}

return true;
}

saveProfileButton.addEventListener('click', function() {

if (
profileName.value.trim() === '' ||
profilePhone.value.trim() === '' ||
profileEmail.value.trim() === '' ||
profileAge.value.trim() === '' ||
profileGender.value === ''
) {

alert('Please fill in all fields');

return;
}

if (!validateProfileEmail()) return;

const profileData = {

fullName: profileName.value,

phone: profilePhone.value,

email: profileEmail.value,

age: profileAge.value,

gender: profileGender.value

};

localStorage.setItem(
'profileData',
JSON.stringify(profileData)
);

alert('Your information has been saved successfully');
});

function loadProfileData() {

const savedProfile =
JSON.parse(localStorage.getItem('profileData'));

if (savedProfile) {

profileName.value =
savedProfile.fullName || '';

profilePhone.value =
savedProfile.phone || '';

profileEmail.value =
savedProfile.email || '';

profileAge.value =
savedProfile.age || '';

profileGender.value =
savedProfile.gender || '';

}
}

loadProfileData();

const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {

logoutBtn.addEventListener('click', function () {

localStorage.removeItem('user');

localStorage.removeItem('profileData');

loginForm.reset();

profileName.value = '';
profilePhone.value = '';
profileEmail.value = '';
profileAge.value = '';

document.getElementById("welcomeUser").textContent = '';

});

}

//Contact Us
const contactForm =
document.getElementById('contactForm');

const contactName =
document.getElementById('contactName');

const contactEmail =
document.getElementById('contactEmail');

const contactMessage =
document.getElementById('contactMessage');

function validateContactName() {

const value = contactName.value.trim();

if (value === '') {

document.getElementById('contactNameError')
.textContent = 'Full name is required';

return false;
}

document.getElementById('contactNameError')
.textContent = '';

return true;
}

function validateContactEmail() {

const value = contactEmail.value.trim();

const emailPattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (value === '') {
document.getElementById('contactEmailError')
.textContent = 'Email is required';
return false;
}

if (!emailPattern.test(value)) {
document.getElementById('contactEmailError')
.textContent = 'Enter a valid email';
return false;
}

return true;
}

function validateContactMessage() {

const value = contactMessage.value.trim();

if (value === '') {

document.getElementById('contactMessageError')
.textContent = 'Message cannot be empty';

return false;
}

document.getElementById('contactMessageError')
.textContent = '';

return true;
}

contactForm.addEventListener('submit', function(event) {

event.preventDefault();

const nameValid =
validateContactName();

const emailValid =
validateContactEmail();

const messageValid =
validateContactMessage();

if (
nameValid &&
emailValid &&
messageValid
) {

alert(
'Your message has been sent successfully. We will contact you soon.'
);

contactForm.reset();
}
});

//Reviwes
document.addEventListener('DOMContentLoaded', function () {

const reviewForm = document.getElementById('reviewForm');
const reviewCustomer = document.getElementById('reviewCustomer');
const reviewText = document.getElementById('reviewText');
const reviewRating = document.getElementById('reviewRating');
const reviewTableBody = document.getElementById('reviewTableBody');

const defaultReviews = [
{ customer: 'James', text: 'The steak was amazing!', rating: 5 },
{ customer: 'Emily', text: 'Mashed potatoes were perfect.', rating: 4 },
{ customer: 'Michael Brown', text: 'Best restaurant in Texas!', rating: 5 },
{ customer: 'Sarah Johnson', text: 'Service was a bit slow but food great.', rating: 4 },
{ customer: 'David Lee', text: 'The food was very good!', rating: 5 },
{ customer: 'Olivia', text: 'Cozy place nothing special.', rating: 2 }
];

let reviewsFromStorage = JSON.parse(localStorage.getItem('reviews'));

let reviews = (reviewsFromStorage && reviewsFromStorage.length)
? reviewsFromStorage
: defaultReviews;

if (!reviewsFromStorage) {
localStorage.setItem('reviews', JSON.stringify(defaultReviews));
}

function saveReviews() {
localStorage.setItem('reviews', JSON.stringify(reviews));
}

window.deleteReview = function (index) {
reviews.splice(index, 1);
saveReviews();
displayReviews();
};

function displayReviews() {

reviewTableBody.innerHTML = '';

let ratingCount = { 1:0, 2:0, 3:0, 4:0, 5:0 };

reviews.forEach((review, index) => {

const row = document.createElement('tr');

row.innerHTML = `
<td>${review.customer}</td>
<td>${review.text}</td>
<td>${review.rating}</td>
<td><button onclick="deleteReview(${index})">Delete</button></td>
`;

reviewTableBody.appendChild(row);

ratingCount[review.rating]++;
});

const total = reviews.length || 1;

document.getElementById('progress5').value = ratingCount[5];
document.getElementById('progress4').value = ratingCount[4];
document.getElementById('progress3').value = ratingCount[3];
document.getElementById('progress2').value = ratingCount[2];
document.getElementById('progress1').value = ratingCount[1];

document.getElementById('progress5').max = total;
document.getElementById('progress4').max = total;
document.getElementById('progress3').max = total;
document.getElementById('progress2').max = total;
document.getElementById('progress1').max = total;
}

reviewForm.addEventListener('submit', function (e) {
e.preventDefault();

if (
reviewCustomer.value.trim() === '' ||
reviewText.value.trim() === '' ||
reviewRating.value === ''
) {

alert('Please fill in all review fields');

return;
}

const newReview = {
customer: reviewCustomer.value,
text: reviewText.value,
rating: parseInt(reviewRating.value)
};

reviews.unshift(newReview);

saveReviews();
displayReviews();
reviewForm.reset();
});

displayReviews();

});