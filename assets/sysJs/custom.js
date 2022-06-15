const token = getCookie('procToken');
function getCookie(cName) {
	const name = cName + '=';
	const cDecoded = decodeURIComponent(document.cookie); //to be careful
	const cArr = cDecoded.split('; ');
	let res;
	cArr.forEach((val) => {
		if (val.indexOf(name) === 0) res = val.substring(name.length);
	});
	return res;
}

if (!token || token === null || token === undefined) {
	window.location = window.location.origin + '/index.html';
}

function logOut() {
	document.cookie = 'procToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	// localStorage.removeItem('instructorData');
	redirect('/index.html');
}

function redirect(where) {
	setTimeout(() => {
		window.location = `${where}`;
	}, 2000);
}
