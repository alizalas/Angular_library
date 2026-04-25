import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRootModule, TuiAlertModule, TuiDialogModule } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRootModule, TuiAlertModule, TuiDialogModule],
  template: `
    <tui-root>
      <tui-alerts />
      <tui-dialogs />
      <router-outlet />
    </tui-root>
  `
})
export class AppComponent {}