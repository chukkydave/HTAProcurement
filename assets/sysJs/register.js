$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addFields();
		}
	});
	$('#cancel').on('click', () => {
		$('.classChecker').val('');
	});

	$(document).on('click', '.infoe', function() {
		var id = $(this).attr('id').replace(/info_/, '');
		$('#payPO').attr('data', id);
		window.location = `/employee_info.html?${id}`;
		// makePayment(id);
	});


		$(document).on('change', '.select_change', function() {


		var id = $(this).attr('id').replace(/type_/, '');

		if($(`#type_${id}`).val() == "select"){
			$(`#options_group_${id}`).show()

		}else{
			$(`#options_group_${id}`).hide()

		}

      });

    $(document).on('click', '.removeInput', function() {
            var id = $(this).attr('id').replace(/removeInput_/, '');
    
        
          $(`#field_${id}`).remove();
			$(`#options_group_${id}`).remove()

        });

    $(document).on('click', '.addInput', function() {
		var id = $(this).attr('id').replace(/addInput_/, '');

      $(".appendInput").append(
          `
          <div class="append" id="field_${Number(id) + 1}" style="display: flex; justify-content: space-between;">
          <div class="form-group" style="width: 60%;">
              <label for="companyName">Field Name</label>
              <input style="width: 90%;" type="text" class="form-control classChecker" id="id="name_${Number(id) + 1}" >
          </div>
          <div class="form-group" style="width: 30%">
              <label for="email">Field Input Type</label>
              <select style="width: 90%;"  class="select_change form-control classChecker" id="type_${Number(id) + 1}" >
              <option value="input">Input Field </option>
              <option value="select">Select Field </option>
              </select>


          </div>

          <div class="d-flex my-xl-auto right-content">

              <div id="addInput_${Number(id) + 1}" class="addInput pr-1 mb-3 mb-xl-0" style="    display: grid;
              align-items: end; margin-top:5px">
                  <a aria-controls="collapseExample" aria-expanded="true" data-toggle="collapse" role="button" class=""> <button type="button" class="btn btn-primary  btn-icon mr-2"><i class="mdi mdi-plus"></i>
                      </button></a>
              </div>

              <div id="removeInput_${Number(id) + 1}" class="removeInput pr-1 mb-3 mb-xl-0" style="    display: grid;
              align-items: end; margin-top:5px">
                  <a aria-controls="collapseExample" aria-expanded="true" data-toggle="collapse" role="button" class=""> <button type="button" class="btn btn-danger  btn-icon mr-2"><i class="mdi mdi-minus"></i>
                      </button></a>
              </div>

          </div>
		  

      </div>
	  
	  <div class="form-group" style="width: 100%; display:none" id="options_group_${Number(id) + 1}">

	  <label for="companyName">Select Field Options (Seperate with comma)</label>

	  <input placeholder="tolu, tayo, tola" style="width: 100%;" type="text" class="just_options form-control classChecker" id="options_${Number(id) + 1}" >

	 </div> `
      )

    //   $(`#addInput_${id}`).remove();
	});

	$(document).on('click', '.approve', function() {
		var id = $(this).attr('id').replace(/approve_/, '');

		if (confirm('Are you sure you want to approve this record')) {
			approveProposal(id);
		} else {
			return false;
		}
	});

	$(document).on('click', '.view', function() {
		var id = $(this).attr('id').replace(/view_/, '');

		viewProposal(id);
		return false;
	});

	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/del_/, '');

		if (confirm('Are you sure you want to delete record')) {
			deleteProposal(id);
		} else {
			return false;
		}
	});

	listProposals();
});
let myFile;
const fileInput = document.getElementById('attachment');
fileInput.onchange = () => {
	Main();
};

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

async function Main() {
	const file = document.querySelector('#attachment').files[0];
	myFile = await toBase64(file);
}

