import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';
import { AppComponent } from './app.component';

jest.mock('canvas-confetti', () => jest.fn());
jest.setTimeout(10000);
jest.useFakeTimers();

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

  describe('Inicialização e tema', () => {
    test('deve criar o componente e inicializar tema/estado', () => {
      localStorage.setItem('historicoSorteios', JSON.stringify(['João']));
      localStorage.setItem('tema', 'dark');
      const temaSpy = jest.spyOn(component, 'atualizarTema');
      component.ngOnInit();
      expect(component.itensSorteados).toEqual(['João']);
      expect(temaSpy).toHaveBeenCalled();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('altera tema corretamente e salva no localStorage', () => {
      component.temaEscuroAtivo = false;
      component.alternarTema();
      expect(component.temaEscuroAtivo).toBe(true);
      expect(localStorage.getItem('tema')).toBe('dark');
      component.alternarTema();
      expect(localStorage.getItem('tema')).toBe('light');
    });

    test('atualizarTema aplica e remove dark no html', () => {
      component.temaEscuroAtivo = true;
      component.atualizarTema();
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      component.temaEscuroAtivo = false;
      component.atualizarTema();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Manipulação da lista', () => {
    test('onInput limpa timeout anterior antes de configurar novo', () => {
      component.typingTimeout = setTimeout(() => {}, 5000);
      const clearSpy = jest.spyOn(global, 'clearTimeout');
      component.textoLista = 'Novo texto';
      component.onInput();
      expect(clearSpy).toHaveBeenCalledWith(expect.any(Number));
    });
    test('carregarLista limpa itens e formata texto corretamente', () => {
      component.textoLista = 'Ana\nCarlos\n \nMaria';
      component.itensSorteados = ['X'];
      component.carregarLista();
      expect(component.lista).toEqual(['Ana', 'Carlos', 'Maria']);
      expect(component.textoLista).toBe('Ana\nCarlos\nMaria');
      expect(component.itensSorteados).toEqual([]);
    });

    test('onInput dispara debounce para carregarLista', () => {
      const spy = jest.spyOn(component, 'carregarLista');
      component.textoLista = 'Teste';
      component.onInput();
      jest.advanceTimersByTime(500);
      expect(spy).toHaveBeenCalled();
    });

    test('onPaste chama carregarLista', () => {
      const spy = jest.spyOn(component, 'carregarLista').mockImplementation(() => {});
      component.onPaste();
      jest.runAllTimers();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Sorteio', () => {
    test('sortear percorre lista animada e salva sorteados', async () => {
      jest
        .spyOn(
          AppComponent.prototype as unknown as { delay: (ms: number) => Promise<void> },
          'delay'
        )
        .mockResolvedValue(undefined);

      component.lista = Array.from({ length: 10 }, (_, i) => `Nome${i}`);
      component.listaOriginal = [...component.lista];
      component.quantidadeSorteios = 2;

      const playSpy = jest.spyOn(component, 'playSound').mockImplementation(async () => {});
      const confettiSpy = jest.spyOn(
        component as unknown as { playConfete: () => void },
        'playConfete'
      );

      const sortearPromise = component.sortear();
      jest.runAllTimers();
      await sortearPromise;
      jest.runAllTimers();
      await Promise.resolve();

      expect(component.itensSorteados.length).toBe(2);
      expect(component.lista.length).toBe(8);
      expect(component.progresso).toBe(100);
      expect(component.animando).toBe(false);
      expect(playSpy).toHaveBeenCalled();
      expect(confettiSpy).toHaveBeenCalled();
    });

    test('sortear ignora se lista vazia ou animando', async () => {
      component.lista = [];
      component.animando = false;
      const sortearPromise = component.sortear();
      jest.runAllTimers();
      await sortearPromise;
      jest.runAllTimers();
      expect(component.itensSorteados).toEqual([]);

      component.lista = ['A'];
      component.animando = true;
      await component.sortear();
      expect(component.itensSorteados).toEqual([]);
    });
  });

  describe('Reset e histórico', () => {
    test('resetar limpa dados com confirmação', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      component.textoLista = 'a';
      component.lista = ['a'];
      component.listaOriginal = ['a'];
      component.itensSorteados = ['a'];
      component.progresso = 100;
      component.resetar();
      expect(component.textoLista).toBe('');
      expect(component.lista.length).toBe(0);
      expect(component.progresso).toBe(0);
    });

    test('resetar não faz nada se não confirmar', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      component.lista = ['Z'];
      component.textoLista = 'Z';
      component.listaOriginal = ['Z'];
      component.itensSorteados = ['Z'];
      component.progresso = 50;
      component.resetar();
      expect(component.lista).toEqual(['Z']);
      expect(component.textoLista).toBe('Z');
      expect(component.listaOriginal).toEqual(['Z']);
      expect(component.itensSorteados).toEqual(['Z']);
      expect(component.progresso).toBe(50);
    });

    test('limparHistoricoSorteios com e sem confirmação', () => {
      jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
      component.itensSorteados = ['A'];
      component.limparHistoricoSorteios();
      expect(component.itensSorteados).toEqual(['A']);

      jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
      component.itensSorteados = ['B'];
      localStorage.setItem('historicoSorteios', '["B"]');
      component.limparHistoricoSorteios();
      expect(component.itensSorteados).toEqual([]);
      expect(localStorage.getItem('historicoSorteios')).toBeNull();
    });
  });

  describe('Outros comportamentos', () => {
    test('delay retorna após timeout simulado', async () => {
      const delayPromise = (component as unknown as { delay(ms: number): Promise<void> }).delay(10);
      jest.advanceTimersByTime(10);
      await delayPromise;
      expect(typeof delayPromise.then).toBe('function');
    });
    test('quantidadeSorteios setter reinicia itens e mensagem temporária', () => {
      component.mensagemTimeout = setTimeout(() => {}, 1000);
      component.itensSorteados = ['X'];
      localStorage.setItem('historicoSorteios', '[]');
      component.quantidadeSorteios = 5;
      expect(component.itensSorteados).toEqual([]);
      expect(component.mensagem).toBeTruthy();
      jest.advanceTimersByTime(3000);
      expect(component.mensagem).toBeNull();
    });

    test('getter quantidadeSorteios retorna corretamente', () => {
      component.quantidadeSorteios = 3;
      expect(component.quantidadeSorteios).toBe(3);
    });

    test('itensFiltrados retorna apenas nomes válidos', () => {
      component.itensSorteados = ['João', '', ' ', 'Maria'];
      expect(component.itensFiltrados).toEqual(['João', 'Maria']);
    });

    test('playSound executa com sucesso e trata erro', async () => {
      const mockAudio = { play: jest.fn().mockResolvedValue(undefined) };
      window.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;
      await component.playSound();
      expect(mockAudio.play).toHaveBeenCalled();

      const erro = new Error('Erro simulado');
      const erroAudio = { play: jest.fn().mockRejectedValueOnce(erro) };
      window.Audio = jest.fn(() => erroAudio) as unknown as typeof Audio;
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      await component.playSound();
      expect(warn).toHaveBeenCalledWith('Erro ao tocar som:', erro);
    });

    test('playConfete aciona canvas-confetti', () => {
      component.playConfete();
      expect(confetti).toHaveBeenCalled();
    });
  });
});
