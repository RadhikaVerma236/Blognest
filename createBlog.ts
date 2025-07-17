interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  createdAt: string;
}

function generateId():string{
    return 'blog_' + Date.now();
}

function getBlogsFromLocalStorage():BlogPost[]{
    return JSON.parse(localStorage.getItem('blogs') || '[]');
}

function saveBlogsToLocalStorage(blogs:BlogPost[]):void{
    localStorage.setItem('blogs', JSON.stringify(blogs));
}

function handleBlogSubmit(event:Event){
    event.preventDefault();

    const titleInput = document.getElementById('title') as HTMLInputElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLSelectElement;
  const contentInput = document.getElementById('content') as HTMLTextAreaElement;
  const imageInput = document.getElementById('coverImage') as HTMLInputElement;

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const category = categoryInput.value.trim();
  const author = authorInput.value.trim();
  const coverImage = imageInput.value.trim();

  if (!title || !content || !category || !author) {
    alert('Please fill in all required fields.');
    return;
  }

  const newBlog: BlogPost = {
    id: generateId(),
    title,
    author,
    category,
    content,
    coverImage: coverImage || undefined,
    createdAt: new Date().toISOString()
  };

  const blogs=getBlogsFromLocalStorage();
  blogs.push(newBlog);
  saveBlogsToLocalStorage(blogs);

  alert('Blog published successfully!');
  (document.getElementById('blogForm') as HTMLFormElement).reset();
  window.location.href = '/newBlog.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('blogForm');
  form?.addEventListener('submit', handleBlogSubmit);
});
