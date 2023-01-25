import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../plot.test-samples';

import { PlotFormService } from './plot-form.service';

describe('Plot Form Service', () => {
  let service: PlotFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlotFormService);
  });

  describe('Service methods', () => {
    describe('createPlotFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPlotFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cultivatedArea: expect.any(Object),
            name: expect.any(Object),
            location: expect.any(Object),
            crop: expect.any(Object),
            sensor: expect.any(Object),
          })
        );
      });

      it('passing IPlot should create a new form with FormGroup', () => {
        const formGroup = service.createPlotFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cultivatedArea: expect.any(Object),
            name: expect.any(Object),
            location: expect.any(Object),
            crop: expect.any(Object),
            sensor: expect.any(Object),
          })
        );
      });
    });

    describe('getPlot', () => {
      it('should return NewPlot for default Plot initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPlotFormGroup(sampleWithNewData);

        const plot = service.getPlot(formGroup) as any;

        expect(plot).toMatchObject(sampleWithNewData);
      });

      it('should return NewPlot for empty Plot initial value', () => {
        const formGroup = service.createPlotFormGroup();

        const plot = service.getPlot(formGroup) as any;

        expect(plot).toMatchObject({});
      });

      it('should return IPlot', () => {
        const formGroup = service.createPlotFormGroup(sampleWithRequiredData);

        const plot = service.getPlot(formGroup) as any;

        expect(plot).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPlot should not enable id FormControl', () => {
        const formGroup = service.createPlotFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPlot should disable id FormControl', () => {
        const formGroup = service.createPlotFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
