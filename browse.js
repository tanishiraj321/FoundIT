// Browse Items JavaScript

// Sample data for demonstration
const sampleItems = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "electronics",
        type: "lost",
        location: "library",
        date: "2024-02-10",
        description: "Black iPhone 13 Pro with cracked screen protector",
        contact: "john.doe@vit.edu",
        image: "https://via.placeholder.com/300x200/667eea/ffffff?text=iPhone+13+Pro"
    },
    {
        id: 2,
        name: "Blue Backpack",
        category: "bags",
        type: "found",
        location: "academic-block",
        date: "2024-02-12",
        description: "Blue Nike backpack found in Academic Block A",
        contact: "jane.smith@vit.edu",
        image: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Blue+Backpack"
    },
    {
        id: 3,
        name: "Data Structures Textbook",
        category: "books",
        type: "lost",
        location: "cafeteria",
        date: "2024-02-11",
        description: "Data Structures and Algorithms textbook with notes",
        contact: "student@vit.edu",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Textbook"
    },
    {
        id: 4,
        name: "AirPods Pro",
        category: "electronics",
        type: "found",
        location: "sports-complex",
        date: "2024-02-13",
        description: "White AirPods Pro with charging case",
        contact: "sports@vit.edu",
        image: "https://via.placeholder.com/300x200/ffc107/ffffff?text=AirPods"
    },
    {
        id: 5,
        name: "Student ID Card",
        category: "id",
        type: "found",
        location: "hostel",
        date: "2024-02-09",
        description: "VIT student ID card found in hostel corridor",
        contact: "warden@vit.edu",
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=ID+Card"
    },
    {
        id: 6,
        name: "Black Wallet",
        category: "bags",
        type: "lost",
        location: "parking",
        date: "2024-02-08",
        description: "Black leather wallet with cards inside",
        contact: "lost.wallet@vit.edu",
        image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Wallet"
    },
    {
        id: 7,
        name: "Prescription Glasses",
        category: "accessories",
        type: "found",
        location: "auditorium",
        date: "2024-02-14",
        description: "Black frame prescription glasses in brown case",
        contact: "auditorium@vit.edu",
        image: "https://via.placeholder.com/300x200/6610f2/ffffff?text=Glasses"
    },
    {
        id: 8,
        name: "Car Keys",
        category: "keys",
        type: "lost",
        location: "library",
        date: "2024-02-07",
        description: "Honda car keys with blue keychain",
        contact: "car.owner@vit.edu",
        image: "https://via.placeholder.com/300x200/e83e8c/ffffff?text=Car+Keys"
    }
];

let currentView = 'grid';
let filteredItems = [...sampleItems];
let currentPage = 1;
const itemsPerPage = 6;

$(document).ready(function() {
    // Initialize
    displayItems();
    updateItemCount();
    
    // Search functionality
    $('#searchBtn').on('click', performSearch);
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });
    
    // Filter functionality
    $('#itemTypeFilter, #categoryFilter, #locationFilter, #sortFilter').on('change', applyFilters);
    
    // Reset filters
    $('#resetFilters').on('click', resetFilters);
    
    // View toggle
    $('#gridView').on('click', function() {
        currentView = 'grid';
        $(this).addClass('active');
        $('#listView').removeClass('active');
        displayItems();
    });
    
    $('#listView').on('click', function() {
        currentView = 'list';
        $(this).addClass('active');
        $('#gridView').removeClass('active');
        displayItems();
    });
    
    // Check URL parameters for category filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        $('#categoryFilter').val(categoryParam);
        applyFilters();
    }
});

function performSearch() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    
    filteredItems = sampleItems.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               item.description.toLowerCase().includes(searchTerm) ||
               item.location.toLowerCase().includes(searchTerm);
    });
    
    currentPage = 1;
    displayItems();
    updateItemCount();
}

