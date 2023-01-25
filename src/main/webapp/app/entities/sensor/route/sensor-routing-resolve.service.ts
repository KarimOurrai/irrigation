import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISensor } from '../sensor.model';
import { SensorService } from '../service/sensor.service';

@Injectable({ providedIn: 'root' })
export class SensorRoutingResolveService implements Resolve<ISensor | null> {
  constructor(protected service: SensorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISensor | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sensor: HttpResponse<ISensor>) => {
          if (sensor.body) {
            return of(sensor.body);
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
