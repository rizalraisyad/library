// eslint-disable-next-line @typescript-eslint/no-var-requires
const yargs = require('yargs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

// Parse the command-line arguments
const {
  _: [name],
} = yargs.argv;

// Construct the migration path
const migrationPath = `src/db/migrations/${name}`;

// Run the typeorm command
execSync(
  `yarn typeorm migration:generate ${migrationPath} -d src/db/data-source  --pretty=true`,
  {
    stdio: 'inherit',
  },
);
