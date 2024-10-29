setupUi();

getUser();
getPosts();

function getCurrentUserId() {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('userid');
	return id;
}
function getUser() {
	const id = getCurrentUserId();

	axios.get(`${baseUrl}/users/${id}`).then((response) => {
		const user = response.data.data;
		document.getElementById('main-info-email').innerHTML = user.email;
		document.getElementById('main-info-name').innerHTML = user.name;
		document.getElementById('main-info-username').innerHTML = user.username;
		document.getElementById('header-image').src = user.profile_image;
		document.getElementById('username-posts').innerHTML = `${user.username}'s`;
		document.getElementById('posts-count').innerHTML = user.posts_count;
		document.getElementById('comments-count').innerHTML = user.comments_count;
	});
}

function getPosts() {
	const id = getCurrentUserId();

	axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
		const posts = response.data.data;
		document.getElementById('user-posts').innerHTML = '';
		for (post of posts) {
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
                    <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px;">
                    <b style="display: inline;">${author.username}</b>
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
			document.getElementById('user-posts').innerHTML += content;

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
