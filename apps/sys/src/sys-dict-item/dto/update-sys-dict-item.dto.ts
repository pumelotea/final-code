import { PartialType } from '@codecoderun/swagger';
import { CreateSysDictItemDto } from './create-sys-dict-item.dto';

export class UpdateSysDictItemDto extends PartialType(CreateSysDictItemDto) {}
