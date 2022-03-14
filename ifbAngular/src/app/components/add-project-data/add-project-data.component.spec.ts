import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectDataComponent } from './add-project-data.component';

describe('AddProjectDataComponent', () => {
  let component: AddProjectDataComponent;
  let fixture: ComponentFixture<AddProjectDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
