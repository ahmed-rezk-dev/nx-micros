import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'courses',
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  remotes: ['shell'],
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
