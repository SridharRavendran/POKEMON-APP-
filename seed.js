const { sequelize, Pokemon, Stat } = require('./models');
const axios = require('axios');

(async () => {
    try {
        await sequelize.sync({ force: true });
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const pokemons = await Promise.all(
            data.results.map(async (pokemon) => {
                const pokemonData = (await axios.get(pokemon.url)).data;
                const createdPokemon = await Pokemon.create({
                    id: pokemonData.id,
                    name: pokemonData.name,
                    image: pokemonData.sprites.front_default,
                    type: pokemonData.types[0].type.name,
                    height: pokemonData.height,
                    weight: pokemonData.weight
                });
                await Stat.create({
                    pokemon_id: createdPokemon.id,
                    hp: pokemonData.stats[0].base_stat,
                    attack: pokemonData.stats[1].base_stat,
                    defense: pokemonData.stats[2].base_stat,
                    special_attack: pokemonData.stats[3].base_stat,
                    special_defense: pokemonData.stats[4].base_stat
                });
                return createdPokemon;
            })
        );
        console.log(`Seeded ${pokemons.length} pokemons!`);
        process.exit();
    } catch (error) {
        console.error(error);
    }
})();
