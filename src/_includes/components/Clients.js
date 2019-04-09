module.exports = (clients, from, to = clients.length) => {

    let renderTools = function (toolList) {
        let html = toolList.map(tool => `<i class="icon-m ${ tool }"></i>`);
        return html.join('');
    };
    let subList = clients.slice(from, to);
    let renderedList = subList.map(client => `<div class="card-horiz">
      <figure class=""></figure>
      <table>
          <tr>
              <td>Client</td>
              <td>${ client.title }</td>
          </tr>
          <tr>
              <td>Project</td>
              <td>${ client.description }</td>
          </tr>
          <tr>
              <td>Tools</td>
              <td>
              ${ renderTools(client.tools) }

              </td>
          </tr>
      </table>
      <!--
  
      <aside>
          <a href="${ client.link }">link</a>
      </aside>
      -->
  </div>`);
    return renderedList.join('');
};