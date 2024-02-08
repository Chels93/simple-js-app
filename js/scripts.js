let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let listElement = document.querySelector('.pokemon-list'); // Selecting the list element
    let listItem = document.createElement('li');

    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.setAttribute('data-id', pokemonList.length)
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#exampleModal');
    button.classList.add('button-class');
    listItem.appendChild(button);
    listElement.appendChild(listItem);
  }

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  async function loadDetails(item) {
    let url = item.detailsUrl;
    try {
      const response = await fetch(url);
      const details = await response.json();
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types;
    } catch (e) {
      console.error(e);
    }
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {

      let modalBody = document.querySelector('.modal-body');
      let modalTitle = document.querySelector('.modal-title');

      // Create modal content
      // Create element for name
      let nameElement = document.createElement('h1');
      nameElement.innerText = pokemon.name;

      // Create element for image
      let imageElementFront = document.createElement('img');
      imageElementFront.classList.add('modal-img');
      imageElementFront.style.width = '50%';
      imageElementFront.src = pokemon.imageUrlFront;
      let imageElementBack = document.createElement('img');
      imageElementBack.classList.add('modal-img');
      imageElementBack.style.width = '50%';
      imageElementBack.src = pokemon.imageUrlBack;

      // Create element for height
      let heightElement = document.createElement('p');
      heightElement.innerText = 'Height: ' + pokemon.height + ' meters';

      // Create element for weight
      let weightElement = document.createElement('p');
      weightElement.innerText = 'Weight: ' + pokemon.weight + ' kg';

      // Create element for types
      let typesElement = document.createElement('p');
      typesElement.innerText = 'Types: ' + pokemon.types.join(', ');

      // Append elements to modal content
      modalTitle.appendChild(nameElement);
      modalBody.appendChild(imageElementFront);
      modalBody.appendChild(imageElementBack);
      modalBody.appendChild(heightElement);
      modalBody.appendChild(weightElement);
      modalBody.appendChild(typesElement);
    });
  }

  $('#exampleModal').on('show.bs.modal', function (event) {
    let pokemonID = parseInt(event.relatedTarget.dataset.id);
    showDetails(pokemonRepository.getAll()[pokemonID]);
  });


  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});






