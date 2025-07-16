export function openBlogModal(button: HTMLElement) {
  const modal = document.getElementById('blogModal') as HTMLElement;
  const title = button.getAttribute('data-title') || '';
  const content = button.getAttribute('data-content') || '';
  const image = button.getAttribute('data-image') || '';

  const modalTitle = document.getElementById('modalTitle') as HTMLElement;
  const modalContent = document.getElementById('modalContent') as HTMLElement;
  const modalImg = document.getElementById('modalImage') as HTMLImageElement;

  modalTitle.textContent = title;
  modalContent.textContent = content;

  if (image) {
    modalImg.src = image;
    modalImg.classList.remove('hidden');
  } else {
    modalImg.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

export function closeBlogModal() {
  const modal = document.getElementById('blogModal') as HTMLElement;
  modal.classList.add('hidden');
}
