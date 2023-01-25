import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SensorFormService } from './sensor-form.service';
import { SensorService } from '../service/sensor.service';
import { ISensor } from '../sensor.model';

import { SensorUpdateComponent } from './sensor-update.component';

describe('Sensor Management Update Component', () => {
  let comp: SensorUpdateComponent;
  let fixture: ComponentFixture<SensorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sensorFormService: SensorFormService;
  let sensorService: SensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SensorUpdateComponent],
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
      .overrideTemplate(SensorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SensorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sensorFormService = TestBed.inject(SensorFormService);
    sensorService = TestBed.inject(SensorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sensor: ISensor = { id: 456 };

      activatedRoute.data = of({ sensor });
      comp.ngOnInit();

      expect(comp.sensor).toEqual(sensor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISensor>>();
      const sensor = { id: 123 };
      jest.spyOn(sensorFormService, 'getSensor').mockReturnValue(sensor);
      jest.spyOn(sensorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sensor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sensor }));
      saveSubject.complete();

      // THEN
      expect(sensorFormService.getSensor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sensorService.update).toHaveBeenCalledWith(expect.objectContaining(sensor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISensor>>();
      const sensor = { id: 123 };
      jest.spyOn(sensorFormService, 'getSensor').mockReturnValue({ id: null });
      jest.spyOn(sensorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sensor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sensor }));
      saveSubject.complete();

      // THEN
      expect(sensorFormService.getSensor).toHaveBeenCalled();
      expect(sensorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISensor>>();
      const sensor = { id: 123 };
      jest.spyOn(sensorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sensor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sensorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
