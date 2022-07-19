const saveLocalRated = (obj) => {
  const storage = localStorage.getItem('rated-movies')
    ? JSON.parse(localStorage.getItem('rated-movies'))
    : [];

  const newStorage = JSON.stringify([...storage, obj]);

  localStorage.setItem('rated-movies', newStorage);
};

const loadLocalRated = () =>
  localStorage.getItem('rated-movies') ? JSON.parse(localStorage.getItem('rated-movies')) : [];

export { saveLocalRated, loadLocalRated };
