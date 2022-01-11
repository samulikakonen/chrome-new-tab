// Date & time
let updateTimeInterval;
const timeBlock = document.getElementById('time');
const dateBlock = document.getElementById('date');

const updateTime = () => {
  const date = new Date();
  const hour = date.getHours();
  const hours = hour < 10 ? '0' + hour : hour;
  const min = date.getMinutes();
  const minutes = min < 10 ? '0' + min : min;

  timeBlock.innerHTML = `${hours}:${minutes}`;
  dateBlock.innerHTML = `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()}`;
};

const startInterval = () => {
  updateTime();
  updateTimeInterval = setInterval(() => updateTime(), 2000);
};

document.addEventListener('visibilitychange', function (e) {
  if (document.hidden) clearInterval(updateTimeInterval);
  if (!document.hidden) startInterval();
});

// Get bookmarks
chrome.bookmarks.getSubTree('1').then((bookmarks) => {
  const parent = document.getElementById('favorites');
  bookmarks[0].children.forEach((bookmark) => {
    const linkElem = document.createElement('a');
    linkElem.href = bookmark.url;
    const newElem = document.createElement('div');
    newElem.classList.add('favorite');

    const favicon = document.createElement('img');
    favicon.src =
      'https://s2.googleusercontent.com/s2/favicons?domain=' + bookmark.url;

    const text = document.createElement('p');
    text.appendChild(document.createTextNode(bookmark.title));

    newElem.appendChild(favicon);
    newElem.appendChild(text);

    linkElem.appendChild(newElem);
    parent.appendChild(linkElem);
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
    const weatherDesc = document.getElementById('weather-description');
    weatherDesc.innerHTML = data.weather[0].description;
  });

// Start background update service
startInterval();
