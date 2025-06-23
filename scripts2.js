 document.addEventListener('DOMContentLoaded', () => {
            
            document.querySelectorAll('.post-card').forEach(postCard => {
                const postId = postCard.dataset.postId;
                if (localStorage.getItem(`bookmarked_${postId}`) === 'true') {
                    const bookmarkBtn = postCard.querySelector('.bookmark-btn');
                    if (bookmarkBtn) {
                        bookmarkBtn.classList.add('filled');
                        bookmarkBtn.innerHTML = '★'; 
                    }
                }
            });
        });

        function showTab(tabId) {
           
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            
            document.getElementById(tabId).classList.add('active');

            
            document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add('active');
        }

       
        function showToast(title, message) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-title').innerText = title;
            document.getElementById('toast-message').innerText = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); 
        }

        function hideToast() {
            document.getElementById('toast').classList.remove('show');
        }

        function showUploadToast() {
            showToast('Upload Feature', 'The upload feature will be available soon!');
        }

        function showAddToast() {
            showToast('Plate Selected!', 'This balanced meal has been added to your plate.');
        }

        function commentFeature() {
            showToast('Comments Feature', 'Comments will be available in the next update!');
        }

        function sharePost() {
            showToast('Sharing Post', "You're sharing this balanced plate with your friends!");
        }

        function likePost(button) {
            const likeCountSpan = button.querySelector('.like-count');
            const heartIcon = button.querySelector('.heart-icon'); 
            let currentLikes = parseInt(likeCountSpan.innerText);

            if (button.classList.contains('liked')) {
               
                button.classList.remove('liked');
                heartIcon.innerText = '♡'; 
                likeCountSpan.innerText = currentLikes - 1;
                showToast('Unliked!', 'You have unliked this post.');
            } else {
              
                button.classList.add('liked');
                heartIcon.innerText = '♥'; 
                likeCountSpan.innerText = currentLikes + 1;
                showToast('Liked!', 'You have liked this post!');
            }
        }

        function toggleBookmark(button) {
            const postCard = button.closest('.post-card');
            const postId = postCard.dataset.postId;
            const postContent = {
                id: postId,
                avatarSrc: postCard.querySelector('.avatar').src,
                userName: postCard.querySelector('.post-user strong').innerText,
                userHandle: postCard.querySelector('.post-user span').innerText,
                text: postCard.querySelector('.post-content p:first-of-type').innerText,
                tags: postCard.querySelector('.tags').innerText,
                imageSrc: postCard.querySelector('.post-image').src,
                ingredients: Array.from(postCard.querySelectorAll('.ingredients .tag')).map(tag => tag.innerText),
                likes: parseInt(postCard.querySelector('.like-count').innerText),
                comments: parseInt(postCard.querySelector('.comment-count').innerText)
            };

            if (button.classList.contains('filled')) {
               
                button.classList.remove('filled');
                button.innerHTML = '☆'; 
                localStorage.removeItem(`bookmarked_${postId}`);
                showToast('Bookmark Removed', 'This post has been removed from your bookmarks.');
            } else {
                
                button.classList.add('filled');
                button.innerHTML = '★'; 
                localStorage.setItem(`bookmarked_${postId}`, 'true');
                localStorage.setItem(`post_${postId}`, JSON.stringify(postContent)); 
                showToast('Bookmarked!', 'This post has been added to your bookmarks.');
            }
        }

        function loadMorePosts() {
           
            showToast('No More Posts','posts shaared by users appear here!');
        }
