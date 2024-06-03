import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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

// Глобальные переменные для хранения текущей страницы и количества фотографий на странице
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

// Функция для обработки ошибок
function handleError(error) {
    console.error(error);
    // Обработка ошибки, например, вывод сообщения об ошибке на странице
}

// Функция для отображения кнопки "Load more" и обработки нажатия на нее
function handleLoadMoreButton(totalHits) {
    const trueVal = currentPage * perPage;
    console.dir(`Loaded: ${trueVal} pages`);
    if (trueVal < totalHits) {
        btnMore.style.display = 'inline';
    } else {
        btnMore.style.display = 'none';
        // Вывод сообщения об окончании результатов поиска
        // Например, можно создать элемент с сообщением и добавить его на страницу
        const endMessage = document.createElement('p');
        endMessage.textContent =
            "We're sorry, but you've reached the end of search results.";
        gallery.appendChild(endMessage);
    }
}

btnMore.addEventListener('click', async function () {
    currentPage += 1;
    await getImages();
});

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
            throw new TypeError('No results');
        }

        renderData(hits);
        console.dir('Response status:', response.status);
        console.log('Total pages:', totalHits);
        handleLoadMoreButton(totalHits);
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
        throw new TypeError('No input data');
    }
    data = inputData;
    currentPage = 1; // Сброс значения currentPage при новом поиске
    await getImages();
});
