import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  textoLista: string = '';
  lista: string[] = [];
  listaOriginal: string[] = [];
  itensSorteados: string[] = [];
  _quantidadeSorteios: number = 1;
  animando: boolean = false;
  mensagem: string | null = null;
  temaEscuroAtivo: boolean = false;
  typingTimeout: ReturnType<typeof setTimeout> | null = null;
  mensagemTimeout: ReturnType<typeof setTimeout> | null = null;
  progresso: number = 0;
  nomeEmFoco: string = '';

  // ---------------- LIFECYCLE ----------------
  ngOnInit(): void {
    const dadosSalvos = localStorage.getItem('historicoSorteios');
    if (dadosSalvos) {
      this.itensSorteados = JSON.parse(dadosSalvos);
    }

    const temaSalvo = localStorage.getItem('tema');
    this.temaEscuroAtivo = temaSalvo === 'dark';
    this.atualizarTema();
  }

  // ---------------- GETTERS E SETTERS ----------------
  get quantidadeSorteios(): number {
    return this._quantidadeSorteios;
  }

  set quantidadeSorteios(valor: number) {
    this._quantidadeSorteios = valor;
    this.itensSorteados = [];
    localStorage.removeItem('historicoSorteios');

    this.mensagem = 'A lista de ganhadores foi reiniciada.';
    if (this.mensagemTimeout) clearTimeout(this.mensagemTimeout);
    this.mensagemTimeout = setTimeout(() => {
      this.mensagem = null;
    }, 3000);
  }

  get itensFiltrados(): string[] {
    return this.itensSorteados.filter((i) => i.trim());
  }

  // ---------------- MÉTODOS PÚBLICOS ----------------
  carregarLista(): void {
    const linhas = this.textoLista
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    this.lista = linhas;
    this.listaOriginal = [...linhas];
    this.textoLista = linhas.join('\n');
    this.itensSorteados = [];
    this.progresso = 0;
    this.nomeEmFoco = '';
  }

  onInput(): void {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.carregarLista();
    }, 500);
  }

  onPaste(): void {
    setTimeout(() => {
      this.carregarLista();
    }, 0);
  }

  async sortear(): Promise<void> {
    if (this.lista.length === 0 || this.animando) return;

    this.animando = true;
    this.itensSorteados = [];
    const qtd = Math.min(this.quantidadeSorteios, this.lista.length);

    for (let i = 0; i < qtd; i++) {
      const rodadas = Math.min(100, this.lista.length);
      for (let j = 0; j < rodadas; j++) {
        const indexAleatorio = Math.floor(Math.random() * this.lista.length);
        this.nomeEmFoco = this.lista[indexAleatorio];
        this.progresso = ((j + 1) / rodadas) * 100;
        await this.delay(5);
      }

      const index = Math.floor(Math.random() * this.lista.length);
      this.itensSorteados.push(this.lista[index]);
      this.lista.splice(index, 1);
      this.nomeEmFoco = '';
      this.progresso = 100;
    }

    this.playSound();
    this.playConfete();

    setTimeout(() => {
      this.animando = false;
    }, 500);
  }

  resetar(): void {
    const confirmar = confirm('Tem certeza que deseja limpar toda a lista?');
    if (!confirmar) return;

    this.textoLista = '';
    this.lista = [];
    this.listaOriginal = [];
    this.itensSorteados = [];
    this.quantidadeSorteios = 1;
    localStorage.removeItem('historicoSorteios');
    this.progresso = 0;
    this.nomeEmFoco = '';
  }

  limparHistoricoSorteios(): void {
    const confirmar = confirm('Deseja limpar apenas o histórico de sorteios?');
    if (!confirmar) return;

    this.itensSorteados = [];
    localStorage.removeItem('historicoSorteios');
  }

  async playSound(): Promise<void> {
    try {
      const audio = new Audio('assets/sounds/vitoria.mp3');
      await audio.play();
    } catch (e) {
      console.warn('Erro ao tocar som:', e);
    }
  }

  playConfete(): void {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  }

  alternarTema(): void {
    this.temaEscuroAtivo = !this.temaEscuroAtivo;
    this.atualizarTema();
  }

  atualizarTema(): void {
    const html = document.documentElement;
    if (this.temaEscuroAtivo) {
      html.classList.add('dark');
      localStorage.setItem('tema', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('tema', 'light');
    }
  }

  // ---------------- MÉTODOS PRIVADOS ----------------
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
