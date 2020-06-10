/*
 * Embedded constants
 */

const FUSE_CONFIG = { threshold: 0.2, 
  keys: [{
    name: 'title',
    weight: 2
  },     {
    name: 'body',
    weight: 1
  }]
}

/*
 * Helper functions
 */

const initMenu = (menu) => {
  const menu__dropdown = menu.querySelector('.menu__dropdown')
  menu__dropdown.classList.remove('menu__dropdown_loading')

  const changePage = ({ target }) => {
      menu__dropdown.classList.add('menu__dropdown_loading')
      window.location.href = target.value;
  }
  
  menu.addEventListener('change', changePage)
};

const initWidget = (widget) => {
  const html = htm.bind(preact.h);

  const Card = ({ title, body, filter }) => html`
    <span class="card">
      <h3 class="card__title" dangerouslySetInnerHTML=${{ __html: filter.length < 3 ? title : title.replace(new RegExp(filter, 'ig'), (match) => `<mark>${match}</mark>`)}} />

      <p class="card__description" dangerouslySetInnerHTML=${{ __html: filter.length < 3 ? body : body.replace(new RegExp(filter, 'ig'), (match) => `<mark>${match}</mark>`)}} />
    </span>
  `
  
  const useData = (url) => {
    const [data, setData] = preactHooks.useState(null);
    
    preactHooks.useEffect(() => {
      axios.get(url).then((response) => setData(response.data))
    }, [])
    
    return data;
  }

  const App = ({ url }) => {
    const data = useData(url);
    const [filter, setFilter] = preactHooks.useState('');
    const searchIndex = preactHooks.useMemo(() => !!data && new Fuse(data, FUSE_CONFIG), [data]);

    if (!data) {
      return html`
        <${preact.Fragment}>
          <input class="widget__input" disabled />
          <ul class="grid"></ul>
        </${preact.Fragment}>
      `;
    }

    const filteredData = filter.length < 3 ? data : searchIndex.search(filter).map(({ item }) => item);

    return html`
      <${preact.Fragment}>
        <input class="widget__input" placeholder="Filter.." value=${filter} onInput=${({ target }) => setFilter(target.value)}/>

        <ul class="grid">
          ${filteredData.map(({ title, body }) => html`
            <li class="grid__item">
              ${html`<${Card} filter=${filter} title=${title} body=${body} />`}
            </li>
          `)}
        </ul>
      </${preact.Fragment}>
    `
  }

  const url = widget.getAttribute('data-url');

  if (!url) {
    throw new Error('No url supplied via "data-url" to ".widget"');
  }

  preact.render(html`<${App} url=${url} />`, widget);
}

/**
 * Primary side-effect
 */

const menu = document.querySelector('.menu');
const widget = document.querySelector('.widget');

if (menu) initMenu(menu);
if (widget) initWidget(widget);
