import fs from 'fs';
import {taffy} from 'taffydb';
import ESDoc from './../../src/ESDoc.js';
import defaultPublisher from '../../src/Publisher/publish.js';

let configFilePath = './test/fixture/esdoc.json';
let configJSON = fs.readFileSync(configFilePath, {encode: 'utf8'});
let config = JSON.parse(configJSON);

ESDoc.generate(config, (data, config)=>{
  let clonedData = JSON.parse(JSON.stringify(data));
  let db = taffy(clonedData);
  db.find = function(...cond) {
    return db(...cond).map((v)=>{
      let copy = JSON.parse(JSON.stringify(v));
      delete copy.___id;
      delete copy.___s;
      return copy;
    });
  };
  global.db = db;

  defaultPublisher(data, config);

  fs.writeFileSync('./test/fixture/esdoc/dump.json', JSON.stringify(db.find({}), null, 2));
});
