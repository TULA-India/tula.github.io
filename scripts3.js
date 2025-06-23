document.addEventListener('DOMContentLoaded', function() {
    const profileSetup = document.getElementById('profileSetup');
    const emptyPage = document.getElementById('emptyPage');
    const savePlateBtn = document.getElementById('savePlateBtn');
    const plateNameInput = document.getElementById('plateNameInput');
    const toastMessage = document.getElementById('toastMessage');
    const toastText = document.getElementById('toastText');
    const setupProfileBtn = document.getElementById('setupProfileBtn');
    const emptySavedPlatesMessage = document.getElementById('emptySavedPlatesMessage');
    const savedPlatesContainer = document.getElementById('savedPlatesContainer');
    const buildPlateBox = document.querySelector('.empty-saved-plates'); 

    function updatePageVisibility() {
        if (sessionStorage.getItem('profileSet') === 'true') {
            profileSetup.style.display = 'none';
            emptyPage.style.display = 'block';
            loadSavedPlates(); 
        } else {
            profileSetup.style.display = 'flex';
            emptyPage.style.display = 'none';
        }
    }

    updatePageVisibility();

    setupProfileBtn.addEventListener('click', function() {
        sessionStorage.setItem('profileSet', 'true');
        window.location.href = 'balanced_plate.html';
    });

    function showToast(message) {
        toastText.textContent = message;
        toastMessage.classList.add('show');
        setTimeout(function() {
            toastMessage.classList.remove('show');
        }, 3000);
    }

    savePlateBtn.addEventListener('click', function() {
        const plateName = plateNameInput.value.trim();
        const currentPlate = JSON.parse(sessionStorage.getItem('currentBalancedThali'));

        if (!plateName) {
            showToast('Please enter a plate name.');
            plateNameInput.focus();
            return;
        }

        if (!currentPlate) {
            showToast('No plate to save. Please build a plate first.');
            emptySavedPlatesMessage.style.display = 'block';
            return;
        }

        savePlateToLocalStorage(plateName);
        showToast(`Plate "${plateName}" saved successfully!`);
        plateNameInput.value = '';
        loadSavedPlates(); 
        sessionStorage.removeItem('currentBalancedThali'); 
    });

    function savePlateToLocalStorage(plateName) {
        let savedPlates = JSON.parse(localStorage.getItem('savedBalancedThalis')) || [];
        const currentPlate = JSON.parse(sessionStorage.getItem('currentBalancedThali'));

        if (currentPlate) {
            const newPlate = {
                id: Date.now(),
                name: plateName,
                items: currentPlate.selectedItems,
                totals: {
                    calories: currentPlate.totalCalories,
                    price: currentPlate.totalPrice,
                    protein: currentPlate.totalProtein,
                    carbs: currentPlate.totalCarbs,
                    fat: currentPlate.totalFat,
                    fiber: currentPlate.totalFiber,
                    targetCalories: currentPlate.targetCalories
                },
                date: new Date().toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            };
            savedPlates.push(newPlate);
            localStorage.setItem('savedBalancedThalis', JSON.stringify(savedPlates));
        }
    }

    function loadSavedPlates() {
        const savedPlates = JSON.parse(localStorage.getItem('savedBalancedThalis')) || [];
        savedPlatesContainer.innerHTML = ''; 

        if (savedPlates.length === 0) {
            emptySavedPlatesMessage.style.display = 'block';
            savedPlatesContainer.style.display = 'none';
            buildPlateBox.style.display = 'block'; 
        } else {
            emptySavedPlatesMessage.style.display = 'none';
            savedPlatesContainer.style.display = 'grid';
            buildPlateBox.style.display = 'none'; 
            
            savedPlates.forEach(plate => {
                const card = document.createElement('div');
                card.className = 'saved-plate-card';
                card.dataset.id = plate.id; 

                card.innerHTML = `
                    <h4>${plate.name}</h4>
                    <div class="plate-date">Created on ${plate.date || 'Unknown date'}</div>
                    <button class="delete-btn" aria-label="Delete plate">
                        <i class="fas fa-times-circle"></i>
                    </button>
                    <table class="nutritional-info">
                        <tr><th colspan="2">Nutritional Info:</th></tr>
                        <tr><td class="label">Calories:</td><td class="value">${plate.totals.calories} kcal</td></tr>
                        <tr><td class="label">Protein:</td><td class="value">${plate.totals.protein}g</td></tr>
                        <tr><td class="label">Carbs:</td><td class="value">${plate.totals.carbs}g</td></tr>
                        <tr><td class="label">Fat:</td><td class="value">${plate.totals.fat}g</td></tr>
                    </table>
                    <button class="load-btn" data-id="${plate.id}">Load This Plate</button>
                `;
                savedPlatesContainer.appendChild(card);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const plateId = parseInt(this.closest('.saved-plate-card').dataset.id);
                    deletePlate(plateId);
                    showToast('Plate removed from bookmarks');
                });
            });

            document.querySelectorAll('.load-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const plateId = this.getAttribute('data-id');
                    const plateName = this.closest('.saved-plate-card').querySelector('h4').textContent;
                    loadPlate(plateId, plateName);
                });
            });
        }
    }

    function loadPlate(plateId, plateName) {
        const savedPlates = JSON.parse(localStorage.getItem('savedBalancedThalis')) || [];
        const plateToLoad = savedPlates.find(plate => plate.id === parseInt(plateId));
        
        if (plateToLoad) {
            const plateData = {
                selectedItems: plateToLoad.items,
                totalCalories: plateToLoad.totals.calories,
                totalPrice: plateToLoad.totals.price,
                totalProtein: plateToLoad.totals.protein,
                totalCarbs: plateToLoad.totals.carbs,
                totalFat: plateToLoad.totals.fat,
                totalFiber: plateToLoad.totals.fiber,
                targetCalories: plateToLoad.totals.targetCalories,
                isLoadedPlate: true
            };

            sessionStorage.setItem('currentBalancedThali', JSON.stringify(plateData));
            showToast(`"${plateName}" plate loaded successfully!`);

            setTimeout(() => {
                window.location.href = 'balanced_plate.html';
            }, 1000);
        } else {
            showToast('Plate not found');
        }
    }

    function deletePlate(id) {
        let savedPlates = JSON.parse(localStorage.getItem('savedBalancedThalis')) || [];
        savedPlates = savedPlates.filter(plate => plate.id !== id);
        localStorage.setItem('savedBalancedThalis', JSON.stringify(savedPlates));
        loadSavedPlates(); 

        if (savedPlates.length === 0) {
            buildPlateBox.style.display = 'block';
        }
    }
});
