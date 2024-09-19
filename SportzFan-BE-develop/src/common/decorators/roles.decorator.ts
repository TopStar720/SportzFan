import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models/base';

export const Roles = (roles: UserRole[]) => SetMetadata('roles', roles);
