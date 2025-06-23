document.addEventListener('DOMContentLoaded', function() {


const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  const userAge = sessionStorage.getItem('userAge');

  if (!userAge || isReload) {
    sessionStorage.clear(); // optional if you want to fully reset
    window.location.href = "balanced_plate.html";
  }
  
  
  
    
    const urlParams = new URLSearchParams(window.location.search);
    const age = parseInt(urlParams.get('age')) || 0;

    
    let ageGroup = "Children";
    let calorieRecommendation = 1800;

    if (age >= 4 && age <= 6) {
        ageGroup = "Pre-school Children";
        calorieRecommendation = 1350;
    } else if (age >= 7 && age <= 9) {
        ageGroup = "School Children";
        calorieRecommendation = 1690;
    } else if (age >= 10 && age <= 12) {
        ageGroup = "Pre-teens";
        calorieRecommendation = 2010;
    } else if (age >= 13 && age <= 15) {
        ageGroup = "Teen Boys";
        calorieRecommendation = 2450;
    } else if (age >= 16 && age <= 17) {
        ageGroup = "Late Teens";
        calorieRecommendation = 2640;
    } else if (age >= 18 && age <= 29) {
        ageGroup = "Young Adults";
        calorieRecommendation = 2400;
    } else if (age >= 30 && age <= 59) {
        ageGroup = "Adults";
        calorieRecommendation = 2320;
    } else if (age >= 60) {
        ageGroup = "Seniors";
        calorieRecommendation = 1900;
    }

   
    document.getElementById('age-group').textContent = ageGroup;
    document.getElementById('calories-recommendation').textContent = calorieRecommendation;

    
    const targetCalories = calorieRecommendation;

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

   
    function closeAllAccordions() {
        document.querySelectorAll('.accordion-item').forEach(accordion => {
            accordion.classList.remove('open');
        });
    }

   
    function openAllAccordions() {
        document.querySelectorAll('.accordion-item').forEach(accordion => {
            accordion.classList.add('open');
        });
    }

   
    function allSectionsSelected() {
        return selectedItems.base && selectedItems.curry && selectedItems.dessert && selectedItems.beverage;
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('open');

            closeAllAccordions();

            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // Enhanced Curry tab functionality
    const curryTabs = document.querySelectorAll('.curry-tab');

    curryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;

            curryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.food-grid').forEach(content => {
                if (content.id === 'veg-content' || content.id === 'nonveg-content') {
                    content.style.display = 'none';
                }
            });

            document.getElementById(`${tabType}-content`).style.display = 'grid';
        });
    });

    // Food selection functionality
    const foodCards = document.querySelectorAll('.food-card');
    let selectedItems = {
        base: null,
        curry: null,
        dessert: null,
        beverage: null
    };
    let totalCalories = 0;
    let totalPrice = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

   
    function saveCurrentPlateToSessionStorage() {
        const hasAnyItemSelected = Object.values(selectedItems).some(item => item !== null);
        if (!hasAnyItemSelected) {
            sessionStorage.removeItem('currentBalancedThali');
            sessionStorage.removeItem('currentBalancedThaliTotals');
            sessionStorage.removeItem('hasCurrentPlate');
            return;
        }

        const currentPlate = {
            selectedItems: selectedItems,
            totalCalories: totalCalories,
            totalPrice: totalPrice,
            totalProtein: totalProtein,
            totalCarbs: totalCarbs,
            totalFat: totalFat,
            totalFiber: totalFiber,
            targetCalories: targetCalories
        };
        sessionStorage.setItem('currentBalancedThali', JSON.stringify(currentPlate));
        sessionStorage.setItem('hasCurrentPlate', 'true');
    }

 
    function loadSelectedItems() {
        const savedCurrentPlate = sessionStorage.getItem('currentBalancedThali');

        if (savedCurrentPlate) {
            const currentPlate = JSON.parse(savedCurrentPlate);
            selectedItems = currentPlate.selectedItems;
            totalCalories = currentPlate.totalCalories;
            totalPrice = currentPlate.totalPrice;
            totalProtein = currentPlate.totalProtein;
            totalCarbs = currentPlate.totalCarbs;
            totalFat = currentPlate.totalFat;
            totalFiber = currentPlate.totalFiber;

            updateThaliDisplay();

            for (const [category, item] of Object.entries(selectedItems)) {
                if (item) {
                    const card = document.querySelector(`.food-card[data-name="${item.name}"]`);
                    if (card) {
                        card.classList.add('selected');
                    }
                }
            }

            if (Object.values(selectedItems).some(item => item !== null)) {
                document.querySelector('.plate-visualization').style.display = 'flex';
                document.getElementById('empty-thali').style.display = 'none';
                document.querySelector('.selected-items').style.display = 'block';
                document.querySelector('.total-price').style.display = 'flex';
                document.querySelector('.nutrition-summary').style.display = 'block';
                document.querySelector('.nutritional-target').style.display = 'block';
                document.querySelector('.meal-balance').style.display = 'block';
                document.querySelector('.order-btn').style.display = 'block';
            }
        }
        updateOrderButtonState();
    }

  
    function checkAllSectionsFilled() {
        return selectedItems.base && selectedItems.curry && selectedItems.dessert && selectedItems.beverage;
    }

    
    function updateOrderButtonState() {
        const orderBtn = document.querySelector('.order-btn');
        if (checkAllSectionsFilled()) {
            orderBtn.disabled = false;
            orderBtn.style.opacity = '1';
            orderBtn.style.cursor = 'pointer';
            document.querySelector('.caution-box').style.display = 'none';
        } else {
            orderBtn.disabled = true;
            orderBtn.style.opacity = '0.6';
            orderBtn.style.cursor = 'not-allowed';
            document.querySelector('.caution-box').style.display = 'flex';
        }
    }

    // Enhanced tooltip function
    function showTooltip(e) {
        const category = this.dataset.category;
        const item = selectedItems[category];
        
        const existingTooltip = document.querySelector('.segment-tooltip');
        if (existingTooltip) existingTooltip.remove();
        
        if (!item) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'segment-tooltip';
        tooltip.innerHTML = `
            <strong>${item.name}</strong>
            <div>Price: ₹${item.price}</div>
            <div>Calories: ${item.calories} cal</div>
            <div>Protein: ${item.protein}g</div>
        `;
        
        const plate = document.querySelector('.plate-visualization');
        const plateRect = plate.getBoundingClientRect();
        const radius = plateRect.width / 2;
        const centerX = radius;
        const centerY = radius;
        
        
        switch(category) {
            case 'base': 
                tooltip.style.left = `${centerX + radius - 10}px`;
                tooltip.style.top = `${centerY}px`;
                tooltip.style.transform = 'translateY(-50%)';
                break;
                
            case 'curry': 
                tooltip.style.left = `${centerX + radius - 5}px`;
                tooltip.style.top = `${centerY + radius - 5}px`;
                break;
                
            case 'dessert': 
                tooltip.style.left = `${centerX - radius + 10}px`;
                tooltip.style.top = `${centerY}px`;
                tooltip.style.transform = 'translate(-100%, -50%)';
                break;
                
            case 'beverage': 
                tooltip.style.left = `${centerX - radius + 15}px`;
                tooltip.style.top = `${centerY - radius + 15}px`;
                tooltip.style.transform = 'translateY(-100%)';
                break;
        }
        
        plate.appendChild(tooltip);
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.segment-tooltip');
        if (tooltip) tooltip.remove();
    }

    foodCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const name = this.dataset.name;
            const calories = parseInt(this.dataset.calories);
            const price = parseInt(this.dataset.price);
            const protein = parseFloat(this.dataset.protein);
            const carbs = parseFloat(this.dataset.carbs);
            const fat = parseFloat(this.dataset.fat);
            const fiber = parseFloat(this.dataset.fiber);

            if (selectedItems[category]) {
                const prevCard = document.querySelector(`.food-card[data-name="${selectedItems[category].name}"]`);
                if (prevCard) prevCard.classList.remove('selected');
                totalCalories -= selectedItems[category].calories;
                totalPrice -= selectedItems[category].price;
                totalProtein -= selectedItems[category].protein;
                totalCarbs -= selectedItems[category].carbs;
                totalFat -= selectedItems[category].fat;
                totalFiber -= selectedItems[category].fiber;
            }

            this.classList.add('selected');
            selectedItems[category] = {
                name,
                calories,
                price,
                protein,
                carbs,
                fat,
                fiber
            };
            totalCalories += calories;
            totalPrice += price;
            totalProtein += protein;
            totalCarbs += carbs;
            totalFat += fat;
            totalFiber += fiber;

            updateThaliDisplay();

            document.querySelector('.plate-visualization').style.display = 'flex';
            document.getElementById('empty-thali').style.display = 'none';

            document.querySelector('.selected-items').style.display = 'block';
            document.querySelector('.total-price').style.display = 'flex';
            document.querySelector('.nutrition-summary').style.display = 'block';
            document.querySelector('.nutritional-target').style.display = 'block';
            document.querySelector('.meal-balance').style.display = 'block';
            document.querySelector('.order-btn').style.display = 'block';

            document.querySelector('.order-confirmation').style.display = 'none';

            this.classList.add('bounce');
            setTimeout(() => {
                this.classList.remove('bounce');
            }, 500);

            const currentSection = document.querySelector(`.accordion-item:nth-child(${getSectionIndex(category) + 1})`);
            if (currentSection) {
                currentSection.classList.remove('open');
            }

            if (allSectionsSelected()) {
                closeAllAccordions();
            }

            saveCurrentPlateToSessionStorage();
            updateOrderButtonState();
        });
    });

   
    function getSectionIndex(category) {
        const sections = ['base', 'curry', 'dessert', 'beverage'];
        return sections.indexOf(category);
    }

   
    function calculateMealBalance() {
        const caloriesPercent = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);
        const proteinPercent = Math.min(Math.round((totalProtein / 50) * 100), 100);
        const carbsPercent = Math.min(Math.round((totalCarbs / 300) * 100), 100);
        const fatPercent = Math.min(Math.round((totalFat / 70) * 100), 100);
        const fiberPercent = Math.min(Math.round((totalFiber / 25) * 100), 100);

        const avgPercent = (caloriesPercent * 0.4) + (proteinPercent * 0.2) +
            (carbsPercent * 0.2) + (fatPercent * 0.1) + (fiberPercent * 0.1);

        let rating, ratingClass;
        if (avgPercent >= 90) {
            rating = "Excellent";
            ratingClass = "rating-excellent";
        } else if (avgPercent >= 75) {
            rating = "Good";
            ratingClass = "rating-good";
        } else if (avgPercent >= 50) {
            rating = "Fair";
            ratingClass = "rating-fair";
        } else {
            rating = "Poor";
            ratingClass = "rating-poor";
        }

        const ratingElement = document.getElementById('balance-rating-value');
        ratingElement.textContent = rating;
        ratingElement.className = 'rating-value ' + ratingClass;
    }

    
    function updateThaliDisplay() {
        const selectedItemsContainer = document.getElementById('selected-items');
        const plateCenterText = document.getElementById('plate-center-text');
        const totalCaloriesElement = document.getElementById('total-calories');
        const totalPriceElement = document.getElementById('total-price-value');
        const orderPriceElement = document.getElementById('order-price');
        const confirmationPriceElement = document.getElementById('confirmation-price');
        const totalProteinElement = document.getElementById('total-protein');
        const totalCarbsElement = document.getElementById('total-carbs');
        const totalFatElement = document.getElementById('total-fat');
        const totalFiberElement = document.getElementById('total-fiber');

        selectedItemsContainer.innerHTML = '';

        const hasItems = Object.values(selectedItems).some(item => item !== null);

        if (hasItems) {
            plateCenterText.textContent = `${totalCalories} cal`;

            document.querySelectorAll('.plate-segment').forEach(segment => {
                const category = segment.dataset.category;
                segment.innerHTML = ''; 
                
                if (selectedItems[category]) {
                    segment.classList.add('active');
                    
                   
                    segment.addEventListener('mouseenter', showTooltip);
                    segment.addEventListener('mousemove', showTooltip);
                    segment.addEventListener('mouseleave', hideTooltip);
                } else {
                    segment.classList.remove('active');
                   
                    segment.removeEventListener('mouseenter', showTooltip);
                    segment.removeEventListener('mousemove', showTooltip);
                    segment.removeEventListener('mouseleave', hideTooltip);
                }
            });

            for (const [category, item] of Object.entries(selectedItems)) {
                if (item) {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'selected-item';
                    itemElement.innerHTML = `
                        <span class="selected-item-name">${item.name}</span>
                        <div class="selected-item-details">
                            <span class="selected-item-calories">${item.calories} cal</span>
                            <span class="selected-item-price">₹${item.price}</span>
                        </div>
                    `;
                    selectedItemsContainer.appendChild(itemElement);
                }
            }

            totalCaloriesElement.textContent = totalCalories;
            totalPriceElement.textContent = `₹${totalPrice}`;
            orderPriceElement.textContent = totalPrice;
            confirmationPriceElement.textContent = totalPrice;
            totalProteinElement.textContent = `${totalProtein}g`;
            totalCarbsElement.textContent = `${totalCarbs}g`;
            totalFatElement.textContent = `${totalFat}g`;
            totalFiberElement.textContent = `${totalFiber}g`;

            const caloriesPercent = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);
            const proteinPercent = Math.min(Math.round((totalProtein / 50) * 100), 100);
            const carbsPercent = Math.min(Math.round((totalCarbs / 300) * 100), 100);
            const fatPercent = Math.min(Math.round((totalFat / 70) * 100), 100);
            const fiberPercent = Math.min(Math.round((totalFiber / 25) * 100), 100);

            document.getElementById('calories-percent').textContent = `${caloriesPercent}%`;
            document.getElementById('protein-percent').textContent = `${proteinPercent}%`;
            document.getElementById('carbs-percent').textContent = `${carbsPercent}%`;
            document.getElementById('fat-percent').textContent = `${fatPercent}%`;
            document.getElementById('fiber-percent').textContent = `${fiberPercent}%`;

            document.querySelector('.target-calories .target-progress').style.width = `${caloriesPercent}%`;
            document.querySelector('.target-protein .target-progress').style.width = `${proteinPercent}%`;
            document.querySelector('.target-carbs .target-progress').style.width = `${carbsPercent}%`;
            document.querySelector('.target-fat .target-progress').style.width = `${fatPercent}%`;
            document.querySelector('.target-fiber .target-progress').style.width = `${fiberPercent}%`;

            calculateMealBalance();
        }

        updateOrderButtonState();
    }

  
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelectorAll('.food-card').forEach(card => {
            card.classList.remove('selected');
        });

        selectedItems = {
            base: null,
            curry: null,
            dessert: null,
            beverage: null
        };

        totalCalories = 0;
        totalPrice = 0;
        totalProtein = 0;
        totalCarbs = 0;
        totalFat = 0;
        totalFiber = 0;

        document.querySelector('.plate-visualization').style.display = 'none';
        document.getElementById('empty-thali').style.display = 'block';

        document.querySelector('.selected-items').style.display = 'none';
        document.querySelector('.total-price').style.display = 'none';
        document.querySelector('.nutrition-summary').style.display = 'none';
        document.querySelector('.nutritional-target').style.display = 'none';
        document.querySelector('.meal-balance').style.display = 'none';
        document.querySelector('.order-btn').style.display = 'none';
        document.querySelector('.order-confirmation').style.display = 'none';

        const currentPlate = JSON.parse(sessionStorage.getItem('currentBalancedThali'));
        
        if (currentPlate && currentPlate.isLoadedPlate) {
            openAllAccordions();
        } else {
            closeAllAccordions();
        }

        sessionStorage.removeItem('currentBalancedThali');
        sessionStorage.removeItem('hasCurrentPlate');

        updateThaliDisplay();
    });

   
    document.querySelector('.order-btn').addEventListener('click', function() {
        if (!checkAllSectionsFilled()) {
            alert('Please select items from all four sections to complete your thali.');
            return;
        }

        if (totalPrice > 0) {
            document.querySelector('.order-btn').style.display = 'none';
            const confirmation = document.querySelector('.order-confirmation');
            confirmation.style.display = 'block';

            createConfetti();

            confirmation.scrollIntoView({ behavior: 'smooth' });
        }
    });

  
    document.querySelector('.order-confirmation').addEventListener('click', function(e) {
        if (e.target.classList.contains('cancel-btn')) {
            this.style.display = 'none';
            document.querySelector('.order-btn').style.display = 'block';
            
           
            const toast = document.getElementById('cancel-toast');
            toast.style.display = 'flex';
            toast.style.animation = 'slideIn 0.3s ease-out';
            
           
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }, 3000);
        }
    });

    
    document.querySelector('.toast-close').addEventListener('click', function() {
        const toast = document.getElementById('cancel-toast');
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    });

    
    function createConfetti() {
        const colors = ['#00996D', '#4CAF50', '#2196F3', '#FFA000', '#F44336'];
        const container = document.querySelector('.thali-box');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.opacity = '0';
            confetti.style.animation = `confetti ${Math.random() * 3 + 2}s ease-out forwards`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

   
    updateOrderButtonState();

    
    openAllAccordions();

    
    loadSelectedItems();
});
document.querySelector('.close-order-btn').addEventListener('click', function() {
  document.querySelector('.order-confirmation').style.display = 'none';
  document.querySelector('.order-btn').style.display = 'block';
});
