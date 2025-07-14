// ===== ENTERPRISE INVOICE EDITOR SYSTEM =====
  
  // Payment Profiles System
  const paymentProfiles = {
    wise: {
      name: "Wise (Standard)",
      accountHolder: "ELK Media LLC",
      bank: "TransferWise Europe SA",
      iban: "BE13 9672 2117 7039",
      swift: "TRWIBEB1XXX",
      address: "Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium"
    }
  };

  // Default Invoice Items
  const defaultInvoiceItems = [
    {
      id: 1,
      name: "Premium Event-Webseite",
      description: "Professionelle Event-Webseite mit responsivem Design, SEO-Optimierung, Ticketing-Integration, Sponsorenbereich, Social Media Integration und SSL-Zertifikat inkl. Hosting für 1 Jahr. Launch innerhalb von 7 Tagen.",
      quantity: 1,
      price: 3790.00
    },
    {
      id: 2,
      name: "Interaktive Veranstaltungskarte",
      description: "Detaillierte Karte mit allen Eventlocations, Parkplätzen, Gastronomie und Points of Interest inkl. Routenplaner.",
      quantity: 1,
      price: 845.00
    },
    {
      id: 3,
      name: "Express-Bearbeitung (5 Tage)",
      description: "Beschleunigter Launch der Event-Webseite innerhalb von 5 statt 7 Werktagen.",
      quantity: 1,
      price: 500.00
    }
  ];

  // ==== PASSWORD SECTION START ====
  const validPasswords = {
    "customeraut@gmail.com": "Asilah12!",
    "laura.rzoska@gmail.com": "Laura12!",
    "Ingrid.el.kanfoud@gmail.com": "Ingrid12!",
    "sinisapaler@gmail.com": "Sinisa12!",
    "1212": "1212",
  };
  // ==== PASSWORD SECTION END ====

  document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const splash = document.getElementById('splash');
    const auth = document.getElementById('auth');
    const authForm = document.getElementById('authForm');
    const authError = document.getElementById('authError');
    const authErrorText = document.getElementById('authErrorText');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const authSubmit = document.getElementById('authSubmit');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const editor = document.getElementById('editor');
    const artboardContainer = document.querySelector('.artboard-container');
    const artboardCanvas = document.querySelector('.artboard-canvas');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomLabel = document.getElementById('zoom-percentage');
    const fitToScreenBtn = document.getElementById('fit-to-screen');
    const actualSizeBtn = document.getElementById('actual-size');
    const addItemBottomBtn = document.getElementById('add-item-bottom');
    const helpBtn = document.getElementById('help-btn');
    const helpOverlay = document.getElementById('help-overlay');
    const helpClose = document.getElementById('help-close');
    const printBtn = document.getElementById('print-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');
    const resetModal = document.getElementById('reset-modal');
    const resetCancel = document.getElementById('reset-cancel');
    const resetConfirm = document.getElementById('reset-confirm');
    const helpHeaderBtn = document.getElementById('help-header-btn');
    const currencySwitch = document.getElementById('currency-switch');

    // ===== INVOICE EDITING SYSTEM VARIABLES =====
    let invoiceItems = [...defaultInvoiceItems];
    let itemIdCounter = defaultInvoiceItems.length;
    const basicFields = ['invoiceNumber', 'customerName'];
    let saveTimeout;

    // ===== CURRENCY SYSTEM =====
    let currentCurrency = 'CHF';
    
    function updateCurrency(newCurrency) {
      currentCurrency = newCurrency;
      
      // Update currency switch UI
      currencySwitch.querySelectorAll('.currency-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.currency === newCurrency);
      });
      
      // Update all price displays in the invoice
      updateInvoiceTable();
      
      // Update static price displays in HTML
      updateStaticPriceDisplays();
      
      // Save currency preference
      localStorage.setItem('invoiceCurrency', newCurrency);
    }
    
    function updateStaticPriceDisplays() {
      // Update all elements with price-display class
      document.querySelectorAll('.price-display').forEach(element => {
        const price = parseFloat(element.dataset.price);
        if (!isNaN(price)) {
          element.textContent = formatCurrency(price);
        }
      });
    }
    
    function formatCurrency(amount) {
      const symbol = currentCurrency === 'CHF' ? 'CHF' : '€';
      const locale = currentCurrency === 'CHF' ? 'de-CH' : 'de-DE';
      
      if (currentCurrency === 'CHF') {
        return `CHF ${amount.toLocaleString(locale, { minimumFractionDigits: 2 })}`;
      } else {
        return `${amount.toLocaleString(locale, { minimumFractionDigits: 2 })} €`;
      }
    }
    
    // Currency switch event listeners
    if (currencySwitch) {
      currencySwitch.addEventListener('click', (e) => {
        if (e.target.classList.contains('currency-option')) {
          const newCurrency = e.target.dataset.currency;
          updateCurrency(newCurrency);
        }
      });
    }
    
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('invoiceCurrency');
    if (savedCurrency && (savedCurrency === 'CHF' || savedCurrency === 'EUR')) {
      updateCurrency(savedCurrency);
    }

    // Authentication persistence functions
    function setAuthentication(username) {
      const authData = {
        authenticated: true,
        username: username,
        timestamp: Date.now(),
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      localStorage.setItem('eventseiten_auth', JSON.stringify(authData));
    }

    function checkAuthentication() {
      try {
        const authData = JSON.parse(localStorage.getItem('eventseiten_auth'));
        if (!authData) return false;
        
        if (Date.now() > authData.expires) {
          localStorage.removeItem('eventseiten_auth');
          return false;
        }
        
        return authData.authenticated === true;
      } catch (e) {
        localStorage.removeItem('eventseiten_auth');
        return false;
      }
    }

    function clearAuthentication() {
      localStorage.removeItem('eventseiten_auth');
    }

    // Check if user is already authenticated
    const isAuthenticated = checkAuthentication();
    
    if (isAuthenticated) {
      setTimeout(() => {
        hidePreloader();
      }, 500);
    } else {
      setTimeout(() => {
        showPasswordScreen();
      }, 2500);
    }

    function showPasswordScreen() {
      splash.classList.add('fade-out');
      
      setTimeout(() => {
        splash.style.display = 'none';
        auth.classList.add('active');
        setTimeout(() => {
          usernameInput.focus();
        }, 300);
      }, 600);
    }

    function hidePreloader() {
      preloader.classList.add('hidden');
      
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }

    function showError(message) {
      authErrorText.textContent = message;
      authError.classList.add('show');
      
      usernameInput.classList.add('error');
      passwordInput.classList.add('error');
      
      setTimeout(() => {
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');
      }, 400);
      
      setTimeout(() => {
        hideError();
      }, 5000);
    }

    function hideError() {
      authError.classList.remove('show');
    }

    function validateCredentials(username, password) {
      const normalizedUsername = username.toLowerCase().trim();
      
      for (const [validUser, validPass] of Object.entries(validPasswords)) {
        if (validUser.toLowerCase() === normalizedUsername && validPass === password) {
          return true;
        }
      }
      return false;
    }

    // Form submission handler
    if (authForm) {
      authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideError();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        if (!username || !password) {
          showError('Bitte füllen Sie alle Felder aus.');
          return;
        }
        
        authSubmit.disabled = true;
        authSubmit.textContent = 'Validierung...';
        
        setTimeout(() => {
          if (validateCredentials(username, password)) {
            authSubmit.textContent = 'Erfolgreich!';
            authSubmit.style.background = 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-dark) 100%)';
            authSubmit.style.boxShadow = '0 4px 20px rgba(196, 27, 21, 0.4), 0 2px 8px rgba(196, 27, 21, 0.3)';
            
            setAuthentication(username);
            
            setTimeout(() => {
              hidePreloader();
            }, 1000);
          } else {
            showError('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.');
            authSubmit.disabled = false;
            authSubmit.textContent = 'Anmelden';
            
            passwordInput.value = '';
            passwordInput.focus();
          }
        }, 800);
      });
    }

    // Clear error when user starts typing
    [usernameInput, passwordInput].forEach(input => {
      if (input) {
        input.addEventListener('input', hideError);
      }
    });

    // Mobile Menu Toggle Functionality
    if (mobileMenuToggle && editor) {
      mobileMenuToggle.addEventListener('click', function() {
        const isCurrentlyOpen = editor.classList.contains('open');
        
        if (isCurrentlyOpen) {
          this.classList.add('closing');
          this.classList.remove('active');
          
          setTimeout(() => {
            editor.classList.remove('open');
            this.classList.remove('closing');
            this.setAttribute('aria-label', 'Einstellungen öffnen');
          }, 600);
        } else {
          editor.classList.add('open');
          this.classList.add('active');
          this.setAttribute('aria-label', 'Einstellungen schließen');
        }
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!editor.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          if (editor.classList.contains('open')) {
            mobileMenuToggle.classList.add('closing');
            mobileMenuToggle.classList.remove('active');
            
            setTimeout(() => {
              editor.classList.remove('open');
              mobileMenuToggle.classList.remove('closing');
              mobileMenuToggle.setAttribute('aria-label', 'Einstellungen öffnen');
            }, 600);
          }
        }
      });
    }

    // Close Editor Button Functionality
    const closeEditorBtn = document.getElementById('close-editor');
    if (closeEditorBtn && editor) {
      closeEditorBtn.addEventListener('click', function() {
        if (editor.classList.contains('open')) {
          editor.classList.remove('open');
          if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-label', 'Einstellungen öffnen');
          }
        }
      });
    }

    // Add Item Button Functionality
    const addItemBtn = document.getElementById('add-item');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', addInvoiceItem);
    }

    // ===== INVOICE EDITING SYSTEM =====
    
    // Date formatting function - DD.MM.YYYY format
    function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    // Initialize live binding for basic fields
    basicFields.forEach(fieldName => {
      const input = document.querySelector(`[name="${fieldName}"]`);
      const targets = document.querySelectorAll(`[data-bind="${fieldName}"]`);
      
      if (input && targets.length > 0) {
        input.addEventListener('input', e => {
          const value = e.target.value || input.placeholder || targets[0].textContent;
          
          targets.forEach(target => {
            target.textContent = value;
          });
          
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(save, 500);
        });
        
        // Initialize with current value or placeholder
        const initialValue = input.value || input.placeholder || targets[0].textContent;
        targets.forEach(target => {
          target.textContent = initialValue;
        });
      }
    });

    // Special handling for date fields with enhanced formatting
    const dateFields = ['invoiceDate', 'dueDate'];
    dateFields.forEach(fieldName => {
      const input = document.querySelector(`[name="${fieldName}"]`);
      const targets = document.querySelectorAll(`[data-bind="${fieldName}"]`);
      
      if (input && targets.length > 0) {
        input.addEventListener('input', e => {
          const formattedDate = formatDate(e.target.value);
          
          targets.forEach(target => {
            target.textContent = formattedDate;
          });
          
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(save, 500);
        });
        
        // Initialize with current value
        if (input.value) {
          const formattedDate = formatDate(input.value);
          targets.forEach(target => {
            target.textContent = formattedDate;
          });
        }
      }
    });

    // Customer address handling
    const customerAddressInput = document.querySelector('[name="customerAddress"]');
    const customerAddressTarget = document.querySelector('[data-bind="customerAddress"]');
    
    if (customerAddressInput && customerAddressTarget) {
      customerAddressInput.addEventListener('input', e => {
        customerAddressTarget.innerHTML = e.target.value.replace(/\n/g, '<br>');
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(save, 500);
      });
    }

    // Invoice Items Management
    function createInvoiceItemElement(item) {
      const div = document.createElement('div');
      div.className = 'invoice-item-form';
      div.dataset.itemId = item.id;
      
      div.innerHTML = `
        <div class="item-header">
          <h5>Position ${item.id}</h5>
          <button type="button" class="remove-item" data-item-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="form-group">
          <label>Bezeichnung</label>
          <input type="text" name="itemName" value="${item.name}" data-item-id="${item.id}">
        </div>
        
        <div class="form-group">
          <label>Beschreibung</label>
          <textarea name="itemDescription" rows="2" data-item-id="${item.id}">${item.description}</textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Menge</label>
            <input type="number" name="itemQuantity" value="${item.quantity}" min="1" data-item-id="${item.id}">
          </div>
          
          <div class="form-group">
            <label>Einzelpreis (CHF)</label>
            <input type="number" name="itemPrice" value="${item.price}" step="0.01" min="0" data-item-id="${item.id}">
          </div>
        </div>
      `;
      
      return div;
    }

    function renderInvoiceItems() {
      const container = document.getElementById('invoice-items');
      container.innerHTML = '';
      
      invoiceItems.forEach(item => {
        const element = createInvoiceItemElement(item);
        container.appendChild(element);
      });

      // Add event listeners for item forms
      container.querySelectorAll('[data-item-id]').forEach(input => {
        input.addEventListener('input', updateInvoiceItem);
      });

      container.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeInvoiceItem);
      });

      updateInvoiceTable();
    }

    function updateInvoiceItem(e) {
      const itemId = parseInt(e.target.dataset.itemId);
      const item = invoiceItems.find(item => item.id === itemId);
      
      if (!item) return;

      const fieldName = e.target.name;
      const value = e.target.value;

      switch (fieldName) {
        case 'itemName':
          item.name = value;
          break;
        case 'itemDescription':
          item.description = value;
          break;
        case 'itemQuantity':
          item.quantity = parseInt(value) || 1;
          break;
        case 'itemPrice':
          item.price = parseFloat(value) || 0;
          break;
      }

      updateInvoiceTable();
      
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(save, 500);
    }

    function removeInvoiceItem(e) {
      const itemId = parseInt(e.target.dataset.itemId);
      invoiceItems = invoiceItems.filter(item => item.id !== itemId);
      renderInvoiceItems();
      
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(save, 500);
    }

    function addInvoiceItem() {
      itemIdCounter++;
      const newItem = {
        id: itemIdCounter,
        name: `Neue Position ${itemIdCounter}`,
        description: 'Beschreibung der Leistung',
        quantity: 1,
        price: 0.00
      };
      
      invoiceItems.push(newItem);
      renderInvoiceItems();
      
      // Focus on the new item's name field
      setTimeout(() => {
        const newItemElement = document.querySelector(`[data-item-id="${itemIdCounter}"][name="itemName"]`);
        if (newItemElement) {
          newItemElement.focus();
          newItemElement.select();
        }
      }, 100);
    }

    function updateInvoiceTable() {
      const tableBody = document.querySelector('.items-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = '';
      let total = 0;

      invoiceItems.forEach(item => {
        const itemTotal = item.quantity * item.price;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <strong>${item.name}</strong>
            <div class="item-description">
              ${item.description}
            </div>
          </td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${formatCurrency(itemTotal)}</td>
        `;
        
        tableBody.appendChild(row);
      });

      // Update total amount
      const totalAmountElement = document.querySelector('.total-amount');
      if (totalAmountElement) {
        totalAmountElement.textContent = formatCurrency(total);
      }
    }

    // Payment Profile Management
    function updatePaymentProfile(profileKey) {
      const profile = paymentProfiles[profileKey];
      if (!profile) return;

      const paymentDetails = document.querySelectorAll('.payment-detail');
      
      paymentDetails.forEach(detail => {
        const label = detail.querySelector('.payment-label').textContent.toLowerCase();
        const valueElement = detail.querySelector('.payment-value');
        
        if (label.includes('kontoinhaber')) {
          valueElement.textContent = profile.accountHolder;
        } else if (label.includes('iban')) {
          valueElement.textContent = profile.iban;
        } else if (label.includes('bank')) {
          valueElement.textContent = profile.bank;
        } else if (label.includes('adresse')) {
          valueElement.innerHTML = profile.address.replace(/\n/g, '<br>');
        } else if (label.includes('swift') || label.includes('bic')) {
          valueElement.textContent = profile.swift;
        }
      });
    }

    // Payment profile selector
    const paymentProfileSelect = document.getElementById('payment-profile');
    if (paymentProfileSelect) {
      paymentProfileSelect.addEventListener('change', e => {
        updatePaymentProfile(e.target.value);
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(save, 500);
      });
    }

    // Storage functions
    function save() {
      const formData = new FormData(document.getElementById('invoiceForm'));
      const data = {};
      
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      data.invoiceItems = invoiceItems;
      data.timestamp = Date.now();
      
      localStorage.setItem('invoiceData', JSON.stringify(data));
    }

    function load() {
      const saved = localStorage.getItem('invoiceData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          
          // Load basic form fields
          Object.keys(data).forEach(key => {
            if (key === 'invoiceItems' || key === 'timestamp') return;
            
            const input = document.querySelector(`[name="${key}"]`);
            if (input && data[key]) {
              input.value = data[key];
              
              // Trigger update for bound elements
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
            }
          });

          // Load invoice items
          if (data.invoiceItems && data.invoiceItems.length > 0) {
            invoiceItems = data.invoiceItems;
            itemIdCounter = Math.max(...invoiceItems.map(item => item.id));
          }

          // Update payment profile
          if (data.paymentProfile) {
            updatePaymentProfile(data.paymentProfile);
          }

          renderInvoiceItems();
          
        } catch (e) {
          console.warn('Error loading saved data:', e);
        }
      } else {
        // Initialize with default items if no saved data
        renderInvoiceItems();
      }
    }

    // Reset functionality
    document.getElementById('reset').addEventListener('click', () => {
      if (confirm('Alle Felder auf Standardwerte zurücksetzen?')) {
        localStorage.removeItem('invoiceData');
        
        // Reset form
        document.getElementById('invoiceForm').reset();
        
        // Reset items to defaults
        invoiceItems = [...defaultInvoiceItems];
        itemIdCounter = defaultInvoiceItems.length;
        
        // Reset date fields to defaults
        document.querySelector('[name="invoiceDate"]').value = '2025-01-15';
        document.querySelector('[name="dueDate"]').value = '2025-02-14';
        
        // Update display
        setTimeout(() => {
          renderInvoiceItems();
          updatePaymentProfile('wise');
          
          // Trigger updates for bound elements
          document.querySelectorAll('[data-bind]').forEach(element => {
            const fieldName = element.dataset.bind;
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (input) {
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
            }
          });
        }, 100);
      }
    });

    // Download button with enterprise animation
    document.getElementById('download').addEventListener('click', function(e) {
      e.preventDefault();
      
      // Simply call print immediately without animations that could cause overlay issues
      window.print();
    });

    // Initialize the invoice editor
    setTimeout(() => {
      load();
      updatePaymentProfile('wise');
      updateStaticPriceDisplays();
    }, 100);

    // Auto-logout after inactivity (2 hours)
    let inactivityTimer;
    function resetInactivityTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        clearAuthentication();
        location.reload();
      }, 2 * 60 * 60 * 1000);
    }

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });
    
    resetInactivityTimer();

    // ===== ARTBOARD SYSTEM =====
    
    // ===== PRODUCTION-READY ZOOM SYSTEM =====
    let currentZoom = 100; // Current zoom percentage
    const minZoom = 10;
    const maxZoom = 200;
    // Figma-style zoom levels
    const zoomLevels = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 200];
    
    // Page dimensions at 100% (A4 at 96 DPI)
    const pageWidth = 794;
    const pageHeight = 1123;
    
    // Viewport and transform state
    let viewportX = 0; // Viewport center X offset
    let viewportY = 0; // Viewport center Y offset
    let lastZoom = 100; // For toggle functionality
    
    // Legacy variables for compatibility with duplicate functions
    let currentScale = 1.0;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    
    // Get container center point
    function getContainerCenter() {
      const rect = artboardContainer.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2
      };
    }
    
    // Apply transform to canvas with proper centering
    function updateCanvasTransform() {
      const scale = currentZoom / 100;
      
      // Always use center-center origin for consistent behavior
      artboardCanvas.style.transformOrigin = 'center center';
      
      // Apply scale and translate together
      if (viewportX === 0 && viewportY === 0) {
        // Pure scale when centered
        artboardCanvas.style.transform = `scale(${scale})`;
      } else {
        // Scale with translate offset
        artboardCanvas.style.transform = `translate(${viewportX}px, ${viewportY}px) scale(${scale})`;
      }
    }
    
    // Center the page in viewport
    function centerPage() {
      // Reset viewport offsets to center the page
      viewportX = 0;
      viewportY = 0;
      updateCanvasTransform();
    }
    
    // Production-ready zoom function with proper viewport management
    function zoomTo(newZoom, mouseX = null, mouseY = null, shouldCenter = false) {
      // Store last zoom for toggle
      if (newZoom !== currentZoom) {
        lastZoom = currentZoom;
      }
      
      const oldZoom = currentZoom;
      currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
      
      if (shouldCenter) {
        // Explicitly center the page
        centerPage();
      } else if (mouseX !== null && mouseY !== null) {
        // Zoom around mouse cursor - PROPER CALCULATION
        const containerRect = artboardContainer.getBoundingClientRect();
        const center = getContainerCenter();
        
        // Mouse position relative to container center
        const mouseRelativeX = mouseX - containerRect.left - center.x;
        const mouseRelativeY = mouseY - containerRect.top - center.y;
        
        // Calculate zoom factor change
        const oldScale = oldZoom / 100;
        const newScale = currentZoom / 100;
        const scaleFactor = newScale / oldScale;
        
        // Adjust viewport to keep mouse point stationary
        viewportX = mouseRelativeX + (viewportX - mouseRelativeX) * scaleFactor;
        viewportY = mouseRelativeY + (viewportY - mouseRelativeY) * scaleFactor;
        
        updateCanvasTransform();
      } else {
        // Just update scale, keep viewport position
        updateCanvasTransform();
      }
      
      updateZoomDisplay();
    }
    
    // Updated panning system
    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isSpacePressed = false;
    
    // Panning functionality
    function startPan(x, y) {
      isPanning = true;
      lastMouseX = x;
      lastMouseY = y;
    }
    
    function updatePan(x, y) {
      if (!isPanning) return;
      
      const deltaX = x - lastMouseX;
      const deltaY = y - lastMouseY;
      
      viewportX += deltaX;
      viewportY += deltaY;
      
      updateCanvasTransform();
      
      lastMouseX = x;
      lastMouseY = y;
    }
    
    function endPan() {
      isPanning = false;
    }
    
    // Update zoom display and buttons
    function updateZoomDisplay() {
      if (zoomLabel) {
        // Always show clean rounded percentage
        const roundedZoom = Math.round(currentZoom);
        zoomLabel.textContent = `${roundedZoom}%`;
      }
      if (zoomInBtn) {
        zoomInBtn.disabled = currentZoom >= maxZoom;
      }
      if (zoomOutBtn) {
        zoomOutBtn.disabled = currentZoom <= minZoom;
      }
    }
    
    // Get next/previous zoom level
    function getNextZoomLevel(current, direction) {
      const currentIndex = zoomLevels.findIndex(level => level >= current);
      if (direction > 0) {
        // Zoom in
        return currentIndex < zoomLevels.length - 1 ? zoomLevels[currentIndex + 1] : maxZoom;
      } else {
        // Zoom out
        return currentIndex > 0 ? zoomLevels[currentIndex - 1] : minZoom;
      }
    }
    
    // Center the page in the viewport (only when explicitly requested)
    function centerPage() {
      // Reset viewport offsets to center the page
      viewportX = 0;
      viewportY = 0;
      updateCanvasTransform();
    }
    
    // Zoom button controls
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextZoom = getNextZoomLevel(currentZoom, 1);
        // Center zoom for button clicks
        zoomTo(nextZoom, null, null, false);
      });
    }
    
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextZoom = getNextZoomLevel(currentZoom, -1);
        // Center zoom for button clicks  
        zoomTo(nextZoom, null, null, false);
      });
    }
    
    // Fit to screen functionality
    if (fitToScreenBtn) {
      fitToScreenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const containerRect = artboardContainer.getBoundingClientRect();
        const padding = 40; // Minimum padding around page
        
        const scaleX = (containerRect.width - padding) / pageWidth;
        const scaleY = (containerRect.height - padding) / pageHeight;
        
        const optimalScale = Math.min(scaleX, scaleY);
        const optimalZoom = Math.round(optimalScale * 100);
        
        // Find closest zoom level
        const closestZoom = zoomLevels.reduce((prev, curr) => 
          Math.abs(curr - optimalZoom) < Math.abs(prev - optimalZoom) ? curr : prev
        );
        
        zoomTo(Math.max(minZoom, closestZoom), null, null, true);
      });
    }
    
    // Actual size functionality
    if (actualSizeBtn) {
      actualSizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        zoomTo(100, null, null, true);
      });
    }
      
      // Mouse move for panning
      document.addEventListener('mousemove', (e) => {
        if (isPanning && (isSpacePressed || isHandToolActive)) {
          updatePan(e.clientX, e.clientY);
          artboardContainer.classList.add('dragging');
        }
      });
      
      // Mouse up for panning
      document.addEventListener('mouseup', () => {
        if (isPanning) {
          endPan();
          artboardContainer.classList.remove('dragging');
        }
      });
    
    // Space key panning state
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        isSpacePressed = true;
        artboardContainer.classList.add('space-panning');
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        isSpacePressed = false;
        isPanning = false;
        artboardContainer.classList.remove('space-panning', 'dragging');
      }
    });
    
    // Mouse down for panning
    artboardContainer.addEventListener('mousedown', (e) => {
      // Space key panning (temporary)
      if (isSpacePressed) {
        e.preventDefault();
        startPan(e.clientX, e.clientY);
        artboardContainer.classList.add('dragging');
        return;
      }
      
      // Hand tool panning (persistent)
      if (isHandToolActive) {
        e.preventDefault();
        startPan(e.clientX, e.clientY);
        artboardContainer.classList.add('dragging');
        return;
      }
      
      // Zoom tool
      if (isZoomToolActive) {
        e.preventDefault();
        if (e.altKey) {
          // Alt + click = zoom out
          const nextZoom = getNextZoomLevel(currentZoom, -1);
          zoomTo(nextZoom, e.clientX, e.clientY);
        } else {
          // Click = zoom in
          const nextZoom = getNextZoomLevel(currentZoom, 1);
          zoomTo(nextZoom, e.clientX, e.clientY);
        }
        return;
      }
    });
    
    // Wheel events for zoom and touchpad pan
    artboardContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + wheel = zoom - PRODUCTION READY
        const zoomSensitivity = 0.2;
        const deltaY = e.deltaY;
        
        // Calculate zoom change
        let zoomChange;
        if (Math.abs(deltaY) > 100) {
          // Mouse wheel - discrete steps
          zoomChange = deltaY > 0 ? -10 : 10;
        } else {
          // Trackpad - smooth zoom
          zoomChange = -deltaY * zoomSensitivity;
        }
        
        const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + zoomChange));
        
        // Only update if significant change
        if (Math.abs(newZoom - currentZoom) > 0.1) {
          zoomTo(newZoom, e.clientX, e.clientY);
        }
      } else {
        // Regular wheel = trackpad pan
        viewportX -= e.deltaX;
        viewportY -= e.deltaY;
        updateCanvasTransform();
      }
    });
    
    // Prevent default space bar scrolling
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });
    
    // Initialize artboard
    function initializeArtboard() {
      currentZoom = 80; // Changed from 100 to 80 for better initial view
      // Delay centering to ensure proper layout calculations
      setTimeout(() => {
      centerPage();
      updateZoomDisplay();
      }, 100);
    }
    
    // Reinitialize on window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        centerPage();
      }, 100);
    });
    
    // Initialize artboard and bottom bar functionality
    initializeArtboard();
    
    // Zoom percentage toggle
    if (zoomLabel) {
      zoomLabel.addEventListener('click', () => {
        zoomTo(lastZoom);
      });
    }
    
    // Add item button (bottom bar)
    if (addItemBottomBtn) {
      addItemBottomBtn.addEventListener('click', addInvoiceItem);
    }
    
    // Print button (bottom bar)
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        // Hide all overlays and modals before printing to prevent z-index conflicts
        if (helpOverlay && helpOverlay.classList.contains('active')) {
          helpOverlay.classList.remove('active');
        }
        if (resetModal && resetModal.classList.contains('active')) {
          resetModal.classList.remove('active');
        }
        
        // Ensure editor is closed on mobile
        if (editor && editor.classList.contains('open')) {
          editor.classList.remove('open');
        }
        
        // Force hide all major UI elements immediately
        const elementsToHide = [
          '.document-switcher',
          '.figma-bottom-bar',
          '#editor',
          '#preloader'
        ];
        
        elementsToHide.forEach(selector => {
          const element = document.querySelector(selector);
          if (element) {
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
          }
        });
        
        // Small delay to ensure DOM updates before print dialog
        setTimeout(() => {
          window.print();
          
          // Restore visibility after a brief delay
          setTimeout(() => {
            elementsToHide.forEach(selector => {
              const element = document.querySelector(selector);
              if (element) {
                element.style.visibility = '';
                element.style.opacity = '';
                element.style.pointerEvents = '';
              }
            });
          }, 200);
        }, 50);
      });
    }
    
    // Add print event listeners to handle modal state during print
    window.addEventListener('beforeprint', () => {
      // Store current modal states and display styles of major containers
      window.printUIData = {
        helpActive: helpOverlay && helpOverlay.classList.contains('active'),
        resetActive: resetModal && resetModal.classList.contains('active'),
        editorOpen: editor && editor.classList.contains('open'),
        mainEditorDisplay: editor ? editor.style.display : '',
        preloaderDisplay: preloader ? preloader.style.display : '',
        documentSwitcherDisplay: document.querySelector('.document-switcher') ? document.querySelector('.document-switcher').style.display : '',
        bottomBarDisplay: document.querySelector('.figma-bottom-bar') ? document.querySelector('.figma-bottom-bar').style.display : ''
      };
      
      // Hide all modals and major UI containers
      if (helpOverlay) helpOverlay.classList.remove('active');
      if (resetModal) resetModal.classList.remove('active');
      
      // Explicitly hide main editor and preloader
      if (editor) editor.style.display = 'none';
      if (preloader) preloader.style.display = 'none';
      
      // Hide document switcher and bottom bar
      const documentSwitcher = document.querySelector('.document-switcher');
      if (documentSwitcher) documentSwitcher.style.display = 'none';
      
      const bottomBar = document.querySelector('.figma-bottom-bar');
      if (bottomBar) bottomBar.style.display = 'none';
    });
    
    window.addEventListener('afterprint', () => {
      // Restore modal states and display styles after printing
      if (window.printUIData) {
        setTimeout(() => {
          // Restore modals
          if (window.printUIData.helpActive && helpOverlay) {
            helpOverlay.classList.add('active');
          }
          if (window.printUIData.resetActive && resetModal) {
            resetModal.classList.add('active');
          }
          if (window.printUIData.editorOpen && editor && editor.classList.contains('open')) {
            // This condition was editorOpen, but the class might have been removed by the click handler.
            // If it was open, and it's the mobile view, it should be restored if still open.
            // The main editor's display style handles desktop visibility.
          } else if (window.printUIData.editorOpen && editor && !editor.classList.contains('open')) {
             // If it was open and now it's not (likely mobile closed by print handler), keep it closed.
          }

          // Restore main editor and preloader display styles
          if (editor) editor.style.display = window.printUIData.mainEditorDisplay;
          if (preloader) preloader.style.display = window.printUIData.preloaderDisplay;
          
          // Restore document switcher and bottom bar
          const documentSwitcher = document.querySelector('.document-switcher');
          if (documentSwitcher) documentSwitcher.style.display = window.printUIData.documentSwitcherDisplay;
          
          const bottomBar = document.querySelector('.figma-bottom-bar');
          if (bottomBar) bottomBar.style.display = window.printUIData.bottomBarDisplay;
          
          delete window.printUIData;
        }, 150); // Slightly increased delay to ensure print dialog is fully gone
      }
    });
    
    // Help overlay functionality
    if (helpBtn && helpOverlay && helpClose) {
      helpBtn.addEventListener('click', () => {
        helpOverlay.classList.add('active');
      });
      
      helpClose.addEventListener('click', () => {
        helpOverlay.classList.remove('active');
      });
      
      // Close on overlay click
      helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
          helpOverlay.classList.remove('active');
        }
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpOverlay.classList.contains('active')) {
          helpOverlay.classList.remove('active');
        }
      });
    }
    
    // Header help button (duplicate functionality for header button)
    if (helpHeaderBtn && helpOverlay) {
      helpHeaderBtn.addEventListener('click', () => {
        helpOverlay.classList.add('active');
      });
      }
      
    // Reset modal functionality
    if (resetAllBtn && resetModal && resetCancel && resetConfirm) {
      resetAllBtn.addEventListener('click', () => {
        resetModal.classList.add('active');
      });

      resetCancel.addEventListener('click', () => {
        resetModal.classList.remove('active');
      });
    
      // Close on overlay click
      resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
          resetModal.classList.remove('active');
      }
      });
    
      // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resetModal.classList.contains('active')) {
          resetModal.classList.remove('active');
      }
      });

      // Confirm reset
      resetConfirm.addEventListener('click', () => {
        // Clear all data
        localStorage.removeItem('invoiceData');
        
        // Reset form
        document.getElementById('invoiceForm').reset();
        
        // Reset items to defaults
        invoiceItems = [...defaultInvoiceItems];
        itemIdCounter = defaultInvoiceItems.length;
        
        // Reset date fields to defaults
        document.querySelector('[name="invoiceDate"]').value = '2025-01-15';
        document.querySelector('[name="dueDate"]').value = '2025-02-14';
        
        // Reset zoom and center artboard
        currentZoom = 80;
        centerPage();
        updateZoomDisplay();
        
        // Close modal
        resetModal.classList.remove('active');
        
        // Update display
        setTimeout(() => {
          renderInvoiceItems();
          updatePaymentProfile('wise');
          
          // Trigger updates for bound elements
          document.querySelectorAll('[data-bind]').forEach(element => {
            const fieldName = element.dataset.bind;
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (input) {
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
            }
          });
        }, 100);
      });
    }
  }); // Close DOMContentLoaded event listener
