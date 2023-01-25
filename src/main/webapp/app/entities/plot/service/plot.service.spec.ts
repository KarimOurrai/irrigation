import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlot } from '../plot.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../plot.test-samples';

import { PlotService } from './plot.service';

const requireRestSample: IPlot = {
  ...sampleWithRequiredData,
};

describe('Plot Service', () => {
  let service: PlotService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlot | IPlot[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlotService);
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

    it('should create a Plot', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const plot = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(plot).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plot', () => {
      const plot = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(plot).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plot', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plot', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Plot', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlotToCollectionIfMissing', () => {
      it('should add a Plot to an empty array', () => {
        const plot: IPlot = sampleWithRequiredData;
        expectedResult = service.addPlotToCollectionIfMissing([], plot);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plot);
      });

      it('should not add a Plot to an array that contains it', () => {
        const plot: IPlot = sampleWithRequiredData;
        const plotCollection: IPlot[] = [
          {
            ...plot,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlotToCollectionIfMissing(plotCollection, plot);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plot to an array that doesn't contain it", () => {
        const plot: IPlot = sampleWithRequiredData;
        const plotCollection: IPlot[] = [sampleWithPartialData];
        expectedResult = service.addPlotToCollectionIfMissing(plotCollection, plot);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plot);
      });

      it('should add only unique Plot to an array', () => {
        const plotArray: IPlot[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plotCollection: IPlot[] = [sampleWithRequiredData];
        expectedResult = service.addPlotToCollectionIfMissing(plotCollection, ...plotArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plot: IPlot = sampleWithRequiredData;
        const plot2: IPlot = sampleWithPartialData;
        expectedResult = service.addPlotToCollectionIfMissing([], plot, plot2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plot);
        expect(expectedResult).toContain(plot2);
      });

      it('should accept null and undefined values', () => {
        const plot: IPlot = sampleWithRequiredData;
        expectedResult = service.addPlotToCollectionIfMissing([], null, plot, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plot);
      });

      it('should return initial array if no Plot is added', () => {
        const plotCollection: IPlot[] = [sampleWithRequiredData];
        expectedResult = service.addPlotToCollectionIfMissing(plotCollection, undefined, null);
        expect(expectedResult).toEqual(plotCollection);
      });
    });

    describe('comparePlot', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlot(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlot(entity1, entity2);
        const compareResult2 = service.comparePlot(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlot(entity1, entity2);
        const compareResult2 = service.comparePlot(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlot(entity1, entity2);
        const compareResult2 = service.comparePlot(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
