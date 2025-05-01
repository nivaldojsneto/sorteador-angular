import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

jest.mock('canvas-confetti', () => jest.fn());

describe('AppComponent com Jest (100% cobertura incluindo .catch)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  test('onInput chama carregarLista após pausa na digitação', () => {
    const carregarSpy = jest.spyOn(component, 'carregarLista');
    jest.useFakeTimers();
    component.textoLista = 'João\\nMaria\\nCarlos';
    component.onInput(); // simula digitação
    expect(carregarSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500); // tempo de debounce
    expect(carregarSpy).toHaveBeenCalled();
  });

  test('carregarLista limpa itens sorteados', () => {
    component.itensSorteados = ['A'];
    component.textoLista = `João
    Maria
    Carlos`;
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.listaOriginal).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.itensSorteados).toEqual([]);
  });

  test('sortear respeita quantidade', () => {
    component.lista = ['A', 'B', 'C'];
    component.quantidadeSorteios = 2;
    const soundSpy = jest.spyOn(component, 'playSound');
    const confettiSpy = jest.spyOn(component as any, 'playConfete');
    jest.useFakeTimers();
    component.sortear();
    expect(component.itensSorteados.length).toBe(2);
    jest.advanceTimersByTime(3000);
    expect(component.animando).toBe(false);
    expect(soundSpy).toHaveBeenCalled();
    expect(confettiSpy).toHaveBeenCalled();
  });

  test('sortear com quantidade maior sorteia tudo', () => {
    component.lista = ['X', 'Y'];
    component.quantidadeSorteios = 5;
    component.sortear();
    expect(component.itensSorteados.length).toBe(2);
    expect(component.lista.length).toBe(0);
  });

  test('sortear ignora com lista vazia', () => {
    component.lista = [];
    component.sortear();
    expect(component.itensSorteados).toEqual([]);
  });

  test('sortear ignora se animando', () => {
    component.lista = ['A'];
    component.animando = true;
    component.sortear();
    expect(component.itensSorteados).toEqual([]);
  });

  test('resetar com confirmação limpa tudo', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.textoLista = 'Teste';
    component.lista = ['A'];
    component.listaOriginal = ['A'];
    component.itensSorteados = ['A'];
    component.quantidadeSorteios = 3;
    component.resetar();
    expect(component.textoLista).toBe('');
    expect(component.lista).toEqual([]);
    expect(component.listaOriginal).toEqual([]);
    expect(component.itensSorteados).toEqual([]);
    expect(component.quantidadeSorteios).toBe(1);
  });

  test('resetar sem confirmação não altera estado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.lista = ['Z'];
    component.resetar();
    expect(component.lista).toEqual(['Z']);
  });

  test('onPaste chama carregarLista com timeout', () => {
    const spy = jest.spyOn(component, 'carregarLista');
    jest.useFakeTimers();
    component.onPaste();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalled();
  });

  test('playSound com sucesso', async () => {
    const mockAudio = { play: jest.fn().mockResolvedValue(undefined) };
    window.Audio = jest.fn(() => mockAudio) as any;
    await component.playSound();
    expect(mockAudio.play).toHaveBeenCalled();
  });

  test('playSound com erro no play cobre o .catch', async () => {
    const audioMock = {
      play: jest.fn().mockRejectedValueOnce(new Error('Erro simulado')),
    };
    window.Audio = jest.fn(() => audioMock) as any;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await component.playSound();
    expect(audioMock.play).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith('Erro ao tocar som:', expect.any(Error));
    warnSpy.mockRestore();
  });

  test('playConfete é chamado corretamente', () => {
    const confetti = require('canvas-confetti');
    component.playConfete();
    expect(confetti).toHaveBeenCalled();
  });
});
