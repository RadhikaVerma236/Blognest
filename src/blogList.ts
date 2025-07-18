import { getBlogsFromLocalStorage } from '../createBlog';


interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  imageBase?: string;
  excerpt?: string;
}

const RECENT_COUNT = 6;
const RECENT_VISIBLE = 3;
const OLDER_VISIBLE = 5;

const recentContainer = document.getElementById('recentBlogs')!;
const olderContainer = document.getElementById('olderBlogs')!;
const loadMoreRecentBtn = document.getElementById('loadMoreRecent')!;
const loadMoreOlderBtn = document.getElementById('loadMoreOlder')!;

const blogs: Blog[] = getBlogsFromLocalStorage().sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

const recentBlogs = blogs.slice(0, RECENT_COUNT);
const olderBlogs = blogs.slice(RECENT_COUNT);

let recentIndex = 0;
let olderIndex = 0;

function createCard(blog:Blog, horizontal=false){
    const card = document.createElement('div');

    card.className = horizontal
    ? 'min-w-[250px] max-w-xs bg-surface-light dark:bg-surface-dark p-4 rounded shadow transition shrink-0 relative'
    : 'bg-surface-light dark:bg-surface-dark p-4 rounded shadow transition relative';

    const isValidImage = blog.imageBase && blog.imageBase.startsWith('data:image');
    const defaultImagePath = 'src/assets/logo.png';
    console.log()
    const imageSrc = isValidImage ? blog.imageBase : defaultImagePath;

const imageSection = `<img src="${imageSrc}" alt="${blog.title}" class="w-full h-40 object-cover rounded mb-3">`;



    const contentPreview = blog.excerpt || blog.content.slice(0, 100) + '...';

     

    card.innerHTML = `
    ${imageSection}
    <h3 class="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">${blog.title}</h3>
    <p class="text-sm text-text-light dark:text-text-dark mb-2">By ${blog.author} • ${new Date(blog.createdAt).toLocaleDateString()}</p>
    <p class="text-sm text-text-light dark:text-text-dark mb-3">${contentPreview}</p>
    <button class="text-primary-light dark:text-primary-dark text-sm font-semibold underline hover:opacity-80">Read More</button>
  `;

  // Create tag element with pill styling
  const categoryTag = document.createElement('span');
  categoryTag.className = 'inline-block border border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark text-xs font-medium px-3 py-1 rounded-full bg-transparent dark:bg-transparent hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition cursor-pointer mb-2';
  categoryTag.textContent = blog.category;

  // Insert tag above the blog title
  const titleElement = card.querySelector('h3');
  if (titleElement && titleElement.parentNode) {
    titleElement.parentNode.insertBefore(categoryTag, titleElement);
  }

  card.querySelector('button')?.addEventListener('click', (e) => {
    e.stopPropagation();
    localStorage.setItem('selectedBlogId', blog.id);
    window.location.href = 'viewBlog.html';
  });

   card.addEventListener('click', () => {
    localStorage.setItem('selectedBlogId', blog.id);
    window.location.href = 'viewBlog.html';
  });

  return card;
}

function showMoreRecent(){
    const next=recentBlogs.slice(recentIndex, recentIndex + RECENT_VISIBLE);
    next.forEach(blog=>recentContainer.appendChild(createCard(blog, true)));
    recentIndex +=RECENT_VISIBLE;
    if(recentIndex>=recentBlogs.length) loadMoreRecentBtn.style.display='none';
}

function showMoreOlder(){
    const next=olderBlogs.slice(olderIndex, olderIndex + OLDER_VISIBLE);
    next.forEach(blog=>olderContainer.appendChild(createCard(blog)));
    olderIndex += OLDER_VISIBLE;
    if(olderIndex >= olderBlogs.length) loadMoreOlderBtn.style.display='none';
}

loadMoreRecentBtn.addEventListener('click', showMoreRecent);
loadMoreOlderBtn.addEventListener('click', showMoreOlder);

// Initial rendering
showMoreRecent();
showMoreOlder();