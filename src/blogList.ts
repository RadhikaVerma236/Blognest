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

const RECENT_COUNT = 8;
const RECENT_VISIBLE = 4;
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
    ? 'w-full max-w-5xl flex gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded shadow transition relative mb-6'
    : 'bg-surface-light dark:bg-surface-dark p-4 rounded shadow transition relative';

    const isValidImage = blog.imageBase && blog.imageBase.startsWith('data:image');
    const defaultImagePath = 'src/assets/logo.png';
    console.log()
    const imageSrc = isValidImage ? blog.imageBase : defaultImagePath;

// const imageSection = `<img src="${imageSrc}" alt="${blog.title}" class="w-full h-40 object-cover rounded mb-3">`;

const imageSection = horizontal
  

  ? `<div class="w-1/3 max-w-[200px] h-40">
       <img src="${imageSrc}" alt="${blog.title}" class="w-full h-full object-cover rounded-md">
     </div>`
  : `<img src="${imageSrc}" alt="${blog.title}" class="w-full h-40 object-cover rounded mb-3">`;

    const contentPreview = blog.excerpt || blog.content.slice(0, 100) + '...';

  card.innerHTML = horizontal
  ? `
    <div class="flex gap-4">
      ${imageSection}
      <div class="flex flex-col justify-between w-2/3">
        <span class="category-tag-placeholder self-start inline-block w-fit"></span>
        <h3 class="text-lg font-semibold text-primary-light dark:text-primary-dark mb-1">${blog.title}</h3>
        <p class="text-sm text-text-light dark:text-text-dark mb-1">By ${blog.author} • ${new Date(blog.createdAt).toLocaleDateString()}</p>
        <p class="text-sm text-text-light dark:text-text-dark mb-3">${contentPreview}</p>
        <button class="text-primary-light dark:text-primary-dark text-sm font-semibold underline hover:opacity-80 self-start">Read More</button>
      </div>
    </div>
    `
  : `
    ${imageSection}
    <h3 class="text-lg font-semibold text-primary-light dark:text-primary-dark mb-2">${blog.title}</h3>
    <p class="text-sm text-text-light dark:text-text-dark mb-2">By ${blog.author} • ${new Date(blog.createdAt).toLocaleDateString()}</p>
    <p class="text-sm text-text-light dark:text-text-dark mb-3">${contentPreview}</p>
    <button class="text-primary-light dark:text-primary-dark text-sm font-semibold underline hover:opacity-80">Read More</button>
  `;

const titleElement = card.querySelector('h3');
const categoryTag = document.createElement('span');
categoryTag.className = 'self-start inline-block w-fit border border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark text-xs font-medium px-3 py-1 rounded-full bg-transparent dark:bg-transparent hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition cursor-pointer mb-2';
categoryTag.textContent = blog.category;

if (horizontal) {
  const tagPlaceholder = card.querySelector('.category-tag-placeholder');
  if (tagPlaceholder) tagPlaceholder.replaceWith(categoryTag);
} else if (titleElement && titleElement.parentNode) {
  titleElement.parentNode.insertBefore(categoryTag, titleElement);
}


  card.querySelector('button')?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.location.href = `viewBlog.html?id=${blog.id}`;
  });

   card.addEventListener('click', () => {
    window.location.href = `viewBlog.html?id=${blog.id}`;
  });

  return card;
}

function showMoreRecent(){
    const next=recentBlogs.slice(recentIndex, recentIndex + RECENT_VISIBLE);
    next.forEach(blog=>recentContainer.appendChild(createCard(blog)));
    recentIndex +=RECENT_VISIBLE;
    if(recentIndex>=recentBlogs.length) loadMoreRecentBtn.style.display='none';
}

function showMoreOlder(){
    const next=olderBlogs.slice(olderIndex, olderIndex + OLDER_VISIBLE);
    next.forEach(blog=>olderContainer.appendChild(createCard(blog, true)));
    olderIndex += OLDER_VISIBLE;
    if(olderIndex >= olderBlogs.length) loadMoreOlderBtn.style.display='none';
}

loadMoreRecentBtn.addEventListener('click', showMoreRecent);
loadMoreOlderBtn.addEventListener('click', showMoreOlder);

// Initial rendering
showMoreRecent();
showMoreOlder();