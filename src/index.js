import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

import { createMarkup } from './helpers/markup';
import { params, elems } from './helpers/common';

require('dotenv').config();

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.get['Content-Type'] = 'application/json';

const api_key = process.env.API_KEY;
const { typeimg, orient, safeimg } = params;
const { formData, gallery, btnMore } = elems;

const largeImg = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});

let data;
let currentPage = 1;
const perPage = 40; // Изменено на 40

// Render data
function renderData(res) {
    const markup = createMarkup(res);
    gallery.insertAdjacentHTML('beforeend', markup);
    largeImg.refresh();
    formData.reset();
}

function handleError(error) {
    console.error(error);
}

function handleLoadMoreButton(totalHits) {
    const trueVal = currentPage * perPage;
    console.dir(`Loaded: ${trueVal} pages`);
    if (trueVal < totalHits) {
        btnMore.style.display = 'inline';
    } else {
        btnMore.style.display = 'none';
        Notify.info(
            `"We're sorry, but you've reached the end of search results."`,
            {
                width: '300px',
                fontSize: '20px',
                position: 'center-top',
                timeout: 5000,
                plainText: false,
                cssAnimationStyle: 'fade',
                cssAnimation: true,
            },
        );
    }
}

btnMore.addEventListener('click', async function () {
    currentPage += 1;
    await getImages();
});

let notificationsShown = false;

function showNotification(totalHits) {
    if (!notificationsShown) {
        Notify.success(`Hooray! We found ${totalHits} images.`, {
            width: '300px',
            fontSize: '20px',
            position: 'center-top',
            timeout: 5000,
            plainText: false,
            cssAnimationStyle: 'fade',
            cssAnimation: true,
        });
        notificationsShown = true;
    }
}

// Key value search
async function getImages() {
    try {
        let searchParams = `?key=${api_key}&q=${data}&imagetype=${typeimg}&orientation=${orient}&safesearch=${safeimg}`;

        const response = await axios.get(
            searchParams + `&page=${currentPage}&per_page=${perPage}`,
        );

        const {
            data: { hits, totalHits },
        } = response;

        if (hits.length === 0) {
            Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
                {
                    width: '300px',
                    fontSize: '20px',
                    position: 'center-center',
                    timeout: 5000,
                    plainText: false,
                    cssAnimationStyle: 'fade',
                    cssAnimation: true,
                },
            );
            throw new TypeError('No results');
        }

        console.dir('Response status:', response.status);
        console.log('Total pages:', totalHits);

        renderData(hits);
        handleLoadMoreButton(totalHits);

        if (!notificationsShown && hits.length === 40) {
            showNotification(totalHits);
        }
    } catch (error) {
        handleError(error);
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
        Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
            {
                width: '300px',
                fontSize: '20px',
                position: 'center-center',
                timeout: 5000,
                plainText: false,
                cssAnimationStyle: 'fade',
                cssAnimation: true,
            },
        );
        throw new TypeError('No input data');
    }
    data = inputData;
    currentPage = 1;
    await getImages();
});
