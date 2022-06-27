$(document).ready(() => {
	$(document).on('click', '.viewDetails', function() {
		var id = $(this).attr('id').replace(/view_/, '');

		getPODetais(id);

		// if (confirm('Are you sure you want to delete this record')) {
		// 	delete_lecture(id, mId);
		// } else {
		// 	return false;
		// }
	});
	$(document).on('click', '.makePayment', function() {
		var id = $(this).attr('id').replace(/pay_/, '');
		$('#payPO').attr('data', id);
		// makePayment(id);
	});

	$(document).on('click', '#updateProfile', function() {
		// if (isEmptyInput('.payCheck')) {
		updateProfile();
		// }
	});
	getEmployeeInfo();
	$('#edit').on('click', () => {
		$('#viewSection').fadeOut('slow');
		$('#editSection').fadeIn('slow');
	});
	$('#cancelEdit').on('click', () => {
		$('#editSection').fadeOut('slow');
		$('#viewSection').fadeIn('slow');
	});
	$('#sProfilepic').on('click', () => {
		$('#eProfilepic').trigger('click');
	});
});

let myFile;

function listProcurements() {
	$('#purchase').hide();
	$('#purchaseLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));

	axios
		.get(`${apiPath}procurements`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				data.map((item, indx) => {
					let poStat;
					let payStat;
					if (item.poStatus === 'inprogress') {
						poStat =
							'<span class="badge badge-warning" style="color:white;">inprogress</span>';
					} else {
						poStat = `<span class="badge badge-success" style="color:white;">${item.poStatus}</span>`;
					}

					if (item.paymentStatus === 'unpaid') {
						payStat =
							'<span class="badge badge-danger" style="color:white;">unpaid</span>';
					} else {
						payStat = `<span class="badge badge-success" style="color:white;">${item.paymentStatus}</span>`;
					}
					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${item.code}</td>`;
					res += `<td>${moment(item.creationDate, 'YYYY-MM-DD').format('LL')}</td>`;
					res += `<td>${
						item.vendorName ? item.vendorName :
						''}</td>`;
					res += `<td>${payStat}</td>`;
					res += `<td>${poStat}</td>`;
					res += `<td>${
						item.priority ===
						'critical' ? '<span class="badge badge-danger" style="color:white;">critical</span>' :
						'<span class="badge badge-warning" style="color:white;">uncritical</span>'}</td>`;
					res += `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <a class="dropdown-item viewDetails" id="view_${item._id}">Details</a>
                                    ${
										datam.adminRole ? `<a class="dropdown-item makePayment" id="pay_${item._id}" data-target="#modaldemo7" data-toggle="modal">Make Payment</a>` :
										''}
                                </div>
                            </div></td>`;
					res += `</tr>`;
				});
			} else {
				res += '<tr colspan="9"><td>No record found</td></tr>';
			}

			$('#purchase').append(res);
			$('#purchaseLoader').hide();
			$('#purchase').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#purchaseLoader').hide();
			$('#purchase').append(`<tr colspan="9"><td>${error.response.statusText}</td></tr>`);
			$('#purchase').show();
		})
		.then(function() {
			// always executed
		});
}

function delete_lecture(id, mId) {
	$(`#block_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}api/v1/deleteCourse/${id}`, {
			// meetingId and lecture_id
			headers: {
				Authorization: token,
			},
			// data: {
			// 	meetingId: mId,
			// 	lecture_id: id,
			// },
		})
		.then((res) => {
			if (res.data.status === 201 || res.data.status === 200) {
				console.log(`#row_${id}`);
				$(`#row_${id}`).remove();
			} else {
				$(`#block_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting Record`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#block_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Deleting Record`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function getEmployeeInfo() {
	let id = window.location.search.split('?')[1];
	$('#vProfile').hide();
	axios
		.get(`${apiPath}getUser/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			// 			acctName: ""
			// address: "13, Yemi matanmi street,Dalemo, Alakuko,Lagos\n23"
			// adminRole: false
			// attendance: []
			// bankName: ""
			// dateOfBirth: ""
			// department: ""
			// email: ""
			// firstName: "Tolu"
			// gender: "Male"
			// guarantorAddress: "13, Yemi matanmi street,Dalemo, Alakuko,Lagos"
			// guarantorFullName: "Tolu Johnson"
			// guarantorGender: "Male"
			// lastName: "Johnson"
			// leave: []
			// maritalStatus: "Married"
			// middleName: ""
			// password: "$2b$10$r38LFfqKgT0ZeORBSWs.M.mlO.ZuLoxS9ztdEevS0pC6xsm3QQM1."
			// phoneNumber: "08161582774"
			// position: ""
			// profilePic: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAlgCWAA
			// qualifications: []
			// religion: "Christian"
			// salaryHistory: []
			// sortCode: ""
			// workExperience: []
			// __v: 0
			// _id: "62a35ca3e025ae44a9dd167f"

			if (data.length !== 0) {
				let dat = data[0];
				$('#vName').html(`${dat.firstName} ${dat.lastName}`);
				$('#vPosition').html(dat.position);
				$('#vEmail').html(dat.email);
				$('#vProfilepic').attr('src', dat.profilePic);
				$('#vPhone').html(dat.phoneNumber);
				$('#vAddress').html(dat.address);
				$('#vGender').html(dat.gender);

				$('#efirstName').val(dat.firstName);
				$('#elastName').val(dat.lastName);
				$('#eEmail').val(dat.email);
				$('#emiddleName').val(dat.middleName);
				$('#ePhone').val(dat.phoneNumber);
				$('#eAddress').val(dat.address);
				$('#eMaritalstatus').val(dat.maritalStatus);
				$('#eReligion').val(dat.religion);
				$('#eDOB').val(dat.dateOfBirth);
				$('#eGender').val(dat.gender);
				$('#ePosition').val(dat.position);
				$('#eDepartment').val(dat.department);
				$('#eBankname').val(dat.bankName);
				$('#eAcctname').val(dat.acctName);
				$('#eSortcode').val(dat.sortCode);
				$('#eGuarantorname').val(dat.guarantorFullName);
				$('#eGuarantoraddress').html(dat.guarantorAddress);
				$('#eGuarantorgender').val(dat.guarantorGender);
				$('#evProfilepic').attr('src', dat.profilePic);
				// $('#').val();
			} else {
				$('#vProfile').html('No record found');
			}

			$('#vProfile').show();
			$('#vProfileLoader').hide();
		})
		.catch(function(error) {
			console.log(error);
			$('#vProfileLoader').hide();
			$('#vProfile').html('Error loading result');
			$('#vProfile').show();
		})
		.then(function() {
			// always executed
		});
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$('#evProfilepic').attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
		// console.log(reader.readAsDataURL(input.files[0]));
		Main();
	}
}

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

async function Main() {
	const file = document.querySelector('#eProfilepic').files[0];
	myFile = await toBase64(file);
}

function updateProfile() {
	let id = window.location.search.split('?')[1];
	$('#updateProfile').hide();
	$('#updateProfileLoader').show();

	let firstName = $('#efirstName').val();
	let lastName = $('#elastName').val();
	let email = $('#eEmail').val();
	let middleName = $('#emiddleName').val();
	let phone = $('#ePhone').val();
	let address = $('#eAddress').val();
	let maritalStatus = $('#eMaritalstatus').val();
	let religion = $('#eReligion').val();
	let dob = $('#eDOB').val();
	let gender = $('#eGender').val();
	let position = $('#ePosition').val();
	let department = $('#eDepartment').val();
	let bankname = $('#eBankname').val();
	let acctname = $('#eAcctname').val();
	let sortcode = $('#eSortcode').val();
	let guarantorname = $('#eGuarantorname').val();
	let guarantoraddress = $('#eGuarantoraddress').val();
	let guarantorgender = $('#eGuarantorgender').val();
	let profilePic = myFile;
	axios
		.post(
			`${apiPath}updateStaff/${id}`,
			{
				firstName: firstName,
				middleName: middleName,
				maritalStatus: maritalStatus,
				lastName: lastName,
				religion: religion,
				dateOfBirth: dob,
				// email: email,
				phoneNumber: phone,
				gender: gender,
				address: address,
				position: position,
				department: department,
				profilePic: profilePic,
				bankName: bankname,
				acctName: acctname,
				sortCode: sortcode,
				guarantorFullName: guarantorname,
				guarantorAddress: guarantoraddress,
				guarantorGender: guarantorgender,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#updateProfileLoader').hide();
			$('#updateProfile').show();

			Swal.fire({
				title: 'Success',
				text: `Profile Update successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: getEmployeeInfo(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#updateProfileLoader').hide();
			$('#updateProfile').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}
