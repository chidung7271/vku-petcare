import { SetMetadata } from '@nestjs/common';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VET = 'VET',
  MODERATOR = 'MODERATOR'
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
