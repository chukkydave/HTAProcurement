$(document).ready(function() {
	$('.select2').select2({
		placeholder: 'Choose one',
		searchInputPlaceholder: 'Search',
	});
	$('.select2-no-search').select2({
		minimumResultsForSearch: Infinity,
		placeholder: 'Choose one',
	});
	getVendor();

	$('#addVendor').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			createVendor();
		}
	});
});

function getVendor() {
	$('#vendor').hide();
	$('#vendorLoader').show();

	axios
		.get(`${apiPath}getVendors`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select Vendor --</option>';
			data.map((item, indx) => {
				res += `<option value="${item._id}">${item.name}</option>`;
			});
			$('#vendor').html(res);
			$('#vendorLoader').hide();
			$('#vendor').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#vendorLoader').hide();
			$('#vendor').show();
			$('#vendor').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function createVendor() {
	$('#addVendor').hide();
	$('#addVendorLoader').show();

	let vname = $('#vname').val();
	let vphone = $('#vphone').val();
	let vaddress = $('#vaddress').val();
	let vcomment = $('#vcomment').val();
	let vemail = $('#vemail').val();

	axios
		.post(
			`${apiPath}createVendor`,
			{
				name: vname,
				phoneNumber: vphone,
				address: vaddress,
				comment: vcomment,
				email: vemail,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#addVendorLoader').hide();
			$('#addVendor').show();

			$('#modaldemo1').modal('hide');

			Swal.fire({
				title: 'Success',
				text: `Vendor Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: getVendor(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#addVendorLoader').hide();
			$('#addVendor').show();
			$('#modaldemo1').modal('hide');
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}
