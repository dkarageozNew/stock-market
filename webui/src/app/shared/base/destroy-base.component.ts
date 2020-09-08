import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DestroyBaseComponent implements OnDestroy {

    protected destroy$: Subject<void> = new Subject<void>();

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
