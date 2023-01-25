import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CropFormService } from './crop-form.service';
import { CropService } from '../service/crop.service';
import { ICrop } from '../crop.model';

import { CropUpdateComponent } from './crop-update.component';

describe('Crop Management Update Component', () => {
  let comp: CropUpdateComponent;
  let fixture: ComponentFixture<CropUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cropFormService: CropFormService;
  let cropService: CropService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CropUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CropUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CropUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cropFormService = TestBed.inject(CropFormService);
    cropService = TestBed.inject(CropService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const crop: ICrop = { id: 456 };

      activatedRoute.data = of({ crop });
      comp.ngOnInit();

      expect(comp.crop).toEqual(crop);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrop>>();
      const crop = { id: 123 };
      jest.spyOn(cropFormService, 'getCrop').mockReturnValue(crop);
      jest.spyOn(cropService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crop }));
      saveSubject.complete();

      // THEN
      expect(cropFormService.getCrop).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cropService.update).toHaveBeenCalledWith(expect.objectContaining(crop));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrop>>();
      const crop = { id: 123 };
      jest.spyOn(cropFormService, 'getCrop').mockReturnValue({ id: null });
      jest.spyOn(cropService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crop: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crop }));
      saveSubject.complete();

      // THEN
      expect(cropFormService.getCrop).toHaveBeenCalled();
      expect(cropService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrop>>();
      const crop = { id: 123 };
      jest.spyOn(cropService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cropService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
