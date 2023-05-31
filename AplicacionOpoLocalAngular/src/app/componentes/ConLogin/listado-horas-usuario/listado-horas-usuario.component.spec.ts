import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHorasUsuarioComponent } from './listado-horas-usuario.component';

describe('ListadoHorasUsuarioComponent', () => {
  let component: ListadoHorasUsuarioComponent;
  let fixture: ComponentFixture<ListadoHorasUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoHorasUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoHorasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
