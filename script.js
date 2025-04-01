// Masquer le loader et afficher le contenu après 4 secondes
    // Solution garantie pour afficher le loader
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Forcer l'affichage immédiat du loader
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'flex'; // S'assurer qu'il est visible
        
        // 2. Cacher après 4 secondes ou quand les produits sont chargés
        setTimeout(function() {
            loadingElement.style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 6000);
        
        
    });

    const url = 'https://api.daaif.net/products?limit=200&delay=3000';

    let productsArray = [];
    let filteredProducts = [];
    let productsParPage = 20;
    let pageActuelle = 1;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        productsArray = response.products;
        filteredProducts = productsArray; // Initialement, tous les produits sont affichés.

        const totalProduits = filteredProducts.length;
        const totalPages = Math.ceil(totalProduits / productsParPage);

        const infoHTML = `
        <div class="alert alert-success rounded-4">
            <strong>Total : </strong> ${totalProduits} produits |
            <strong>Products per page </strong> ${productsParPage} |
            
        </div>
        `;
        document.getElementById('info-container').innerHTML = infoHTML;
        afficherPage(pageActuelle); // Afficher la première page
        afficherPagination(totalPages);
        remplirFiltres();
    };

    xhr.send();
    console.log("Requête envoyée");

    function afficherPage(page) {
        const start = (page - 1) * productsParPage;
        const end = page * productsParPage;
        const produitsPage = filteredProducts.slice(start, end);

        const container = document.getElementById('produits-container');
        container.innerHTML = ''; // Réinitialisation
        produitsPage.forEach(produit => {
            const produitHTML = `
            <div class="col-12 col-sm-6 col-md-6 col-lg-4 mb-4 d-flex">
                <div class="card h-100 shadow rounded-4">
                    <img src="${produit.thumbnail}" class="card-img-top" alt="${produit.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${produit.title}</h5>
                        <p class="card-text text-justify">${produit.description.substring(0, 100)}...</p>
                        <div class="d-grid gap-2 mt-auto">
                            <p ><strong>Prix :</strong> $${produit.price}&nbsp;&nbsp;&nbsp; <strong>Stock :</strong> ${produit.stock}</p>
                            <button class="btn btn-success mb-0 rounded-4 " onclick="voirDetails('${produit.title}', '${produit.images[0]}', '${produit.category}', '${produit.price}','${produit.discountPercentage}', '${produit.brand}' , '${produit.rating}' ,'${produit.returnPolicy}' , '${produit.availabilityStatus}' , '${produit.sku}')">More details</button>
                            <button class="btn btn-primary mb-0 rounded-4 " onclick="voirAvis('${produit.title}')">Reviews</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            container.innerHTML += produitHTML;
        });
    }

    function afficherPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination-container');
        paginationContainer.innerHTML = ''; // Réinitialiser le conteneur de pagination

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
            pageButton.textContent = i;
            pageButton.onclick = () => {
                pageActuelle = i;
                afficherPage(pageActuelle); // Afficher les produits de la page sélectionnée
            };
            paginationContainer.appendChild(pageButton);
        }
    }

    function remplirFiltres() {
        const categories = [...new Set(productsArray.map(p => p.category))];
        const brands = [...new Set(productsArray.map(p => p.brand))];
    
        const categorySelect = document.getElementById('filter-category');
        categories.forEach(categorie => {
            const option = document.createElement('option');
            option.value = categorie;
            option.textContent = categorie;
            categorySelect.appendChild(option);
        });
    
        const brandSelect = document.getElementById('filter-brand');
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    
        // Mettre à jour le texte du filtre de prix
        const priceRangeInput = document.getElementById('filter-price');
        priceRangeInput.addEventListener('input', (event) => {
            document.getElementById('price-range-label').textContent = `Prix max: ${event.target.value}`;
        });
    
        // Ajout des écouteurs d'événements pour les filtres
        document.getElementById('filter-category').addEventListener('change', appliquerFiltres);
        document.getElementById('filter-brand').addEventListener('change', appliquerFiltres);
        document.getElementById('filter-price').addEventListener('input', appliquerFiltres);
    }
    

    function appliquerFiltres() {
        const selectedCategory = document.getElementById('filter-category').value;
        const selectedBrand = document.getElementById('filter-brand').value;
        const selectedPrice = document.getElementById('filter-price').value;

        filteredProducts = productsArray.filter(produit => {
            return (
                (selectedCategory === "" || produit.category === selectedCategory) &&
                (selectedBrand === "" || produit.brand === selectedBrand) &&
                (produit.price <= selectedPrice)
            );
        });

        // Mise à jour de l'affichage
        const totalProduits = filteredProducts.length;
        const totalPages = Math.ceil(totalProduits / productsParPage);
        afficherPage(1); // Afficher la 1ère page après filtrage
        afficherPagination(totalPages);
    }

    function voirDetails(title, image, categorie, price,discount, brand, rating, returnPolicy, availability, sku) {
        const escapedTitle = title.replace(/'/g, "\\'");

        document.getElementById('produit-title').textContent = escapedTitle;
        document.getElementById('produit-image').src = image;
        document.getElementById('produit-category').textContent = `Category : ${categorie}`;
        document.getElementById('produit-price').textContent = `Price: $${price}`;
        document.getElementById('produit-discount').textContent = `Discount: ${discount}%`;
        document.getElementById('produit-brand').textContent = `Brand: ${brand}`;
        document.getElementById('produit-rating').textContent= `Rating: ${rating}`;
        document.getElementById('produit-returnPolicy').textContent = `Return Policy: ${returnPolicy}`;
        document.getElementById('produit-availability').textContent = `Availability: ${availability}`;
        document.getElementById('produit-sku').textContent = `SKU : ${sku}`;

        const modal = new bootstrap.Modal(document.getElementById('produitModal'));
        modal.show();
    }
    function voirAvis(productTitle) {
        // Trouver le produit dans le tableau filteredProducts
        
        const product = filteredProducts.find(p => p.title === productTitle);
        const reviewsContainer = document.getElementById('produit-reviews');
        reviewsContainer.innerHTML = ''; // Vider le contenu précédent
    
        if (product && product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                const reviewItem = document.createElement('li');
                reviewItem.className = 'list-group-item';
                reviewItem.innerHTML = `<strong>${review.reviewerName}</strong>: ${review.comment} (⭐ ${review.rating})`;
                reviewsContainer.appendChild(reviewItem);
            });
        } else {
            const noReviewItem = document.createElement('li');
            noReviewItem.className = 'list-group-item';
            noReviewItem.textContent = 'Aucun avis disponible.';
            reviewsContainer.appendChild(noReviewItem);
        }
    
        const modal = new bootstrap.Modal(document.getElementById('reviewsModal'));
        modal.show();
    }
    
