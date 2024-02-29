let discountApply = true
async function calculateTotalPrice(products, widgetElement,currency,totalPriceText,discountValue,discountType) {
  let totalPrice = 0;
  let anyCheckboxChecked = false;
  if (widgetElement) {
      const productList = widgetElement.querySelectorAll(`.sf-product-item`);
    let addOnTotalPrice = 0
      productList.forEach((productItem,index) => {
          var _a, _b, _c, _d, _e, _f;
          const checkbox = productItem.querySelector('input[type="checkbox"]');
          if (checkbox && checkbox.checked) {
              anyCheckboxChecked = true;
              let productRef = products;
              let productId = productItem.getAttribute("data-product-id");
              let product = productRef.find((product) => Number(product.id) === Number(productId));
              let selectedIndex = (_a = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".sf-product-variants-dropdown")) === null || _a === void 0 ? void 0 : _a.selectedIndex;
              let price = selectedIndex > 0 ? product.variants[selectedIndex]?.variant_price : product?.price
              if (price){
                totalPrice += price;
           
                if(index > 0)
                {
                  addOnTotalPrice += price
                }
              }            
          }
      });
      const formattedTotalPrice = anyCheckboxChecked
          ? totalPrice.toFixed(2)
          : "0.00";
      const totalPriceTextValue = widgetElement.querySelector('.sf-total-price[data-tag="total-price"]');
      firstItemPrice(products, widgetElement).then((firstItemPr) => {
          if (widgetElement) {
              const addOnPrice = widgetElement.querySelector(".sf-add-on-product-price");
              const thisPrice = widgetElement.querySelector('.sf-this-product-price');
              if (thisPrice && firstItemPr) {
                  thisPrice.innerHTML = `${currency}  ${firstItemPr}`;
              }
              if (addOnPrice) {
                const firstElement = widgetElement.querySelector(".sf-product-checkbox");
                  if (firstItemPr !== undefined ) {
                      const priceValue = (addOnTotalPrice).toFixed(2)
                      addOnPrice.innerHTML = `${currency}  ${ priceValue > 0 ? priceValue : 0}
            `;
                  }
              }
            const thisItemValue = widgetElement.querySelectorAll('.sf-this-item');
            if(thisItemValue){
              for (var i = 1; i < thisItemValue.length; i++) {
                var parentElement = thisItemValue[i].parentNode;
                  var item = thisItemValue[i];
                  item.parentNode.removeChild(item);
              }
            }
          }
      });
    setTotalPrice(discountValue,discountType,formattedTotalPrice,totalPriceTextValue,currency,totalPriceText,widgetElement)
  }
}


async function cartButtonText(widgetElement, checkboxCount) {
  const multiCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-multi-cart");
  const twoCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-two-cart");
  const singleCartElement = widgetElement === null || widgetElement === void 0 ? void 0 : widgetElement.querySelector(".sf-single-cart");
  if (checkboxCount === 2) {
      if (twoCartElement)
          twoCartElement.style.display = "block";
      if (multiCartElement)
          multiCartElement.style.display = "none";
      if (singleCartElement)
          singleCartElement.style.display = "none";
  }
  else if (checkboxCount === 1 || checkboxCount === 0) {
      if (twoCartElement)
          twoCartElement.style.display = "none";
      if (multiCartElement)
          multiCartElement.style.display = "none";
      if (singleCartElement)
          singleCartElement.style.display = "block";
  }
  else {
      if (twoCartElement)
          twoCartElement.style.display = "none";
      if (multiCartElement)
          multiCartElement.style.display = "block";
      if (singleCartElement)
          singleCartElement.style.display = "none";
  }
}

