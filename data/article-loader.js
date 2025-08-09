// Article Loader - Dynamically loads articles from articledata.js

document.addEventListener('DOMContentLoaded', function() {
    const articleList = document.getElementById('article-list');
    
    if (!articleList) {
        console.error('Article list container not found');
        return;
    }
    
    // Check if articleData is available
    if (typeof window.articleData === 'undefined') {
        console.error('Article data not found. Make sure articledata.js is loaded before article-loader.js');
        return;
    }
    
    // Clear any existing content
    articleList.innerHTML = '';
    
    // Load and display articles
    window.articleData.forEach((article, index) => {
        const articleElement = createArticleElement(article, index + 1);
        articleList.appendChild(articleElement);
    });
    
    // Trigger animations after content is loaded
    setTimeout(() => {
        triggerAnimations();
    }, 100);
});

function createArticleElement(article, staggerIndex) {
    const articleElement = document.createElement('article');
    articleElement.className = `article-item fade-up stagger-${staggerIndex}`;
    
    // Create article header
    const header = document.createElement('div');
    header.className = 'article-header';
    
    const meta = document.createElement('div');
    meta.className = 'article-meta';
    
    const topic = document.createElement('span');
    topic.className = 'article-topic';
    topic.textContent = article.topic;
    
    const date = document.createElement('span');
    date.className = 'article-date';
    date.textContent = article.date;
    
    meta.appendChild(topic);
    meta.appendChild(date);
    
    const title = document.createElement('h2');
    title.className = `article-title slide-right stagger-${staggerIndex + 1}`;
    title.textContent = article.title;
    
    header.appendChild(meta);
    header.appendChild(title);
    
    // Create article content
    const content = document.createElement('div');
    content.className = 'article-content';
    
    article.content.forEach((paragraph, paraIndex) => {
        const p = document.createElement('p');
        p.className = `fade-up stagger-${staggerIndex + 2 + paraIndex}`;
        p.textContent = paragraph;
        content.appendChild(p);
    });
    
    // Assemble the article
    articleElement.appendChild(header);
    articleElement.appendChild(content);
    
    return articleElement;
}

function triggerAnimations() {
    // Trigger intro animations
    const introElements = document.querySelectorAll('.intro-fade-up');
    introElements.forEach(element => {
        element.classList.add('animate');
    });
    
    // Set up scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll animation classes
    const scrollElements = document.querySelectorAll(`
        .fade-up,
        .slide-left,
        .slide-right,
        .scale-in
    `);
    
    scrollElements.forEach(element => {
        observer.observe(element);
    });
}
