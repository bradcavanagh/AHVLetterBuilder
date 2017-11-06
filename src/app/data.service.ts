import { Injectable } from '@angular/core';
import { Project } from './project';
import { Option } from './option';
import { OptionType } from './option';
import { RandomHelper } from './random-helper';
import { OnInit } from '@angular/core';
import * as Tabletop from 'tabletop';

@Injectable()
export class DataService {

  private projectCache: Project[];
  private optionCache: Option[];
  private textBankCache: {[id: string] : string[]};

  constructor(){
    this.projectCache = new Array<Project>();
    this.optionCache = new Array<Option>();
    this.textBankCache = {};
  }

  init(callback: ()=> void)
  {
    //todo: don't hardcode key? Ahh who cares
    Tabletop.init( { key: '1ZFKYPIx8JlfGg1dHJvSwq6xSOuQRM34cXSRZjH-AeuM',
                   callback: (data, tabletop) => {
                     this.parseSpreadsheetData(data, tabletop, this.projectCache, this.optionCache, this.textBankCache);
                     callback();
                   } } );
  }

  //the cache parameters are dumb and shouldn't be necessary. For some reason I just couldn't get "this" to bind correctly in this method.
  parseSpreadsheetData = (data: any, tabletop: any, 
    projectCache: Project[], optionCache: Option[], textBankCache: {[id: string] : string[]}) => 
  {
    console.log('got data from tabletop');
    let projects = data['Projects'].all();
    projects.forEach(function(p){
      //todo: error handling
      let id = p["ID"];
      let name = p["Name"];
      let emailAddress = p["Email to"];
      let neighbourhood = p["Neighbourhood name"];
      let description = p["Description"];
      let tags = (p["Tags"] as string).split(",");
      let newProject = new Project(id, name, emailAddress, neighbourhood, description, tags);
      projectCache.push(newProject); 
    });

    let options = data['Options'].all();
    options.forEach(function(o){
      //todo: read option data
      let newOption = new Option();
      newOption.type =  OptionType[o['Type'] as string];
      newOption.id = o["ID"];
      newOption.description = o["Description"];
      let tags = o["Tags"] as string;
      if(tags.trim() == "")
        newOption.tags = [];
      else
        newOption.tags = (o["Tags"] as string).split(",");
      optionCache.push(newOption);
    });

    let textBank = data['Text Bank'].all();
    textBank.forEach(function(tb){
      let id = tb['ID'] as string;
      let text = tb['Text'] as string;
      if(id in textBankCache)
        textBankCache[id].push(text);
      else
        textBankCache[id] = [text];
    });
    console.log('data from tabletop was successfully parsed and cached');
  }

  getProject(id: string): Project {
    let matches = this.projectCache.filter(function(p) { return p.id === id; });
    if(matches.length == 0)
      return null;
    else
      return matches[0];
  }

  getOptions(type: OptionType): Option[]{
    return this.optionCache.filter(function(o){return o.type === type});
  }
  getRandomTextBankEntry(id: string): string {
    let sentences = this.textBankCache[id];
    return RandomHelper.RandomString(sentences);
  }
  
    getRandomBulletPoint(): string{
    var options = ['-','•'];
    return RandomHelper.RandomString(options);
  }

}
