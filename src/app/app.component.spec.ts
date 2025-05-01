import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

jest.mock('canvas-confetti', () => jest.fn());

describe('AppComponent com Jest (100% cobertura)', () => {
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

  test('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  test('ngOnInit carrega histórico salvo do localStorage', () => {
    localStorage.setItem('historicoSorteios', JSON.stringify(['Carlos']));
    component.ngOnInit();
    expect(component.itensSorteados).toEqual(['Carlos']);
  });

  test('onInput chama carregarLista após debounce', () => {
    const carregarSpy = jest.spyOn(component, 'carregarLista');
    jest.useFakeTimers();
    component.textoLista = 'João\\nMaria\\nCarlos';
    component.onInput();
    expect(carregarSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(carregarSpy).toHaveBeenCalled();
  });

  test('carregarLista remove linhas vazias e limpa sorteios anteriores', () => {
    component.itensSorteados = ['X'];
    component.textoLista = `João\n\n Maria \n    \nCarlos `;
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.itensSorteados).toEqual([]);
  });

  test('textoLista é reformatado ao carregarLista', () => {
    component.textoLista = `João\n\n  \nMaria\nCarlos\n   `;
    component.carregarLista();
    expect(component.textoLista).toBe('João\nMaria\nCarlos');
  });

  test('itensFiltrados remove itens vazios ou espaços', () => {
    component.itensSorteados = ['João', ' ', 'Carlos', '', '   ', 'Maria'];
    expect(component.itensFiltrados).toEqual(['João', 'Carlos', 'Maria']);
  });

  test('sortear respeita quantidade', () => {
    component.lista = ['A', 'B', 'C'];
    component.quantidadeSorteios = 2;
    const somSpy = jest.spyOn(component, 'playSound');
    const confettiSpy = jest.spyOn(component as any, 'playConfete');
    jest.useFakeTimers();
    component.sortear();
    expect(component.itensSorteados.length).toBe(2);
    jest.advanceTimersByTime(3000);
    expect(component.animando).toBe(false);
    expect(somSpy).toHaveBeenCalled();
    expect(confettiSpy).toHaveBeenCalled();
  });

  test('sortear com quantidade maior que a lista sorteia tudo', () => {
    component.lista = ['X', 'Y'];
    component.quantidadeSorteios = 5;
    component.sortear();
    expect(component.itensSorteados.length).toBe(2);
    expect(component.lista.length).toBe(0);
    expect(component.itensSorteados).toEqual(expect.arrayContaining(['X', 'Y']));
  });

  test('sortear não faz nada se lista vazia ou animando', () => {
    component.lista = [];
    component.sortear();
    expect(component.itensSorteados).toEqual([]);

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
    localStorage.setItem('historicoSorteios', JSON.stringify(['X']));
    component.resetar();
    expect(component.textoLista).toBe('');
    expect(component.lista).toEqual([]);
    expect(component.listaOriginal).toEqual([]);
    expect(component.itensSorteados).toEqual([]);
    expect(component.quantidadeSorteios).toBe(1);
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
  });

  test('resetar sem confirmação mantém estado', () => {
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

  test('playSound toca som com sucesso', async () => {
    const mockAudio = { play: jest.fn().mockResolvedValue(undefined) };
    window.Audio = jest.fn(() => mockAudio) as any;
    await component.playSound();
    expect(mockAudio.play).toHaveBeenCalled();
  });

  test('playSound com erro chama catch e loga warning', async () => {
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

  test('limparHistoricoSorteios limpa apenas histórico com confirmação', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    localStorage.setItem('historicoSorteios', JSON.stringify(['A']));
    component.itensSorteados = ['A'];
    component.limparHistoricoSorteios();
    expect(component.itensSorteados).toEqual([]);
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
  });

  test('limparHistoricoSorteios não faz nada se cancelado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.itensSorteados = ['A'];
    component.limparHistoricoSorteios();
    expect(component.itensSorteados).toEqual(['A']);
  });

  test('alterar quantidadeSorteios limpa sorteios e mostra mensagem', () => {
    jest.useFakeTimers();
    component.itensSorteados = ['João'];
    component.quantidadeSorteios = 2;
    expect(component.itensSorteados).toEqual([]);
    expect(component.mensagem).toBe('A lista de ganhadores foi reiniciada.');
    jest.advanceTimersByTime(3000);
    expect(component.mensagem).toBeNull();
  });

  test('set quantidadeSorteios limpa histórico e exibe mensagem', () => {
    jest.useFakeTimers();
    component.itensSorteados = ['Z'];
    component.quantidadeSorteios = 2;
    expect(component.itensSorteados).toEqual([]);
    expect(localStorage.getItem('historicoSorteios')).toBeNull();
    expect(component.mensagem).toBe('A lista de ganhadores foi reiniciada.');
    jest.advanceTimersByTime(3000);
    expect(component.mensagem).toBeNull();
  });
});
