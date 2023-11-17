import { PartialType } from '@codecoderun/swagger';
import { CreateSysDictDto } from './create-sys-dict.dto';

export class UpdateSysDictDto extends PartialType(CreateSysDictDto) {}
