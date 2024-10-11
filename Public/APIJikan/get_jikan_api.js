document.getElementById('searchButton').addEventListener('click', async () => {
    const animeName = document.getElementById('animeName').value;
    if (animeName) {
        const anime = await buscarAnimePorNome(animeName);
        if (anime) {
            mostrarAnimeInfo(anime);
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
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${nome}&limit=1`);
        const data = response.data.data[0];
        if (data) {
            const exemplar = {
                nome: data.title,
                sinopse: data.synopsis,
                categoria: data.genres.map(genre => genre.name).join(', '),
                episodio_capitulo_total: data.episodes,
                imagem: data.images.jpg.image_url,
                nota_geral: data.score,
                data_lancamento: data.aired.from
            };
            localStorage.setItem('anime', JSON.stringify(exemplar));
            return exemplar;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function mostrarAnimeInfo(anime) {
    document.getElementById('animeTitle').textContent = anime.nome;
    document.getElementById('animeSynopsis').textContent = anime.sinopse;
    document.getElementById('animeImage').src = anime.imagem;
    document.getElementById('animeInfo').style.display = 'block';
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