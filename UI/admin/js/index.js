(function(){
	let card = document.querySelector('.card');
	let height = window.innerHeight;
	card.style.minHeight = height +'px';
// 	let yes = document.querySelector("#verify");
// 	yes.oninput = (e) => {
// 		if(yes.checked === true){
// 		window.fetch('http://localhost:3000/loans/1', {
// 			method: 'PATCH',
// 			body: {status:"verified"},
// 		}).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));
// 	}
// }
})();