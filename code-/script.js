// script.js
// Auto-scroll + manual control + per-card modal. No token animation.

(() => {
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.track');
  const modal = document.querySelector('[data-modal]');
  const modalTitle = modal?.querySelector('.modal__title');
  const modalContent = modal?.querySelector('.modal__content');

  if (!carousel || !track) return;

 
  // --- Auto-scroll + manual control ---
  let running = true;
  let idleTimer = null;
  const speed = 0.45; // pixels per frame

  function tick(){
    if (running){
      carousel.scrollTop += speed;
      wrapIfNeeded();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const pause = () => { running = false; clearTimeout(idleTimer); };
  const resume = (delay=1500) => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { running = true; }, delay);
  };

  // --- Modal ---
  function openModal(title, html){
    if (!modal) return;
    pause();
    document.body.classList.add('no-scroll');
    modalTitle.textContent = title || '';
    modalContent.innerHTML = html || '';
    modal.removeAttribute('hidden');
    modal.querySelector('.modal__close')?.focus();
  }
  function closeModal(){
    if (!modal) return;
    modal.setAttribute('hidden','');
    document.body.classList.remove('no-scroll');
    resume(600);
  }
  modal?.addEventListener('click', (e) => {
    if (e.target.matches('[data-close], .modal__backdrop')) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (!modal?.hasAttribute('hidden') && e.key === 'Escape') closeModal();
  });

  // Card click -> open its details (or fallback to info text)
  const cards = track.querySelectorAll('.card:not([aria-hidden="true"])');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.title')?.textContent?.trim() || 'Details';
      const details = card.querySelector('.details');
      const fallback = `<p>${card.querySelector('.info')?.textContent || ''}</p>`;
      openModal(title, details ? details.innerHTML : fallback);
    });
  });
})();
