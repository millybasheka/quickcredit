const clientsArea = document.querySelector('.clients');
const approved = document.getElementById('status');
const repaid = document.getElementById('repaid');
const search = document.getElementById('search');
const errors = document.querySelector('.errors');
const get_loan = document.getElementById('get_loan');
const loan_id = document.querySelector('.amount input[name = loan]');

async function getData(url) {
	const response = await fetch(url, {
		method: 'GET'
		headers: new Headers({
				     'Authorization': localStorage.getItem('token'),
				     })
	});
	return await response.json();
}

async function patchLoan(url, status_text) {
	const response = await fetch(url, {
		method: 'PATCH',
		body: new URLSearchParams({ status: status_text }),
		headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				     'Authorization': localStorage.getItem('token'),
				     })
	});
	return await response.json();
}

async function getLoansDep(url) {
	const response = await fetch(url, {
		method: 'GET'
	});
	return await response.json();
}

function displayLoans() {
	getData('https://qwikcredit.herokuapp.com/api/v1/loans')
	.then(data => {
		if (Object.prototype.toString.call(data.data) === '[object Array]') {
			helperFunc(data);
			verifyLoan();
		} else {
			clientsArea.insertAdjacentHTML('beforeend', '<h4> No Data </h4');
		}
	})
	.catch(error => console.error(error));
}

displayLoans();
function verifyLoan() {
	const verify = document.querySelectorAll('#verify');
	const reject = document.querySelectorAll('#reject')
	verify.forEach(function (l) {
		l.onclick = function (e) {
			if (e.target.checked) {
				let loan_id = e.target.parentElement.parentElement.parentElement.parentElement
					.parentElement.children[0].firstElementChild.textContent;
				patchLoan(`https://qwikcredit.herokuapp.com/api/v1/loans/${loan_id}`, 'approved')
				.then(data => {
					console.error(data)
				})
				.catch(error => console.error(error));
			}
			window.location.reload(true)
		}
	})

	reject.forEach(function (l) {
		l.onclick = function (e) {
			if (e.target.checked) {
				let loan_id = e.target.parentElement.parentElement.parentElement.parentElement
				.parentElement.children[0].firstElementChild.textContent;
				patchLoan(`https://qwikcredit.herokuapp.com/api/v1/loans/${loan_id}`, 'rejected')
				.then(data => {
					console.error(data)
				})
				.catch(error => console.error(error));
			}
			window.location.reload(true)
		}
	})
}

search.onclick = function() {
	if (approved.checked && repaid.checked) {
		getLoansDep('https://qwikcredit.herokuapp.com/api/v1/loans?status=approved&repaid=true')
		.then(data => {
			if(data.status === 404){
				errors.textContent = data.error.trim();
				errors.style.display = 'block';
			}
			if (Object.prototype.toString.call(data.data) === '[object Array]') {
				clientsArea.innerHTML = '';
				helperFunc(data);
			}
		})
		.catch(error => {
			console.error(error)
		})
	} else if (approved.checked && repaid.checked === false) {
		getLoansDep('https://qwikcredit.herokuapp.com/api/v1/loans?status=approved&repaid=false')
		.then(data => {
			console.log(data)
			if(data.status === 404){
				errors.textContent = data.error.trim();
				errors.style.display = 'block';
			}
			if (Object.prototype.toString.call(data.data) === '[object Array]') {
				clientsArea.innerHTML = '';
				helperFunc(data);
			}
		})
		.catch(error => {
			console.error(error)
		})
	}
}

get_loan.onclick = function(){
	if (loan_id.value === '') {
		console.error('no input value')
	} else {
		getData(`https://qwikcredit.herokuapp.com/api/v1/loans/${loan_id.value}`)
		.then(data => {
			if (data.status === 404) {
				errors.textContent = data.error.trim();
				errors.style.display = 'block';
			} else if (data.status === 200) {
				clientsArea.innerHTML = ''
				helperGetByID(data)
			}
		})
		.catch(error => {
			console.error(error)
		})
	}
}

function helperGetByID(data) {
	const dat = data.data;
	clientsArea.insertAdjacentHTML('beforeend',
	`
	<li class="clients-card getloanbyid">
	<div class="card-text_">
	<h5 class="user_name">${dat.id}</h5>
	</div>
	<div class="card-text">
	<h5 class="user_name">${dat.user}</h5>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Type: </span><span class="currency">${dat.loanType}</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Amount: </span><span class="currency">${dat.amount}</span><span class="currency_symbol">UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="created_at"><span class="created_text">Created at: </span><span class="data">${dat.createdOn}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified  margin_it"><span class="status_text">Status: </span><span class="status_value">${dat.status}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified"><span class="repaid_text">Repaid: </span><span class="repaid_value">${dat.repaid}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified"><span class="balance_text">Balance: </span><span class="balance_value">${dat.balance} (Loan amount plus Interest)</span></h6>
	</div>
	<div class="description">
	<h6 class="actions_verify"><span class="action_text">Verify Loan: 
	<label class="container">
	<input id="verify" type="checkbox" name="" value="off">
	<span class="checkmarker  loan_verify"></span>
	</label>
	<label class="container">
	<input id="reject" type="checkbox" name="" value="off">
	<span class="checkmarker loan_reject"></span>
	</label>
	</div>
	</li>
	`)
	const status_value = document.querySelectorAll('.status_value');
	changeColor(status_value)
}

function helperFunc(data) {
	const dat = data.data;
	for (let i = 0; i < dat.length; i++) {
		clientsArea.insertAdjacentHTML('beforeend',
		`
		<li class="clients-card">
		<div class="card-text_">
		<h5 class="user_name">${dat[i].id}</h5>
		</div>
		<div class="card-text">
		<h5 class="user_name">${dat[i].user}</h5>
		</div>
		<div class="description">
		<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Type: </span><span class="currency">${dat[i].loanType}</span></h6>
		</div>
		<div class="description">
		<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Amount: </span><span class="currency">${dat[i].amount}</span><span class="currency_symbol">UGX</span></h6>
		</div>
		<div class="description">
		<h6 class="created_at"><span class="created_text">Created at: </span><span class="data">${dat[i].createdOn}</span></h6>
		</div>
		<div class="description">
		<h6 class="verified  margin_it"><span class="status_text">Status: </span><span class="status_value">${dat[i].status}</span></h6>
		</div>
		<div class="description">
		<h6 class="verified"><span class="repaid_text">Repaid: </span><span class="repaid_value">${dat[i].repaid}</span></h6>
		</div>
		<div class="description">
		<h6 class="verified"><span class="balance_text">Balance: </span><span class="balance_value">${dat[i].balance} (Loan amount plus Interest)</span></h6>
		</div>
		<div class="description">
		<h6 class="actions_verify"><span class="action_text">Verify Loan: 
		<label class="container">
		<input id="verify" type="checkbox" name="" value="off">
		<span class="checkmarker  loan_verify"></span>
		</label>
		<label class="container">
		<input id="reject" type="checkbox" name="" value="off">
		<span class="checkmarker loan_reject"></span>
		</label>
		</div>
		</li>
		`)
	}
	const status_value = document.querySelectorAll('.status_value');
	changeColor(status_value)
}

function changeColor(status_value){
	status_value.forEach(function(e) {
		if (e.textContent === 'approved') {
			e.style.backgroundColor = '#4CAF50'
			e.parentElement.parentElement.parentElement.lastElementChild.style.display = 'none'
		}

		if (e.textContent === 'rejected') {
			e.style.backgroundColor = '#F44336'
		}
	})
}

