const { createApp } = Vue;

createApp({
    data() {
        return {
            pokemons: [],
            filteredPokemons: [],
            loading: true,
            searchText: '',
            nextPage: 1,
        }
    },
    created() {
        this.callAPI();
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        async callAPI() {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(this.nextPage - 1) * 151}&limit=151`);
                const data = await response.json();
                const pokemonDetailsPromises = data.results.map(async pokemon => this.fetchPokemonData(pokemon.url));
                this.pokemons = await Promise.all(pokemonDetailsPromises);
                this.filteredPokemons = this.pokemons;
                this.nextPage++;
                this.loading = false;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchPokemonData(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    weight: data.weight,
                    types: data.types,
                    sprites: data.sprites,
                    showDetails: false,
                }
            } catch (e) {
                console.error(e);
            }
        },
        handleScroll() {
            const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            if (bottomOfWindow && !this.loading) {
                this.loading = true;
                this.callAPI();
            }
        },
        getTypeClass(types) {
            return types.map(type => this.getTypeClassSingle(type.type.name)).join(' ');
        },
        getTypeClassSingle(type) {
            const classTypeMap = {
                fire: 'fire',
                grass: 'grass',
                water: 'water',
                bug: 'bug',
                normal: 'normal',
                poison: 'poison',
                electric: 'electric',
                ground: 'ground',
                ghost: 'ghost',
                fighting: 'fighting',
                psychic: 'psychic',
                rock: 'rock',
                ice: 'ice',
                steel: 'steel',
                dark: 'dark',
                flying: 'flying',
                fairy: 'fairy',
                dragon: 'dragon',
            };
            return classTypeMap[type] || '';
        },
        filterPokemons() {
            this.filteredPokemons = this.pokemons.filter(pokemon => 
                pokemon.name.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    }
}).mount("#app");