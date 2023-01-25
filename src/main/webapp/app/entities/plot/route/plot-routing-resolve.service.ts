import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlot } from '../plot.model';
import { PlotService } from '../service/plot.service';

@Injectable({ providedIn: 'root' })
export class PlotRoutingResolveService implements Resolve<IPlot | null> {
  constructor(protected service: PlotService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlot | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plot: HttpResponse<IPlot>) => {
          if (plot.body) {
            return of(plot.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
