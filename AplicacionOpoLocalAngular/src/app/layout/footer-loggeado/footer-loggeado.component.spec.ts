import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLoggeadoComponent } from './footer-loggeado.component';

describe('FooterLoggeadoComponent', () => {
  let component: FooterLoggeadoComponent;
  let fixture: ComponentFixture<FooterLoggeadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterLoggeadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterLoggeadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
