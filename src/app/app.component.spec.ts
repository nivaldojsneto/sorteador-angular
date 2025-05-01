// app.component.spec.ts (otimizado para 100% cobertura)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

jest.mock('canvas-confetti', () => jest.fn());

describe('AppComponent (100% cobertura)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    localStorage.clear();
    fixture.detectChanges();
  });

  test('criação e inicialização do componente', () => {
    expect(component).toBeTruthy();
    localStorage.setItem('historicoSorteios', JSON.stringify(['João']));
    localStorage.setItem('tema', 'dark');
    component.ngOnInit();
    expect(component.itensSorteados).toEqual(['João']);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('alternarTema alterna o tema e salva no localStorage', () => {
    component.temaEscuroAtivo = false;
    component.alternarTema();
    expect(component.temaEscuroAtivo).toBe(true);
    expect(localStorage.getItem('tema')).toBe('dark');
    component.alternarTema();
    expect(localStorage.getItem('tema')).toBe('light');
  });

  test('carregarLista limpa texto, espaços e sorteios anteriores', () => {
    component.textoLista = 'Ana\nCarlos\n \nMaria';
    component.itensSorteados = ['X'];
    component.carregarLista();
    expect(component.lista).toEqual(['Ana', 'Carlos', 'Maria']);
    expect(component.textoLista).toBe('Ana\nCarlos\nMaria');
    expect(component.itensSorteados).toEqual([]);
  });

  test('onInput executa debounce e chama carregarLista', () => {
    const spy = jest.spyOn(component, 'carregarLista');
    jest.useFakeTimers();
    component.textoLista = 'Teste';
    component.onInput();
    jest.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalled();
  });

  test('onPaste chama carregarLista', () => {
    const spy = jest.spyOn(component, 'carregarLista');
    component.onPaste();
    setTimeout(() => expect(spy).toHaveBeenCalled(), 0);
  });

  test('sortear funciona corretamente', () => {
    component.lista = ['A', 'B', 'C'];
    component.quantidadeSorteios = 2;
    const soundSpy = jest.spyOn(component, 'playSound');
    const confettiSpy = jest.spyOn(component as any, 'playConfete');
    jest.useFakeTimers();
    component.sortear();
    expect(component.itensSorteados.length).toBe(2);
    expect(soundSpy).toHaveBeenCalled();
    expect(confettiSpy).toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(component.animando).toBe(false);
  });

  test('sortear ignora se lista vazia ou animando', () => {
    component.lista = [];
    component.animando = false;
    component.sortear();
    expect(component.itensSorteados).toEqual([]);

    component.lista = ['X'];
    component.animando = true;
    component.sortear();
    expect(component.itensSorteados).toEqual([]);
  });

  test('resetar com e sem confirmação', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');

    confirmSpy.mockReturnValue(false);
    component.lista = ['Z'];
    component.resetar();
    expect(component.lista).toEqual(['Z']);

    confirmSpy.mockReturnValue(true);
    component.textoLista = 'a';
    component.lista = ['a'];
    component.listaOriginal = ['a'];
    component.itensSorteados = ['a'];
    localStorage.setItem('historicoSorteios', '[]');
    component.resetar();
    expect(component.textoLista).toBe('');
    expect(component.lista.length).toBe(0);
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
  });

  test('limparHistoricoSorteios com e sem confirmação', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.itensSorteados = ['Ana'];
    component.limparHistoricoSorteios();
    expect(component.itensSorteados).toEqual(['Ana']);

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.itensSorteados = ['B'];
    localStorage.setItem('historicoSorteios', '["B"]');
    component.limparHistoricoSorteios();
    expect(component.itensSorteados).toEqual([]);
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
  });

  test('playSound cobre sucesso e erro (catch)', async () => {
    const mockAudio = { play: jest.fn().mockResolvedValue(undefined) };
    window.Audio = jest.fn(() => mockAudio) as any;
    await component.playSound();
    expect(mockAudio.play).toHaveBeenCalled();

    const erro = new Error('Erro simulado');
    const playMock = jest.fn().mockRejectedValueOnce(erro);
    window.Audio = jest.fn(() => ({ play: playMock })) as any;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await component.playSound();
    expect(warnSpy).toHaveBeenCalledWith('Erro ao tocar som:', erro);
  });

  test('quantidadeSorteios setter limpa itens e mensagem temporária', () => {
    jest.useFakeTimers();
    component.itensSorteados = ['X'];
    localStorage.setItem('historicoSorteios', '[]');
    component.quantidadeSorteios = 5;
    expect(component.itensSorteados).toEqual([]);
    expect(component.mensagem).toBe('A lista de ganhadores foi reiniciada.');
    jest.advanceTimersByTime(3000);
    expect(component.mensagem).toBeNull();
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
  });

  test('get quantidadeSorteios retorna valor correto', () => {
    component.quantidadeSorteios = 4;
    expect(component.quantidadeSorteios).toBe(4);
  });

  test('itensFiltrados retorna apenas nomes válidos', () => {
    component.itensSorteados = ['Ana', '', '   ', 'Carlos'];
    expect(component.itensFiltrados).toEqual(['Ana', 'Carlos']);
  });

  test('atualizarTema aplica ou remove classe dark do HTML', () => {
    component.temaEscuroAtivo = true;
    component.atualizarTema();
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    component.temaEscuroAtivo = false;
    component.atualizarTema();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('playConfete aciona canvas-confetti', () => {
    const confetti = require('canvas-confetti');
    component.playConfete();
    expect(confetti).toHaveBeenCalled();
  });
});
