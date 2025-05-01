# 🏆 Sorteador Interativo de Itens - Angular 🚀


Crie experiências únicas com este poderoso e moderno **sorteador de nomes ou itens**, desenvolvido com **Angular 19 e componentes standalone**. Perfeito para sorteios em tempo real, dinâmicas de grupo, eventos, premiações ou simplesmente para tornar qualquer lista em algo divertido e surpreendente.

✨ Com uma interface elegante e intuitiva, este app transforma listas em momentos memoráveis com:

- ✅ **Sorteios animados**, com nome do ganhador destacado e piscando
- ✅ **Confetes explodindo** na tela ao estilo celebração 🎊
- ✅ **Som de vitória** para reforçar o impacto do sorteio 🔊
- ✅ **Sorteio múltiplo** de vários itens em um clique
- ✅ **Auto-carregamento da lista** ao digitar ou colar
- ✅ **Limpeza automática de linhas em branco**
- ✅ **Reset seguro com confirmação**
- ✅ Tudo isso com **100% de cobertura de testes unitários com Jest** 🧪

💡 Simples o suficiente para qualquer pessoa usar, poderoso o bastante para qualquer situação.

## 🚀 Como usar

### 1. Clone o repositório

```bash
git clone https://github.com/nivaldojsneto/sorteador-angular.git
cd sorteador-angular
```

### 2. Instale as dependências do projeto
```bash
npm install
```

### 3. Rode o servidor local
```bash
ng serve
```
Abra seu navegador em: http://localhost:4200

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.spec.ts
│   └── app.component.ts
├── assets/
│   └── sounds/
│       └── vitoria.mp3
└── main.ts
```
## 🔊 Som de Vitória

O projeto já vem com um arquivo chamado ```vitoria.mp3```.

Você pode substituí-lo por qualquer som ```.mp3``` de sua preferência.

Sugestões de sites para sons gratuitos:

[Pixabay](https://pixabay.com/pt/sound-effects/)

[Free Sound](https://freesound.org/)

Substitua pelo arquivo original que esta em:

```
src/assets/sounds/vitoria.mp3
```

## 🧪 Testes Unitários

O projeto possui uma suíte completa de **testes unitários** utilizando **[Jest](https://jestjs.io/)**, com **100% de cobertura de código** nas funcionalidades principais.

### 🔍 Funcionalidades testadas:

✅ **Carregamento da lista** com diferentes quebras de linha (`\\n` e `\\r\\n`)

✅ **Remoção automática de linhas em branco** e espaços antes de processar a lista 

✅ **Limpeza visual do campo de texto (textarea)** ao carregar a lista 

✅ **Sorteio de múltiplos nomes de uma só vez**, respeitando a quantidade definida 

✅ **Comportamento ao tentar sortear com lista vazia**

✅ **Prevenção de sorteio durante animação ativa**

✅ **Reset completo com confirmação do usuário**

✅ **Preservação de dados se reset for cancelado**

✅ **Auto-carregamento da lista ao parar de digitar** (debounce de 500ms)

✅ **Chamadas aos efeitos visuais** (`playSound` e `playConfete`)

✅ **Tratamento de erro ao executar `audio.play()`** com `.catch`

✅ **Verificação de execução assíncrona com `setTimeout`**

✅ **Getter `itensFiltrados`** retorna apenas entradas válidas para exibição

### ▶️ Executando os testes

```bash
npm run test
```

Ou com relatório de cobertura:

```bash
npm run test -- --coverage
```

O relatório gerado em `/coverage/lcov-report/index.html` mostra todos os arquivos com 100% de statements, branches, functions e lines. """

## 📄 Licença
Este projeto está licenciado sob a [MIT Licence](https://mit-license.org/).
