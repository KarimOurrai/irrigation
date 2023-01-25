import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlot, NewPlot } from '../plot.model';

export type PartialUpdatePlot = Partial<IPlot> & Pick<IPlot, 'id'>;

export type EntityResponseType = HttpResponse<IPlot>;
export type EntityArrayResponseType = HttpResponse<IPlot[]>;

@Injectable({ providedIn: 'root' })
export class PlotService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plots');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(plot: NewPlot): Observable<EntityResponseType> {
    return this.http.post<IPlot>(this.resourceUrl, plot, { observe: 'response' });
  }

  update(plot: IPlot): Observable<EntityResponseType> {
    return this.http.put<IPlot>(`${this.resourceUrl}/${this.getPlotIdentifier(plot)}`, plot, { observe: 'response' });
  }

  partialUpdate(plot: PartialUpdatePlot): Observable<EntityResponseType> {
    return this.http.patch<IPlot>(`${this.resourceUrl}/${this.getPlotIdentifier(plot)}`, plot, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlot>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlot[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlotIdentifier(plot: Pick<IPlot, 'id'>): number {
    return plot.id;
  }

  comparePlot(o1: Pick<IPlot, 'id'> | null, o2: Pick<IPlot, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlotIdentifier(o1) === this.getPlotIdentifier(o2) : o1 === o2;
  }

  addPlotToCollectionIfMissing<Type extends Pick<IPlot, 'id'>>(
    plotCollection: Type[],
    ...plotsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plots: Type[] = plotsToCheck.filter(isPresent);
    if (plots.length > 0) {
      const plotCollectionIdentifiers = plotCollection.map(plotItem => this.getPlotIdentifier(plotItem)!);
      const plotsToAdd = plots.filter(plotItem => {
        const plotIdentifier = this.getPlotIdentifier(plotItem);
        if (plotCollectionIdentifiers.includes(plotIdentifier)) {
          return false;
        }
        plotCollectionIdentifiers.push(plotIdentifier);
        return true;
      });
      return [...plotsToAdd, ...plotCollection];
    }
    return plotCollection;
  }
}
