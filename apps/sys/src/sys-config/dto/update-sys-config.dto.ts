import { PartialType } from '@codecoderun/swagger';
import { CreateSysConfigDto } from './create-sys-config.dto';

export class UpdateSysConfigDto extends PartialType(CreateSysConfigDto) {}