function addFields() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let title = $('#title').val();
	let image = $('#image').val();

    var fields = [];


    $(".append").each(function () {
        var id = $(this).attr("id").replace(/field_/, "");
        console.log(id);
		if($("#type_" + id).val() == "select"){
			if($(`#options_${id}`).val() == ''){
				Swal.fire({
					title: 'Error!',
					text: `Select options is missing`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
				return;
			}
		}
        var fieldName = $("#name_" + id).val();
        var fieldType = $("#type_" + id).val();
		var options = $(`#options_${id}`).val();

		
  
        fields.push({
            fieldName: fieldName,
            fieldType: fieldType,
            options: options
        });
      });


	axios
		.post(
			`${apiPath}registerProgram`,
			{
				title: title,
				image: myFile,
                fields:fields,
			
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			$('#addLoader').hide();
			$('#addBtn').show();

			Swal.fire({
				title: 'Success',
				text: `Form creation successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listProposals(),
			});
			$('.classChecker').val('');
			$('#collapseExample').removeClass('show');
			// fetchStaffRecord();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#addLoader').hide();
			$('#addBtn').show();
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
{
	/* <img alt="" src="assets/img/faces/6.jpg"> */
}

function listProposals() {
	$('#listProposal').hide();
	$('#listProposalLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}applications`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				if (page == 1 || page == '') {
					var k = 1;
				} else {
					var k = page * limit - limit + 1;
				}

				data.map((item, indx) => {
					let creation = moment(item.creationDate, 'YYYY-MM-DD').format('LL');

					// let status;
					// let action;
					// if (item.approved) {
					// 	status = `<td><i class="fa fa-check " style="color: green"></i></td>`;
					// 	action = `<td><div class="dropdown">
			        //             <button aria-expanded="false" aria-haspopup="true"
			        //                 class="btn ripple btn-default" data-toggle="dropdown"
			        //                 id="dropdownMenuButton" type="button">Action <i
			        //                     class="fas fa-caret-down ml-1"></i></button>
			        //             <div class="dropdown-menu tx-13">
			        //                 <a class="dropdown-item pointer view" id="view_${item._id}" style="color: blue;">View</a>
			        //                 <!--<a class="dropdown-item pointer delete" style="color: red;" id="delete_${item._id}">Delete</a>-->
			        //             </div>
			        //         </div></td>`;
					// } else {
					// 	status = `<td><i class="fa fa-exclamation-triangle " style="color: orange"></i></td>`;
					// 	action = `<td><div class="dropdown">
			        //             <button aria-expanded="false" aria-haspopup="true"
			        //                 class="btn ripple btn-default" data-toggle="dropdown"
			        //                 id="dropdownMenuButton" type="button">Action <i
			        //                     class="fas fa-caret-down ml-1"></i></button>
			        //             <div class="dropdown-menu tx-13">
			        //                 <a class="dropdown-item pointer view" id="view_${item._id}" style="color: blue;">View/Approve</a>
			        //                 <a class="dropdown-item pointer approve" id="approve_${item._id}" style="color: blue;">Approve</a>
			        //                 <a class="dropdown-item pointer delete" style="color: red;" id="del_${item._id}">Delete</a>
			        //             </div>
			        //         </div></td>`;
					// }

					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${k++}</td>`;
					res += `<td>${item.title}</td>`;
					res += `<td>${creation}</td>`;
				

					res += `</tr>`;
					res += `<tr colspan="8" id="deleteSpinner_${item._id}" style="display: none;"><td><div class="spinner-grow text-secondary" role="status"
			                        >
			                        <span class="sr-only">Loading...</span>
			                    </div></td></tr>`;
				});
			} else {
				res += '<tr colspan="8"><td>No record found</td></tr>';
			}

			$('#listProposal').html(res);
			$('#listProposalLoader').hide();
			$('#listProposal').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listProposalLoader').hide();
			$('#listProposal').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listProposal').show();
		})
		.then(function() {
			// always executed
		});
}

function approveProposal(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.post(
			`${apiPath}approveProposal/${id}`,
			{ data: 'none' },
			{
				// meetingId and lecture_id
				headers: {
					Authorization: token,
				},
				// data: {
				// 	meetingId: mId,
				// 	lecture_id: id,
				// },
			},
		)
		.then((res) => {
			if (
				res.data.status === 201 ||
				res.data.status === 200 ||
				res.data.status === '201' ||
				res.data.status === '200'
			) {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Success',
					text: `Proposal Approval Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listProposals(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Approving Proposal`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Approving Leave`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function deleteProposal(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}delProposal/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			if (
				res.data.status === 201 ||
				res.data.status === 200 ||
				res.data.status === '201' ||
				res.data.status === '200'
			) {
				Swal.fire({
					title: 'Success',
					text: `Proposal Deleted Successfully`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listProposals(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting Proposal`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Deleting Proposal`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function listEmployees() {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}fetchStaffs`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>--Select Employee--</option>';

			if (data.length !== 0) {
				data.map((itm, ind) => {
					res += `<option value="${itm._id}">${itm.firstName} ${itm.lastName}</option>`;
				});
			} else {
				res += '<option>No record found</option>';
			}

			$('#listEmployee').html(res);
			$('#listEmployeeLoader').hide();
			$('#listEmployee').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listEmployeeLoader').hide();
			$('#listEmployee').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listEmployee').show();
		})
		.then(function() {
			// always executed
		});
}

function viewProposal(id) {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));

	let idt = window.location.search.split('?')[1];
	axios
		.get(`${apiPath}viewProposal/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(res) {
			const { data } = res.data;

			if (data.length !== 0) {
				let dat = data[0];
				let created = moment(dat.creationDate, 'YYYY-MM-DD HH:mm:ss').format('LL');
				$('#modaldemo3').modal('show');

				$('#sAddress').html(dat.address);
				$('#sApproved').html(

						dat.approved ? 'Approved' :
						'Not-Approved',
				);
				$('#sAttachment').attr('src', dat.attachment);
				$('#sCompanyname').html(dat.companyName);
				$('#sCreationdate').html(created);
				$('#sEmail').html(dat.email);
				$('#sPhone').html(dat.phoneNumber);
				$('#sbrief').html(dat.proposalBrief);
				$('#sbudget').html(dat.totalBudget);
			}

			$('#viewPurchase').html(res);
			$('#viewPurchaseLoader').hide();
		})
		.catch(function(error) {
			console.log(error);
			$('#viewPurchaseLoader').hide();
			$('#viewPurchase').append(`<tr colspan="9"><td>${error.response.statusText}</td></tr>`);
			$('#modaldemo3').modal('show');
		})
		.then(function() {
			// always executed
		});
}
