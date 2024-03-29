import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { EmptyScreenPage } from './empty-screen.page';

describe('EmptyScreenPage', () => {
  let component: EmptyScreenPage;
  let fixture: ComponentFixture<EmptyScreenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmptyScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
