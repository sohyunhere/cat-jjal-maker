import React from "react";
import './App.css';
import Form from './components/Form';
import Title from './components/Title';
import MainCard from './components/MainCard';
import Favorites from './components/Favorites';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const App = () => {

  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  });
  const [mainCatImage, setMainCatImage] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []
  });

  const alreadyFavorite = favorites.includes(mainCatImage)

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    setMainCatImage(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, [])

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setCounter((prev) => { //prev는 setCounter 하기 전 counter의 값을 가져온다
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });

    setMainCatImage(newCat);
  }

  function hadleHeartClick() {
    const nextFavorites = [...favorites, mainCatImage];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }
  const counterTitle = counter === null ? "" : counter + '번째 '

  return (
    <div>
      <Title>
        {counterTitle}고양이 가라사대
      </Title>

      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCatImage} onHeartClick={hadleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  )
}

export default App;
