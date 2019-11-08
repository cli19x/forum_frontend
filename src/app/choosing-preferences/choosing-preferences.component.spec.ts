import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosingPreferencesComponent } from './choosing-preferences.component';

describe('ChoosingPreferencesComponent', () => {
  let component: ChoosingPreferencesComponent;
  let fixture: ComponentFixture<ChoosingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosingPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