async function checkboxTriggered(products, widgetElement,currency,totalPriceText,discountValue,discountType,tableElement) {
  // Function to calculate the number of checked products
  const updateCheckedCount = () => {
      const checkboxes = widgetElement?.querySelectorAll(".sf-product-checkbox");
      const firstElement = widgetElement?.querySelector(".sf-product-checkbox");
      let checkedCount = 0
      let addOnCount = 0
      checkboxes.forEach((checkbox,index) => {
          const productItem = checkbox.closest(".sf-product-item , .sf-product-list-item ");
          if (!productItem)
              return;
        const productId = checkbox.id
        const productImage = tableElement ?    
           widgetElement.querySelector(`[data-product-id="${productId}"].sf-product-item .sf-product-image`) :
            productItem.querySelector(".sf-product-image");
       
          const productDropdown = productItem.querySelector(".sf-product-variants-dropdown");
          const productTitle = productItem.querySelector(".sf-product-title");
          const productPrice = productItem.querySelector(".sf-price-container");
          const thisItem = productItem.querySelector(".sf-this-item")
          const checkboxInput = checkbox;
          const productDetails = widgetElement.querySelector(`tr.sf-product-list-item[data-product-id="${productId}"]`);
            if(productDetails){
              productDetails.style.opacity = checkboxInput.checked ? "1": "0.5";
            }
          if (productImage) {
              productImage.style.opacity = checkboxInput.checked ? "1" : "0.5";
          }
          if (productDropdown) {
              productDropdown.style.opacity = checkboxInput.checked ? "1" : "0.5";
          }
          if (productTitle) {
              productTitle.style.opacity = checkboxInput.checked ? "1" : "0.5";
          }
          if (productPrice) {
              productPrice.style.opacity = checkboxInput.checked ? "1" : "0.5";
          }
          if (checkboxInput.checked) {
            if(index>0){
              addOnCount++
            }
              checkedCount++;
          }
          if (thisItem)
          {
              thisItem.style.opacity = checkboxInput.checked ? "1" : "0.5";
          }
        
        
      });
    const discountTotalAmount = widgetElement.querySelector('sf-original-price-vs');
    
      if(  checkedCount < (checkboxes?.length) || !firstElement?.checked)
      {
        discountApply = false
        const discountTextElements = widgetElement.getElementsByClassName('sf-discount-text');

        for (let i = 0; i < discountTextElements.length; i++) {
              discountTextElements[i].style.display = 'none';
          }

      }
        else if(checkedCount === 0){
          discountApply = false
          const addOnElement = widgetElement.querySelector(".sf-add-on-product-price");
      if (addOnElement) {
          addOnElement.innerHTML = currency + '0';
        
          }
          
        }
      else{
        discountApply = true
        const discountTextElements = widgetElement.getElementsByClassName('sf-discount-text');
        for (let i = 0; i < discountTextElements.length; i++) {
              discountTextElements[i].style.display = 'block';
          }
        if(discountTotalAmount){
              discountTotalAmount.style.display = 'block';
        }
      }
      cartButtonText(widgetElement,checkedCount)
      const addOnElement = widgetElement.querySelector(".sf-add-on-product");
      if (addOnElement) {
          const addOnText = addOnCount <= 1 ? "Add-on" : "Add-ons";
          addOnElement.innerHTML = `${addOnCount < 0 ? 0 : addOnCount} ${addOnText}`;
        
      }
      calculateTotalPrice(products, widgetElement,currency,totalPriceText,discountValue,discountType);
      fbtTablePriceCalculator(products, widgetElement,currency,totalPriceText,discountValue,discountType);
      
  };
  updateCheckedCount();
  widgetElement.addEventListener("change", updateCheckedCount);
}
async function fbtTablePriceCalculator(products, widgetElement,currency,totalPriceText,discountValue,discountType) {

  let totalPrice = 0;
  let anyCheckboxChecked = false;
  if (widgetElement) {
      const productList = widgetElement.querySelector(`.sf-product-table`);
      if(productList)
      {
        const priceContainers = productList.querySelectorAll('.sf-table-price-container');    
        priceContainers.forEach(container => {
            if (!container.textContent.includes(currency)) {
              container.textContent = currency + container.textContent.trim();
          }
        });
      }
      const checkboxes = productList === null || productList === void 0 ? void 0 : productList.querySelectorAll('input[type="checkbox"]');
      checkboxes === null || checkboxes === void 0 ? void 0 : checkboxes.forEach((checkbox) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          if (checkbox && checkbox.checked) {
              anyCheckboxChecked = true;
              const productId = checkbox.getAttribute("id");
              const productItem = widgetElement.querySelector(`.sf-product-list-item[data-product-id="${productId}"]`);
              let product = products.find((product) => Number(product.id) === Number(productId));

              let selectedIndex = (_c = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".sf-product-variants-dropdown")) === null || _c === void 0 ? void 0 : _c.selectedIndex;
                        
            let price = selectedIndex > 0 ? product.variants?.[selectedIndex]?.variant_price : product?.price
              if (price)
                  totalPrice += price;
          }
      });
      if (productList) {
          const formattedTotalPrice = anyCheckboxChecked
              ? totalPrice.toFixed(2)
              : "0.00";
          const totalPriceTextDiv = widgetElement.querySelector('.sf-total-price[data-tag="total-price"]');
          setTotalPrice(discountValue,discountType,formattedTotalPrice,totalPriceTextDiv,currency,totalPriceText,widgetElement)
      }
  }
}
function setTotalPrice(discountValue,discountType,formattedTotalPrice,totalPriceTextValue,currency,totalPriceText,widgetElement){
  if (totalPriceTextValue) {
    let discountAmount
    let finalAmount
    if(discountType ==='percentage'){
      discountAmount =( (formattedTotalPrice/100) * discountValue)
      finalAmount = discountApply ? formattedTotalPrice - discountAmount : formattedTotalPrice
    }else if(discountType ==='flat'){
      finalAmount = discountApply ? formattedTotalPrice - discountValue :formattedTotalPrice
    }
    var strikeSpan = document.createElement('span');
    
    strikeSpan.innerHTML = (Number(discountValue)>0 &&  discountApply) ? currency + formattedTotalPrice : ''
    strikeSpan.style.textDecoration = 'line-through';
    strikeSpan.style.fontSize = '16px';
    strikeSpan.style.marginLeft = '10px';
    strikeSpan.classList.add('sf-original-price-vs');
    totalPriceTextValue.innerHTML = `${totalPriceText}: ${currency}${finalAmount > 0 ? parseFloat(finalAmount).toFixed(2) : 0}`;
    totalPriceTextValue.style = "margin-top:10px";
    totalPriceTextValue.appendChild(strikeSpan);
    return true;
  }
}

