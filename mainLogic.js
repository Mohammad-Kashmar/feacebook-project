const baseUrl = 'https://tarmeezacademy.com/api/v1';

///====== posts request ======//

function creatNewPostclick() {
	let postId = document.getElementById('post-id-input').value;
	let isCreate = postId == null || postId == ''; // التحقق مما إذا كانت العملية هي إنشاء أو تعديل

	const title = document.getElementById('post-title-input').value;
	const body = document.getElementById('post-body-input').value;
	const image = document.getElementById('post-image-input').files[0];
	const token = localStorage.getItem('token');

	let formData = new FormData();
	formData.append('body', body);
	formData.append('title', title);
	formData.append('image', image);
	// const params = {
	//   "body" : body,
	//   "tiltle" : title
	// }
	const headers = {
		//مهممممم
		'Content-Type': 'multipart/form-data',
		authorization: `Bearer ${token} `
	};

	if (isCreate == true) {
		url = `${baseUrl}/posts`;
	} else {
		//هون لازم put بس لانو مبني بلارفيل صار التفاف على البوت ولازم استخدم ال post
		formData.append('_method', 'put');
		url = `${baseUrl}/posts/${postId}`;
	}
	toggleLoader(true);

	axios
		.post(url, formData, {
			headers: headers
		})
		.then((response) => {
			toggleLoader(false);
			console.log(response);
			const modal = document.getElementById('creat-post-modal');
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert('new post has been created successfuly ', 'danger');
			getPosts();
		})
		.catch((error) => {
			const message = error.response.data.message;
			showAlert(message, 'danger');
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function setupUi() {
	const token = localStorage.getItem('token');

	const loginBtn = document.getElementById('login');
	const registerBtn = document.getElementById('registe');
	const logoutBtn = document.getElementById('logout');
	const addBtn = document.getElementById('add-btn');
	const photo = document.getElementById('photo-user-nav');

	if (token == null) {
		// the user is guest
		if (addBtn != null) {
			addBtn.style.setProperty('display', 'none', 'important');
		}
		loginBtn.style.setProperty('display', 'block', 'important');
		registerBtn.style.setProperty('display', 'block', 'important');
		logoutBtn.style.setProperty('display', 'none', 'important');
		photo.style.setProperty('display', 'none', 'important');
		document.getElementById('nav-username').style.setProperty('display', 'none', 'important');
	} else {
		//for logged in user
		if (addBtn != null) {
			addBtn.style.setProperty('display', 'block', 'important');
		}
		loginBtn.style.setProperty('display', 'none', 'important');
		registerBtn.style.setProperty('display', 'none', 'important');
		logoutBtn.style.setProperty('display', 'block', 'important');
		photo.style.setProperty('display', 'block', 'important');
		document.getElementById('nav-username').style.setProperty('display', 'block', 'important');

		const user = getCurrentUser();
		document.getElementById('nav-username').innerHTML = user.username;
		document.getElementById('photo-user-nav').src = user.profile_image;
	}
}

////=====auth fiunction====///

function loginBtnclick() {
	const username = document.getElementById('register-usernameInput').value;
	const password = document.getElementById('register-passwordInput').value;
	const params = {
		username: username,
		password: password
	};
	console.log(username, password);
	toggleLoader(true);
	axios
		.post(`${baseUrl}/login`, params)
		.then((response) => {
			toggleLoader(false);
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));

			// إغلاق المودل
			const modal = document.getElementById('loginModal');
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			//
			showAlert('logged in successfuly', 'success');
			setupUi();
		})
		.catch((error) => {
			const Messade = error.response.data.message;
			showAlert(Messade, 'danger');
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function registerModalBtnclick() {
	const name = document.getElementById('register-nameInput').value;
	const username = document.getElementById('usernameInput').value;
	const password = document.getElementById('passwordInput').value;
	const image = document.getElementById('register-imageInput').files[0];

	let formData = new FormData();
	formData.append('name', name);
	formData.append('username', username);
	formData.append('password', password);
	formData.append('image', image);

	const headers = {
		'Content-Type': 'multipart/form-data'
	};

	toggleLoader(true);
	axios
		.post(`${baseUrl}/register`, formData, {
			headers: headers
		})
		.then((response) => {
			toggleLoader(false);
			console.log(response.data.data);
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));

			// إغلاق المودل
			const modal = document.getElementById('registerModal');
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			//
			showAlert('new user logged  in successfuly', 'success');
			setupUi();
		})
		.catch((error) => {
			const message = error.response.data.message;
			showAlert(message, 'danger');
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	setupUi();
	showAlert('logged out successfuly', 'success');
}

//===alerts===///
function showAlert(customMessage, type = 'success') {
	const alertPlaceholder = document.getElementById('success-alert');
	const appendAlert = (message, type) => {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${message}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			'</div>'
		].join('');

		alertPlaceholder.append(wrapper);
	};
	const alertTrigger = document.getElementById('liveAlertBtn');
	if (alertTrigger) {
		alertTrigger.addEventListener('click', () => {
			appendAlert(customMessage, 'success');
			//# مهم
			setTimeout(() => {
				//todo: hide alert=======
				// const alert= document.getElementById("success-alert")
				// const modalAlert = bootstrap.Alert.getInstance(alert)
				// modalAlert.hide()
				// document.getElementById("success-alert").hide()
			}, 1500);
		});
	}
}

function getCurrentUser() {
	let user = null;

	const storageUser = localStorage.getItem('user');
	if (storageUser != null) {
		user = JSON.parse(storageUser);
	}
	return user;
}

function editPostBtnClick(postObject) {
	let post = JSON.parse(decodeURIComponent(postObject));
	console.log(post);
	document.getElementById('post-modal-submit-modal').innerHTML = 'update';
	document.getElementById('post-id-input').value = post.id;
	document.getElementById('post-modal-title').innerHTML = 'Edit Post';
	document.getElementById('post-title-input').value = post.title;
	document.getElementById('post-body-input').value = post.body;
	let postModal = new bootstrap.Modal(document.getElementById('creat-post-modal'), {}); //الوصول لمودل انشاء بوست عن طريق جافا سكريبت
	postModal.toggle(); //اظهار المودال
}

function deletePostBtnClick(postObject) {
	let post = JSON.parse(decodeURIComponent(postObject));
	console.log(post);

	document.getElementById('delete-post-id-input').value = post.id;
	let postModal = new bootstrap.Modal(document.getElementById('delete-post-modal'), {}); //الوصول لمودل انشاء بوست عن طريق جافا سكريبت
	postModal.toggle(); //اظهار المودال
}

function confirmPostDelete() {
	const token = localStorage.getItem('token');

	const postId = document.getElementById('delete-post-id-input').value;
	const headers = {
		//مهممممم
		'Content-Type': 'multipart/form-data',
		authorization: `Bearer ${token} `
	};
	toggleLoader(true);
	axios
		.delete(`${baseUrl}/posts/${postId}`, {
			headers: headers
		})
		.then((response) => {
			toggleLoader(false);
			// إغلاق المودل
			const modal = document.getElementById('delete-post-modal');
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();

			showAlert('the post has been deleted successfuly', 'success');
			getPosts();
		})
		.catch((error) => {
			const message = error.response.data.message;
			showAlert(message, 'danger');
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function profileClicked() {
	const user = getCurrentUser();
	const userId = user.id;
	window.location = `profile.html?userid=${userId}`;
}

function toggleLoader(show = true) {
	if (show) {
		document.getElementById('loader').style.visibility = 'visible';
	} else {
		document.getElementById('loader').style.visibility = 'hidden';
	}
}
