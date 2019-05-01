const email = document.querySelector('.amount input[name = email]');
const amount = document.querySelector('.amount input[name = paidAmount]');
const repayBtn = document.querySelector('.submit_app');

async function repay(url, email, amount) {
	const response = await fetch(url, {
		method: 'POST',
		body: new URLSearchParams({ amount: amount, email: email }),
		headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'})
	})
	return await response.json();
};

repayBtn.onclick = function(_e) {
	repay('http://localhost:3000/api/v1/loans/repayments', email.value, amount.value)
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error);
	})
	window.location.reload(true)
}
