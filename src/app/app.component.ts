import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  textoLista: string = '';
  lista: string[] = [];
  listaOriginal: string[] = [];
  itensSorteados: string[] = [];
  animando: boolean = false;
  typingTimeout: any;
  mensagem: string | null = null;
  mensagemTimeout: any;
  temaEscuroAtivo = false;

  private _quantidadeSorteios: number = 1;

  get quantidadeSorteios(): number {
    return this._quantidadeSorteios;
  }

  get iconeTema(): string {
    return this.temaEscuroAtivo ? '☀️' : '🌙';
  }

  set quantidadeSorteios(valor: number) {
    this._quantidadeSorteios = valor;
    this.itensSorteados = [];
    localStorage.removeItem('historicoSorteios');

    // Mensagem temporária
    this.mensagem = 'A lista de ganhadores foi reiniciada.';
    clearTimeout(this.mensagemTimeout);
    this.mensagemTimeout = setTimeout(() => {
      this.mensagem = null;
    }, 3000);
  }

  ngOnInit(): void {
    const dadosSalvos = localStorage.getItem('historicoSorteios');
    if (dadosSalvos) {
      this.itensSorteados = JSON.parse(dadosSalvos);
    }
    const temaSalvo = localStorage.getItem('tema');
    this.temaEscuroAtivo = temaSalvo === 'dark';
    this.atualizarTema();
  }

  alternarTema() {
    this.temaEscuroAtivo = !this.temaEscuroAtivo;
    this.atualizarTema();
  }

  atualizarTema() {
    const html = document.documentElement;
    if (this.temaEscuroAtivo) {
      html.classList.add('dark');
      localStorage.setItem('tema', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('tema', 'light');
    }
  }

  get itensFiltrados() {
    return this.itensSorteados.filter((i) => i.trim());
  }

  carregarLista() {
    const linhas = this.textoLista
      .split(/\r?\n/) // aceita \n (Unix) ou \r\n (Windows)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    this.lista = linhas;
    this.listaOriginal = [...linhas];
    this.textoLista = linhas.join('\n'); // atualiza o textarea sem linhas em branco
    this.itensSorteados = []; // 🔑 limpa sorteios anteriores
  }

  onInput() {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.carregarLista();
    }, 500);
  }

  sortear() {
    if (this.lista.length === 0 || this.animando) return;

    const qtd = Math.min(this.quantidadeSorteios, this.lista.length);
    const sorteados: string[] = [];

    for (let i = 0; i < qtd; i++) {
      const index = Math.floor(Math.random() * this.lista.length);
      sorteados.push(this.lista[index]);
      this.lista.splice(index, 1);
    }

    this.itensSorteados = [...sorteados, ...this.itensSorteados];
    localStorage.setItem('historicoSorteios', JSON.stringify(this.itensSorteados));

    this.playSound();
    this.playConfete();

    this.animando = true;
    setTimeout(() => {
      this.animando = false;
    }, 3000);
  }

  resetar() {
    const confirmar = confirm('Tem certeza que deseja limpar toda a lista?');
    if (!confirmar) return;

    this.textoLista = '';
    this.lista = [];
    this.listaOriginal = [];
    this.itensSorteados = [];
    this.quantidadeSorteios = 1;
    localStorage.removeItem('historicoSorteios');
  }

  limparHistoricoSorteios() {
    const confirmar = confirm('Deseja limpar apenas o histórico de sorteios?');
    if (!confirmar) return;

    this.itensSorteados = [];
    localStorage.removeItem('historicoSorteios');
  }

  onPaste() {
    setTimeout(() => {
      this.carregarLista();
    }, 0);
  }

  async playSound() {
    try {
      const audio = new Audio('assets/sounds/vitoria.mp3');
      await audio.play();
    } catch (e) {
      console.warn('Erro ao tocar som:', e);
    }
  }

  playConfete() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  }
}
