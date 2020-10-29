import {dataHandler} from "./data_handler.js";
import {layoutGenerator} from "./main_layout_generator.js";
import {cartGenerator} from "./cart_layout_generator.js";
import {products, category, categoryBtnDescription, suppliers} from "./enumerators.js";
import {productsNavBar} from "./product_nav_bar.js";
import {suppliersNavBar} from "./supplier_nav_bar.js";

const tabletsBtn = document.querySelector(".tablets");
const sortOptionBtn = document.getElementById("toggle-sort-option");
const ulProducts = document.querySelector(".products");
const ulSupplies = document.querySelector(".suppliers");
const navButtons = document.querySelectorAll("ul li a");
const content = document.querySelector(".container");

export const buttonHandler = {
    init: function () {
        this.showProducts(category.product, products.tablets);
        setInitStyles();
        productsNavBar.activateAllProductButtons();
        suppliersNavBar.activateAllSuppliersButtons();
        this.toggleNavMenuBySortOption();
    },

    addProductToCart: function (productId, cartId, userId, quantity) {
        const data = {
            productId: productId,
            cartId: cartId,
            userId: userId,
            quantity: quantity
        }
        dataHandler.sendProductToCart(data, function (response) {
            cartGenerator.createProductInfo(response);
        });
    },

    showProducts: function (category, sortOption) {
        dataHandler.getProducts(category, sortOption, function (products) {
            layoutGenerator.createProductCards(products);
        });
    },

    toggleNavMenuBySortOption: function () {
        switchSortOption();
    },

    markButtonAsCurrent: function (currentButton) {
        navButtons.forEach(button => {
            button.style.backgroundColor = "#0B2D59";
            button.style.color = "#EAE9F2";
        });
        currentButton.style.backgroundColor = "#C6C5D9";
        currentButton.style.color = "#0B2D59";
    },

    displayProducts: function(category, product, currentBtn) {
        layoutGenerator.removeContent(content);
        buttonHandler.markButtonAsCurrent(currentBtn);
        buttonHandler.showProducts(category, product);
    },
}

function getProduct(productId) {
    dataHandler.getProduct(productId, function (response) {
       return response;
    });
}

function switchSortOption() {
    sortOptionBtn.addEventListener("click", () => {
        displaySortOptionOnButton();
        let button;
        if (sortOptionBtn.innerText === categoryBtnDescription.SUPPLIER) {
            showSelectedOptionNavBar(category.product);
            button = tabletsBtn;
            displayDefaultProducts(category.product, products.tablets);
        } else {
            showSelectedOptionNavBar(category.supplier);
            button = document.querySelector(".amazon");
            displayDefaultProducts(category.supplier, suppliers.amazon);
        }
        buttonHandler.markButtonAsCurrent(button);
    });
}

function showSelectedOptionNavBar(option) {
    if (option === category.product) {
        ulProducts.style.display = "flex";
        ulSupplies.style.display = "none";
    } else {
        ulProducts.style.display = "none";
        ulSupplies.style.display = "flex";
    }
}

function displayDefaultProducts(category, sortOption) {
    layoutGenerator.removeContent(content);
    buttonHandler.showProducts(category, sortOption);
}

function displaySortOptionOnButton() {
    sortOptionBtn.innerText === categoryBtnDescription.SUPPLIER ? sortOptionBtn.innerText = categoryBtnDescription.PRODUCTS
        : sortOptionBtn.innerText = categoryBtnDescription.SUPPLIER;
}

function setInitStyles() {
    tabletsBtn.style.backgroundColor = "#C6C5D9";
    tabletsBtn.style.color = "#0B2D59";
    ulProducts.style.display = "flex";
    ulSupplies.style.display = "none";
}
