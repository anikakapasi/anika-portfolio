const storyTypes = ['All', 'Favorites', 'Breaking News', 'Enterprise', 'Features', 'Solutions'];
const beats = ['Politics & Government', 'Business & Economy', 'Technology', 'Education', 'Community & Culture'];
const state = { story: 'All', beat: 'All' };
const articleImages = {
  'article-3': 'Crisis pregnancy centers quietly thrive as access to abortion health care falls under scrutiny.jpg',
  'article-4': 'Trump and BU- A year in review.jpg',
  'article-5': 'BU, City of Boston’s MLK Day celebration urges Americans to ‘turn toward’ issues of inequality, not away.jpg',
  'article-6': '60th annual Head of the Charles Regatta draws hundreds of thousands of attendees from across the world.jpg',
  'article-7': 'Mayor Wu delivers first State of the Schools address.jpg',
  'article-8': '13 protesters detained at pro-Palestine demonstration in Boston Common.jpg',
  'article-9': 'Boston’s fourth Men’s March against abortion met with counter protesters.jpg',
  'article-10': 'Susan Fournier to retire after eight years as Questrom Dean, 21 years at BU.jpg',
  'article-11': 'University commits over $104 million to the city of Boston in historic PILOT agreement.png',
  'article-12': '‘We can’t rely on the executive orders’- Wu prepares for potential ICE surge, advocates argue community action is key.jpg',
  'article-13': 'Statewide rise in antisemitism doesn’t mirror BU’s campus climate, Jewish leaders say.jpg',
  'article-14': '‘So many girls got dropped so quickly.’ BU students launch initiative to add sorority following record participation in 2026 recruitment cycle.jpg',
  'article-15': 'BU sophomore establishes independent Turning Point USA chapter at BU.jpg',
  'article-16': 'Surge in AI transforms job recruitment industry, prompts discussions surrounding ethics.jpg',
  'article-18': 'SKILL Act would give companies tax credits for training, hiring students.jpeg',
  'article-19': 'article-19.jpg',
  'article-20': 'Council debates Chamber contract, weighs economic vitality plan.jpg',
  'article-22': 'Los Altos priest advises Anthropic on AI ethics.jpg',
  'article-23': 'Former MVHS journalism teacher and students’ lawsuit vs. principal moves closer to trial.jpg',
  'article-24': 'The Repair Café fixes all kinds of broken stuff.jpg',
  'article-27': 'article-27.png',
  'article-28': 'Los Altos first fully affordable housing development takes aim at carbon emissions.jpg',
  'article-29': 'Council debates allocation of supplemental funds CASSY funding halved.jpg'
};

const normalize = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const grid = document.querySelector('#article-grid');
const count = document.querySelector('#result-count');
const reset = document.querySelector('#reset-filters');
const empty = document.querySelector('#empty-state');

function createFilter(group, label, dimension) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.value = label;
  button.setAttribute('aria-pressed', String(label === 'All' && dimension === 'story'));
  button.addEventListener('click', () => {
    state.story = dimension === 'story' ? label : 'All';
    state.beat = dimension === 'beat' ? label : 'All';
    document.querySelectorAll('.filter-options button').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    filterArticles();
  });
  group.append(button);
}

function articleMatches(article) {
  const storyMatch = state.story === 'All' || (state.story === 'Favorites' ? article.favorite : normalize(article.storyType) === normalize(state.story));
  const beatMatch = state.beat === 'All' || article.beats.some((beat) => normalize(beat) === normalize(state.beat));
  return storyMatch && beatMatch;
}

function cardMarkup(article, index) {
  const accentClass = index % 10 === 1 ? 'accent-blue' : index % 10 === 6 ? 'accent-cream' : '';
  const tags = [article.storyType, ...article.beats].filter(Boolean);
  const imagePath = `public/article-images/${articleImages[article.id]}`;
  return `
    <article class="article-card ${accentClass}" data-id="${article.id}" style="animation-delay:${Math.min(index, 7) * 45}ms">
      <a class="article-link" href="${article.url}" target="_blank" rel="noopener noreferrer" aria-label="${article.title} — opens in a new tab">
        <div class="image-well"><img src="${imagePath}" alt="Photo for ${article.title}" loading="lazy"></div>
        <div class="card-body">
          <p class="tags">${article.favorite ? '<span class="favorite-mark" aria-label="Favorite">★</span>' : ''}${tags.join(' · ')}</p>
          <h2>${article.title}</h2>
          <time class="article-date">${article.date || 'Publication date forthcoming'}</time>
          <div class="card-bottom"><span class="publication">${article.publication}</span><span class="external-arrow" aria-hidden="true">↗</span></div>
        </div>
      </a>
    </article>`;
}

function renderArticles() {
  const datedArticles = [...window.ARTICLES].sort((a, b) => {
    const aDate = Date.parse(a.date) || 0;
    const bDate = Date.parse(b.date) || 0;
    return bDate - aDate;
  });
  grid.innerHTML = datedArticles.map(cardMarkup).join('');
}

function filterArticles() {
  let visible = 0;
  document.querySelectorAll('.article-card').forEach((card) => {
    const article = window.ARTICLES.find((item) => item.id === card.dataset.id);
    const show = articleMatches(article);
    card.hidden = !show;
    if (show) {
      visible += 1;
      card.style.animation = 'none';
      requestAnimationFrame(() => { card.style.animation = ''; });
    }
  });
  count.textContent = `${visible} ${visible === 1 ? 'story' : 'stories'}`;
  empty.hidden = visible !== 0;
  reset.hidden = state.story === 'All' && state.beat === 'All';
}

function resetFilters() {
  state.story = 'All'; state.beat = 'All';
  document.querySelectorAll('.filter-options button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.value === 'All')));
  filterArticles();
}

storyTypes.forEach((label) => createFilter(document.querySelector('#story-filters'), label, 'story'));
beats.forEach((label) => createFilter(document.querySelector('#beat-filters'), label, 'beat'));
reset.addEventListener('click', resetFilters);
empty.querySelector('button').addEventListener('click', resetFilters);
renderArticles();
filterArticles();
