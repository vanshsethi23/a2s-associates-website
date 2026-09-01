import * as migration_20260901_175900 from './20260901_175900';

export const migrations = [
  {
    up: migration_20260901_175900.up,
    down: migration_20260901_175900.down,
    name: '20260901_175900'
  },
];
