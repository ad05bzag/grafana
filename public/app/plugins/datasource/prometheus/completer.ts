///<reference path="../../../headers/common.d.ts" />

import {PrometheusDatasource} from "./datasource";

export class PromCompleter {
  identifierRegexps = [/[\[\]a-zA-Z_0-9=]/];

  constructor(private datasource: PrometheusDatasource) {
  }

  getCompletions(editor, session, pos, prefix, callback) {
    if (prefix === '[') {
      var vectors = [];
      for (let unit of ['s', 'm', 'h']) {
        for (let value of [1,5,10,30]) {
         vectors.push({caption: value+unit, value: '['+value+unit, meta: 'range vector'});
        }
      }
      callback(null, vectors);
      return;
    }

    var query = prefix;
    var line = editor.session.getLine(pos.row);

    return this.datasource.performSuggestQuery(query).then(metricNames => {
      callback(null, metricNames.map(name => {
        let value = name;
        if (prefix === '(') {
          value = '(' + name;
        }

        return {
          caption: name,
          value: value,
          meta: 'metric',
        };
      }));
    });
  }

}
