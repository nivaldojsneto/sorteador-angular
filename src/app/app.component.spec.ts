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

  test('deve carregar a lista corretamente', () => {
    component.textoLista = `João
Maria
Carlos`;
    component.carregarLista();
    expect(component.lista).toEqual(['João', 'Maria', 'Carlos']);
    expect(component.listaOriginal).toEqual(['João', 'Maria', 'Carlos']);
  });

  test('deve sortear um item, remover da lista e disparar efeitos', () => {
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

  test('deve resetar tudo se confirmado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.textoLista = 'Exemplo';
    component.lista = ['X'];
    component.listaOriginal = ['X'];
    component.itemSorteado = 'X';
    component.mostrarLista = true;

    component.resetar();

    expect(component.textoLista).toBe('');
    expect(component.lista).toEqual([]);
    expect(component.listaOriginal).toEqual([]);
    expect(component.itemSorteado).toBe('');
    expect(component.mostrarLista).toBe(false);
  });

  test('não deve resetar se cancelado', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    component.lista = ['A'];
    component.resetar();
    expect(component.lista).toEqual(['A']);
  });
});
