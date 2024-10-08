-- Criação da tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL, -- Lembrar de armazenar o hash da senha
    email TEXT NOT NULL UNIQUE,
    bio TEXT DEFAULT '' CHECK(length(bio) <= 160),
    imagem_perfil TEXT DEFAULT '/Imagens/hikaru.jpg', -- Pode armazenar a URL da imagem
    lista_id INTEGER, -- Chave estrangeira para a lista
    FOREIGN KEY (lista_id) REFERENCES list(id)
);

-- Criação da tabela de Listas
CREATE TABLE IF NOT EXISTS list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER, -- Chave estrangeira para o usuário
    FOREIGN KEY (usuario_id) REFERENCES users(id)
);

-- Criação da tabela de Exemplares
CREATE TABLE IF NOT EXISTS exemplar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    sinopse TEXT,
    categoria TEXT, -- Lista de categorias
    episodio_capitulo_total INTEGER,
    episodio_capitulo_assistido INTEGER DEFAULT 0,
    imagem TEXT, -- URL da imagem
    nota_geral REAL CHECK(nota_geral >= 0 AND nota_geral <= 10),
    notas_do_user TEXT, -- Campo extra para notas ou comentários
    data_lancamento TEXT, -- Data em formato ISO
    data_editado TEXT DEFAULT CURRENT_TIMESTAMP,
    visualizar BOOLEAN DEFAULT 1 -- Se está visível ou não
);

-- Criação da tabela intermediária para relacionar listas e exemplares (muitos para muitos)
CREATE TABLE IF NOT EXISTS list_exemplar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER,
    exemplar_id INTEGER,
    FOREIGN KEY (list_id) REFERENCES list(id),
    FOREIGN KEY (exemplar_id) REFERENCES exemplar(id)
);
