/* 
This event listener allows the script to run after the page has loaded, preventing errors of elements not being found 
Although this is not too important, because I put my script imports and the end of my HTML pages anyway, but it is good to double check.
*/
document.addEventListener('DOMContentLoaded', () => {
  /*******************************************************
  Dark theme selector (in nav bar)
  ********************************************************/
  /* 
  Runs on all pages so no if statement needed.
  This needs to be done first, so the theme is set before the user can interact with the page 
  */
  const themeDropdownItems = document.querySelectorAll('#themeDropdown .dropdown-item');
  const themeCheckLight = document.getElementById('themeCheckLight');
  const themeCheckDark = document.getElementById('themeCheckDark');

  /* I have to get this from localStorage, because when this script is reloaded, the system would "forget" what theme the user was on. So this allows the theme to stay across pages. */
  let currentTheme = localStorage.getItem('theme') || 'light';
  /*
   "false" means that it doesn't have a fade animation when the theme is applied. (defined in a function later on) I need this because if I don't, there will be a fade effect whenever the user changes pages, which is annoying.
  */
  applyTheme(currentTheme, false);

  if (themeDropdownItems) {
    themeDropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        /* Here I used the new HTML5 custom data attributes to retrieve data */
        const chosenTheme = item.getAttribute('data-theme');
        if (chosenTheme && chosenTheme !== currentTheme) {
          currentTheme = chosenTheme;
          /* I want the fade effect to be present when the user manually changes the theme. */
          applyTheme(currentTheme, true);
        }
      });
    });
  }

  // Makes sure theme stays the same when user returns to the page, or presses back button (allows dark theme to stay even in browser history)
  // The 'pageshow' event fires when the page is loaded or when the user opens it through browser history.
  // This event is useful, because I need to make sure the theme stays when the user navigates back and forward through history (bfcache - back forward cache)
  window.addEventListener('pageshow', () => {
    // The || is a JS logical OR operator. It returns the first value if it is not null, otherwise it returns the second value. So if there was no previous theme saved, it defaults to 'light'.
    const saved = localStorage.getItem('theme') || 'light';
    if (saved !== currentTheme) {
      currentTheme = saved;
      applyTheme(currentTheme, false);
    }
  });

  function applyTheme(theme, showFade) {
    // No fade on immediate load, but fades when the user changes theme:
    if (showFade) {
      document.documentElement.classList.remove('no-theme-transition');
    } else {
      document.documentElement.classList.add('no-theme-transition');
    }

    // Making sure the checkmark moves depending on the theme selected
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      if (themeCheckLight) themeCheckLight.style.visibility = 'hidden';
      if (themeCheckDark) themeCheckDark.style.visibility = 'visible';
    } else {
      document.documentElement.classList.remove('dark-theme');
      if (themeCheckLight) themeCheckLight.style.visibility = 'visible';
      if (themeCheckDark) themeCheckDark.style.visibility = 'hidden';
    }

    // This is the only place the localStorage value is changed, which is good management - the value is only changed right after the theme is changed, making it always accurate and up to date.
    localStorage.setItem('theme', theme);

    // I have used setTimeout here, because if I don't, the fade will still exist even when I turn it off (because no-theme-transition is immediately removed after it was added previously)
    // If I don't remove it at all, the no-theme-transition would stay until the page is reloaded, which eliminates all other transitions which I do want.
    // As the human reaction time is ~250ms, I did setTimeout for 250ms so the user won't realise other transitions are gone, but it gives the maximum time for the theme to instantly "clip" instead of fade before the fade is added back.
    setTimeout(() => {
      document.documentElement.classList.remove('no-theme-transition');
    }, 250);
  }
  
  /******************************************
   Filtering birds and families in index.html
  ******************************************/
  const birdsFilterType = document.getElementById('birdsFilterType');
  const birdsSubFilter = document.getElementById('birdsSubFilter');
  const birdsCardContainer = document.querySelector('#birds .card-container');
  const familiesSubFilter = document.getElementById('familiesSubFilter');
  const familiesCardContainer = document.querySelector('#families .card-container');

  /* 
  This is the code that should only run on the index.html page.
  The if statement ensures it only runs when this script is loaded from the index.html page, because the elements with those id's don't exist on any other page.
  */
  if (birdsFilterType && birdsSubFilter && birdsCardContainer && familiesSubFilter && familiesCardContainer) {
    
    // I made this so I can easily translate family_ID to family_name and vice versa.
    // It is bad practice to hard code this (given that I have a database), but as family options don't change (if this project was extended, only extra birds would be added), this is fine.
    const familyOptions = [
        {id: 1, name: 'Ducks'},
        {id: 2, name: 'Parrots'},
        {id: 3, name: 'Pigeons'},
        {id: 4, name: 'Water Birds'},
        {id: 5, name: 'Honey Eaters'},
        {id: 6, name: 'Robins'}
    ];

    // Updates sub-filter based on the main filter type for birds
    function updateBirdsSubFilterOptions() {
        const filterType = birdsFilterType.value;

        // This basically completely clears the <select> for the sub-filter and then rebuilds it appropriately according to the filter type.
        birdsSubFilter.innerHTML = '';

        if (filterType === 'name' || filterType === 'size') {
            const ascOpt = document.createElement('option');
            ascOpt.value = 'asc';
            ascOpt.textContent = 'Ascending';
            const descOpt = document.createElement('option');
            descOpt.value = 'desc';
            descOpt.textContent = 'Descending';

            birdsSubFilter.appendChild(ascOpt);
            birdsSubFilter.appendChild(descOpt);
            birdsSubFilter.value = 'asc';

        } else if (filterType === 'family') {
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = '<Select Filter>';
            birdsSubFilter.appendChild(defaultOpt);

            familyOptions.forEach(fam => {
                const opt = document.createElement('option');
                opt.value = fam.id;
                opt.textContent = fam.name;
                birdsSubFilter.appendChild(opt);
            });
        }
  }

    // Fetch filtered birds and update the card container
    function fetchFilteredBirds() {
        const filterType = birdsFilterType.value;
        const filterValue = birdsSubFilter.value; // 'asc','desc' or family ID

        // encodeURIComponent makes sure special characters that aren't in the URL charset are translated properly - to prevent errors. E.g. space turns into %20
        let url = `/filter/birds?filterType=${encodeURIComponent(filterType)}&filterValue=${encodeURIComponent(filterValue)}`;

        // Fetches information from a URL - this allows JS to connect to main.py's API, which is connected to the database - allowing it to effectively query the database based on the user's choice of filter.
        fetch(url)
        // .then and .catch are the JS equivalents of try and except in Python. (JS Promises)
        // a `.then` section only runs after the fetch has successfully completed. The .then after the first .then only runs after the first .then has successfully completed. And so on.
        // `.catch` is run if the fetch fails.
            .then(response => response.json())
            .then(data => {
                // Practically clears and rebuilds the whole birds section.
                birdsCardContainer.innerHTML = '';

                data.forEach(bird => {
                    const card = document.createElement('a');
                    card.href = `/moreInfo/birds?bird-ID=${bird.bird_ID}`;
                    card.className = 'card';

                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';

                    const img = document.createElement('img');
                    img.className = 'card-img';
                    img.src = `/static/assets/images/${bird.image_file_name}`;
                    img.alt = bird.image_alt_text;

                    imageContainer.appendChild(img);

                    const cardText = document.createElement('p');
                    cardText.className = 'card-text';
                    cardText.textContent = bird.bird_name;

                    card.appendChild(imageContainer);
                    card.appendChild(cardText);

                    birdsCardContainer.appendChild(card);
                });
            })
            // A demonstration of JS arrow functions (use of anonymous functions)
            .catch(err => console.error("Error fetching filtered birds:", err));
    }

    // Fetches filtered families and updates the card container
    function fetchFilteredFamilies() {
        const filterValue = familiesSubFilter.value; // 'asc' or 'desc'
        const url = `/filter/families?filterValue=${encodeURIComponent(filterValue)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                familiesCardContainer.innerHTML = '';

                data.forEach(family => {
                    const card = document.createElement('a');
                    card.href = `/moreInfo/families?family-ID=${family.family_ID}`;
                    card.className = 'card';

                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';

                    const img = document.createElement('img');
                    img.className = 'card-img';
                    img.src = `/static/assets/images/${family.image_file_name}`;
                    img.alt = family.image_alt_text;

                    imageContainer.appendChild(img);

                    const cardText = document.createElement('p');
                    cardText.className = 'card-text';
                    cardText.textContent = family.family_name;

                    card.appendChild(imageContainer);
                    card.appendChild(cardText);

                    familiesCardContainer.appendChild(card);
                });
            })
            .catch(err => console.error("Error fetching filtered families:", err));
    }

    // Event Listeners
    birdsFilterType.addEventListener('change', () => {
        // Update the subfilter when the main filter is changed
        updateBirdsSubFilterOptions();
        // Since when the "name" or "size" filters are selected, the subfilter defaults to "asc" and the bird tiles are immediately filtered, I have called fetchFilteredBirds immediately after the main filter changes.
        if (birdsFilterType.value === 'name' || birdsFilterType.value === 'size') {
            fetchFilteredBirds();
        }
    });

    birdsSubFilter.addEventListener('change', () => {
        // After the filter type is selected, the user can then change the subfilter.
        // But the family subfilter defaults to "<Select Filter>" so we don't need to fetch the birds for that, so I need to return early.
        if (birdsFilterType.value === 'family' && birdsSubFilter.value === '') {
            return;
        }
        // Otherwise, I will fetch the birds - this function will check the filter type and subfilter values and then fetch the birds.
        fetchFilteredBirds();
    });

    // As the families section only has one filter type, the logic is much simpler - when the subfilter is changed (asc->desc or vice versa), the families are fetched.
    familiesSubFilter.addEventListener('change', fetchFilteredFamilies);
  }

  /*************************************************************
   Back button (in moreInfoBirds.html and moreInfoFamilies.html)
  **************************************************************/
  /*
   This code should only run on moreInfoBirds.html and moreInfoFamilies.html
   The if statement ensures this, as the index.html page does not have a back button. 
  */
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // This is equivalent to clicking the back button in the browser.
      window.history.back();
    });
  }

  /****************************************************************
   Image lightbox (in moreInfoBirds.html and moreInfoFamilies.html)
  ****************************************************************/
  /* 
    This code should only run in the moreInforBirds.html and moreInfoFamilies.html pages.
    The if statement ensures this.
  */
  const focusImage = document.getElementById('focusImage');
  const overlay = document.getElementById('overlay');
  const expandedImage = document.getElementById('expandedImage');
  const closeButton = document.getElementById('closeButton');

  if (focusImage && overlay && expandedImage && closeButton) {
    // This listens for when the image is clicked, and then shows the overlay accordingly
    focusImage.addEventListener('click', () => {
      expandedImage.src = focusImage.src; 
      // The display was set to "hidden" in the CSS file, so I set it to "flex" to show the overlay.
      overlay.style.display = 'flex';     
    });

  // Closes the overlay if the user clicks the background
  overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Prevents the overlay from closing if the user clicks the enlarged image
  expandedImage.addEventListener('click', event => {
    event.stopPropagation();
  });

  // "×" close button
  closeButton.addEventListener('click', event => {
    event.stopPropagation();
    overlay.style.display = 'none';
  });
  }
});