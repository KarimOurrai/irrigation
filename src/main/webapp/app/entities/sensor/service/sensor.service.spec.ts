import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISensor } from '../sensor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sensor.test-samples';

import { SensorService } from './sensor.service';

const requireRestSample: ISensor = {
  ...sampleWithRequiredData,
};

describe('Sensor Service', () => {
  let service: SensorService;
  let httpMock: HttpTestingController;
  let expectedResult: ISensor | ISensor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SensorService);
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

    it('should create a Sensor', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sensor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sensor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sensor', () => {
      const sensor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sensor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sensor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sensor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Sensor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSensorToCollectionIfMissing', () => {
      it('should add a Sensor to an empty array', () => {
        const sensor: ISensor = sampleWithRequiredData;
        expectedResult = service.addSensorToCollectionIfMissing([], sensor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sensor);
      });

      it('should not add a Sensor to an array that contains it', () => {
        const sensor: ISensor = sampleWithRequiredData;
        const sensorCollection: ISensor[] = [
          {
            ...sensor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSensorToCollectionIfMissing(sensorCollection, sensor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sensor to an array that doesn't contain it", () => {
        const sensor: ISensor = sampleWithRequiredData;
        const sensorCollection: ISensor[] = [sampleWithPartialData];
        expectedResult = service.addSensorToCollectionIfMissing(sensorCollection, sensor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sensor);
      });

      it('should add only unique Sensor to an array', () => {
        const sensorArray: ISensor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sensorCollection: ISensor[] = [sampleWithRequiredData];
        expectedResult = service.addSensorToCollectionIfMissing(sensorCollection, ...sensorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sensor: ISensor = sampleWithRequiredData;
        const sensor2: ISensor = sampleWithPartialData;
        expectedResult = service.addSensorToCollectionIfMissing([], sensor, sensor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sensor);
        expect(expectedResult).toContain(sensor2);
      });

      it('should accept null and undefined values', () => {
        const sensor: ISensor = sampleWithRequiredData;
        expectedResult = service.addSensorToCollectionIfMissing([], null, sensor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sensor);
      });

      it('should return initial array if no Sensor is added', () => {
        const sensorCollection: ISensor[] = [sampleWithRequiredData];
        expectedResult = service.addSensorToCollectionIfMissing(sensorCollection, undefined, null);
        expect(expectedResult).toEqual(sensorCollection);
      });
    });

    describe('compareSensor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSensor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSensor(entity1, entity2);
        const compareResult2 = service.compareSensor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSensor(entity1, entity2);
        const compareResult2 = service.compareSensor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSensor(entity1, entity2);
        const compareResult2 = service.compareSensor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
