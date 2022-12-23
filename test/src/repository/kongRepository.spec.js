const chai= require("chai");
const kongRepository= require("../../../src/repository/kongRepository");
const fs = require('fs');
const yaml = require('js-yaml');
var path = require('path');
const genereratedDeckConf= require('./validDeckConf').genereratedDeckConf;
const genereratedDeckConf2= require('./validDeckConf').genereratedDeckConf2;
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);
const { expect } = chai;

describe ('Kong Repository',()=>{
    describe ('generate Deck Declarative File',()=>{
        it('should return valid deck declarite file',(done) => {
            var testSpecPath = path.join(__dirname, './') + 'testSpec.yaml' ;
            const data = yaml.load(fs.readFileSync(testSpecPath));
            const backendHost='https://localhost';
            apiName='testapi';
            const deckConfFile= kongRepository.generateDeckDeclarativeFile(apiName, data, backendHost);
            expect(deckConfFile).to.deep.equalInAnyOrder(genereratedDeckConf);
            done();
        }),
        it('should return valid deck declarite file',(done) => {
            var testSpecPath = path.join(__dirname, './') + 'testSpec.yaml' ;
            const data = yaml.load(fs.readFileSync(testSpecPath));
            const backendHost='http://localhost';
            apiName='testapi';
            const deckConfFile= kongRepository.generateDeckDeclarativeFile(apiName, data, backendHost);
            expect(deckConfFile).to.deep.equalInAnyOrder(genereratedDeckConf2);
            done();
        })
   })
})
