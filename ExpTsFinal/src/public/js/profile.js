async function loadGameStats() {
  try {
    const response = await fetch('/api/game/user-stats');
    const stats = await response.json();
    
    const statsElement = document.getElementById('gameStats');
    
    if (stats.error) {
      statsElement.innerHTML = '<p class="text-danger mb-0">Erro ao carregar estatísticas.</p>';
      return;
    }
    
    statsElement.innerHTML = `
      <div class="row text-center">
        <div class="col-4">
          <div class="border rounded p-2">
            <div class="h4 text-primary">${stats.totalGames}</div>
            <small class="text-muted">Jogos</small>
          </div>
        </div>
        <div class="col-4">
          <div class="border rounded p-2">
            <div class="h4 text-success">${stats.bestScore}</div>
            <small class="text-muted">Melhor Score</small>
          </div>
        </div>
        <div class="col-4">
          <div class="border rounded p-2">
            <div class="h4 text-info">${stats.averageScore}</div>
            <small class="text-muted">Score Médio</small>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
    document.getElementById('gameStats').innerHTML = 
      '<p class="text-danger mb-0">Erro ao carregar estatísticas.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadGameStats();
});