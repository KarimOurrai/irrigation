import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TimeSlotFormService } from './time-slot-form.service';
import { TimeSlotService } from '../service/time-slot.service';
import { ITimeSlot } from '../time-slot.model';
import { IPlot } from 'app/entities/plot/plot.model';
import { PlotService } from 'app/entities/plot/service/plot.service';

import { TimeSlotUpdateComponent } from './time-slot-update.component';

describe('TimeSlot Management Update Component', () => {
  let comp: TimeSlotUpdateComponent;
  let fixture: ComponentFixture<TimeSlotUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let timeSlotFormService: TimeSlotFormService;
  let timeSlotService: TimeSlotService;
  let plotService: PlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TimeSlotUpdateComponent],
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
      .overrideTemplate(TimeSlotUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TimeSlotUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    timeSlotFormService = TestBed.inject(TimeSlotFormService);
    timeSlotService = TestBed.inject(TimeSlotService);
    plotService = TestBed.inject(PlotService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Plot query and add missing value', () => {
      const timeSlot: ITimeSlot = { id: 456 };
      const plot: IPlot = { id: 73850 };
      timeSlot.plot = plot;
      const plot: IPlot = { id: 83364 };
      timeSlot.plot = plot;

      const plotCollection: IPlot[] = [{ id: 38489 }];
      jest.spyOn(plotService, 'query').mockReturnValue(of(new HttpResponse({ body: plotCollection })));
      const additionalPlots = [plot, plot];
      const expectedCollection: IPlot[] = [...additionalPlots, ...plotCollection];
      jest.spyOn(plotService, 'addPlotToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ timeSlot });
      comp.ngOnInit();

      expect(plotService.query).toHaveBeenCalled();
      expect(plotService.addPlotToCollectionIfMissing).toHaveBeenCalledWith(
        plotCollection,
        ...additionalPlots.map(expect.objectContaining)
      );
      expect(comp.plotsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const timeSlot: ITimeSlot = { id: 456 };
      const plot: IPlot = { id: 97589 };
      timeSlot.plot = plot;
      const plot: IPlot = { id: 99455 };
      timeSlot.plot = plot;

      activatedRoute.data = of({ timeSlot });
      comp.ngOnInit();

      expect(comp.plotsSharedCollection).toContain(plot);
      expect(comp.plotsSharedCollection).toContain(plot);
      expect(comp.timeSlot).toEqual(timeSlot);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeSlot>>();
      const timeSlot = { id: 123 };
      jest.spyOn(timeSlotFormService, 'getTimeSlot').mockReturnValue(timeSlot);
      jest.spyOn(timeSlotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeSlot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeSlot }));
      saveSubject.complete();

      // THEN
      expect(timeSlotFormService.getTimeSlot).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(timeSlotService.update).toHaveBeenCalledWith(expect.objectContaining(timeSlot));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeSlot>>();
      const timeSlot = { id: 123 };
      jest.spyOn(timeSlotFormService, 'getTimeSlot').mockReturnValue({ id: null });
      jest.spyOn(timeSlotService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeSlot: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: timeSlot }));
      saveSubject.complete();

      // THEN
      expect(timeSlotFormService.getTimeSlot).toHaveBeenCalled();
      expect(timeSlotService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITimeSlot>>();
      const timeSlot = { id: 123 };
      jest.spyOn(timeSlotService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ timeSlot });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(timeSlotService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePlot', () => {
      it('Should forward to plotService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(plotService, 'comparePlot');
        comp.comparePlot(entity, entity2);
        expect(plotService.comparePlot).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
