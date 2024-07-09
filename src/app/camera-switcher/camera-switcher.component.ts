import { Component } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/library';


@Component({
  selector: 'app-camera-switcher',
  standalone: true,
  imports: [],
  templateUrl: './camera-switcher.component.html',
  styleUrl: './camera-switcher.component.css'
})
export class CameraSwitcherComponent {

}
