//script for creating custom bootstrap cards dynamically based on parameters
function createContentCard(
  type,
  title,
  width = '18rem',
  minHeight = '220px',
  link = '#',
  background = 'linear-gradient(135deg, #9f6af6 0%, #5f7dff 100%)'
) {
  const card = document.createElement('a');
  card.href = link;
  card.className = 'card content-card text-decoration-none text-white';
  card.style.width = width;
  card.style.minHeight = minHeight;
  card.style.background = background;
  card.style.display = 'block';

  card.innerHTML = `
    <div class="card-body d-flex flex-column justify-content-between" style="min-height: ${minHeight}; min-width: ${width};">
      <small class="mb-1 d-block">${type}</small>
      <h5 class="card-title fw-bold">${title}</h5>
    </div>
  `;

  return card;
}
