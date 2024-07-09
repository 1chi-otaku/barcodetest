import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BarcodeFormat } from '@zxing/library';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ZXingScannerComponent } from '@zxing/ngx-scanner'; 
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { stringify } from 'querystring';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZXingScannerModule,CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCheckboxModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'barcodetest';
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice!: MediaDeviceInfo;
  currentColorIndex: number = 0;

  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);

  hasDevices!: boolean;
  hasPermission!: boolean;


  qrResultString!: string;

  allowedFormats: BarcodeFormat[] = [];
  historicalResults: string[] = [];

  colors: string[] = ['#a37f1c', '#FF0000', '#00FF00'];

  errorMessage: string = '';

  markerStyle: any = {};
  showMarker: boolean = false;

  zoomEnabled: boolean = false;


  clearResult(): void {
    this.qrResultString = "";
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    let previousString = this.qrResultString;
    this.qrResultString = resultString;
    this.historicalResults.push(resultString);
    if(previousString != resultString){
      this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    }
  }

  onDeviceSelectChange(event: any) {
    const selectedValue = event.target.value;
    const device = this.availableDevices.find(x => x.deviceId === selectedValue);
    if (device !== undefined) {
      this.currentDevice = device;
    }

    
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  getNextColor(): string {
    const color = this.colors[this.currentColorIndex];
    return color;
  }
  
  async triggerCameraFocus(event: MouseEvent) {
    this.errorMessage = '';
    if (this.currentDevice) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: this.currentDevice.deviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any;
  
        if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
          const video = event.target as HTMLElement;
          const rect = video.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
  
          const constraints: any = {
            advanced: [{ focusMode: 'manual', focusPointX: x, focusPointY: y }]
          };
  
          await track.applyConstraints(constraints);
  
          this.showMarker = true;
          this.markerStyle = {
            left: `${event.clientX - rect.left}px`,
            top: `${event.clientY - rect.top}px`
          };
  
          await setTimeout(() => {
            this.showMarker = false;
  
            const constraints: any = {
              advanced: [{ focusMode: 'continuous'}]
            };
  
            track.applyConstraints(constraints);
  
          }, 3000);
  
          console.log('Constraints applied:', constraints);
          this.errorMessage += ' Constraints applied';
        } else {
          console.warn('Manual focus is not supported by this device.');
          this.errorMessage = 'Manual focus is not supported by this device.';
        }
      } catch (error) {
        console.error('Error focusing camera:', error);
      }
    }
  }
  
  // async toggleZoom() {
  //   try {
  //     this.errorMessage = 'Enter';
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: { deviceId: { exact: this.currentDevice.deviceId } }
  //     });
  //     const track = stream.getVideoTracks()[0];
  //     const capabilities = track.getCapabilities() as any;
  
  //     console.log('Camera capabilities:', capabilities);

  //     this.errorMessage = `Camera capabilities: ${JSON.stringify(capabilities)}`;
  
  //     if (capabilities.zoom) {
  //       const zoomLevel = this.zoomEnabled ? 1 : capabilities.zoom.max / 2;
  //       const constraints: any = {
  //         advanced: [{ zoom: zoomLevel }]
  //       };
  //       await track.applyConstraints(constraints);
  //       this.zoomEnabled = !this.zoomEnabled;
  //       console.log('Zoom constraints applied:', constraints);
  //       this.errorMessage = 'Zoom applied';
  //     } else {
  //       console.warn('Zoom is not supported by this device.');
  //     }
  //   } catch (error) {
  //     console.error('Error toggling zoom:', error);
      
  //   }
  // }
}




  
  


  
  







