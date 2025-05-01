import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  textoLista: string = '';
  lista: string[] = [];
  listaOriginal: string[] = [];
  itemSorteado: string = '';
  animando: boolean = false;
  mostrarLista: boolean = false;

  onPaste() {
    // Aguarda o ngModel atualizar o conteúdo colado
    setTimeout(() => {
      this.carregarLista();
    }, 0); // 0 já é suficiente para esperar o próximo tick
  }

  playConfete() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  }

  carregarLista() {
    this.lista = this.textoLista
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    this.listaOriginal = [...this.lista];
    this.itemSorteado = '';
    this.mostrarLista = false; // Oculta após carregar
  }

  playSound() {
    const audio = new Audio('assets/sounds/vitoria.mp3');
    audio.play().catch((e) => {
      console.warn('Erro ao tocar som:', e);
    });
  }

  sortear() {
    if (this.lista.length === 0 || this.animando) return;

    const index = Math.floor(Math.random() * this.lista.length);
    this.itemSorteado = this.lista[index];
    this.lista.splice(index, 1);

    this.playSound(); // 🔊 Toca o som
    this.playConfete(); // 🔊 Estoura o confete

    this.animando = true;
    setTimeout(() => {
      this.animando = true;
    }, 2000); // tempo da animação
  }

  resetar() {
    const confirmar = confirm('Tem certeza que deseja limpar toda a lista?');
    if (!confirmar) return;

    this.textoLista = '';
    this.lista = [];
    this.listaOriginal = [];
    this.itemSorteado = '';
    this.mostrarLista = false;
  }
}
