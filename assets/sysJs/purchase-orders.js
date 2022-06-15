$(document).ready(() => {
	listProcurements();
	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');
		var mId = $(this).attr('dir');

		if (confirm('Are you sure you want to delete this record')) {
			delete_lecture(id, mId);
		} else {
			return false;
		}
	});
});

function listProcurements() {
	$('#purchase').hide();
	$('#purchaseLoader').show();
	// $('#departmentLoader').show();
	let data = JSON.parse(localStorage.getItem('procData'));

	axios
		.get(`${apiPath}procurements`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';
			// amountPaid: 600000
			// balanceToPay: 200000
			// code: "PO-001"
			// createdBy: "62a5a75402043b7a76110f7e"
			// createdByName: "tolu jay"
			// creationDate: "2022-06-13T10:46:39.017Z"
			// expectedDeliveryDate: "20/05/2022"
			// grandTotal: 800000
			// paymentHistory: [{amount: 400000, date: "2022-06-13T11:47:59.351Z", paymentById: "62a7174a2e43d19e6b21093e",…},…]
			// paymentStatus: "unpaid"
			// poStatus: "inprogress"
			// priority: "critical"
			// products: [,…]
			// vendorId: "62a70c52395de28da2a502dc"
			// __v: 0
			// _id: "62a7159a0d68774333ee4db0"
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
					res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${item.code}</td>`;
					res += `<td>${item.creationDate}</td>`;
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
                                    <a class="dropdown-item" style="color: green;">Details</a>
                                    <a class="dropdown-item" style="color: red;">Delete</a>
                                </div>
                            </div></td>`;
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
