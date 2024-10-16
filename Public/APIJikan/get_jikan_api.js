document.getElementById('searchButton').addEventListener('click', async () => {
    const animeName = document.getElementById('animeName').value;
    if (animeName) {
        const animes = await buscarAnimePorNome(animeName);
        if (animes && animes.length > 0) {
            mostrarResultados(animes.slice(0, 3));
        } else {
            alert('Anime não encontrado.');
        }
    } else {
        alert('Por favor, digite o nome do anime.');
    }
});

function mostrarResultados(animes) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; // Limpar resultados anteriores

    animes.forEach(anime => {
        const animeElement = document.createElement('div');
        animeElement.className = 'anime-match';

        const title = document.createElement('h2');
        title.textContent = anime.nome;

        const synopsis = document.createElement('p');
        synopsis.textContent = anime.sinopse;

        const image = document.createElement('img');
        image.src = anime.imagem;
        image.alt = 'Imagem do Anime';
        image.className = 'img-thumbnail';

        const selectButton = document.createElement('button');
        selectButton.textContent = 'Selecionar';
        selectButton.className = 'btn btn-primary';
        selectButton.addEventListener('click', () => {
            localStorage.setItem('selectedAnime', JSON.stringify(anime));
            window.location.href = '/adicionarpes';
        });

        animeElement.appendChild(title);
        animeElement.appendChild(synopsis);
        animeElement.appendChild(image);
        animeElement.appendChild(selectButton);

        searchResults.appendChild(animeElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addExemplarForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const anime = JSON.parse(localStorage.getItem('selectedAnime'));
            const episodesWatched = document.getElementById('episodesWatched').value;
            const totalEpisodes = document.getElementById('totalEpisodes').value;
            const additionalNotes = document.getElementById('additionalNotes').value;

            const exemplar = {
                ...anime,
                episodio_capitulo_assistido: episodesWatched,
                episodio_capitulo_total: totalEpisodes,
                notas_do_user: additionalNotes
            };

            try {
                const response = await axios.post('/api/exemplares', exemplar);
                if (response.data.success) {
                    alert('Anime adicionado com sucesso!');
                    adicionarExemplarAListaDoUsuario(response.data.exemplarId);
                    window.location.href = '/lista';
                } else {
                    alert('Erro ao adicionar anime.');
                }
            } catch (error) {
                console.error('Erro ao adicionar exemplar:', error);
                alert('Erro ao adicionar exemplar.');
            }
        });
    }
});

async function adicionarExemplarAListaDoUsuario(exemplarId) {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await axios.post('/api/list_exemplar', {
            list_id: user.lista_id,
            exemplar_id: exemplarId
        });
        if (!response.data.success) {
            alert('Erro ao adicionar exemplar à lista do usuário.');
        }
    } catch (error) {
        console.error('Erro ao adicionar exemplar à lista do usuário:', error);
        alert('Erro ao adicionar exemplar à lista do usuário.');
    }
}

async function buscarAnimePorNome(nome) {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${nome}&limit=4`);
        const data = response.data.data;
        if (data && data.length > 0) {
            const exemplares = data.map(anime => ({
                nome: anime.title,
                sinopse: anime.synopsis,
                categoria: anime.genres.map(genre => genre.name).join(', '),
                episodio_capitulo_total: anime.episodes,
                imagem: anime.images.jpg.image_url,
                nota_geral: anime.score,
                data_lancamento: anime.aired.from
            }));
            localStorage.setItem('animes', JSON.stringify(exemplares));
            return exemplares;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function mostrarAnimeInfo(animes) {
    const animeInfoContainer = document.getElementById('animeInfo');
    animeInfoContainer.innerHTML = ''; // Limpar conteúdo anterior

    animes.forEach(anime => {
        const animeElement = document.createElement('div');
        animeElement.className = 'anime-match';

        const title = document.createElement('h2');
        title.textContent = anime.nome;

        const synopsis = document.createElement('p');
        synopsis.textContent = anime.sinopse;

        const image = document.createElement('img');
        image.src = anime.imagem;
        image.alt = 'Imagem do Anime';
        image.className = 'img-thumbnail';

        const insertButton = document.createElement('button');
        insertButton.textContent = 'Inserir no Banco de Dados';
        insertButton.className = 'btn btn-success custom-btn';
        insertButton.addEventListener('click', () => {
            inserirExemplar(anime);
            alert('Anime inserido com sucesso!');
            animeInfoContainer.style.display = 'none';
        });

        animeElement.appendChild(title);
        animeElement.appendChild(synopsis);
        animeElement.appendChild(image);
        animeElement.appendChild(insertButton);

        animeInfoContainer.appendChild(animeElement);
    });

    animeInfoContainer.style.display = 'block';
}

function inserirExemplar(exemplar) {
    axios.post('/api/inserirExemplar', exemplar)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}