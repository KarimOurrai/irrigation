import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../crop.test-samples';

import { CropFormService } from './crop-form.service';

describe('Crop Form Service', () => {
  let service: CropFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropFormService);
  });

  describe('Service methods', () => {
    describe('createCropFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCropFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            waterAmount: expect.any(Object),
            duration: expect.any(Object),
            area: expect.any(Object),
          })
        );
      });

      it('passing ICrop should create a new form with FormGroup', () => {
        const formGroup = service.createCropFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            waterAmount: expect.any(Object),
            duration: expect.any(Object),
            area: expect.any(Object),
          })
        );
      });
    });

    describe('getCrop', () => {
      it('should return NewCrop for default Crop initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCropFormGroup(sampleWithNewData);

        const crop = service.getCrop(formGroup) as any;

        expect(crop).toMatchObject(sampleWithNewData);
      });

      it('should return NewCrop for empty Crop initial value', () => {
        const formGroup = service.createCropFormGroup();

        const crop = service.getCrop(formGroup) as any;

        expect(crop).toMatchObject({});
      });

      it('should return ICrop', () => {
        const formGroup = service.createCropFormGroup(sampleWithRequiredData);

        const crop = service.getCrop(formGroup) as any;

        expect(crop).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICrop should not enable id FormControl', () => {
        const formGroup = service.createCropFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCrop should disable id FormControl', () => {
        const formGroup = service.createCropFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
