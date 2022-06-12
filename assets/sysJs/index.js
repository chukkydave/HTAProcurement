$(document).ready(() => {
	$('#loginBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			login();
		}
	});
});

function login() {
	$('#loginBtn').hide();
	$('#loginLoader').show();

	let email = $('#email').val();
	let password = $('#password').val();

	axios
		.post(`${apiPath}adminLogin`, {
			email: email,
			password: password,
		})
		.then(function(response) {
			$('#loginLoader').hide();
			$('#loginBtn').show();

			// const {
			// 	department,
			// 	email,
			// 	firstName,
			// 	lastName,
			// 	department_id,
			// 	position,
			// 	profilePic,
			// 	_id,
			// } = response.data.data;

			let date = new Date();
			date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
			const expires = 'expires=' + date.toUTCString();
			document.cookie = `adminToken=${response.data.token};path=/;${expires}`;

			// let obj = {
			// 	_id: _id,
			// 	firstName: firstName,
			// 	lastName: lastName,
			// 	email: email,
			// 	position: position,
			// 	profilePic: profilePic,
			// 	department: department,
			// 	department_id: department_id,
			// };

			// localStorage.setItem('deanData', JSON.stringify(obj));

			Swal.fire({
				title: 'Success',
				text: `Logging In`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect('dashboard.html'),
			});
			$('#loginLoader').hide();
			$('#loginBtn').hide();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#loginLoader').hide();
			$('#loginBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function redirect(where) {
	setTimeout(() => {
		window.location = `/${where}`;
	}, 2000);
}

let username = 'Max Brown';

// Set a Cookie
function setCookie(cName, cValue, expDays) {
	let date = new Date();
	date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
	const expires = 'expires=' + date.toUTCString();
	document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/';
}

// Apply setCookie
// setCookie('username', username, 30);