function applyFilters() {
    const itemType = $('#itemTypeFilter').val();
    const category = $('#categoryFilter').val();
    const location = $('#locationFilter').val();
    const sortBy = $('#sortFilter').val();
    
    filteredItems = sampleItems.filter(item => {
        let matches = true;
        
        if (itemType && item.type !== itemType) matches = false;
        if (category && item.category !== category) matches = false;
        if (location && item.location !== location) matches = false;
        
        return matches;
    });
    
    // Sorting
    if (sortBy === 'newest') {
        filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
        filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    currentPage = 1;
    displayItems();
    updateItemCount();
}

function resetFilters() {
    $('#searchInput').val('');
    $('#itemTypeFilter').val('');
    $('#categoryFilter').val('');
    $('#locationFilter').val('');
    $('#sortFilter').val('newest');
    
    filteredItems = [...sampleItems];
    currentPage = 1;
    displayItems();
    updateItemCount();
}

function displayItems() {
    const container = $('#itemsContainer');
    const noResults = $('#noResults');
    container.empty();
    
    if (filteredItems.length === 0) {
        noResults.show();
        return;
    }
    
    noResults.hide();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = filteredItems.slice(startIndex, endIndex);
    
    if (currentView === 'grid') {
        itemsToDisplay.forEach(item => {
            const itemCard = createGridItemCard(item);
            container.append(itemCard);
        });
    } else {
        itemsToDisplay.forEach(item => {
            const itemCard = createListItemCard(item);
            container.append(itemCard);
        });
    }
    
    // Create pagination
    createPagination();
    
    // Add click handlers to item cards
    $('.item-card, .item-list-card').on('click', function() {
        const itemId = $(this).data('item-id');
        showItemDetail(itemId);
    });
}

function createGridItemCard(item) {
    const statusBadge = item.type === 'lost' ? 'badge-lost' : 'badge-found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    return `
        <div class="col-md-4 mb-4">
            <div class="item-card" data-item-id="${item.id}">
                <img src="${item.image}" class="item-card-img" alt="${item.name}">
                <div class="item-card-body">
                    <h5 class="item-card-title">${item.name}</h5>
                    <span class="item-badge ${statusBadge}">${statusText}</span>
                    <div class="item-meta">
                        <div><i class="fas fa-map-marker-alt"></i> ${formatLocation(item.location)}</div>
                        <div><i class="fas fa-calendar"></i> ${formatDate(item.date)}</div>
                        <div><i class="fas fa-tag"></i> ${formatCategory(item.category)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createListItemCard(item) {
    const statusBadge = item.type === 'lost' ? 'badge-lost' : 'badge-found';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    return `
        <div class="col-12 mb-3">
            <div class="item-list-card" data-item-id="${item.id}">
                <img src="${item.image}" class="item-list-img" alt="${item.name}">
                <div class="item-list-body">
                    <h5 class="item-card-title">${item.name}</h5>
                    <span class="item-badge ${statusBadge}">${statusText}</span>
                    <p class="text-muted mt-2">${item.description}</p>
                    <div class="item-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${formatLocation(item.location)}</span>
                        <span class="ms-3"><i class="fas fa-calendar"></i> ${formatDate(item.date)}</span>
                        <span class="ms-3"><i class="fas fa-tag"></i> ${formatCategory(item.category)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createPagination() {
    const pagination = $('#pagination');
    pagination.empty();
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    // Previous button
    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }
    
    // Next button
    pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `);
    
    // Add click handlers
    $('.page-link').on('click', function(e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            displayItems();
            $('html, body').animate({ scrollTop: 0 }, 500);
        }
    });
}

function showItemDetail(itemId) {
    const item = sampleItems.find(i => i.id === itemId);
    if (!item) return;
    
    const statusBadge = item.type === 'lost' ? 'bg-danger' : 'bg-success';
    const statusText = item.type === 'lost' ? 'Lost' : 'Found';
    
    $('#modalItemTitle').text(item.name);
    $('#modalItemImage').attr('src', item.image);
    $('#modalItemStatus').text(statusText).attr('class', `badge ${statusBadge}`);
    $('#modalItemCategory').text(formatCategory(item.category));
    $('#modalItemLocation').text(formatLocation(item.location));
    $('#modalItemDate').text(formatDate(item.date));
    $('#modalItemDescription').text(item.description);
    $('#modalItemContact').text(item.contact);
    
    const modal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
    modal.show();
}

// Claim item button
$('#claimItemBtn').on('click', function() {
    alert('Claim request submitted! You will be contacted for verification.');
    const modal = bootstrap.Modal.getInstance(document.getElementById('itemDetailModal'));
    modal.hide();
});

function updateItemCount() {
    $('#itemCount').text(filteredItems.length);
}

function formatLocation(location) {
    return location.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
