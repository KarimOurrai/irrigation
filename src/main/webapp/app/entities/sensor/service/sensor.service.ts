import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISensor, NewSensor } from '../sensor.model';

export type PartialUpdateSensor = Partial<ISensor> & Pick<ISensor, 'id'>;

export type EntityResponseType = HttpResponse<ISensor>;
export type EntityArrayResponseType = HttpResponse<ISensor[]>;

@Injectable({ providedIn: 'root' })
export class SensorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sensors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sensor: NewSensor): Observable<EntityResponseType> {
    return this.http.post<ISensor>(this.resourceUrl, sensor, { observe: 'response' });
  }

  update(sensor: ISensor): Observable<EntityResponseType> {
    return this.http.put<ISensor>(`${this.resourceUrl}/${this.getSensorIdentifier(sensor)}`, sensor, { observe: 'response' });
  }

  partialUpdate(sensor: PartialUpdateSensor): Observable<EntityResponseType> {
    return this.http.patch<ISensor>(`${this.resourceUrl}/${this.getSensorIdentifier(sensor)}`, sensor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISensor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISensor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSensorIdentifier(sensor: Pick<ISensor, 'id'>): number {
    return sensor.id;
  }

  compareSensor(o1: Pick<ISensor, 'id'> | null, o2: Pick<ISensor, 'id'> | null): boolean {
    return o1 && o2 ? this.getSensorIdentifier(o1) === this.getSensorIdentifier(o2) : o1 === o2;
  }

  addSensorToCollectionIfMissing<Type extends Pick<ISensor, 'id'>>(
    sensorCollection: Type[],
    ...sensorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sensors: Type[] = sensorsToCheck.filter(isPresent);
    if (sensors.length > 0) {
      const sensorCollectionIdentifiers = sensorCollection.map(sensorItem => this.getSensorIdentifier(sensorItem)!);
      const sensorsToAdd = sensors.filter(sensorItem => {
        const sensorIdentifier = this.getSensorIdentifier(sensorItem);
        if (sensorCollectionIdentifiers.includes(sensorIdentifier)) {
          return false;
        }
        sensorCollectionIdentifiers.push(sensorIdentifier);
        return true;
      });
      return [...sensorsToAdd, ...sensorCollection];
    }
    return sensorCollection;
  }
}
