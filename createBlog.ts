interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  imageBase?: string;
  createdAt: string;
}

function generateId(): string {
  return 'blog_' + Date.now();
}

export function getBlogsFromLocalStorage(): BlogPost[] {
  return JSON.parse(localStorage.getItem('blogs') || '[]');
}

function saveBlogsToLocalStorage(blogs: BlogPost[]): void {
  localStorage.setItem('blogs', JSON.stringify(blogs));
}

// Default image fallback (place this image in your assets or public folder)
const DEFAULT_IMAGE_PATH = 'src/assets/logo.png'; // ← You can replace with your real default base64

// Form handling
const blogForm = document.getElementById('blogForm') as HTMLFormElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const contentInput = document.getElementById('content') as HTMLTextAreaElement;
const categoryInput = document.getElementById('category') as HTMLSelectElement;
const authorInput = document.getElementById('author') as HTMLInputElement;
const coverImageInput = document.getElementById('coverImage') as HTMLInputElement;
const imagePreview = document.getElementById('imagePreview') as HTMLImageElement; // 🆕 for preview

// 🖼️ Show image preview before submit
coverImageInput?.addEventListener('change', () => {
  const file = coverImageInput.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      coverImageInput.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    coverImageInput.src = DEFAULT_IMAGE_PATH;
  }
});

blogForm?.addEventListener('submit',async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const category = categoryInput.value;
  const author = authorInput.value.trim();
  const createdAt = new Date().toISOString();
  const file = coverImageInput.files?.[0];
  const imageBase = file ? await toBase64(file): null;

  

  const handleSave = (imageBase: string) => {
    const newBlog: BlogPost = {
      id: generateId(),
      title,
      content,
      category,
      author,
      createdAt,
      imageBase,
    };

    const blogs = getBlogsFromLocalStorage();
    blogs.unshift(newBlog);
    saveBlogsToLocalStorage(blogs);

    alert('Blog saved successfully!');
    blogForm.reset();
    coverImageInput.src = DEFAULT_IMAGE_PATH;

    // ✅ Close modal
    document.getElementById("blogModal")?.classList.add("hidden");
  };
    function toBase64(file:File): Promise<string>{
      return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.onload =()=> resolve (reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file)
      })
    }
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleSave(reader.result as string);
    };
    reader.readAsDataURL(file);
  } else {
    handleSave(DEFAULT_IMAGE_PATH);
  }
});
