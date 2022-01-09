// Date & time
const updateTimeInterval;
window.onload = () => {
  const timeBlock = document.getElementById('time');
  const dateBlock = document.getElementById('date');

  updateTimeInterval = setInterval(() => {
    const date = new Date();
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  
    timeBlock.innerHTML = `${date.getHours()}:${minutes}`;
    dateBlock.innerHTML = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`;
  }, 1000);

  
};

// Get bookmarks
chrome.bookmarks.getSubTree('1').then((bookmarks) => {
  const parent = document.getElementById('favorites');
  bookmarks[0].children.forEach((bookmark) => {
    const newElem = document.createElement('div');
    newElem.classList.add('favorite');

    const favicon = document.createElement('img');
    favicon.src =
      'https://s2.googleusercontent.com/s2/favicons?domain=' + bookmark.url;

    const text = document.createElement('p');
    text.appendChild(document.createTextNode(bookmark.title));

    newElem.appendChild(favicon);
    newElem.appendChild(text);

    parent.appendChild(newElem);
  });
});

// Fetch news from Ilta-Sanomat
fetch('https://www.is.fi/rss/tuoreimmat.xml')
  .then((response) => response.text())
  .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
  .then((data) => {
    const news = document.getElementById('news');

    const logoUrl = data.querySelector('image')?.querySelector('url').innerHTML;
    const image = document.createElement('img');
    image.src = logoUrl;
    image.alt = '';
    console.log(data.querySelector('image')?.querySelector('url').innerHTML);
    document.getElementById('news-outlet').appendChild(image);

    const items = data.querySelectorAll('item');

    items.forEach((item) => {
      const link = document.createElement('a');

      const newsImg = document.createElement('img');
      newsImg.src = item.querySelector('content')?.getAttribute('url');
      newsImg.alt = '';

      link.appendChild(newsImg);

      let text = item.querySelector('title').innerHTML;
      text = text.replace('<![CDATA[', '').replace(']]>', '');

      link.appendChild(document.createTextNode(text));
      link.href = item.querySelector('link').innerHTML;

      news.appendChild(link);
    });
  });

// Fetch weather for Helsinki
fetch(
  'https://api.openweathermap.org/data/2.5/weather?q=helsinki&appid=' + token
)
  .then((response) => response.json())
  .then((data) => {
    const temperature = document.getElementById('temperature');
    temperature.innerHTML = `${Number(data.main.temp - 273.15).toFixed()}°C`;
    console.log(data.main.temp);
    console.log(typeof data.main.temp);
    const weatherDesc = document.getElementById('weather-description');
    weatherDesc.innerHTML = data.weather[0].description;
  });

// ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ
