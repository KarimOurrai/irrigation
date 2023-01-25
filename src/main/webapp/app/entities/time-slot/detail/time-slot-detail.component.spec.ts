import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimeSlotDetailComponent } from './time-slot-detail.component';

describe('TimeSlot Management Detail Component', () => {
  let comp: TimeSlotDetailComponent;
  let fixture: ComponentFixture<TimeSlotDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ timeSlot: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TimeSlotDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TimeSlotDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load timeSlot on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.timeSlot).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
