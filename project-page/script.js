'use strict';

// Each demonstration is paired with its design and remains directly accessible.
const demonstrations = [...document.querySelectorAll('.demo-player video')];
demonstrations.forEach(video => {
  const speed = document.querySelector(`select[data-video="${video.id}"]`);
  const applySpeed = () => { video.playbackRate = Number(speed.value); };
  speed.addEventListener('change', applySpeed);
  video.addEventListener('loadedmetadata', applySpeed);
  video.addEventListener('play', () => {
    demonstrations.forEach(other => { if (other !== video) other.pause(); });
  });
});

function tabKeyboard(tabs, choose) {
  tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    choose(tabs[next]);
    tabs[next].focus();
  }));
}

const results = {
  plots: {
    image: 'evaluation-results.png',
    title: 'Workload and task completion time',
    alt: 'Boxplots comparing perceived workload and task completion time for LiverPlan and the desktop baseline, overall and by task.',
    caption: 'Perceived workload and task completion time, overall and by experimental task. Solid lines indicate medians.'
  },
  table: {
    image: 'evaluation-table.png',
    title: 'Task performance and confidence ratings',
    alt: 'Table 2 from the paper: overall and stage-specific performance and confidence ratings, with mean and standard deviation, percentage changes, and significance.',
    caption: 'Task performance and confidence ratings reported in the paper, including overall and stage-specific results.'
  }
};
const resultTabs = [...document.querySelectorAll('.results-tabs button')];
function selectResults(key) {
  resultTabs.forEach(tab => {
    const selected = tab.dataset.result === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const content = results[key];
  const img = document.querySelector('#results-image');
  img.src = `assets/figures/${content.image}`;
  img.alt = content.alt;
  const opener = img.closest('.figure-open');
  opener.dataset.title = content.title;
  opener.dataset.caption = content.caption;
  opener.setAttribute('aria-label', `Enlarge: ${content.title}`);
  document.querySelector('#results-caption').textContent = content.caption;
  document.querySelector('#results-panel').setAttribute('aria-labelledby', `results-tab-${key}`);
}
resultTabs.forEach(tab => tab.addEventListener('click', () => selectResults(tab.dataset.result)));
tabKeyboard(resultTabs, tab => selectResults(tab.dataset.result));

const dialog = document.querySelector('#figure-dialog');
let lastFigure = null;
document.querySelectorAll('.figure-open').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    document.querySelector('#dialog-title').textContent = button.dataset.title;
    document.querySelector('#dialog-caption').textContent = button.dataset.caption;
    const expanded = document.querySelector('#dialog-image');
    expanded.src = image.src;
    expanded.alt = button.dataset.fullAlt || image.alt;
    lastFigure = button;
    document.body.classList.add('dialog-open');
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  lastFigure?.focus({ preventScroll: true });
});

const copy = document.querySelector('#copy-citation');
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector('#bibtex').textContent);
    copy.textContent = 'Copied';
    document.querySelector('#copy-status').textContent = 'BibTeX copied to clipboard.';
    window.setTimeout(() => { copy.textContent = 'Copy BibTeX'; }, 2000);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('#bibtex'));
    selection.removeAllRanges();
    selection.addRange(range);
    copy.textContent = 'Select and copy';
    document.querySelector('#copy-status').textContent = 'BibTeX selected. Use your browser’s copy command.';
  }
});

const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  ['workflow', 'design-study', 'evaluation', 'resources'].forEach(id => observer.observe(document.getElementById(id)));
}
