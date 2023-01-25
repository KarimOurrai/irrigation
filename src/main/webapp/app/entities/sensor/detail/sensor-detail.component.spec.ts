import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SensorDetailComponent } from './sensor-detail.component';

describe('Sensor Management Detail Component', () => {
  let comp: SensorDetailComponent;
  let fixture: ComponentFixture<SensorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sensor: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SensorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SensorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sensor on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sensor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
