import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { BaseComponent } from '../../base/base.component';
export interface AppMenuSubItem {
    icon?: string;
    label: string;
    url: string;
    // route: string;
    exactRouteActive?: boolean;
    queryParams?: any;
    subItems?: AppMenuSubItem[];
}
export interface AppMenuItemWrapper {
    subItems: AppMenuSubItem[];
    title: string;
}

export interface PanelWrapper {
    panel: MatExpansionPanel;
    active: boolean;
}

@Component({
    selector: 'app-main-menu-item',
    templateUrl: './main-menu-item.component.html',
    styleUrls: ['./main-menu-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MainMenuItem extends BaseComponent {
    @Input() menuItem?: AppMenuItemWrapper;
    @Input() panels: PanelWrapper[] = [];

    constructor() {
        super();
    }

    isActivePanel(expansionPanel: MatExpansionPanel) {
        // console.log("Log ~ file: main-menu-item.component.ts:37 ~ MainMenuItem ~ isActivePanel ~ this.panels", this.panels);
        return this.panels?.some((x) => x.panel === expansionPanel && x.active);
    }

    isActiveChange(active: boolean, expansionPanel: MatExpansionPanel) {
        if (!expansionPanel) {
            return;
        }

        let panelWrapper = this.panels.find((x) => x.panel === expansionPanel);

        if (!panelWrapper) {
            panelWrapper = { panel: expansionPanel, active: active };
            this.panels.push(panelWrapper);
        }

        panelWrapper.active = active;

        //todo fix bug select menu on sub menu selected
        // console.log("Log ~ file: page-wrapper.component.ts:52 ~ PageWrapperComponent ~ isActiveChange ~ expansionPanel._getExpandedState()", panelWrapper, this.panels);

        // eslint-disable-next-line no-underscore-dangle
        if (active && expansionPanel._getExpandedState() !== 'expanded') {
            this.setTimeout(() => {
                expansionPanel.open();
            }, 10);
            // console.log("Log ~ file: page-wrapper.component.ts:55 ~ PageWrapperComponent ~ isActiveChange ~ expansionPanel", expansionPanel);
        }
        // console.log("Log ~ file: page-wrapper.component.ts:52 ~ PageWrapperComponent ~ evt", active, expansionPanel);
    }
}
