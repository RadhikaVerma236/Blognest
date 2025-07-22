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

const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
const filteredBlogsSection = document.getElementById('filteredBlogsSection')!;
const filteredContainer = document.getElementById('filteredBlogs')!;
const recentSection = document.getElementById('recentBlogsContainer')!;
const olderSection = document.getElementById('olderBlogsContainer')!;
const clearFilterBtn = document.getElementById('clearFilterBtn') as HTMLButtonElement;

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

categoryFilter.addEventListener('change', () => {
  const selectedCategory = categoryFilter.value.trim();

  if (selectedCategory === '') {
    // Show all sections again if nothing is selected
    filteredBlogsSection.classList.add('hidden');
    recentSection?.classList.remove('hidden');
    olderSection?.classList.remove('hidden');
    clearFilterBtn.classList.add('hidden'); 
    return;
  }

  // Hide others
  recentSection?.classList.add('hidden');
  olderSection?.classList.add('hidden');
  filteredBlogsSection.classList.remove('hidden');
  clearFilterBtn.classList.remove('hidden'); 

  renderFilteredBlogs(selectedCategory);
});

function renderFilteredBlogs(category: string) {
  const filtered = blogs.filter(blog => blog.category === category);
  filteredContainer.innerHTML = '';

  if (filtered.length === 0) {
    filteredContainer.innerHTML = `<p class="text-muted">No blogs found for this category.</p>`;
    return;
  }

  for (const blog of filtered) {
    const card = createCard(blog); // ✅ reuse the same card creation
    filteredContainer.appendChild(card);
  }
}
clearFilterBtn.addEventListener('click', () => {
  categoryFilter.value = ''; // Reset dropdown
  filteredBlogsSection.classList.add('hidden');
  recentSection?.classList.remove('hidden');
  olderSection?.classList.remove('hidden');
  clearFilterBtn.classList.add('hidden'); // Hide button
});




//Trial Code

// const allBlogsContainer = document.getElementById('allBlogs')!;
// const loadMoreAllBtn = document.getElementById('loadMoreAll')!;

// let allIndex = 0;
// const ALL_VISIBLE = 8;

// function showMoreAll() {
//   const next = blogs.slice(allIndex, allIndex + ALL_VISIBLE);

//   next.forEach(blog => {
//     allBlogsContainer.appendChild(createCard(blog)); // ✅ use createCard()
//   });

//   allIndex += ALL_VISIBLE;

//   if (allIndex >= blogs.length) {
//     loadMoreAllBtn.style.display = 'none';
//   }
// }

// loadMoreAllBtn?.addEventListener('click', showMoreAll);
// showMoreAll(); // Initial load


const allBlogsContainer = document.getElementById('allBlogs')!;
const loadMoreAllBtn = document.getElementById('loadMoreAll')!;
const toggleAllViewBtn = document.getElementById('toggleAllView')!;

let allIndex = 0;
const ALL_VISIBLE = 8;
let isListView = false; // 🔄 track view mode

function renderAllBlogs(reset = false) {
  if (reset) {
    allBlogsContainer.innerHTML = '';
    allIndex = 0;
  }

  const next = blogs.slice(allIndex, allIndex + ALL_VISIBLE);

  next.forEach(blog => {
    allBlogsContainer.appendChild(createCard(blog, isListView));
  });

  allIndex += ALL_VISIBLE;

  if (allIndex >= blogs.length) {
    loadMoreAllBtn.style.display = 'none';
  } else {
    loadMoreAllBtn.style.display = 'inline-block';
  }

  // Update container layout class
  if (isListView) {
    allBlogsContainer.className = 'space-y-4'; // Vertical stacking
  } else {
    allBlogsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
  }
}

loadMoreAllBtn?.addEventListener('click', () => renderAllBlogs());
toggleAllViewBtn?.addEventListener('click', () => {
  isListView = !isListView;
  toggleAllViewBtn.textContent = isListView ? 'Switch to Grid View' : 'Switch to List View';
  renderAllBlogs(true); // Reset & rerender
});

renderAllBlogs();
