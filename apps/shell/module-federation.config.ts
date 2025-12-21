import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: [
    'auth',
    'dashboard',
    'courses',
    'learning',
    'instructor',
    'account',
  ],
  shared: {
    // CRITICAL: Share React, React-DOM, and Zustand as singletons
    // This prevents multiple instances and initialization conflicts
    react: {
      singleton: true,
      requiredVersion: '^18.0.0',
      eager: true,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^18.0.0',
      eager: true,
    },
    zustand: {
      singleton: true,
      requiredVersion: '^4.0.0',
      eager: true,
    },
    // Share UI components
    '@nx-micros/ui': {
      singleton: true,
      eager: true,
    },
  },
} as any; // Type assertion needed for Nx compatibility

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
