import 'style/style.scss';
import uuid from 'uuid/v4';

// sizes : [mstzb]


const uid = uuid();
const currentScript = document.currentScript;
currentScript.setAttribute('id', uid);

const API_KEY = 'b36822a18ddea0e3bd497a333e3b696d';
const TOPIC = currentScript.dataset.topic || '${TOPIC}';
const IMG_COUNT = currentScript.dataset.nbrImages || 3;
const searchUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&tags=${TOPIC}&format=json&nojsoncallback=1`;

const widget = document.createElement('div');
widget.setAttribute('id', 'widget-'+uid);

let allPhotos = [];


function success(data) {
  allPhotos = data.photos.photo;

  if (allPhotos.length > 0) {
    for (let i=0; i< IMG_COUNT; i++ ) {
      const imgEl = createImgElement(allPhotos.pop());

      imgEl.onclick = clickListener;
      widget.appendChild(imgEl);
    }
  }
}


function isBlocked(id) {
  const blockedImages = JSON.parse(window.localStorage.getItem('blocked_images')) || [];
  return blockedImages.includes(id);
}

function blockImage(id) {
  const blockedImages = JSON.parse(window.localStorage.getItem('blocked_images')) || [];
  blockedImages.push(id);
  window.localStorage.setItem('blocked_images', JSON.stringify(blockedImages));
}

function clickListener(event) {
  blockImage(event.target.parentElement.id);
  document.getElementById(event.target.parentElement.id).remove();
  event.cancelBubble = true;
  widget.appendChild(createImgElement(allPhotos.pop()));
};

function createImgElement(photoData) {
  while (isBlocked(photoData.id)) {
    photoData = allPhotos.pop();
  }
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.setAttribute('id', photoData.id);

  const img = document.createElement('img');
  const src = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}_q.jpg`;
  img.setAttribute('src', src);
  img.onclick = clickListener;

  card.appendChild(img);
  return card;
}

const configObj = {
  method: 'GET',
  mode: 'cors',
  cache: 'default'
};

fetch(searchUrl, configObj).then((data) => {
  if (data.ok) {
    // return JSON.parse(data.text());
    return data.json();
  }
  throw new Error('Something went wrong. Please wait patiently until all the planets align');
}).then(success);

const parent = currentScript.parentElement;
parent.append(widget);

