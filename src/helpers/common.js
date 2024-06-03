const params = {
    typeimg: '&imagetype=photo',
    orient: '&orientation=horizontal',
    safeimg: '&safesearch=true',
};

const elems = {
    formData: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    btnMore: document.querySelector('.load-more'),
};

const failOpts = {
    width: '300px',
    fontSize: '18px',
    position: 'center-center',
    timeout: 5000,
    plainText: false,
    cssAnimationStyle: 'fade',
    cssAnimation: true,
};

const sucOpts = {
    width: '300px',
    fontSize: '20px',
    position: 'center-top',
    timeout: 5000,
    plainText: false,
    cssAnimationStyle: 'fade',
    cssAnimation: true,
};

export { params, elems, failOpts, sucOpts };
