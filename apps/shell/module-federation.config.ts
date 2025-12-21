import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  /**
   * Expose stores and API from shell app to be consumed by other MFEs
   */
  exposes: {
    './stores': './src/stores/index.ts',
    './api': './src/api.ts',
  },
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
  shared: (libraryName: string) => {
    // Share common libraries as singletons to prevent duplication
    if (
      libraryName === 'react' ||
      libraryName === 'react-dom' ||
      libraryName === 'zustand'
    ) {
      return {
        singleton: true,
        eager: true,
      };
    }
    // Explicitly share @hookform/resolvers with correct version
    if (libraryName === '@hookform/resolvers') {
      return {
        singleton: true,
        eager: true,
        requiredVersion: '^5.2.2',
      };
    }
    return false;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
