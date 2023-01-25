import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sensor.test-samples';

import { SensorFormService } from './sensor-form.service';

describe('Sensor Form Service', () => {
  let service: SensorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorFormService);
  });

  describe('Service methods', () => {
    describe('createSensorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSensorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });

      it('passing ISensor should create a new form with FormGroup', () => {
        const formGroup = service.createSensorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            status: expect.any(Object),
          })
        );
      });
    });

    describe('getSensor', () => {
      it('should return NewSensor for default Sensor initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSensorFormGroup(sampleWithNewData);

        const sensor = service.getSensor(formGroup) as any;

        expect(sensor).toMatchObject(sampleWithNewData);
      });

      it('should return NewSensor for empty Sensor initial value', () => {
        const formGroup = service.createSensorFormGroup();

        const sensor = service.getSensor(formGroup) as any;

        expect(sensor).toMatchObject({});
      });

      it('should return ISensor', () => {
        const formGroup = service.createSensorFormGroup(sampleWithRequiredData);

        const sensor = service.getSensor(formGroup) as any;

        expect(sensor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISensor should not enable id FormControl', () => {
        const formGroup = service.createSensorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSensor should disable id FormControl', () => {
        const formGroup = service.createSensorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
