import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLoggeadoComponent } from './navbar-loggeado.component';

describe('NavbarLoggeadoComponent', () => {
  let component: NavbarLoggeadoComponent;
  let fixture: ComponentFixture<NavbarLoggeadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarLoggeadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLoggeadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
