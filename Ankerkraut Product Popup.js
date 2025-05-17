setTimeout(() => {
  const popup = document.createElement("div");
  const products = document.getElementsByClassName("recipe-product"); //get all Ankerkraut products

  if (products.length === 0) return; //if there are no products on this page then return and do not continue

  function firstAvailableProductIndex(products) {
    //products as a prop

    for (let i = 0; i < products.length; i++) {
      //for loop to iterate through all products with i +1 each time

      const soldOutLabel = products[i].querySelector(".recipe-soldout-label"); //check the product has a soldout label
      if (!soldOutLabel) {
        return i; //if no solout label then return the current value of i as index
      }
    }
    return -1; //if there is no product without a soldout label return -1 as index
  }

  const index = firstAvailableProductIndex(products);
  if (index === -1) return; //if index is -1 then return and do not continue

  const productImages = document.getElementsByClassName("P_IMG_data"); //get all images from products
  const productTitles = document.querySelectorAll(
    ".recipe-slide-grid-title span"
  ); //get all titles from products
  const productDescriptions = document.querySelectorAll(
    ".recipe-product-description"
  ); //get all descriptions from products
  const productPrices = document.querySelectorAll(".recipe-product-price"); //get all prices from products
  const productPriceWPPs = document.querySelectorAll(".recipe-product-wpp"); //get all base prices from products
  const abReviewElements = document.querySelectorAll("#ab-review"); //get all reviews from products
  const atcButtons = document.querySelectorAll(".recipe-atc-button"); //get all add to cart buttons from products

  const productId = atcButtons[index].dataset.variantId; //get product ID of the current index
  const productTitleText = productTitles[index].textContent; //get product title of the current index
  const productDescriptionText = productDescriptions[index].textContent; //get product description of the current index
  const productPriceText = productPrices[index].textContent; //get product price of the current index
  const productPriceWPPText = productPriceWPPs[index].textContent; //get product base price of the current index
  const abReviewText = abReviewElements[index].textContent; //get review of the current index

  const imageElement = productImages[index].querySelector("img"); //get product image element of the current index

  const style = document.createElement("style"); //create css styles section
  style.textContent = `
    #product-popup {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 250px;
      height: 453px;
      background: white;
      border-radius: 6px;
      z-index: 999;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    #product-popup .popup-header {
      background: #B7D5F280;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #product-popup .popup-header h3 {
      margin: 0;
      font-size: 13px;
      color: #323232;
      font-weight: bold;
    }

    #product-popup #close-product-popup {
      padding: 0 6px;
      font-weight: bold;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    #product-popup .image-container {
      display: flex;
      justify-content: center;
      padding: 12px 0;
    }

    #product-popup img {
      width: 180px;
      height: 180px;
      object-fit: contain;
    }

    #product-popup .popup-body {
      display: flex;
      flex-direction: column;
      padding: 0 12px;
    }

    #product-popup .product-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
      width: 100%;
    }

    #product-popup .product-title {
      font-weight: bold;
      margin: 12px 0 0;
      font-size: 14px;
      color: #5C5C5C;
    }

    #product-popup .review-row {
      display: flex;
      align-items: center;
      margin-top: 8px;
    }

    #product-popup .review-row p {
      font-size: 11px;
      margin: 0 8px;
      font-weight: 400;
    }

    #product-popup .product-description {
      font-size: 11px;
      margin-top: 8px;
      font-weight: 400;
    }

    #product-popup .price-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
    }

    #product-popup .price-row p {
      margin: 0;
    }

    #product-popup .price-row .price {
      font-weight: bold;
      font-size: 13px;
    }

    #product-popup .price-row .price-wpp {
      color: #939393;
      font-size: 9px;
    }

    #product-popup #add-to-cart-button {
      padding: 8px 24px;
      background: #B7D5F2;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: #5C5C5C;
      width: 100%;
      font-weight: bold;
      font-size: 13px;
      display: block;
      text-align: center;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      #product-popup {
        width: 90%;
        margin: 12px auto 0;
        height: auto;
        bottom: 0;
        left: 10;
        border-radius: 0;
      }

      #product-popup .popup-body {
        flex-direction: row;
      }
    }
  `;
  document.head.appendChild(style); //append the styles section to the head

  popup.id = "product-popup"; //gives the popup an ID

  //create HTML content of popup

  popup.innerHTML = `
    <div class="popup-header">  <!-- Wrap header content in a div for styling -->

      <h3>Schon ausprobiert?😍</h3>
      <button id="close-product-popup">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.8242 10.9752C11.8799 11.031 11.9241 11.0971 11.9543 11.17C11.9845 11.2428 12 11.3209 12 11.3997C12 11.4785 11.9845 11.5566 11.9543 11.6294C11.9241 11.7023 11.8799 11.7684 11.8242 11.8242C11.7684 11.8799 11.7023 11.9241 11.6294 11.9543C11.5566 11.9845 11.4785 12 11.3997 12C11.3209 12 11.2428 11.9845 11.17 11.9543C11.0971 11.9241 11.031 11.8799 10.9752 11.8242L6 6.8482L1.02478 11.8242C0.912198 11.9368 0.75951 12 0.6003 12C0.441091 12 0.288402 11.9368 0.175824 11.8242C0.0632457 11.7116 3.1384e-09 11.5589 0 11.3997C-3.1384e-09 11.2405 0.0632457 11.0878 0.175824 10.9752L5.1518 6L0.175824 1.02478C0.0632457 0.912198 0 0.75951 0 0.6003C0 0.441091 0.0632457 0.288402 0.175824 0.175824C0.288402 0.0632457 0.441091 0 0.6003 0C0.75951 0 0.912198 0.0632457 1.02478 0.175824L6 5.1518L10.9752 0.175824C11.0878 0.0632457 11.2405 -3.1384e-09 11.3997 0C11.5589 3.1384e-09 11.7116 0.0632457 11.8242 0.175824C11.9368 0.288402 12 0.441091 12 0.6003C12 0.75951 11.9368 0.912198 11.8242 1.02478L6.8482 6L11.8242 10.9752Z" fill="#323232"/>
</svg>

      </button>
      
    </div>

    <div class="popup-body">   <!-- Wrap product content in a div with flex-direction: column on desktop version but flex-direction: row on mobile to display image next to the rest of the content -->

      <div class="image-container">
        <img src="${imageElement.src}"/>
      </div>

      <div class="product-container">
        <p class="product-title">${productTitleText}</p>
        
        <div class="review-row">
          <svg width="86" height="14" viewBox="0 0 86 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14.0003H14V0H0V14.0003Z" fill="#00B67A"/>
            <path d="M11.9347 5.95655L3.99402 11.725L5.15271 8.1599L2.1196 5.95655H5.86867L7.02713 2.39117L8.18558 5.95655H11.9347ZM7.02741 9.52193L9.19602 9.06576L10.06 11.725L7.02741 9.52193Z" fill="white"/>
            <path d="M18 14.0003H32V0H18V14.0003Z" fill="#00B67A"/>
            <path d="M18 14.0003H25V0H18V14.0003Z" fill="#00B67A"/>
            <path d="M25.1675 9.46754L27.0271 9.06566L27.8872 11.7853L24.9709 9.60875L21.9409 11.7853L23.1169 8.20725L20.0382 5.99589H23.8436L25.0192 2.41757L26.1952 5.99589H30.0003L25.1675 9.46754Z" fill="white"/>
            <path d="M36 14.0003H50V0H36V14.0003Z" fill="#00B67A"/>
            <path d="M36 14.0003H43V0H36V14.0003Z" fill="#00B67A"/>
            <path d="M47.9348 5.95655L39.9942 11.725L41.1529 8.1599L38.1198 5.95655H41.8688L43.0273 2.39117L44.1857 5.95655L47.9348 5.95655ZM43.0276 9.52193L45.1962 9.06576L46.0602 11.725L43.0276 9.52193Z" fill="white"/>
            <path d="M54 14.0003H68V0H54V14.0003Z" fill="#00B67A"/>
            <path d="M54 14.0003H61V0H54V14.0003Z" fill="#00B67A"/>
            <path d="M65.9344 5.95655L57.994 11.725L59.1524 8.1599L56.1193 5.95655H59.8684L61.0268 2.39117L62.1853 5.95655L65.9344 5.95655ZM61.0271 9.52193L63.1957 9.06576L64.0597 11.725L61.0271 9.52193Z" fill="white"/>
            <path d="M72 14.0003H86V0H72V14.0003Z" fill="#00B67A"/>
            <path d="M72 14.0003H79V0H72V14.0003Z" fill="#00B67A"/>
            <path d="M83.9342 5.95655L75.9938 11.725L77.1523 8.1599L74.1191 5.95655H77.8682L79.0267 2.39117L80.1851 5.95655H83.9342ZM79.027 9.52193L81.1956 9.06576L82.0596 11.725L79.027 9.52193Z" fill="white"/>
          </svg>


          <p>${abReviewText}</p>

        </div>

          <p class="product-description">${productDescriptionText}</p>

        <div class="price-row">
          <p class="price">${productPriceText}</p>
          <p class="price-wpp">${productPriceWPPText}</p>
        </div>

        <button id="add-to-cart-button" data-variant-id="${productId}">
          IN DEN WARENKORB
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(popup); //append popup to body

  document.getElementById("close-product-popup").onclick = () => {
    //when clicking close button then remove popup from body
    document.getElementById("product-popup").remove();
  };

  document.getElementById("add-to-cart-button").onclick = function () {
    const variantId = this.dataset.variantId; //get the current ID of the product
    addProductToCart(variantId); //call add to cart with current ID

    //change button text to "Hinzugefügt" with checkmark

    this.innerHTML = `
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px">
        <path d="M17.1377 1.13862L6.47187 11.8045C6.40996 11.8665 6.33644 11.9156 6.25551 11.9492C6.17459 11.9827 6.08784 12 6.00024 12C5.91263 12 5.82589 11.9827 5.74496 11.9492C5.66404 11.9156 5.59052 11.8665 5.52861 11.8045L0.862287 7.13817C0.737203 7.01309 0.666931 6.84344 0.666931 6.66654C0.666931 6.48964 0.737203 6.31999 0.862287 6.19491C0.987372 6.06982 1.15702 5.99955 1.33392 5.99955C1.51081 5.99955 1.68047 6.06982 1.80555 6.19491L6.00024 10.3904L16.1945 0.195356C16.3196 0.0702713 16.4892 -1.31798e-09 16.6661 0C16.843 1.31798e-09 17.0127 0.0702713 17.1377 0.195356C17.2628 0.32044 17.3331 0.490091 17.3331 0.666988C17.3331 0.843884 17.2628 1.01353 17.1377 1.13862Z" fill="#5C5C5C"/>
      </svg>
      HINZUGEFÜGT
    `;
  };
}, 10000); //10000ms timeout = wait 10 seconds before creating the popup
