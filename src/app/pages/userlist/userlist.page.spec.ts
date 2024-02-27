import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserlistPage } from './userlist.page';

describe('UserlistPage', () => {
  let component: UserlistPage;
  let fixture: ComponentFixture<UserlistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
