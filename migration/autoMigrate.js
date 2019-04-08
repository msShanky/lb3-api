('use strict');
const loopback = require ('loopback');
const promisify = require ('util').promisify;
const fs = require ('fs');
const writeFile = promisify (fs.writeFile);
const readFile = promisify (fs.readFile);
const mkdirp = promisify (require ('mkdirp'));
const server = require ('../server/server');

const DATASOURCE_NAME = 'mysql';
const dataSourceConfig = require ('../server/datasources.json');
const db = loopback.DataSource (dataSourceConfig[DATASOURCE_NAME]);

async function discoverAndGenerate () {
  // const options = {relations: true};
  // const tables = [
  //   'accounts',
  //   'budgets',
  //   'categories',
  //   'loans',
  //   'modes',
  //   'pockets',
  //   'transactions',
  // ];
  // const modelsFolder = './common/models';
  // const configJson = await readFile ('./server/model-config.json', 'utf-8');
  // const config = JSON.parse (configJson);

  // await mkdirp ('./common/models');
  // for (let table of tables) {
  //   let schema = await db.discoverSchemas (table, options);
  //   await writeFile (
  //     `${modelsFolder}/${table}.json`,
  //     JSON.stringify (
  //       schema[`${dataSourceConfig[DATASOURCE_NAME].database}.${table}`],
  //       null,
  //       1
  //     )
  //   );
  //   config[
  //     schema[`${dataSourceConfig[DATASOURCE_NAME].database}.${table}`].name
  //   ] = {dataSource: DATASOURCE_NAME, public: true};
  // }

  // await writeFile (
  //   './server/model-config.json',
  //   JSON.stringify (config, null, 2)
  // );

  // db.disconnect ();

  const ds = server.dataSources[`mysql-skii-cms`];  
  const lbTables = ['AccessToken', 'ACL', 'RoleMapping', 'Role', 'User'];

  ds.automigrate (lbTables, function (er) {
    ds.disconnect ();
    if (er) throw er;
    console.log (
      'Loopback tables [' + lbTables + '] created in ',
      ds.adapter.name
    );
  });
}

discoverAndGenerate ()
  .then (
    success => console.log ('Migration completed'),
    error => console.log ('Unable to generate data, ' + error)
  )
  .catch (ex => console.log ('Exception: ' + ex));
