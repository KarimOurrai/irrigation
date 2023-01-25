import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PlotFormService } from './plot-form.service';
import { PlotService } from '../service/plot.service';
import { IPlot } from '../plot.model';
import { ICrop } from 'app/entities/crop/crop.model';
import { CropService } from 'app/entities/crop/service/crop.service';
import { ISensor } from 'app/entities/sensor/sensor.model';
import { SensorService } from 'app/entities/sensor/service/sensor.service';

import { PlotUpdateComponent } from './plot-update.component';

describe('Plot Management Update Component', () => {
  let comp: PlotUpdateComponent;
  let fixture: ComponentFixture<PlotUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let plotFormService: PlotFormService;
  let plotService: PlotService;
  let cropService: CropService;
  let sensorService: SensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PlotUpdateComponent],
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
      .overrideTemplate(PlotUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PlotUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    plotFormService = TestBed.inject(PlotFormService);
    plotService = TestBed.inject(PlotService);
    cropService = TestBed.inject(CropService);
    sensorService = TestBed.inject(SensorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Crop query and add missing value', () => {
      const plot: IPlot = { id: 456 };
      const crop: ICrop = { id: 53142 };
      plot.crop = crop;

      const cropCollection: ICrop[] = [{ id: 74543 }];
      jest.spyOn(cropService, 'query').mockReturnValue(of(new HttpResponse({ body: cropCollection })));
      const additionalCrops = [crop];
      const expectedCollection: ICrop[] = [...additionalCrops, ...cropCollection];
      jest.spyOn(cropService, 'addCropToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plot });
      comp.ngOnInit();

      expect(cropService.query).toHaveBeenCalled();
      expect(cropService.addCropToCollectionIfMissing).toHaveBeenCalledWith(
        cropCollection,
        ...additionalCrops.map(expect.objectContaining)
      );
      expect(comp.cropsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sensor query and add missing value', () => {
      const plot: IPlot = { id: 456 };
      const sensor: ISensor = { id: 87632 };
      plot.sensor = sensor;

      const sensorCollection: ISensor[] = [{ id: 46250 }];
      jest.spyOn(sensorService, 'query').mockReturnValue(of(new HttpResponse({ body: sensorCollection })));
      const additionalSensors = [sensor];
      const expectedCollection: ISensor[] = [...additionalSensors, ...sensorCollection];
      jest.spyOn(sensorService, 'addSensorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ plot });
      comp.ngOnInit();

      expect(sensorService.query).toHaveBeenCalled();
      expect(sensorService.addSensorToCollectionIfMissing).toHaveBeenCalledWith(
        sensorCollection,
        ...additionalSensors.map(expect.objectContaining)
      );
      expect(comp.sensorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const plot: IPlot = { id: 456 };
      const crop: ICrop = { id: 35832 };
      plot.crop = crop;
      const sensor: ISensor = { id: 10898 };
      plot.sensor = sensor;

      activatedRoute.data = of({ plot });
      comp.ngOnInit();

      expect(comp.cropsSharedCollection).toContain(crop);
      expect(comp.sensorsSharedCollection).toContain(sensor);
      expect(comp.plot).toEqual(plot);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlot>>();
      const plot = { id: 123 };
      jest.spyOn(plotFormService, 'getPlot').mockReturnValue(plot);
      jest.spyOn(plotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plot }));
      saveSubject.complete();

      // THEN
      expect(plotFormService.getPlot).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(plotService.update).toHaveBeenCalledWith(expect.objectContaining(plot));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlot>>();
      const plot = { id: 123 };
      jest.spyOn(plotFormService, 'getPlot').mockReturnValue({ id: null });
      jest.spyOn(plotService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plot: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: plot }));
      saveSubject.complete();

      // THEN
      expect(plotFormService.getPlot).toHaveBeenCalled();
      expect(plotService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPlot>>();
      const plot = { id: 123 };
      jest.spyOn(plotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ plot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(plotService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCrop', () => {
      it('Should forward to cropService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cropService, 'compareCrop');
        comp.compareCrop(entity, entity2);
        expect(cropService.compareCrop).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSensor', () => {
      it('Should forward to sensorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sensorService, 'compareSensor');
        comp.compareSensor(entity, entity2);
        expect(sensorService.compareSensor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