async function firstItemPrice(products, widgetElement) {
  var _a, _b, _c, _d, _e, _f;
  if (widgetElement) {
      const firstProductElement = widgetElement.querySelector(".sf-product-item");
      const selectedIndex = (_a = firstProductElement === null || firstProductElement === void 0 ? void 0 : firstProductElement.querySelector(".sf-product-variants-dropdown")) === null || _a === void 0 ? void 0 : _a.selectedIndex;
      const productId = firstProductElement.getAttribute("data-product-id");
      let productRef = products;
      let product = productRef.find((product) => Number(product.id) === Number(productId));
      return product?.price
  }
  return undefined;
}
async function fbtTableVariant( mainProductId, selectedIndex, currencySymbol, products) {
  const widgetElement = document.querySelector('.sf-container');
  const productListElement = widgetElement.querySelector("ul.sf-product-list");
  if (!productListElement)
      return;
  let productRef = products;
  let product = productRef.find((product) => Number(product.id) === Number(mainProductId));
  const selectedVariant = product === null || product === void 0 ? void 0 : product.variants[selectedIndex];
  const variantElement = productListElement.querySelector(`[data-product-id="${mainProductId}"]`);
  const priceElement = variantElement === null || variantElement === void 0 ? void 0 : variantElement.querySelector('[data-tag="price"]');
  if (priceElement) {
      const currentPrice = selectedVariant.variant_price * currencyRate;
      if (variantElement &&
          variantElement.querySelector(`[data-tag="on-sale"]`)) {
          return;
      }
      priceElement.textContent = `${currencySymbol}${currentPrice.toFixed(2)}`;
  }
}
async function fbtTableUtils(widgetElement) {
  if (widgetElement) {
      const productListElement = widgetElement.querySelector("tr.sf-product-list-item");
      if (!productListElement)
          return;
      const firstLiElement = productListElement.querySelector("td:first-child");
      if (!firstLiElement)
          return;
      const productNameSpan = productListElement.querySelector(".sf-name-variant-container");
      if (productNameSpan && productNameSpan.innerHTML.includes('<strong>This item:</strong>')) {
            productNameSpan.innerHTML = `${productNameSpan.innerHTML}`;
        }
  }
}
function fbtProductView(products,currency,totalPriceText,discountValue,discountType) {
const productList = products  
const widgetElement = document.querySelector('.sf-container');
const tableElement = document.querySelector('.sf-table') 
calculateTotalPrice(productList, widgetElement,currency,totalPriceText,discountValue,discountType);
checkboxTriggered(productList, widgetElement,currency,totalPriceText,discountValue,discountType,tableElement)
fbtTableUtils(widgetElement);
fbtTablePriceCalculator(productList, widgetElement,currency,totalPriceText,discountValue,discountType);
  
}
