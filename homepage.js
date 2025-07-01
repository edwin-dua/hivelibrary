function toggleCategory(header) {
            const category = header.parentElement;
            category.classList.toggle('active');
            
            // Change the arrow icon
            const arrow = header.querySelector('span');
            if (category.classList.contains('active')) {
                arrow.textContent = '▲';
            } else {
                arrow.textContent = '▼';
            }
        }
        
        // Open first category by default
        document.addEventListener('DOMContentLoaded', function() {
            const firstCategory = document.querySelector('.category');
            if (firstCategory) {
                firstCategory.classList.add('active');
                const arrow = firstCategory.querySelector('.category-header span');
                arrow.textContent = '▲';
            }
        });