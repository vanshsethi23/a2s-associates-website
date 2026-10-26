import * as migration_20260901_175900 from './20260901_175900';
import * as migration_20261026_094500_drop_blog_topics_add_portal_url from './20261026_094500_drop_blog_topics_add_portal_url';

export const migrations = [
  {
    up: migration_20260901_175900.up,
    down: migration_20260901_175900.down,
    name: '20260901_175900',
  },
  {
    up: migration_20261026_094500_drop_blog_topics_add_portal_url.up,
    down: migration_20261026_094500_drop_blog_topics_add_portal_url.down,
    name: '20261026_094500_drop_blog_topics_add_portal_url'
  },
];
