import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostComponent } from './host/host.component';
import { HttpClientModule } from '@angular/common/http';
import { HostInitializerService } from './host/host-initializer.service';
import { RemoteInitializerService } from './remote/remote-initializer.service';

export interface ContainifyCoreModuleConfig {
  host: boolean;
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [HostComponent],
  exports: [HostComponent],
})
export class ContainifyCoreModule {
  static currentConfig: ContainifyCoreModuleConfig;

  constructor(
    hostInitializer: HostInitializerService,
    remoteInitializer: RemoteInitializerService
  ) {
    if (
      ContainifyCoreModule.currentConfig &&
      ContainifyCoreModule.currentConfig.host
    ) {
      hostInitializer.init();
    } else {
      remoteInitializer.init();
    }
  }

  static withConfig(
    config: ContainifyCoreModuleConfig
  ): ModuleWithProviders<ContainifyCoreModule> {
    ContainifyCoreModule.currentConfig = config;
    return {
      ngModule: ContainifyCoreModule,
      providers: [],
    };
  }
}
