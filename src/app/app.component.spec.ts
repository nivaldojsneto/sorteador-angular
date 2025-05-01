import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

jest.mock('canvas-confetti', () => {
  return jest.fn().mockImplementation(() => {});
});

describe('AppComponent', () => {
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

  test('deve carregar a lista corretamente com \\n', () => {
    component.textoLista = `João
Maria
Carlos`;
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.listaOriginal).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.itemSorteado).toBe('');
  });

  test('deve carregar a lista corretamente com \\r\\n', () => {
    component.textoLista = 'João\r\nMaria\r\nCarlos';
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
  });

  test('deve ignorar linhas em branco e espaços', () => {
    component.textoLista = `João\n\n Maria \n \nCarlos `;
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
  });

  test('deve sortear um item e reduzir a lista', () => {
    const playSoundSpy = jest.spyOn(component, 'playSound');
    const playConfeteSpy = jest.spyOn(component as any, 'playConfete');

    component.lista = ['A', 'B', 'C'];
    component.listaOriginal = [...component.lista];
    component.sortear();

    expect(component.itemSorteado).toBeDefined();
    expect(component.lista.length).toBe(2);
    expect(playSoundSpy).toHaveBeenCalled();
    expect(playConfeteSpy).toHaveBeenCalled();
    expect(component.animando).toBe(true);
  });

  test('não deve sortear com lista vazia', () => {
    component.lista = [];
    component.sortear();
    expect(component.itemSorteado).toBe('');
  });

  test('não deve sortear se animando', () => {
    component.lista = ['A', 'B'];
    component.animando = true;
    component.sortear();
    expect(component.lista.length).toBe(2);
    expect(component.itemSorteado).toBe('');
  });

  test('deve resetar tudo se confirmado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.textoLista = 'Teste';
    component.lista = ['A'];
    component.listaOriginal = ['A'];
    component.itemSorteado = 'A';

    component.resetar();

    expect(component.textoLista).toBe('');
    expect(component.lista).toEqual([]);
    expect(component.listaOriginal).toEqual([]);
    expect(component.itemSorteado).toBe('');
  });

  test('não deve resetar se cancelado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.lista = ['A'];
    component.resetar();
    expect(component.lista).toEqual(['A']);
  });

  test('deve executar onPaste e carregar lista', () => {
    const carregarSpy = jest.spyOn(component, 'carregarLista');
    component.textoLista = 'Teste';
    component.onPaste();
    jest.runAllTimers(); // necessário para simular setTimeout
    expect(carregarSpy).toHaveBeenCalled();
  });

  test('playSound deve lidar com falha de reprodução', () => {
    const audioMock = {
      play: jest.fn().mockRejectedValue(new Error('Falha')),
    };
    window.Audio = jest.fn(() => audioMock) as any;
    component.playSound();
    expect(audioMock.play).toHaveBeenCalled();
  });
});
