import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BaseComponent } from '../../components/base/base.component';
import { AuthProvider } from '../../providers/auth-provider';
import { EventsHandler } from '../../services/events.handler';

@Component({
    selector: 'app-drawer-main-container',
    templateUrl: './drawer-container.component.html',
    styleUrls: ['./drawer-container.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DrawerContainerComponent
    extends BaseComponent
    implements OnDestroy
{
    mobileQuery: MediaQueryList;

    menuExpanded: boolean = true;

    @Input() padding: string = '25px 50px';
    @Input() headerTitle: string;
    @Input() headerLink: string;
    @Input() headerLinkText: string;
    @Input() headerSmallText: string;
    @Input() hasSearchInput = false;
    @Input() headerSubTitle: string;
    @Input() headerEndIcon: string;
    @Input() searchInputText: string;
    @Input() searchInputDelay = 300;
    @Input() showPendingModifications: boolean = false;
    @Input() searchInputDisabled: boolean = false;

    @Output() inputSearchChange = new EventEmitter<string>();

    @ViewChild(MatDrawer, { static: false }) private drawer: MatDrawer;

    private mobileQueryListener: () => void;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public authProvider: AuthProvider,
    ) {
        super();

        const sub = EventsHandler.ExpandOrCollapseMenuEvent.subscribe(() => {
            this.menuExpanded = !this.menuExpanded;
            this.drawer.toggle();
        });
        this.eventsCollector.collect(sub);
        const sub2 = EventsHandler.CloseLeftMenu.subscribe(() => {
            this.drawer.close();
        });
        this.eventsCollector.collect(sub2);

        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }
}
