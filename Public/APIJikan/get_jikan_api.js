document.getElementById('searchButton').addEventListener('click', async () => {
    const animeName = document.getElementById('animeName').value;
    if (animeName) {
        const animes = await buscarAnimePorNome(animeName);
        if (animes && animes.length > 0) {
            mostrarAnimeInfo(animes);
        } else {
            alert('Anime não encontrado.');
        }
    } else {
        alert('Por favor, digite o nome do anime.');
    }
});

document.getElementById('insertButton').addEventListener('click', () => {
    const anime = JSON.parse(localStorage.getItem('anime'));
    if (anime) {
        inserirExemplar(anime);
        alert('Anime inserido com sucesso!');
        document.getElementById('animeInfo').style.display = 'none';
    }
});

document.getElementById('cancelButton').addEventListener('click', () => {
    document.getElementById('animeInfo').style.display = 'none';
});

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