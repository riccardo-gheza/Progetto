// Importo il contenuto dei file JavaScript
import Script1 from 'script1.js';
import Script2 from 'script2.js';
import Script3 from 'script3.js';
import Script4 from 'script4.js';

// Importo il contenuto dei file HTML
import Index1 from 'index1.html';
import Index2 from 'index2.html';
import Index3 from 'index3.html';
import Index4 from 'index4.html';

// Importo il contenuto del menu
import Menu from 'index.html';

// Configuro le rotte
const routes = [
    { path: '/Tris', component: Script1, template: Index1 },
    { path: '/Snake', component: Script2, template: Index2 },
    { path: '/CFS', component: Script3, template: Index3 },
    { path: '/2048', component: Script4, template: Index4 },
];

// Registro il componente di menu
Vue.component('menu', {
  template: Menu,
});

// Creo l'istanza principale di Vue
const app = new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname,
  },
  computed: {
    currentTemplate() {
      const route = routes.find(route => route.path === this.currentRoute);
      return route ? route.template : '<p>Pagina non trovata</p>';
    },
  },
  render(h) {
    return h('div', [
      h('app-menu'),
      h('div', { domProps: { innerHTML: this.currentTemplate } }),
    ]);
  },
  watch: {
    '$route'(to, from) {
      this.currentRoute = to.path;
    },
  },
});

// Implemento la gestione delle rotte
window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname;
});

// Inizializzo la SPA
function navigateTo(url) {
  window.history.pushState({}, '', url);
  app.currentRoute = url;
}

// Inizializzo la SPA al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  navigateTo(window.location.pathname);
});
