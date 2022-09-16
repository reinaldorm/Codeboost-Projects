export default class Pokemon {
  constructor(pokemonWrapper, pokemonFilter, pokemonSearch, pokemonShow, pokemonCount, pokemonModal) {
    this.pokemonWrapper = document.querySelector(pokemonWrapper);
    this.pokemonFilter = document.querySelectorAll(pokemonFilter);
    this.pokemonSearch = document.querySelectorAll(pokemonSearch);
    this.pokemonShow = document.querySelector(pokemonShow);
    this.pokemonCount = document.querySelector(pokemonCount);
    this.pokemonModal = document.querySelector(pokemonModal);
    this.count = 0;
  }

  static repairName(name) {
    const toFix = name;
    const toUpper = toFix.toUpperCase()
    const newName = toFix.replace(/^\w/, toUpper.slice(0, 1))
    return newName
  }

  static repairHeight(height) {
    const toFix = height.toString();
    let newHeight;

    if (toFix.length <= 1) newHeight = toFix.replace(/(\d)/, '0.$1m')
    else if (toFix.length <= 2) newHeight = toFix.replace(/(\d)(\d)/, '$1.$2m')
    else if (toFix.length <= 3) newHeight = toFix.replace(/(\d)(\d)(\d)/, '$1$2.$3m')

    return newHeight
  }

  static repairWeight(weight) {
    const toFix = weight.toString();
    let newWeight;

    if (toFix.length <= 1 && toFix[0] == 0) newWeight = toFix.replace(/(\d)/, '0.$1kg')
    else if (toFix.length <= 1 && toFix[0] != 0) newWeight = toFix.replace(/(\d)/, '$1.0kg')
    else if (toFix.length <= 2) newWeight = toFix.replace(/(\d)(\d)/, '$1.$2kg')
    else if (toFix.length <= 3) newWeight = toFix.replace(/(\d)(\d)(\d)/, '$1$2.$3kg')
    else if (toFix.length <= 4) newWeight = toFix.replace(/(\d)(\d)(\d)(\d)/, '$1$2$3.$4kg')

    return newWeight
  }

  async getPokemon(config) {

    const isNumber = typeof config === 'number'

    if (isNumber && this.count === 0) {
      this.count += config;
    } else if ((isNumber && this.count > 0)) {
      this.count += 1;
      config = this.count;
    }

    const pokemonFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${config}`);
    const pokemonJson = await pokemonFetch.json();
    const pokemonInfo = {
      name: this.constructor.repairName(pokemonJson.name),
      id: pokemonJson.id,
      types: pokemonJson.types.map((e) => {
        return {
          slot: e.slot,
          type: e.type.name
        };
      }),
      stats: pokemonJson.stats.map((e) => {
        return {
          name: e.stat.name,
          value: e.base_stat
        }
      }),
      ability: pokemonJson.abilities.map((e) => {
        return e.ability.name
      }),
      weight: pokemonJson.weight,
      height: pokemonJson.height,
      img: pokemonJson.sprites.other.dream_world.front_default !== null ? pokemonJson.sprites.other.dream_world.front_default : './img/png/empty-pokemon.png'
    }

    return pokemonInfo;
  }

  async createPokemon(config) {
    const pokemonInfo = await this.getPokemon(config)
    const newPokemon = document.createElement('li');

    newPokemon.classList.add('pokemon')
    newPokemon.classList.add(pokemonInfo.types[0].type)
    newPokemon.addEventListener('click', () => this.refreshModal(
      pokemonInfo.name,
      pokemonInfo.id,
      pokemonInfo.img,
      pokemonInfo.types[0].type,
      pokemonInfo.types,
      [this.constructor.repairHeight(pokemonInfo.height),
      this.constructor.repairWeight(pokemonInfo.weight),
      this.constructor.repairName(pokemonInfo.ability[0])],
      pokemonInfo.stats))

    newPokemon.innerHTML = `        
      <div class="pokemon-img"><img src="${pokemonInfo.img}"></div>
      <div class="pokemon-info">
        <span class="pokemon-id">#${pokemonInfo.id}</span>
        <span class="pokemon-name">${pokemonInfo.name} <img src="./img/icon/icon-${pokemonInfo.types[0].type}.svg"></span>
    </div>`

    return newPokemon;
  }

  async insertPokemon(config, times = 1) {

    for (let i = 0; i < times; i++) {
      const pokemon = await this.createPokemon(config)
      this.pokemonWrapper.appendChild(pokemon);
      this.refreshCount();
    }

  }

  async filterPokemon(e) {
    e.preventDefault();
    this.resetPokemon();

    const type = e.currentTarget.dataset.type;

    if (type === 'all') return this.insertPokemon(1, 18);

    const filterFetch = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    const filterJson = await filterFetch.json();
    const filterPokemons = await filterJson.pokemon;
    const filteredPokemons = await filterPokemons.map((e) => e.pokemon.name);
    filteredPokemons.forEach((e) => this.insertPokemon(e))
  }

  searchPokemon(e) {
    e.preventDefault();
    if (e.key === 'Enter' || e.target === this.pokemonSearch[1]) {

      const pokemon = this.pokemonSearch[0].value.toLowerCase();
      this.scrollPokemon();
      this.resetPokemon();
      this.insertPokemon(pokemon);
    }
  }

  resetPokemon() {
    this.count = 0;
    const oldPokemons = document.querySelectorAll('.pokemon');
    oldPokemons.forEach((pokemon) => pokemon.remove());
  }

  refreshCount() {
    const pokemonCount = document.querySelectorAll('.pokemon')
    this.pokemonCount.innerText = pokemonCount.length;
  }

  scrollPokemon() {
    this.pokemonWrapper.parentElement.scrollIntoView({
      block: "start",
      behavior: "smooth"
    })
  }

  async refreshModal(...args) {
    this.pokemonModal.classList.add('on');
    document.body.classList.add('modal-on');

    const name = this.pokemonModal.querySelector('[data-name]');
    const id = this.pokemonModal.querySelector('[data-id]');
    const img = this.pokemonModal.querySelector('[data-art]')
    const types = this.pokemonModal.querySelector('[data-types]');
    const oldTypes = this.pokemonModal.querySelectorAll('[data-type]');
    const attribs = this.pokemonModal.querySelectorAll('[data-attrib]');
    const stats = this.pokemonModal.querySelectorAll('[data-stats]');
    const weakness = this.pokemonModal.querySelector('[data-weakness]');
    const background = img.parentElement;

    const weakFetch = await fetch(`https://pokeapi.co/api/v2/type/${args[4][0].type}`);
    const weakJson = await weakFetch.json();

    name.innerText = args[0];
    id.innerText = `#${args[1]}`;
    img.setAttribute('src', `${args[2]}`);
    background.style.background = `url(./img/bg-types/${args[3]}.svg) center / cover`;
    oldTypes.forEach((e) => e.remove());
    args[4].forEach((e) => {
      const newType = document.createElement('li');
      newType.classList.add('s-modal-attributes-heading-type');
      newType.dataset.type = e.type;
      newType.innerHTML = this.constructor.repairName(e.type);
      types.appendChild(newType);
    });
    attribs.forEach((e, index) => {
      e.innerHTML = args[5][index]
    });
    weakJson.damage_relations.double_damage_from.forEach((e) => {
      const newWeak = document.createElement('li');
      newWeak.classList.add('s-modal-attributes-weaknesses-type');
      newWeak.dataset.type = e.name;
      newWeak.innerHTML = this.constructor.repairName(e.name);
      weakness.appendChild(newWeak);
    });
    args[6].forEach((e, index) => {
      let width = e.value
      if (width > 100) width = 100;
      stats[index].style.width = `${width}%`
    });
  }

  bindMethods() {
    this.filterPokemon = this.filterPokemon.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
  }

  addEvent() {
    this.pokemonFilter.forEach((e) => e.addEventListener('click', this.filterPokemon))
    this.pokemonSearch[0].addEventListener('keyup', this.searchPokemon)
    this.pokemonSearch[1].addEventListener('click', this.searchPokemon)
    this.pokemonShow.addEventListener('click', () => {
      this.insertPokemon(1, 18)
    })
    this.pokemonModal.querySelector('[data-exit]').addEventListener('click', () => {
      this.pokemonModal.classList.remove('on')
      document.body.classList.remove('modal-on')
    });
  }

  init() {
    this.bindMethods();
    this.addEvent();

    return this
  }
}
