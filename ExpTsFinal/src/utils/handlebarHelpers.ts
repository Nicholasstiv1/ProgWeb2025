import { registerHelper } from 'handlebars';

export const nodeJsTechnologies = (technologies: any[]): string => {
  const nodeJsTechs = technologies.filter(tech => tech.poweredByNodejs === true);
  
  if (nodeJsTechs.length === 0) {
    return '<p>Nenhuma tecnologia Node.js encontrada.</p>';
  }

  let html = '<ul>';
  nodeJsTechs.forEach(tech => {
    html += `<li><strong>${tech.name}</strong> - ${tech.type}</li>`;
  });
  html += '</ul>';

  return html;
};

export const ifCond = (a: any, b: any, options: any) => {
  if (a == b) {
    return options.fn(options.data.root);
  } else {
    return options.inverse(options.data.root);
  }
};