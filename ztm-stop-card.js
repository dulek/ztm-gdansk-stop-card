class ZTMStopCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  version() { return "0.2.0"; }
  
  _getAttributes(hass, departures) {
    var inmin = new Array(); //time delta
    var routeid = new Array(); //line number
    var vehicle = new Array(); //bus or tram
    var headsign = new Array(); //direction
    var icon = new Array();
    var station; //stop, station name
    var departure_objects = new Array();

    for (let i = 0; i < departures.length(); ++i) {
        d = departures[i];
        departure_objects.push({
            route: d.routeId,
            vehicle: "tram",
            inmin: "6 min"
            headsign: d.headsign,
            icon: "tram",
            station: "Obrońców Westerplatte"
        });
    }

    return departure_objects;
  }
  
  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    config.filter

    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');
    style.textContent = `
      h3 {
        text-align: center;
        padding-top:15px;
      }
      table {
        width: 90%;
        padding: 0px 0px 16px 0px;
        border: none;
        margin-left: 16px;
        margin-right: 16px;
      }
      thead th {
        text-align: left;
      }
      tbody tr:nth-child(odd) {
        background-color: var(--paper-card-background-color);
        vertical-align: middle;
      }
      tbody tr:nth-child(even) {
        background-color: var(--secondary-background-color);
      }
      td {
        padding-left: 5px;
      }
      .emp {
         font-weight: bold;
         font-size: 120%;
      }
      .extraic {
         width: 1em;
         padding-left: 5px;
      }
      .bus {
         color: #44739e;
         width: 0.1em;
      }
      .trolleybus {
         color: #cc0000;
         width: 1.5em;
      }
      .tram {
         color: #e1e100;
         width: 1.5em;
      }
      .rail {
         color: #2ecc71;
         width: 1.5em;
      }
      .subway {
         width: 1.5em;
      }
    `;
    content.innerHTML = `
      <p id='station'>
      <table>
        <tbody id='attributes'>
        </tbody>
      </table>
    `;
    card.appendChild(style);
    card.appendChild(content);
    root.appendChild(card)
    this._config = cardConfig;
  }
  
  _updateContent(element, attributes) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <tr>
          <td class="${attribute.vehicle}"><ha-icon icon="mdi:${attribute.icon}"></td>
          <td><span class="emp">${attribute.route}</span> w kierunku ${attribute.headsign} za ${attribute.inmin} min</td>
        </tr>
      `).join('')}
    `;
  }
  
  _updateStation(element, attributes) {
    element.innerHTML = `
      ${attributes.map((attribute) => `
        <h3>${attribute.station}</h3>
      `)[0]}
    `;
  }
  
  set hass(hass) {
    const config = this._config;
    const root = this.shadowRoot;

    var state = hass.states[config.entity];

    let attributes = this._getAttributes(hass, state.departures);

    this._updateStation(root.getElementById('station'), attributes);
    this._updateContent(root.getElementById('attributes'), attributes);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('ztm-stop-card', ZTMStopCard);
