import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICrop, NewCrop } from '../crop.model';

export type PartialUpdateCrop = Partial<ICrop> & Pick<ICrop, 'id'>;

export type EntityResponseType = HttpResponse<ICrop>;
export type EntityArrayResponseType = HttpResponse<ICrop[]>;

@Injectable({ providedIn: 'root' })
export class CropService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/crops');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(crop: NewCrop): Observable<EntityResponseType> {
    return this.http.post<ICrop>(this.resourceUrl, crop, { observe: 'response' });
  }

  update(crop: ICrop): Observable<EntityResponseType> {
    return this.http.put<ICrop>(`${this.resourceUrl}/${this.getCropIdentifier(crop)}`, crop, { observe: 'response' });
  }

  partialUpdate(crop: PartialUpdateCrop): Observable<EntityResponseType> {
    return this.http.patch<ICrop>(`${this.resourceUrl}/${this.getCropIdentifier(crop)}`, crop, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICrop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICrop[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCropIdentifier(crop: Pick<ICrop, 'id'>): number {
    return crop.id;
  }

  compareCrop(o1: Pick<ICrop, 'id'> | null, o2: Pick<ICrop, 'id'> | null): boolean {
    return o1 && o2 ? this.getCropIdentifier(o1) === this.getCropIdentifier(o2) : o1 === o2;
  }

  addCropToCollectionIfMissing<Type extends Pick<ICrop, 'id'>>(
    cropCollection: Type[],
    ...cropsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const crops: Type[] = cropsToCheck.filter(isPresent);
    if (crops.length > 0) {
      const cropCollectionIdentifiers = cropCollection.map(cropItem => this.getCropIdentifier(cropItem)!);
      const cropsToAdd = crops.filter(cropItem => {
        const cropIdentifier = this.getCropIdentifier(cropItem);
        if (cropCollectionIdentifiers.includes(cropIdentifier)) {
          return false;
        }
        cropCollectionIdentifiers.push(cropIdentifier);
        return true;
      });
      return [...cropsToAdd, ...cropCollection];
    }
    return cropCollection;
  }
}
