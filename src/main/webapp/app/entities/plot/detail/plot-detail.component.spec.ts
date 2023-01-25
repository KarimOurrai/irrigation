import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlotDetailComponent } from './plot-detail.component';

describe('Plot Management Detail Component', () => {
  let comp: PlotDetailComponent;
  let fixture: ComponentFixture<PlotDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ plot: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PlotDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PlotDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load plot on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.plot).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
