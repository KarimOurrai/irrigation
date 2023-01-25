import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CropDetailComponent } from './crop-detail.component';

describe('Crop Management Detail Component', () => {
  let comp: CropDetailComponent;
  let fixture: ComponentFixture<CropDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CropDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ crop: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CropDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CropDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load crop on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.crop).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
