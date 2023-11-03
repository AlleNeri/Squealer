import { Directive, HostListener, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

import { MyErrorMessageComponent } from '../components/my-error-message/my-error-message.component';

@Directive({
  selector: '[appScreenDimension]'
})
export class ScreenDimensionDirective implements OnInit {
  private pixelThreshold: number;
  private tooSmallMessage: string;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {
    this.pixelThreshold=600;
    this.tooSmallMessage='Finestra troppo piccola per la visualizzazione di questa pagina, ti consigliamo di aumentarne la larghezza. Potresti ruotare il dispositivo se esso lo permette. Se non è possibile, dovrai utilizzare un dispositivo più grande.';
  }

  private showContentOrErrorMessage(): void {
    this.viewContainer.clear();
    if(this.isTooSmall(window.screen.width)) this.viewContainer.createComponent(MyErrorMessageComponent).instance.message=this.tooSmallMessage;
    else this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private isTooSmall(width: number): boolean {
    return width < this.pixelThreshold;
  }

  ngOnInit() { this.showContentOrErrorMessage(); }

  @HostListener('window:resize')
  onResize() { this.showContentOrErrorMessage(); }
}
