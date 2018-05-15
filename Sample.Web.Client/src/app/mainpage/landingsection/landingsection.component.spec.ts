import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingsectionComponent } from './landingsection.component';

describe('LandingsectionComponent', () => {
  let component: LandingsectionComponent;
  let fixture: ComponentFixture<LandingsectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
