# 🏆 Sorteador de Itens Angular

Um aplicativo web desenvolvido com **Angular 19 (Standalone Components)** que permite colar uma lista de nomes ou itens e realizar sorteios com animação, som de vitória e uma interface moderna e responsiva.

## ✨ Funcionalidades

✅ Cole ou **digite** rapidamente uma lista de nomes ou itens (um por linha)  
✅ A lista é carregada **automaticamente ao parar de digitar** (com debounce de 500ms)  
✅ Sorteia um ou mais itens aleatórios com **animação moderna**  
✅ Reproduz **som de vitória** e exibe **confetes** ao sortear  
✅ O resultado sorteado é sempre exibido com destaque animado  
✅ Permite escolher a quantidade de sorteios  
✅ Botão de reset com confirmação para evitar apagamento acidental  
✅ Interface limpa, responsiva e com 100% de cobertura de testes com Jest  
✅ Suporte a modo standalone do Angular 19

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
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.component.css
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

✅ Carregamento da lista de itens com diferentes tipos de quebra de linha (`\\n` e `\\r\\n`)
✅ Sorteio de múltiplos items de uma vez
✅ Limpeza completa dos dados com confirmação
✅ Proteções contra ações indevidas (lista vazia, animação em andamento)
✅ Execução correta dos efeitos de som e confete
✅ Tratamento de erros no método `playSound()` (`.catch`)
✅ Verificação do comportamento assíncrono com `setTimeout` e `jest.useFakeTimers()`
✅ Carregamento automático ao parar de digitar (`onInput` com debounce)

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
