document.addEventListener('DOMContentLoaded', function() {
        // Navigation functionality
        const navLinks = document.querySelectorAll('.navbar a');
        const contentSections = document.querySelectorAll('.content-section');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                this.classList.add('active');
                
                const sectionId = this.getAttribute('data-section');
                document.getElementById(sectionId).classList.add('active');
            });
        });

        // Modal functionality
        const modals = {
            'add-book': {
                openBtn: document.getElementById('add-bool-btn') || document.getElementById('add-new-book-btn'),
                modal: document.getElementById('add-book-modal'),
                closeBtn: document.querySelector('#add-book-modal .close-modal'),
                cancelBtn: document.querySelector('#add-book-modal .cancel-btn')
            },
            'add-member': {
                openBtn: document.getElementById('add-member-btn') || document.getElementById('add-new-member-btn'),
                modal: document.getElementById('add-member-modal'),
                closeBtn: document.querySelector('#add-member-modal .close-modal'),
                cancelBtn: document.querySelector('#add-member-modal .cancel-btn')
            },
            'issue-book': {
                openBtn: document.getElementById('issue-book-btn') || document.getElementById('issue-book-transaction-btn'),
                modal: document.getElementById('issue-book-modal'),
                closeBtn: document.querySelector('#issue-book-modal .close-modal'),
                cancelBtn: document.querySelector('#issue-book-modal .cancel-btn')
            }
        };

        // Initialize modals
        Object.keys(modals).forEach(key => {
            const modal = modals[key];
            
            if (modal.openBtn && modal.modal) {
                modal.openBtn.addEventListener('click', () => {
                    modal.modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Initialize issue book dropdown when modal opens
                    if (key === 'issue-book') {
                        initializeIssueBookDropdown();
                    }
                });
                
                const closeModal = () => {
                    modal.modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                };
                
                modal.closeBtn.addEventListener('click', closeModal);
                if (modal.cancelBtn) modal.cancelBtn.addEventListener('click', closeModal);
                
                modal.modal.addEventListener('click', (e) => {
                    if (e.target === modal.modal) {
                        closeModal();
                    }
                });
            }
        });

        // Initialize issue book dropdown with available books
        function initializeIssueBookDropdown() {
            const issueBookSelect = document.getElementById('issue-book');
            if (!issueBookSelect) return;
            
            // Clear existing options except the first one
            while (issueBookSelect.options.length > 1) {
                issueBookSelect.remove(1);
            }
            
            // Add all available books from the books table
            document.querySelectorAll('#books-table tbody tr').forEach(row => {
                const bookId = row.cells[0].textContent;
                const bookTitle = row.cells[1].textContent;
                const statusText = row.cells[5].textContent;
                
                // Check if the book has available copies
                const matches = statusText.match(/(\d+)\s*\(Available(?: of (\d+))?/);
                if (matches && parseInt(matches[1]) > 0) {
                    const option = document.createElement('option');
                    option.value = bookId;
                    option.textContent = `${bookTitle} (${statusText})`;
                    issueBookSelect.appendChild(option);
                }
            });
        }

        // Form submissions with improved functionality
        const addBookForm = document.getElementById('add-book-form');
        if (addBookForm) {
            addBookForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const title = document.getElementById('book-title').value;
                const author = document.getElementById('book-author').value;
                const isbn = document.getElementById('book-isbn').value;
                const category = document.getElementById('book-category').value;
                const publisher = document.getElementById('book-publisher').value;
                const year = document.getElementById('book-year').value;
                const copies = document.getElementById('book-copies').value || 1;
                
                // Generate book ID
                const bookId = 'BK' + Math.floor(1000 + Math.random() * 9000);
                
                // Add to books table
                const booksTable = document.querySelector('#books-table tbody');
                const newRow = booksTable.insertRow();
                
                newRow.innerHTML = `
                    <td>${bookId}</td>
                    <td>${title}</td>
                    <td>${author}</td>
                    <td>${isbn}</td>
                    <td>${category}</td>
                    <td><span class="status available">${copies} (Available)</span></td>
                    <td>
                        <button class="action-icon edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-icon delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Update issue book dropdown
                const issueBookSelect = document.getElementById('issue-book');
                if (issueBookSelect) {
                    const option = document.createElement('option');
                    option.value = bookId;
                    option.textContent = `${title} (${copies} available)`;
                    issueBookSelect.appendChild(option);
                }
                
                // Update stats
                updateStats();
                
                // Add to activity log
                addActivity(`New book added: "${title}" with ${copies} copies`);
                
                // Close modal and reset form
                modals['add-book'].modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();
                
                // Add event listeners to new buttons
                addRowEventListeners(newRow);
            });
        }

        const addMemberForm = document.getElementById('add-member-form');
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('member-name').value;
                const email = document.getElementById('member-email').value;
                const phone = document.getElementById('member-phone').value;
                const address = document.getElementById('member-address').value;
                const membership = document.getElementById('member-type').value;
                
                // Generate member ID
                const memberId = 'MB' + Math.floor(1000 + Math.random() * 9000);
                
                // Add to members table
                const membersTable = document.querySelector('#members-table tbody');
                const newRow = membersTable.insertRow();
                
                newRow.innerHTML = `
                    <td>${memberId}</td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${phone || '-'}</td>
                    <td>${membership}</td>
                    <td>0</td>
                    <td>
                        <button class="action-icon edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-icon delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Add to issue member dropdown
                const issueMemberSelect = document.getElementById('issue-member');
                if (issueMemberSelect) {
                    const option = document.createElement('option');
                    option.value = memberId;
                    option.textContent = `${name} (${memberId})`;
                    issueMemberSelect.appendChild(option);
                }
                
                // Update stats
                updateStats();
                
                // Add to activity log
                addActivity(`New member registered: ${name}`);
                
                // Close modal and reset form
                modals['add-member'].modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();
                
                // Add event listeners to new buttons
                addRowEventListeners(newRow);
            });
        }

        const issueBookForm = document.getElementById('issue-book-form');
        if (issueBookForm) {
            issueBookForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const bookId = document.getElementById('issue-book').value;
                const memberId = document.getElementById('issue-member').value;
                const issueDate = document.getElementById('issue-date').value;
                const dueDate = document.getElementById('due-date').value;
                
                // Get book and member details
                const bookRow = Array.from(document.querySelectorAll('#books-table tbody tr'))
                    .find(row => row.cells[0].textContent === bookId);
                const memberRow = Array.from(document.querySelectorAll('#members-table tbody tr'))
                    .find(row => row.cells[0].textContent === memberId);
                
                if (!bookRow || !memberRow) {
                    alert('Please select both a book and a member');
                    return;
                }
                
                const bookTitle = bookRow.cells[1].textContent;
                const memberName = memberRow.cells[1].textContent;
                
                // Update book copies
                const statusCell = bookRow.cells[5];
                const statusText = statusCell.textContent;
                const matches = statusText.match(/(\d+)\s*\(Available(?: of (\d+))?/);
                
                if (matches) {
                    let available = parseInt(matches[1]);
                    const total = matches[2] ? parseInt(matches[2]) : available;
                    
                    if (available > 0) {
                        available--;
                        
                        if (available > 0) {
                            statusCell.innerHTML = `<span class="status borrowed">${available} (Available of ${total})</span>`;
                        } else {
                            statusCell.innerHTML = `<span class="status overdue">0 (Available of ${total})</span>`;
                        }
                        
                        // Generate transaction ID
                        const transactionId = 'TR' + Math.floor(1000 + Math.random() * 9000);
                        
                        // Add to transactions table
                        const transactionsTable = document.querySelector('#transactions-table tbody');
                        const newRow = transactionsTable.insertRow();
                        
                        newRow.innerHTML = `
                            <td>${transactionId}</td>
                            <td>${bookTitle}</td>
                            <td>${memberName}</td>
                            <td>${issueDate}</td>
                            <td>${dueDate}</td>
                            <td>-</td>
                            <td><span class="status borrowed">Borrowed</span></td>
                            <td>$0.00</td>
                            <td>
                                <button class="action-icon return-btn" title="Return"><i class="fas fa-undo"></i></button>
                                <button class="action-icon pay-btn" title="Pay Fine"><i class="fas fa-dollar-sign"></i></button>
                            </td>
                        `;
                        
                        // Update member's borrowed count
                        const borrowedCount = parseInt(memberRow.cells[5].textContent) + 1;
                        memberRow.cells[5].textContent = borrowedCount;
                        
                        // Update stats
                        updateStats();
                        
                        // Add to activity log
                        addActivity(`${memberName} borrowed "${bookTitle}"`);
                        
                        // Close modal and reset form
                        modals['issue-book'].modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        this.reset();
                        
                        // Refresh the issue book dropdown
                        initializeIssueBookDropdown();
                        
                        // Add event listeners to new buttons
                        addRowEventListeners(newRow);
                    } else {
                        alert('No copies available of this book!');
                        return;
                    }
                }
            });
        }

        // Edit functionality for books and members
        function setupEditFunctionality() {
            // Books table edit
            document.querySelectorAll('#books-table .edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const cells = row.cells;
                    
                    // Get current values
                    const currentData = {
                        id: cells[0].textContent,
                        title: cells[1].textContent,
                        author: cells[2].textContent,
                        isbn: cells[3].textContent,
                        category: cells[4].textContent,
                        status: cells[5].textContent
                    };
                    
                    // Create edit form in modal
                    const modalContent = `
                        <span class="close-modal">&times;</span>
                        <h2><i class="fas fa-edit"></i> Edit Book</h2>
                        <form id="edit-book-form">
                            <div class="form-group">
                                <label for="edit-book-title">Title</label>
                                <input type="text" id="edit-book-title" value="${currentData.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-book-author">Author</label>
                                <input type="text" id="edit-book-author" value="${currentData.author}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-book-isbn">ISBN</label>
                                <input type="text" id="edit-book-isbn" value="${currentData.isbn}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-book-category">Category</label>
                                <select id="edit-book-category" required>
                                    <option value="fiction" ${currentData.category === 'Fiction' ? 'selected' : ''}>Fiction</option>
                                    <option value="non-fiction" ${currentData.category === 'Non-Fiction' ? 'selected' : ''}>Non-Fiction</option>
                                    <option value="science" ${currentData.category === 'Science' ? 'selected' : ''}>Science</option>
                                    <option value="history" ${currentData.category === 'History' ? 'selected' : ''}>History</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="cancel-btn">Cancel</button>
                                <button type="submit" class="submit-btn">Save Changes</button>
                            </div>
                        </form>
                    `;
                    
                    // Create and show modal
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.id = 'edit-book-modal';
                    modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;
                    document.body.appendChild(modal);
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Handle form submission
                    const form = document.getElementById('edit-book-form');
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        // Update row with new values
                        cells[1].textContent = document.getElementById('edit-book-title').value;
                        cells[2].textContent = document.getElementById('edit-book-author').value;
                        cells[3].textContent = document.getElementById('edit-book-isbn').value;
                        cells[4].textContent = document.getElementById('edit-book-category').value;
                        
                        // Close modal
                        modal.remove();
                        document.body.style.overflow = 'auto';
                        
                        // Add to activity log
                        addActivity(`Book "${cells[1].textContent}" was updated`);
                    });
                    
                    // Close modal handlers
                    modal.querySelector('.close-modal').addEventListener('click', () => {
                        modal.remove();
                        document.body.style.overflow = 'auto';
                    });
                    
                    modal.querySelector('.cancel-btn').addEventListener('click', () => {
                        modal.remove();
                        document.body.style.overflow = 'auto';
                    });
                    
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.remove();
                            document.body.style.overflow = 'auto';
                        }
                    });
                });
            });
            
            // Members table edit
            document.querySelectorAll('#members-table .edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const cells = row.cells;
                    
                    // Get current values
                    const currentData = {
                        id: cells[0].textContent,
                        name: cells[1].textContent,
                        email: cells[2].textContent,
                        phone: cells[3].textContent,
                        membership: cells[4].textContent,
                        borrowed: cells[5].textContent
                    };
                    
                    // Create edit form in modal
                    const modalContent = `
                        <span class="close-modal">&times;</span>
                        <h2><i class="fas fa-user-edit"></i> Edit Member</h2>
                        <form id="edit-member-form">
                            <div class="form-group">
                                <label for="edit-member-name">Full Name</label>
                                <input type="text" id="edit-member-name" value="${currentData.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-member-email">Email</label>
                                <input type="email" id="edit-member-email" value="${currentData.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-member-phone">Phone</label>
                                <input type="tel" id="edit-member-phone" value="${currentData.phone}">
                            </div>
                            <div class="form-group">
                                <label for="edit-member-type">Membership Type</label>
                                <select id="edit-member-type" required>
                                    <option value="standard" ${currentData.membership === 'Standard' ? 'selected' : ''}>Standard</option>
                                    <option value="premium" ${currentData.membership === 'Premium' ? 'selected' : ''}>Premium</option>
                                    <option value="student" ${currentData.membership === 'Student' ? 'selected' : ''}>Student</option>
                                </select>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="cancel-btn">Cancel</button>
                                <button type="submit" class="submit-btn">Save Changes</button>
                            </div>
                        </form>
                    `;
                    
                    // Create and show modal
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.id = 'edit-member-modal';
                    modal.innerHTML = `<div class="modal-content">${modalContent}</div>`;
                    document.body.appendChild(modal);
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Handle form submission
                    const form = document.getElementById('edit-member-form');
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        // Update row with new values
                        cells[1].textContent = document.getElementById('edit-member-name').value;
                        cells[2].textContent = document.getElementById('edit-member-email').value;
                        cells[3].textContent = document.getElementById('edit-member-phone').value;
                        cells[4].textContent = document.getElementById('edit-member-type').value;
                        
                        // Close modal
                        modal.remove();
                        document.body.style.overflow = 'auto';
                        
                        // Add to activity log
                        addActivity(`Member "${cells[1].textContent}" was updated`);
                    });
                    
                    // Close modal handlers
                    modal.querySelector('.close-modal').addEventListener('click', () => {
                        modal.remove();
                        document.body.style.overflow = 'auto';
                    });
                    
                    modal.querySelector('.cancel-btn').addEventListener('click', () => {
                        modal.remove();
                        document.body.style.overflow = 'auto';
                    });
                    
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.remove();
                            document.body.style.overflow = 'auto';
                        }
                    });
                });
            });
        }

        // Add event listeners to rows
        function addRowEventListeners(row) {
            // Delete button
            const deleteBtn = row.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this item?')) {
                        const rowType = row.closest('table').id;
                        let message = '';
                        
                        if (rowType === 'books-table') {
                            message = `Book "${row.cells[1].textContent}" was deleted`;
                        } else if (rowType === 'members-table') {
                            message = `Member "${row.cells[1].textContent}" was deleted`;
                        } else if (rowType === 'transactions-table') {
                            message = `Transaction ${row.cells[0].textContent} was deleted`;
                        }
                        
                        row.remove();
                        updateStats();
                        addActivity(message);
                    }
                });
            }
            
            // Return button (for transactions)
            const returnBtn = row.querySelector('.return-btn');
            if (returnBtn) {
                returnBtn.addEventListener('click', function() {
                    const statusCell = row.cells[6];
                    const bookTitle = row.cells[1].textContent;
                    const memberName = row.cells[2].textContent;
                    
                    // Update status to returned
                    statusCell.innerHTML = '<span class="status returned">Returned</span>';
                    
                    // Set return date to today
                    const today = new Date().toISOString().split('T')[0];
                    row.cells[5].textContent = today;
                    
                    // Update book copies in books table
                    const bookTitleCell = row.cells[1].textContent;
                    const bookRow = Array.from(document.querySelectorAll('#books-table tbody tr'))
                        .find(row => row.cells[1].textContent === bookTitleCell);
                    if (bookRow) {
                        const statusText = bookRow.cells[5].textContent;
                        const matches = statusText.match(/(\d+)\s*\(Available(?: of (\d+))?/);
                        
                        if (matches) {
                            let available = parseInt(matches[1]);
                            const total = matches[2] ? parseInt(matches[2]) : available;
                            available++;
                            
                            if (available === total) {
                                bookRow.cells[5].innerHTML = `<span class="status available">${total} (Available)</span>`;
                            } else {
                                bookRow.cells[5].innerHTML = `<span class="status borrowed">${available} (Available of ${total})</span>`;
                            }
                            
                            // Add the book back to the issue book dropdown if it's now available
                            if (available > 0) {
                                const issueBookSelect = document.getElementById('issue-book');
                                if (issueBookSelect) {
                                    const optionExists = Array.from(issueBookSelect.options)
                                        .some(option => option.value === bookRow.cells[0].textContent);
                                    
                                    if (!optionExists) {
                                        const option = document.createElement('option');
                                        option.value = bookRow.cells[0].textContent;
                                        option.textContent = `${bookTitleCell} (${available} available of ${total})`;
                                        issueBookSelect.appendChild(option);
                                    }
                                }
                            }
                        }
                    }
                    
                    // Update member's borrowed count
                    const memberNameCell = row.cells[2].textContent;
                    const memberRow = Array.from(document.querySelectorAll('#members-table tbody tr'))
                        .find(row => row.cells[1].textContent === memberNameCell);
                    if (memberRow) {
                        const borrowedCount = parseInt(memberRow.cells[5].textContent) - 1;
                        memberRow.cells[5].textContent = Math.max(0, borrowedCount);
                    }
                    
                    // Update stats
                    updateStats();
                    
                    // Add to activity log
                    addActivity(`${memberName} returned "${bookTitle}"`);
                });
            }
            
            // Pay button (for transactions)
            const payBtn = row.querySelector('.pay-btn');
            if (payBtn) {
                payBtn.addEventListener('click', function() {
                    const fineCell = row.cells[7];
                    const transactionId = row.cells[0].textContent;
                    
                    // Only allow paying if there's an actual fine
                    if (fineCell.textContent !== '$0.00') {
                        fineCell.textContent = '$0.00';
                        
                        // If the book was overdue and fine is paid, change status to returned
                        const statusCell = row.cells[6];
                        if (statusCell.querySelector('.status.overdue')) {
                            statusCell.innerHTML = '<span class="status returned">Returned</span>';
                            
                            // Set return date to today if not already set
                            if (row.cells[5].textContent === '-') {
                                const today = new Date().toISOString().split('T')[0];
                                row.cells[5].textContent = today;
                            }
                            
                            // Update book copies in books table
                            const bookTitleCell = row.cells[1].textContent;
                            const bookRow = Array.from(document.querySelectorAll('#books-table tbody tr'))
                                .find(row => row.cells[1].textContent === bookTitleCell);
                            if (bookRow) {
                                const statusText = bookRow.cells[5].textContent;
                                const matches = statusText.match(/(\d+)\s*\(Available(?: of (\d+))?/);
                                
                                if (matches) {
                                    let available = parseInt(matches[1]);
                                    const total = matches[2] ? parseInt(matches[2]) : available;
                                    available++;
                                    
                                    if (available === total) {
                                        bookRow.cells[5].innerHTML = `<span class="status available">${total} (Available)</span>`;
                                    } else {
                                        bookRow.cells[5].innerHTML = `<span class="status borrowed">${available} (Available of ${total})</span>`;
                                    }
                                    
                                    // Add the book back to the issue book dropdown if it's now available
                                    if (available > 0) {
                                        const issueBookSelect = document.getElementById('issue-book');
                                        if (issueBookSelect) {
                                            const optionExists = Array.from(issueBookSelect.options)
                                                .some(option => option.value === bookRow.cells[0].textContent);
                                            
                                            if (!optionExists) {
                                                const option = document.createElement('option');
                                                option.value = bookRow.cells[0].textContent;
                                                option.textContent = `${bookTitleCell} (${available} available of ${total})`;
                                                issueBookSelect.appendChild(option);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            // Update member's borrowed count
                            const memberNameCell = row.cells[2].textContent;
                            const memberRow = Array.from(document.querySelectorAll('#members-table tbody tr'))
                                .find(row => row.cells[1].textContent === memberNameCell);
                            if (memberRow) {
                                const borrowedCount = parseInt(memberRow.cells[5].textContent) - 1;
                                memberRow.cells[5].textContent = Math.max(0, borrowedCount);
                            }
                        }
                        
                        // Update stats
                        updateStats();
                        
                        // Add to activity log
                        addActivity(`Fine paid for transaction ${transactionId}`);
                    }
                });
            }
            
            // Edit button (setup after initial page load)
            const editBtn = row.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    // This will be handled by the setupEditFunctionality function
                });
            }
        }

        // Initialize event listeners for existing rows
        document.querySelectorAll('#books-table tbody tr, #members-table tbody tr, #transactions-table tbody tr').forEach(row => {
            addRowEventListeners(row);
        });

        // Setup edit functionality
        setupEditFunctionality();

        // Search functionality
        const bookSearch = document.getElementById('book-search');
        if (bookSearch) {
            document.getElementById('search-book-btn').addEventListener('click', () => {
                const searchTerm = bookSearch.value.toLowerCase();
                filterTable('#books-table', searchTerm);
            });
        }

        const memberSearch = document.getElementById('member-search');
        if (memberSearch) {
            document.getElementById('search-member-btn').addEventListener('click', () => {
                const searchTerm = memberSearch.value.toLowerCase();
                filterTable('#members-table', searchTerm);
            });
        }

        const transactionSearch = document.getElementById('transaction-search');
        if (transactionSearch) {
            document.getElementById('search-transaction-btn').addEventListener('click', () => {
                const searchTerm = transactionSearch.value.toLowerCase();
                filterTable('#transactions-table', searchTerm);
            });
        }

        // Filter functionality
        const bookFilter = document.getElementById('book-filter');
        if (bookFilter) {
            bookFilter.addEventListener('change', function() {
                const status = this.value;
                filterByStatus('#books-table', status);
            });
        }

        const memberFilter = document.getElementById('member-filter');
        if (memberFilter) {
            memberFilter.addEventListener('change', function() {
                const filter = this.value;
                filterMembers(filter);
            });
        }

        const transactionFilter = document.getElementById('transaction-filter');
        if (transactionFilter) {
            transactionFilter.addEventListener('change', function() {
                const status = this.value;
                filterByStatus('#transactions-table', status);
            });
        }

        // Helper functions
        function filterTable(tableId, searchTerm) {
            const rows = document.querySelectorAll(`${tableId} tbody tr`);
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(searchTerm) ? '' : 'none';
            });
        }

        function filterByStatus(tableId, status) {
            const rows = document.querySelectorAll(`${tableId} tbody tr`);
            
            rows.forEach(row => {
                if (status === 'all') {
                    row.style.display = '';
                    return;
                }
                
                const statusCell = row.querySelector('.status');
                if (statusCell) {
                    const statusText = statusCell.textContent.toLowerCase();
                    let showRow = false;
                    
                    if (status === 'available') {
                        showRow = statusText.includes('available') && !statusText.startsWith('0');
                    } else if (status === 'borrowed') {
                        showRow = statusText.includes('available of') && !statusText.startsWith('0');
                    } else if (status === 'overdue') {
                        showRow = statusText.startsWith('0') && statusText.includes('available of');
                    }
                    
                    row.style.display = showRow ? '' : 'none';
                }
            });
        }

        function filterMembers(filter) {
            const rows = document.querySelectorAll('#members-table tbody tr');
            
            rows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                    return;
                }
                
                if (filter === 'active') {
                    row.style.display = '';
                } else if (filter === 'inactive') {
                    row.style.display = 'none';
                } else if (filter === 'overdue') {
                    const borrowed = parseInt(row.cells[5].textContent);
                    row.style.display = borrowed > 0 ? '' : 'none';
                }
            });
        }

        function updateStats() {
            // Total books
            const totalBooks = document.querySelectorAll('#books-table tbody tr').length;
            document.getElementById('total-books').textContent = totalBooks.toLocaleString();
            
            // Total members
            const totalMembers = document.querySelectorAll('#members-table tbody tr').length;
            document.getElementById('total-members').textContent = totalMembers.toLocaleString();
            
            // Borrowed books
            let borrowedBooks = 0;
            document.querySelectorAll('#books-table tbody tr').forEach(row => {
                const statusText = row.cells[5].textContent;
                const matches = statusText.match(/(\d+)\s*\(Available(?: of (\d+))?/);
                if (matches) {
                    const available = parseInt(matches[1]);
                    const total = matches[2] ? parseInt(matches[2]) : available;
                    borrowedBooks += (total - available);
                }
            });
            document.getElementById('borrowed-books').textContent = borrowedBooks.toLocaleString();
            
            // Overdue books
            const overdueBooks = document.querySelectorAll('#transactions-table .status.overdue').length;
            document.getElementById('overdue-books').textContent = overdueBooks.toLocaleString();
        }

        function addActivity(message) {
            const activityList = document.getElementById('activity-list');
            if (!activityList) return;
            
            const now = new Date();
            const timeAgo = getTimeAgo(now);
            
            const icons = {
                'borrowed': 'fa-book-reader',
                'added': 'fa-book',
                'registered': 'fa-user-plus',
                'returned': 'fa-undo',
                'renewed': 'fa-sync',
                'paid': 'fa-dollar-sign',
                'updated': 'fa-edit',
                'deleted': 'fa-trash'
            };
            
            let iconClass = 'fa-info-circle';
            for (const [key, value] of Object.entries(icons)) {
                if (message.toLowerCase().includes(key)) {
                    iconClass = value;
                    break;
                }
            }
            
            const newActivity = document.createElement('li');
            newActivity.innerHTML = `
                <i class="fas ${iconClass}"></i>
                <span>${message}</span>
                <small>${timeAgo}</small>
            `;
            
            activityList.insertBefore(newActivity, activityList.firstChild);
            
            // Limit to 10 activities
            if (activityList.children.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }

        function getTimeAgo(date) {
            const now = new Date();
            const diff = now - date;
            
            const minute = 60 * 1000;
            const hour = 60 * minute;
            const day = 24 * hour;
            
            if (diff < minute) {
                return 'just now';
            } else if (diff < hour) {
                const minutes = Math.floor(diff / minute);
                return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (diff < day) {
                const hours = Math.floor(diff / hour);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(diff / day);
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
        }

        // Initialize stats
        updateStats();
        
        // Set default dates in issue book form
        const issueDateInput = document.getElementById('issue-date');
        const dueDateInput = document.getElementById('due-date');
        
        if (issueDateInput && dueDateInput) {
            const today = new Date();
            const twoWeeksLater = new Date();
            twoWeeksLater.setDate(today.getDate() + 14);
            
            issueDateInput.value = today.toISOString().split('T')[0];
            dueDateInput.value = twoWeeksLater.toISOString().split('T')[0];
        }
    });

    // Logout functionality
    document.querySelector('.fa-sign-out-alt').closest('a').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Logging out...');
        window.location.href = 'admin.html';
    });