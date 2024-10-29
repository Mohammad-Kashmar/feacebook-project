let currentPage = 1;
let lastPage = 1;

/////infinit scrolling///////
window.addEventListener('scroll', function() {
	const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
	console.log(window.innerHeight, window.pageYOffset, document.body.scrollHeight);
	console.log(endOfPage);
	console.log(currentPage, lastPage);

	if (endOfPage && currentPage < lastPage) {
		currentPage = currentPage + 1;
		getPosts(false, currentPage);
	}
});
///infinit scrolling///////

setupUi();
getPosts();

function userclicked(userId) {
	window.location = `profile.html?userid=${userId}`;
}
function getPosts(reload = true, page = 1) {
	toggleLoader(true);
	axios.get(`${baseUrl}/posts?limit=6&page=${page}`).then((response) => {
		toggleLoader(false);
		// handle success
		const posts = response.data.data;
		console.log(posts);
		lastPage = response.data.meta.last_page;
		if (reload == true) {
			document.getElementById('posts').innerHTML = '';
		}
		for (post of posts) {
			console.log(post);
			const author = post.author;
			let postTitle = '';
			//show or hide (edit) button
			let user = getCurrentUser();
			let isMyPost = user != null && post.author.id == user.id;
			let editBottunContent = ``;
			if (isMyPost == true) {
				editBottunContent = `
				
				<button class="btn btn-danger mx-1" style="float: right" onclick="deletePostBtnClick('${encodeURIComponent(
					JSON.stringify(post)
				)}')">delet</button>

				<button class="btn btn-secondary" style="float: right" onclick="editPostBtnClick('${encodeURIComponent(
					JSON.stringify(post)
				)}')">edit</button>
				`;
			}

			if (post.title != null) {
				postTitle = post.title;
			}
			let content = `
                <div class="card shadow ">
                  <h5 class="card-header" id="header">
				   <span onclick="userclicked(${author.id})" style="cursor: pointer">
						<img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
						<b style="display: inline;">${author.username}</b>
					</span>
                    ${editBottunContent}
                  </h5>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                  <img class="w-100" src="${post.image}" alt="" >
                  <h6 class="mt-1" style="color: gray;">
                    ${post.created_at}
                  </h6>
                  <h5>
                    ${postTitle}
                  </h5>
                  <p> 
                    ${post.body}   
                  </p>
                  <hr>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span> 
                    (${post.comments_count}) comment
                    <span id="posts-tags-${post.id}">
                  
                    </span>
                    </span>
                  </div>
                </div>
              </div>
            `;
			document.getElementById('posts').innerHTML += content;

			const currentTagsId = `posts-tags-${post.id}`;
			document.getElementById(currentTagsId).innerHTML = '';
			for (tag of post.tags) {
				console.log(tag.name);
				let tagsContent = `
              <button class="btn btn-sm rounded-5" style="background-color: gray; color:white;">
                ${tag.name}
              </button>
              `;
				document.getElementById(currentTagsId).innerHTML += tagsContent;
			}
		}
	});
}

function postClicked(postId) {
	alert(postId);
	window.location = `http://127.0.0.1:5500/post_details.html?postId=${postId}`;
}

function addBtnClicked() {
	document.getElementById('post-modal-submit-modal').innerHTML = 'creat';
	document.getElementById('post-id-input').value = '';
	document.getElementById('post-modal-title').innerHTML = 'creat a new post';
	document.getElementById('post-title-input').value = '';
	document.getElementById('post-body-input').value = '';
	let postModal = new bootstrap.Modal(document.getElementById('creat-post-modal'), {}); //الوصول لمودل انشاء بوست عن طريق جافا سكريبت
	postModal.toggle(); //اظهار المودال
}
