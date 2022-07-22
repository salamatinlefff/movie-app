class LocalStorageService {
  loadLocalRated = () =>
    localStorage.getItem('rated-movies') ? JSON.parse(localStorage.getItem('rated-movies')) : [];

  saveLocalRated = (obj) => {
    const storage = localStorage.getItem('rated-movies')
      ? JSON.parse(localStorage.getItem('rated-movies'))
      : [];
    let newStorage;

    const hasItem = storage.find((item) => item.id === obj.id);

    if (hasItem) {
      newStorage = [...storage].map((item) => {
        if (item.id === obj.id) return obj;

        return item;
      });
    } else {
      newStorage = [...storage, obj];
    }

    return localStorage.setItem('rated-movies', JSON.stringify(newStorage));
  };
}

export { LocalStorageService };
