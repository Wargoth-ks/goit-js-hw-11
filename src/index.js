import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './helpers/markup';
import { params } from './helpers/common';

require('dotenv').config();

axios.defaults.baseURL = 'https://pixabay.com/api/';

const largeImg = new SimpleLightbox('.gallery a', {
    captionDelay: 250
});

const search = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
// let btnMore = document.querySelector('.load-more');

const { typeimg, orient, safeimg } = params;

async function getImages(evt) {
    return await axios.get(
        `?key=${process.env.API_KEY}&q=${evt}&image_type=${typeimg}&orientation=${orient}&safesearch=${safeimg}`,
    );
}

function onSearch(e) {
    e.preventDefault();

    gallery.innerHTML = '';
    const {
        elements: { searchQuery },
    } = e.target;
    const input = searchQuery.value.trim().toLowerCase();
    console.log(input);
    getImages(input)
        .then(response => {
            // console.dir(response.data.hits);
            console.dir(response.status);
            const markup = createMarkup(response.data.hits);
            gallery.insertAdjacentHTML('beforeend', markup);
            largeImg.refresh();
        })
        .catch(error => console.log(error.response.status));
    search.reset();
    // btnMore.style.display = 'inline';
}

search.addEventListener('submit', onSearch);
