class BlockManager {
    constructor() {
        this.blocksContainer = document.getElementById('blocks-container');
        this.blocks = new Map();
        this.nextId = 1;
        
        this.titles = new Set([
            'Новости', 'Наука', 'Реальная жизнь', 'Путешествия'
        ]);
        
        this.images = new Set([
            'resources/images/БарашКороль.png',
            'resources/images/КарКарыч моряк.png',
            'resources/images/Крош с мороженым.png',
            'resources/images/Совунья врач.png',
            'resources/images/Копатыч с лейкой.png'
        ]);
        
        this.contents = new Set([
            'Срочные новости, новым королем Смешариков стал Бараш!',
            'Нынче отправиться в кругосветку не так уж и сложно, Кар-Карыч тому пример!',
            'Как там в песне Барбариков, оса просто хочет познакомиться, а вовсе не ужалить (или попросить мороженко)',
            'Все то же зелье от Ежика Совунья вовсе не рекомендует, лечить то в итоге ей прошлось',
            'Просто Копатыч с лейкой'
        ]);
        
        this.sizes = new Set(['200px', '300px', '400px', '500px', '600px']);
        this.margins = new Set(['10px', '20px', '30px', '40px', '50px']);
        
        this.initControls();
    }
    
    initControls() {
        document.getElementById('create-block-btn').addEventListener('click', () => {
            const title = document.getElementById('block-title').value;
            const image = document.getElementById('block-image').value;
            const content = document.getElementById('block-content').value;
            const width = document.getElementById('block-width').value;
            const height = document.getElementById('block-height').value;
            const margin = document.getElementById('block-margin').value;
            
            this.createBlock(title, image, content, width, height, margin);
        });
    }
    
    createBlock(title, image, content, width, height, margin) {
        const blockId = `block-${this.nextId++}`;

        const block = document.createElement('div');
        block.className = 'content-block';
        block.id = blockId;
        block.style.width = width;
        console.log(Number(height.split('').slice(0, height.length - 2).join('')))
        block.style.height = Number(height.split('').slice(0, height.length - 2).join('')) + 100 + "px";
        block.style.margin = margin;
        const header = document.createElement('div');
        header.className = 'block-header';
        header.textContent = title;

        const img = document.createElement('img');
        img.className = 'block-image';
        img.src = image;
        img.alt = title;
        img.setAttribute('style', `height: ${height / 3}`)

        const contentSection = document.createElement('div');
        contentSection.className = 'block-content';
        contentSection.textContent = content;

        const controls = document.createElement('div');
        controls.className = 'block-controls';

        const editBtn = document.createElement('button');
        editBtn.className = 'block-btn edit-btn';
        editBtn.textContent = 'Редактировать';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'block-btn delete-btn';
        deleteBtn.textContent = 'Удалить';

        const editForm = document.createElement('div');
        editForm.className = 'edit-form';

        controls.appendChild(editBtn);
        controls.appendChild(deleteBtn);

        block.appendChild(header);
        block.appendChild(img);
        block.appendChild(contentSection);
        block.appendChild(controls);
        block.appendChild(editForm);

        this.blocksContainer.appendChild(block);

        this.blocks.set(blockId, {
            element: block,
            title,
            image,
            content,
            width,
            height,
            margin
        });

        deleteBtn.addEventListener('click', this.deleteBlock.bind(this, blockId));
        editBtn.addEventListener('click', this.toggleEditForm.bind(this, blockId));

        this.setupEditForm(blockId);
    }
    
    deleteBlock(blockId) {
        if (this.blocks.has(blockId)) {
            this.blocks.get(blockId).element.remove();
            this.blocks.delete(blockId);
        }
    }
    
    toggleEditForm(blockId) {
        const blockData = this.blocks.get(blockId);
        const editForm = blockData.element.querySelector('.edit-form');
        
        if (editForm.classList.contains('active')) {
            editForm.classList.remove('active');
        } else {
            editForm.classList.add('active');
        }
    }
    
