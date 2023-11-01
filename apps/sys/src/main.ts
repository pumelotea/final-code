import { SysModule } from './sys.module';
import { createBootstrap } from './config/configuration';

createBootstrap('Sys', SysModule)();
