export default class Pokemon {
  constructor(pokemonWrapper, pokemonFilter, pokemonSearch, pokemonShow, pokemonCount, pokemonModal, pokemonPlusType) {
    this.pokemonWrapper = document.querySelector(pokemonWrapper);
    this.pokemonFilter = document.querySelectorAll(pokemonFilter);
    this.pokemonSearch = document.querySelectorAll(pokemonSearch);
    this.pokemonShow = document.querySelector(pokemonShow);
    this.pokemonCount = document.querySelector(pokemonCount);
    this.pokemonModal = document.querySelector(pokemonModal);
    this.pokemonPlusType = document.querySelector(pokemonPlusType);
    this.count = 0;
  }

  static repairName(name) {
    const toFix = name;
    const toUpper = toFix.toUpperCase()
    const newName = toFix.replace(/^\w/, toUpper.slice(0, 1))
    return newName
  }

  static repairId(id) {
    const toFix = id.toString();;
    let newId;
    if (toFix.length === 1) newId = toFix.replace(/(\d)/, '00$&')
    else if (toFix.length === 2) newId = toFix.replace(/(\d)(\d)/, '0$1$2')
    else if (toFix.length >= 3) newId = toFix;
    return newId
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
      img: pokemonJson.sprites.other['official-artwork'].front_default !== null ? pokemonJson.sprites.other['official-artwork'].front_default : './img/png/no-image.png'
    }

    return pokemonInfo;
  }

  async createPokemon(config) {
    const pokemonInfo = await this.getPokemon(config)
    const newPokemon = document.createElement('li');

    const pokemonType = pokemonInfo.types;
    const pokemonWeight = this.constructor.repairWeight(pokemonInfo.weight)
    const pokemonHeight = this.constructor.repairHeight(pokemonInfo.height)
    const pokemonId = this.constructor.repairId(pokemonInfo.id)

    newPokemon.classList.add('pokemon', 'initial')
    newPokemon.classList.add(pokemonType[0].type)
    newPokemon.addEventListener('click', ({ currentTarget }) => {
      this.refreshModal(
        pokemonInfo.img,
        pokemonInfo.name,
        pokemonId,
        pokemonWeight,
        pokemonHeight,
        pokemonType,
        pokemonInfo.stats,
        currentTarget
      )
    })

    newPokemon.innerHTML = `        
    <div data-color="${pokemonType[0].type}" class="pokemon-type"></div>
    <div class="pokemon-info">
      <img src="${pokemonInfo.img}" class="pokemon-info-img">
      <div id="pokemon-info-heading">
        <p class="pokemon-info-name">${pokemonInfo.name}</p>
        <p class="pokemon-info-id">#${pokemonId}</p>
      </div>
      <p data-text="${pokemonType[0].type}" class="pokemon-info-type">
        ${this.constructor.repairName(pokemonType[0].type)} 
        <img srcset="./img/icon/Types/icon-${pokemonType[0].type}.svg" class="pokemon-info-icon">
      </p>  
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
    args[7].classList.toggle('on')
    args[7].classList.toggle('initial');

    if (args[7].className.includes('final')) args[7].classList.toggle('final');

    const modalImg = this.pokemonModal.querySelector('[data-modal="img"]');
    const modalName = this.pokemonModal.querySelector('[data-modal="name"]');
    const modalID = this.pokemonModal.querySelector('[data-modal="id"]');
    const modalWeight = this.pokemonModal.querySelector('[data-modal="weight"]');
    const modalHeight = this.pokemonModal.querySelector('[data-modal="height"]');
    const modalType = this.pokemonModal.querySelector('[data-modal="type"]');
    const modalTypes = modalType.parentElement;
    const modalOldTypes = this.pokemonModal.querySelectorAll('[data-remove="remove"]');
    const modalWeaknesses = this.pokemonModal.querySelector('[data-modal="weaknesses"]');
    const modalStats = this.pokemonModal.querySelectorAll('[data-modal="stats"]');
    const modalPlusTypes = this.pokemonModal.querySelector('[data-modal="plusTypes"]');
    this.pokemonModal.style.backgroundImage = `url(/img/bg-types/${args[5][0].type}-background.svg)`;

    modalImg.setAttribute('src', args[0]);
    modalName.innerText = args[1];
    modalID.innerText = `#${args[2]}`;
    modalWeight.innerText = args[3];
    modalHeight.innerText = args[4];

    const WeaknessFetch = await fetch(`https://pokeapi.co/api/v2/type/${args[5][0].type}`);
    const WeaknessJSON = await WeaknessFetch.json();
    const Weaknesses = WeaknessJSON.damage_relations.double_damage_from.map((e) => e.name);
    const Types = args[5].map((e) => e.type);

    if (Types.length > 1) modalTypes.classList.add('on');
    else if (Types.length <= 1) modalTypes.classList.remove('on');

    modalOldTypes.forEach((e) => e.remove());

    Types.forEach((type) => {
      if (Types.indexOf(type) === 0) {
        modalType.innerText = type.toUpperCase();
        modalType.dataset.value = type;
      } else {
        const newType = document.createElement('li')
        newType.innerText = type.toUpperCase();
        newType.dataset.value = type
        newType.dataset.remove = 'remove';

        modalPlusTypes.appendChild(newType);
      }
    })

    Weaknesses.forEach((e) => {
      const modalWeaknessEl = document.createElement('li');
      modalWeaknessEl.dataset.value = e;
      modalWeaknessEl.dataset.remove = 'remove';
      modalWeaknessEl.innerText = e.toUpperCase();

      modalWeaknesses.appendChild(modalWeaknessEl);
    })

    modalStats.forEach((stat, index) => {
      let statValue = args[6][index].value;
      statValue = statValue > 100 ? 100 : statValue;

      stat.style.width = `${statValue}%`;
    })
  }

  bindMethods() {
    this.filterPokemon = this.filterPokemon.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
  }

  addEvent() {
    this.pokemonFilter.forEach((e) => e.addEventListener('click', this.filterPokemon))
    this.pokemonSearch[0].addEventListener('keyup', this.searchPokemon)
    this.pokemonSearch[1].addEventListener('click', this.searchPokemon)
    this.pokemonPlusType.addEventListener('click', (e) => {
      const pokemonPlusTypeCont = e.currentTarget.nextElementSibling;

      pokemonPlusTypeCont.classList.toggle('on');
      e.currentTarget.classList.toggle('on');
    })
    this.pokemonShow.addEventListener('click', () => {
      this.insertPokemon(1, 18)
    })
    this.pokemonModal.querySelector('[data-exit]').addEventListener('click', () => {
      const pokemonOn = document.querySelector('.pokemon.on')
      const pokemonActive = this.pokemonModal.querySelectorAll('.on')

      pokemonOn.classList.toggle('on');
      pokemonOn.classList.toggle('initial');
      pokemonOn.classList.toggle('final');

      this.pokemonModal.classList.remove('on')
      document.body.classList.remove('modal-on')
      pokemonActive.forEach((e) => e.classList.remove('on'));
    });
  }

  init() {
    this.bindMethods();
    this.addEvent();

    return this
  }
}