    setupEditForm(blockId) {
        const blockData = this.blocks.get(blockId);
        const editForm = blockData.element.querySelector('.edit-form');
        
        editForm.innerHTML = '';
        
        const titleLabel = document.createElement('label');
        titleLabel.textContent = 'Заголовок:';
        titleLabel.setAttribute('for', `edit-title-${blockId}`);
        
        const titleSelect = document.createElement('select');
        titleSelect.id = `edit-title-${blockId}`;
        titleSelect.className = 'form-control';
        
        this.titles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            option.selected = title === blockData.title;
            titleSelect.appendChild(option);
        });
        
        const imageLabel = document.createElement('label');
        imageLabel.textContent = 'Изображение:';
        imageLabel.setAttribute('for', `edit-image-${blockId}`);
        
        const imageSelect = document.createElement('select');
        imageSelect.id = `edit-image-${blockId}`;
        imageSelect.className = 'form-control';
        
        this.images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image.split('/').pop();
            option.selected = image === blockData.image;
            imageSelect.appendChild(option);
        });
        
        const contentLabel = document.createElement('label');
        contentLabel.textContent = 'Содержимое:';
        contentLabel.setAttribute('for', `edit-content-${blockId}`);
        
        const contentSelect = document.createElement('select');
        contentSelect.id = `edit-content-${blockId}`;
        contentSelect.className = 'form-control';
        
        this.contents.forEach(content => {
            const option = document.createElement('option');
            option.value = content;
            option.textContent = content;
            option.selected = content === blockData.content;
            contentSelect.appendChild(option);
        });
        
        const marginLabel = document.createElement('label');
        marginLabel.textContent = 'Отступ:';
        marginLabel.setAttribute('for', `edit-margin-${blockId}`);
        
        const marginSelect = document.createElement('select');
        marginSelect.id = `edit-margin-${blockId}`;
        marginSelect.className = 'form-control';
        
        this.margins.forEach(margin => {
            const option = document.createElement('option');
            option.value = margin;
            option.textContent = margin;
            option.selected = margin === blockData.margin;
            marginSelect.appendChild(option);
        });
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn';
        saveBtn.textContent = 'Сохранить';
        
        saveBtn.addEventListener('click', () => {
            this.updateBlock(
                blockId,
                titleSelect.value,
                imageSelect.value,
                contentSelect.value,
                blockData.width,
                blockData.height,
                marginSelect.value
            );
            this.toggleEditForm(blockId);
        });
        
        editForm.appendChild(titleLabel);
        editForm.appendChild(titleSelect);
        editForm.appendChild(imageLabel);
        editForm.appendChild(imageSelect);
        editForm.appendChild(contentLabel);
        editForm.appendChild(contentSelect);
        editForm.appendChild(marginLabel);
        editForm.appendChild(marginSelect);
        editForm.appendChild(saveBtn);
    }
    
    updateBlock(blockId, title, image, content, width, height, margin) {
        const blockData = this.blocks.get(blockId);
        
        if (blockData) {
            blockData.title = title;
            blockData.image = image;
            blockData.content = content;
            blockData.width = width;
            blockData.height = height;
            blockData.margin = margin;
            
            const block = blockData.element;
            block.querySelector('.block-header').textContent = title;
            block.querySelector('.block-image').src = image;
            block.querySelector('.block-content').textContent = content;
            block.style.margin = margin;
            
            this.blocks.set(blockId, blockData);
        }
    }
    
    findBlocksByTitle(title) {
        const result = [];
        this.blocks.forEach((blockData, blockId) => {
            if (blockData.title === title) {
                result.push(blockId);
            }
        });
        return result;
    }
    
    filterBlocksBySize(size) {
        const result = [];
        this.blocks.forEach((blockData, blockId) => {
            if (blockData.width === size || blockData.height === size) {
                result.push(blockId);
            }
        });
        return result;
    }
}

const initializeApp = (() => {
    let blockManager;
    
    return () => {
        if (!blockManager) {
            blockManager = new BlockManager();
            console.log('Приложение инициализировано');
        }
        return blockManager;
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});