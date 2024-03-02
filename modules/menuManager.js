import { startMenu, gameMenu, bagMenu, pokemonMenu, pokemonDetailsMenu } from "./modules/loaders/menuLoader.js";
import { State } from "./state.js";

export function updateMenu(activeMenu) {
    let menu = null;
    let state = null;

    if (activeState === State.Start && activeMenu !== startMenu) {
        menu = startMenu;
    } else if (activeState === State.Bag && activeMenu !== bagMenu) {
        menu = bagMenu;
    } else if (activeState === State.PokemonTeam && activeMenu !== pokemonMenu) {
        menu = pokemonMenu;
    } else if (activeState === State.PokemonDetails && activeMenu !== pokemonDetailsMenu) {
        menu = pokemonDetailsMenu;
    } else if (activeState === State.GameMenu && activeMenu !== gameMenu) {
        menu = gameMenu;
    }
    
    if (menu !== null) menu.reset()

    if (menu === gameMenu) {
        if (gameMenu.bagSelected()) state = State.Bag
        else if (gameMenu.pokemonSelected()) state = State.PokemonTeam
        else if (gameMenu.saveSelected()) state = State.Save
    }

    return [menu, state]
}