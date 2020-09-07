import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    EventEmitter,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import * as ReactDOM from 'react-dom';
import React from 'react';
import { MyReactComponent } from './MyReactComponent';

const containerElementName = 'myReactComponentContainer';

@Component({
    selector: 'app-my-component',
    template: `
        <span #${containerElementName}></span>
    `,
    styleUrls: ['./MyReactComponent.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReactTestComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

    @Input() public counter = 10;
    @Output() public componentClick = new EventEmitter();

    constructor() {
        this.handleDivClicked = this.handleDivClicked.bind(this);
    }

    public handleDivClicked() {
        if (this.componentClick) {
            this.counter = this.counter + 1;
            this.componentClick.emit(null);
            this.render();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.render();
    }

    ngAfterViewInit() {
        this.render();
    }

    ngOnDestroy() {
        ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
    }

    private render() {
        const { counter } = this;

        ReactDOM.render(
            <div className={'i-am-classy'}>
                <MyReactComponent counter={counter} onClick={this.handleDivClicked} />
            </div>,
            this.containerRef.nativeElement
        );
    }
}
