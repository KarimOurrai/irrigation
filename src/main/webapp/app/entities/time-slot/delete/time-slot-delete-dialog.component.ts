import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITimeSlot } from '../time-slot.model';
import { TimeSlotService } from '../service/time-slot.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './time-slot-delete-dialog.component.html',
})
export class TimeSlotDeleteDialogComponent {
  timeSlot?: ITimeSlot;

  constructor(protected timeSlotService: TimeSlotService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.timeSlotService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
