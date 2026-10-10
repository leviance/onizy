const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const featureNames = readdirSync(join(__dirname, 'src/features'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const layerZones = [
  {
    target: './src/app',
    from: ['./src/domain', './src/infrastructure'],
    message: 'Keep routes thin; wire domain and adapters in application.',
  },
  {
    target: './src/application',
    from: './src/app',
    message: 'Application composition must not depend on route files.',
  },
  {
    target: './src/domain',
    from: [
      './src/app',
      './src/application',
      './src/features',
      './src/infrastructure',
      './src/design-system',
      './src/shared',
    ],
    message: 'Domain must remain independent of application and platform code.',
  },
  {
    target: './src/infrastructure',
    from: ['./src/app', './src/application', './src/features', './src/design-system'],
    message: 'Adapters may depend on domain contracts and shared utilities only.',
  },
  {
    target: './src/shared',
    from: [
      './src/app',
      './src/application',
      './src/features',
      './src/domain',
      './src/infrastructure',
      './src/design-system',
    ],
    message: 'Shared code must not depend on higher layers.',
  },
  {
    target: './src/design-system',
    from: [
      './src/app',
      './src/application',
      './src/features',
      './src/domain',
      './src/infrastructure',
    ],
    message: 'Design components must not contain product or data-access logic.',
  },
  {
    target: './src/features',
    from: ['./src/app', './src/application', './src/infrastructure'],
    message: 'Inject data adapters through the composition layer.',
  },
  ...featureNames.flatMap((target) =>
    featureNames
      .filter((source) => source !== target)
      .map((source) => ({
        target: `./src/features/${target}`,
        from: `./src/features/${source}`,
        message: 'Compose features in app/application; share business rules in domain.',
      })),
  ),
  ...featureNames.map((feature) => ({
    target: ['./src/app', './src/application'],
    from: `./src/features/${feature}`,
    except: ['./index.ts'],
    message: 'Import a feature through its public index.ts entry point.',
  })),
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', '.expo/**', 'android/**', 'ios/**', 'coverage/**'],
  },
  {
    files: ['eslint.config.cjs'],
    languageOptions: { globals: { __dirname: 'readonly' } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/no-cycle': ['error', { ignoreExternal: true }],
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: false, includeTypes: true, packageDir: __dirname },
      ],
      'import/no-restricted-paths': ['error', { basePath: __dirname, zones: layerZones }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react/*',
                'react-native',
                'react-native/*',
                'expo',
                'expo-*',
                '@expo/*',
                '@react-native/*',
              ],
              message: 'Domain code must be plain TypeScript without UI or native dependencies.',
            },
          ],
        },
      ],
    },
  },
]);
