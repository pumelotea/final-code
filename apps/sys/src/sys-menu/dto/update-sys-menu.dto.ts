import { PartialType } from '@codecoderun/swagger';
import { CreateSysMenuDto } from './create-sys-menu.dto';

export class UpdateSysMenuDto extends PartialType(CreateSysMenuDto) {}
