class NewsBlock {
    constructor(containerId, images, titles) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.titles = titles;
        this.newsItems = [];
    }

    createImageElement(imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Новостное изображение';
        img.className = 'news-image';
        return img;
    }

    createParagraphElement(text) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'news-text';
        return p;
    }

    addNewsItem(imageUrl, title, position = 'end') {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const img = this.createImageElement(imageUrl);
        const p = this.createParagraphElement(title);

        newsItem.appendChild(img);
        newsItem.appendChild(p);

        if (position === 'start') {
            this.container.prepend(newsItem);
        } else {
            this.container.appendChild(newsItem);
        }

        this.newsItems.push(newsItem);
        return newsItem;
    }

    initialize() {
        const imageIterator = this.images.values();
        const titleIterator = this.titles.values();

        for (let i = 0; i < Math.min(this.images.size, this.titles.size); i++) {
            this.addNewsItem(imageIterator.next().value, titleIterator.next().value);
        }
    }

    getAllImages() {
        return this.container.querySelectorAll('.news-image');
    }

    getAllParagraphs() {
        return this.container.querySelectorAll('.news-text');
    }
}

class ExtendedNewsBlock extends NewsBlock {
    constructor(containerId, images, titles) {
        super(containerId, images, titles);
        this.setupControls();
    }

    setupControls() {
        this.addNewsBtn = document.getElementById('add-news-btn');
        this.addImageBtn = document.getElementById('add-image-btn');
        this.newsText = document.getElementById('news-text');
        this.imageUrl = document.getElementById('image-url');
        this.newsPosition = document.getElementById('news-position');
        this.imagePosition = document.getElementById('image-position');

        this.addNewsBtn.addEventListener('click', () => this.addCustomNews());
        this.addImageBtn.addEventListener('click', () => this.addCustomImage());
    }

    addCustomNews() {
        const text = this.newsText.value.trim();
        if (!text) return;

        const position = this.newsPosition.value;
        const paragraphs = this.getAllParagraphs();
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        if (paragraphs.length === 0) {
            const p = this.createParagraphElement(text);
            newsItem.appendChild(p);
            this.container.appendChild(newsItem);
        } else {
            const p = this.createParagraphElement(text);
            newsItem.appendChild(p);

            switch (position) {
                case 'before-first':
                    this.container.insertBefore(newsItem, paragraphs[0].parentElement);
                    break;
                case 'after-first':
                    if (paragraphs.length > 1) {
                        this.container.insertBefore(newsItem, paragraphs[1].parentElement);
                    } else {
                        this.container.appendChild(newsItem);
                    }
                    break;
                case 'after-last':
                    default:
                    this.container.appendChild(newsItem);
            }
        }

        this.newsItems.push(newsItem);
        this.newsText.value = '';
    }

    addCustomImage() {
        const url = this.imageUrl.value.trim();
        if (!url) return;

        const position = this.imagePosition.value;
        const images = this.getAllImages();

        if (images.length === 0) {
            const img = this.createImageElement(url);
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.appendChild(img);
            this.container.appendChild(newsItem);
        } else {
            const img = this.createImageElement(url);
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.appendChild(img);

            switch (position) {
                case 'before-first':
                    this.container.insertBefore(newsItem, images[0].parentElement);
                    break;
                case 'after-last':
                default:
                    this.container.appendChild(newsItem);
            }
        }

        this.imageUrl.value = '';
    }

    addNewsWithImage(imageUrl, title, position = 'end') {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const img = this.createImageElement(imageUrl);
        const p = this.createParagraphElement(title);

        newsItem.appendChild(img);
        newsItem.appendChild(p);

        const paragraphs = this.getAllParagraphs();

        if (position === 'start' && paragraphs.length > 0) {
            this.container.insertBefore(newsItem, paragraphs[0].parentElement);
        } else if (position === 'middle' && paragraphs.length > 1) {
            const middleIndex = Math.floor(paragraphs.length / 2);
            this.container.insertBefore(newsItem, paragraphs[middleIndex].parentElement);
        } else {
            this.container.appendChild(newsItem);
        }

        this.newsItems.push(newsItem);
        return newsItem;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newsBlock = new ExtendedNewsBlock('news-container', newsImages, newsTitles);
    newsBlock.initialize();
});