(() => {
  // Lightbox for research figures.
  const dialog = document.getElementById('figure-dialog');
  const dImg = document.getElementById('dialog-image');
  const dTitle = document.getElementById('dialog-title');
  const dCap = document.getElementById('dialog-caption');
  let opener = null;
  document.querySelectorAll('.figure-open').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      dImg.src = img.currentSrc || img.src;
      dImg.alt = img.alt;
      dTitle.textContent = btn.dataset.title || 'Research figure';
      dCap.textContent = btn.dataset.caption || '';
      opener = btn;
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
    });
  });
  const close = () => { if (dialog.close) dialog.close(); else dialog.removeAttribute('open'); };
  dialog.querySelector('.dialog-close').addEventListener('click', close);
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target.classList.contains('dialog-body')) close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });

  // Only one video plays at a time.
  const videos = [...document.querySelectorAll('video')];
  videos.forEach(v => v.addEventListener('play', () => videos.forEach(o => { if (o !== v) o.pause(); })));

  // Copy BibTeX.
  const copyBtn = document.getElementById('copy-citation');
  const status = document.getElementById('copy-status');
  const bib = document.getElementById('bibtex');
  copyBtn.addEventListener('click', async () => {
    const text = bib.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const r = document.createRange(); r.selectNodeContents(bib);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      document.execCommand('copy'); s.removeAllRanges();
    }
    copyBtn.textContent = 'Copied';
    status.textContent = 'BibTeX copied to clipboard';
    setTimeout(() => { copyBtn.textContent = 'Copy BibTeX'; status.textContent = ''; }, 1800);
  });

  // Highlight the current section in the nav.
  const links = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.removeAttribute('aria-current'));
        const a = map.get(en.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
