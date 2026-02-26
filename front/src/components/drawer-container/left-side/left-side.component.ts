import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { BrowserHelpers } from 'nextalys-js-helpers/dist/browser-helpers';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'app-left-side',
    templateUrl: './left-side.component.html',
    styleUrls: ['./left-side.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LeftSideComponent extends BaseComponent implements OnInit {
    @ViewChild('menuWrapper', { static: false })
    menuWrapper: ElementRef;

    constructor() {
        super();
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.bindExpandButtons();
    }

    bindExpandButtons() {
        if (!this.menuWrapper || !this.menuWrapper.nativeElement) {
            return;
        }

        const list = this.menuWrapper.nativeElement as HTMLUListElement;
        const buttons =
            BrowserHelpers.getHtmlChildrenRecursive<HTMLButtonElement>(
                list,
                'button',
                'btn-expandable-section',
            );

        if (!buttons || buttons.length === 0) {
            return;
        }

        for (const button of buttons) {
            this.eventsCollector.addAndCollectListener(button, 'click', () => {
                this.buttonMenuExpandClick(button);
            });
            button.innerHTML +=
                '<mat-icon style="margin-right:0" role="img" class="mat-icon menu-expand-icon material-icons" aria-hidden="true">expand_more</mat-icon>';
        }

        this.setTimeout(() => {
            for (const button of buttons) {
                const ulList = button.nextElementSibling as HTMLUListElement;
                const links =
                    BrowserHelpers.getHtmlChildrenRecursive<HTMLLinkElement>(
                        ulList,
                        'a',
                    );

                for (const link of links) {
                    if (
                        link.classList &&
                        link.classList.contains('active-route')
                    ) {
                        this.expandOrReduceMenuSection('expand', button);
                        break;
                    }
                }
            }
        }, 400);
    }

    expandOrReduceMenuSection(
        expandOrReduce: 'auto' | 'expand' | 'reduce',
        button: HTMLButtonElement,
    ) {
        if (!button) {
            return;
        }

        const ulList = button.nextElementSibling as HTMLUListElement;

        if (!ulList) {
            return;
        }

        const matIcon = BrowserHelpers.getHtmlChild<HTMLElement>(
            button,
            'mat-icon',
            'menu-expand-icon',
        );
        const expand =
            expandOrReduce === 'auto'
                ? !ulList.clientHeight
                : expandOrReduce === 'expand';

        if (expand) {
            ulList.style.maxHeight = ulList.scrollHeight + 'px';

            if (matIcon && matIcon.innerHTML.indexOf('expand') === 0) {
                matIcon.innerHTML = 'expand_less';
            }
        } else {
            ulList.style.maxHeight = '0';

            if (matIcon && matIcon.innerHTML.indexOf('expand') === 0) {
                matIcon.innerHTML = 'expand_more';
            }
        }
    }

    buttonMenuExpandClick(button: HTMLButtonElement) {
        if (!button) {
            return;
        }

        this.expandOrReduceMenuSection('auto', button);
    }
}
