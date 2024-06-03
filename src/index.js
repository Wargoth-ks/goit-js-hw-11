import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './helpers/markup';
import { params } from './helpers/common';

require('dotenv').config();

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const largeImg = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});

const formData = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
// let btnMore = document.querySelector('.load-more');

const { typeimg, orient, safeimg } = params;

// Render data
function renderData(res) {
    const markup = createMarkup(res);
    gallery.insertAdjacentHTML('beforeend', markup);
    largeImg.refresh();
    formData.reset();
}

// Key value search
async function getImages(keyword) {
    try {
        const response = await axios.get(
            `?key=${process.env.API_KEY}&q=${keyword}&imagetype=${typeimg}&orientation=${orient}&safesearch=${safeimg}`,
        );
        const {
            data: { hits },
        } = response;

        if (hits.length === 0) {
            console.log('No results');
            return;
        }
        console.log('Data ok', hits);
        renderData(hits);
    } catch (error) {
        console.log('Error: ', error.message);
    }
}

// Listen button
formData.addEventListener('submit', async function (event) {
    event.preventDefault();

    gallery.innerHTML = '';
    const {
        elements: { searchQuery },
    } = event.target;
    const inputData = searchQuery.value.trim().toLowerCase();
    if (inputData.length == '') {
        // console.dir('No input data');
        throw new TypeError('No input data');
    }
    await getImages(inputData);
});
