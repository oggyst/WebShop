let strCategories = "<select onchange ='onCategoryChange(this)' class='form-control'><option value = '0'> All categories </option>";
let arrCategories = [];
let strContent = "";
boolDoOnce = true;
function onCategoryChange(categoryID)
{
    console.log(categoryID.value);
    console.log(arrCategories[categoryID.value]);
    $('div.st-content').html(arrCategories[categoryID.value]);
		intChossenCategorie = categoryID.value;
}

function onPageLoad() {
    $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json", function (data) {
        let categories = data.value;
        $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json", function (data) {
            let products = data.value;
            for (var i = 0; i < categories.length; i++) {
                console.log(i)
                strCategories += '<option value ="' + categories[i].CategoryID + '">' + categories[i].CategoryName + '</option>';
                arrCategories[i] = "";
                for (var j = 0; j < products.length; j++) {
                    if (products[j] != null) {
                        if (categories[i].CategoryID == products[j].CategoryID) {
                            console.log(i);
                            arrCategories[i] += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg><br></div>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                                "<input type='number' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=\"" +
                                products[j].ProductName + "\" data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
                        }
                        if (boolDoOnce) {
                            strContent += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                                "<input type='number' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=" +
                                products[j].ProductName + " data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
                        }
                    }
                }
                boolDoOnce = false;
            }
            strCategories += "</select>";
            arrCategories[0] = strContent;
            $('div.st-categories').html(strCategories);
            $('div.st-content').html(strContent);
        });
    });
}