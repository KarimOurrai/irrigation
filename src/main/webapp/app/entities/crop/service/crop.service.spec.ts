import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICrop } from '../crop.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../crop.test-samples';

import { CropService } from './crop.service';

const requireRestSample: ICrop = {
  ...sampleWithRequiredData,
};

describe('Crop Service', () => {
  let service: CropService;
  let httpMock: HttpTestingController;
  let expectedResult: ICrop | ICrop[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CropService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Crop', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const crop = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(crop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Crop', () => {
      const crop = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(crop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Crop', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Crop', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Crop', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCropToCollectionIfMissing', () => {
      it('should add a Crop to an empty array', () => {
        const crop: ICrop = sampleWithRequiredData;
        expectedResult = service.addCropToCollectionIfMissing([], crop);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crop);
      });

      it('should not add a Crop to an array that contains it', () => {
        const crop: ICrop = sampleWithRequiredData;
        const cropCollection: ICrop[] = [
          {
            ...crop,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCropToCollectionIfMissing(cropCollection, crop);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Crop to an array that doesn't contain it", () => {
        const crop: ICrop = sampleWithRequiredData;
        const cropCollection: ICrop[] = [sampleWithPartialData];
        expectedResult = service.addCropToCollectionIfMissing(cropCollection, crop);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crop);
      });

      it('should add only unique Crop to an array', () => {
        const cropArray: ICrop[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cropCollection: ICrop[] = [sampleWithRequiredData];
        expectedResult = service.addCropToCollectionIfMissing(cropCollection, ...cropArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const crop: ICrop = sampleWithRequiredData;
        const crop2: ICrop = sampleWithPartialData;
        expectedResult = service.addCropToCollectionIfMissing([], crop, crop2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crop);
        expect(expectedResult).toContain(crop2);
      });

      it('should accept null and undefined values', () => {
        const crop: ICrop = sampleWithRequiredData;
        expectedResult = service.addCropToCollectionIfMissing([], null, crop, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crop);
      });

      it('should return initial array if no Crop is added', () => {
        const cropCollection: ICrop[] = [sampleWithRequiredData];
        expectedResult = service.addCropToCollectionIfMissing(cropCollection, undefined, null);
        expect(expectedResult).toEqual(cropCollection);
      });
    });

    describe('compareCrop', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCrop(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCrop(entity1, entity2);
        const compareResult2 = service.compareCrop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCrop(entity1, entity2);
        const compareResult2 = service.compareCrop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCrop(entity1, entity2);
        const compareResult2 = service.compareCrop(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
