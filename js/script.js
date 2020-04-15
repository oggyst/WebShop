let strCategories;
let arrCategories = [];
let arrEmployees;
let arrBoughtProducts = [[[]]];
let intUserID;
let boolLogedIn = false;
let intChossenCategorie;
let strContent;
let strAdminContent = "";
let products;
let categories;
let totalPrice = 0;
boolDoOnce = true;

function updateQuickPreview()
{
    let shoppingView;
    let totalCost = 0;
    boolCartIsEmpty = true;
    for(let i = 0; i < arrBoughtProducts[intUserID].length; i++)
    {
        if(arrBoughtProducts[intUserID][i] > 0)
            {
                for(let j = 0; j < products.length; j++)
                {
                    if(i == products[j].ProductID)
                    {
                        boolCartIsEmpty = false;
                        totalCost += arrBoughtProducts[intUserID][i] *  Math.floor(products[j].UnitPrice);
                        shoppingView += "<tr class = 'product'><td><div class = 'st-image'><img src = ./img/sample.jpg></div></td><td>" + products[j].ProductName  + "</td><td>" + Math.floor(products[j].UnitPrice) + "€ </td><td>"  + 
                        "<i onclick='shoppingCart()' class='fas fa-pencil-alt'></i><i onclick = 'zeroQuantity(this)' data-product-id=" + products[j].ProductID + " class='fas fa-trash'></i><td>"+ arrBoughtProducts[intUserID][i] + " x " +  Math.floor(products[j].UnitPrice)  +"€</td></td></tr>";
                    }
                }
                
            }
        }
    console.log(boolCartIsEmpty);
    if (boolCartIsEmpty)
    {
        $("div.st-cart-quick-preview").html("<p class = 'st-green'>There is no articles in your shopping cart</p>");
    } else 
    {
        $("div.st-cart-quick-preview").html(shoppingView + "<tr><td colspan = '2'><button  onclick = 'shoppingCart()'>My cart</button><td colspan = '2'><button  onclick = 'finishShoping()'>Finish</button></td></td><td class = 'st-total'>Total cost: "+ totalCost + "€</tr>");
    }
}

function zeroQuantity(element)
{
    arrBoughtProducts[intUserID][element.dataset.productId] = 0;
    localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
    toast("You sucessfully deleted item", 5000);
    updateQuickPreview();
}

function deleteProduct(elementIndex)
{
    console.log(products);
    for(let i = 0; i < arrEmployees.length.length; i++)
    {
    arrBoughtProducts[i][elementIndex].splice(1);
    }
    boolDoOnce = true;
}

function addNewProductMenu()
{
    $("select#st-categories").html("<select onchange ='onCategoryChange(this)' class='form-control'>" + strCategories);
    $("#modalAddProductForm").modal('show');
}

function addProduct(categories)
{
    let productName = $("#productName").val();
    let price = $("#price").val();
   if (productName == "" || price == "")
   {
       window.alert("Not all fields completed");
   } else 
   {
        let categorie = $("#st-categories").val();
        let index = products.length+1;
        let tempArray = {
            ProductID:index,
            ProductName:productName,
            UnitPrice:price,
            CategoryID:categorie
        };
        products.push(tempArray);
        onPageLoad();
        $("#modalAddProductForm").modal('hide');
        toast("Product added sucessfully.");
    }

}

function confirmNewQuantity (element)
{
    let quantity = $("#st-quantity" + element.dataset.productId).val();
    if (quantity >= 1000)
    {
        toast("You can't purchase that much. ", 5000);
    } else 
    {
        arrBoughtProducts[intUserID][element.dataset.productId] = parseInt(quantity);
        localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
        toast("You sucessfully changed quanity", 5000);
    shoppingCart();
    updateQuickPreview();
    }
}

function onCategoryChange(categoryID) {
    if (arrCategories[categoryID.value] != "<img class = 'st-empty' src = './img/empty.jpg'>")
    {
      $('div.st-content').html(arrCategories[categoryID.value]);
      $('div.st-shopping-cart').html("");
    } else
    {
        $('div.st-content').html("");
        $('div.st-shopping-cart').html(arrCategories[categoryID.value]);
    }

    intChossenCategorie = categoryID.value;
    $("#search-button").val("");
}

function returnToMainPage()
{
    $(".st-content").html(strContent);
    $('div.st-categories').html("<select onchange ='onCategoryChange(this)' class='form-control'><option value = '0'> All categories </option>"  + strCategories);
    $("div.st-shopping-cart").html("");
}

function shoppingCart()
{
    let totalCost = 0;
    let boolCartIsEmpty = true;
    let shoppingView = "<tr><th></th><th>Product name</th><th>Product price</th><th>Quantity</th><th>Total</th>";
    for(let i = 0; i < arrBoughtProducts[intUserID].length; i++)
    {
        if(arrBoughtProducts[intUserID][i] > 0)
            {
                for(let j = 0; j < products.length; j++)
                {
                    if(i == products[j].ProductID)
                    {
                        boolCartIsEmpty = false;
                        totalCost += arrBoughtProducts[intUserID][i] *  Math.floor(products[j].UnitPrice);
                        shoppingView += "<tr class = 'product'><td><div class = 'st-image'><img src = ./img/sample.jpg></div></td><td>" + products[j].ProductName  + "</td><td>" + Math.floor(products[j].UnitPrice) + "€ </td><td>"  + 
                        "<input type='number' value = " + arrBoughtProducts[intUserID][i] + " class = 'st-quantity' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " onclick='confirmNewQuantity(this)'>Confirm</button><td>"+ arrBoughtProducts[intUserID][i] *  Math.floor(products[j].UnitPrice)  +"€</td></td></tr>";
                    }
                }
                
            }
        }
    if (boolCartIsEmpty)
    {
        $(".st-shopping-cart").html("<img class = 'st-empty-cart' src = './img/empty-cart.png'><br><tr><td colspan = '2' class = 'st-back'><div class = 'st-back-holder'><button class = 'st-back' onclick = 'returnToMainPage()'>Back</button></div></td></tr>");
    } else 
    {
        $(".st-shopping-cart").html(shoppingView + "<tr><td colspan = '2' class = 'st-back'><button class = 'st-back' onclick = 'returnToMainPage()'>Back</button><td colspan = '2'><button  onclick = 'finishShoping()'>Finish</button></td></td><td class = 'st-total'>Total cost: "+ totalCost + "€</tr>");
    }
    $(".st-categories").html("");
    $(".st-content").html("");
}

function finishShoping()
{
    toast ("You have successfully finished shoping." , 5000);
    for ( let i = 0;arrBoughtProducts[intChossenCategorie].length > i; i++)
    {
        arrBoughtProducts[intChossenCategorie][i] = 0;
    }
    localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
    returnToMainPage();
}

function buy(element) 
{
    let quantity = $("#st-quantity" + element.dataset.productId).val();
    console.log(products);
    console.log(element.dataset.productId);
    if (quantity < 1) 
    {
        toast("Quantity value can't be lower than 1.", 5000);
    } else 
    {
        
        if (!$.isNumeric(intUserID)) 
        {
            toast("Log in first.", 5000);
        } else 
        {
            if (!$.isNumeric(arrBoughtProducts[intUserID][element.dataset.productId])) 
            {
                arrBoughtProducts[intUserID][element.dataset.productId] = 0;
            }
            arrBoughtProducts[intUserID][element.dataset.productId] = parseInt(arrBoughtProducts[intUserID][element.dataset.productId]) + parseInt(quantity);
            localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
            toast("Sucesfully added item to shoping cart", 5000);
        }
    }
    updateQuickPreview();
}
function checkLogInCredentials() 
{

    let strUsername = $("#username").val();
    let strSecondName = $("#secondName").val();
    if (intUserID != "") {
        if (intUserID >= 0) {
            boolLogedIn = true;
            strChossenUser = "";
            strChossenUser += 'From ' + arrEmployees[intUserID].Address;
            strChossenUser += ' ,<br> ' + arrEmployees[intUserID].Country + ' <br>  ';
            strChossenUser += arrEmployees[intUserID].City;
            toast("Welcome back " + arrEmployees[intUserID].FirstName, 3000);
            $("#modalLoginForm").modal('hide');
            $("p#st-incorrect-credentials").html("");
            $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown' onclick='this.blur()'> " + arrEmployees[intUserID].FirstName + "<br>" +arrEmployees[intUserID].LastName +
                "<div class = 'dropdown-content'><a onclick = 'displayUserInfo()'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark' onclick = 'shoppingCart();this.blur()'><i class='fas fa-shopping-cart'><div class = 'st-cart-quick-preview' onclick = ''></div></i></button>");
        } else {
            strChossenUser = "You are loged in as page administrator";
            boolLogedIn = true;
            $('div.st-categories').html("");
            $('div.st-content').html(strAdminContent);
            $("p#st-incorrect-credentials").html("");
            $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown onclick='this.blur()'> Welcome <br> admin" +
                "<div class = 'dropdown-content'><a onclick = 'displayUserInfo()'> User info </a><a onclick = 'addNewProductMenu()'>Add product</a><a onclick = 'logOut()'>Sign out</a></button>");
        }
    } else
        for (var i = 0; i < arrEmployees.length; i++) 
        {
            if (arrEmployees[i].FirstName === strUsername && arrEmployees[i].LastName == strSecondName) 
            {
                boolLogedIn = true;
                intUserID = i;
                strChossenUser = "";
                strChossenUser += 'From ' + arrEmployees[intUserID].Address;
                strChossenUser += ' ,<br> ' + arrEmployees[intUserID].Country + ' <br>  ';
                strChossenUser += arrEmployees[intUserID].City;
                toast("Welcome back " + strUsername, 3000);
                $("#modalLoginForm").modal('hide');
                $("p#st-incorrect-credentials").html("");
                $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown onclick='this.blur()'> " + arrEmployees[intUserID].FirstName + "<br>" + arrEmployees[intUserID].LastName +
                    "<div class = 'dropdown-content'><a onclick = 'displayUserInfo()'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark' onclick = 'shoppingCart();this.blur()'><i class='fas fa-shopping-cart'><div class = 'st-cart-quick-preview'></div></i></button>");
            } else if (strUsername == "admin" && strSecondName == "admin") 
            {
                intUserID = -1;
                strChossenUser = "You are loged in as page administrator";
                boolLogedIn = true;
                $('div.st-categories').html("");
                $('div.st-content').html(strAdminContent);
                $("#modalLoginForm").modal('hide');
                $("p#st-incorrect-credentials").html("");
                $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown onclick='this.blur()'> Welcome <br> admin" +
                    "<div class = 'dropdown-content'><a onclick = 'displayUserInfo()'> User info </a><a onclick = 'addNewProductMenu()'> Add product </a><a onclick = 'logOut()'>Sign out</a></button>");
            }
        }
    if (document.getElementById("st-keep-loged-in").checked) 
    {
        setCookie();
    }

    if (!boolLogedIn) {
        if (strUsername == "" && strSecondName != "") 
        {
            $("p#st-incorrect-credentials").html("First name missing");
            $("#username").focus();
        } else if (strUsername != "" && strSecondName == "") 
        {
            $("p#st-incorrect-credentials").html("Second name missing");
            $("#secondName").focus();
        } else if (strUsername == "" && strSecondName == "") 
        {
            $("p#st-incorrect-credentials").html("Fill the fields.");
        }
        else 
        {
            $("p#st-incorrect-credentials").html("Wrong credentials");
        }
    }
}

function displayUserInfo()
{
    $("#st-user-info").modal('show');
    console.log(strChossenUser);
    $(".st-user-text").html(strChossenUser);
}

function logOut() 
{
    intUserID = "";
    deleteCookie();
    $('div.st-account').html("<button class = 'btn btn-secondary navbar-dark bg-dark' type = 'button' data-toggle='modal' data-target='#modalLoginForm'" +
        "aria-haspopup='true' aria-expanded = 'false'><i class = 'fas fa-user'></i></button>");
    toast("You sucesfully loged out.",5000);
    returnToMainPage();
}

function search() {

    if($('div.st-shopping-cart').html() != "")
    {
       $(".st-shopping-cart").html("");
       $('div.st-categories').html("<select onchange ='onCategoryChange(this)' class='form-control'><option value = '0'> All categories </option>"  + strCategories);
    }

    if ($("#search-button").val() == undefined) 
    {
        $("st-content").innerHTML = arrCategories[intChossenCategorie];
    } else 
    {
        let strSearchResult = '';
        let strName = "";
        for (var j = 0; j < products.length; j++)
        {
            if (intChossenCategorie == products[j].CategoryID || intChossenCategorie == 0) 
            {
                strName = products[j].ProductName;
                if (products[j].ProductName.toUpperCase().includes($("#search-button").val().toUpperCase())) 
                {
                    if(intUserID == -1)
                    {
                        strSearchResult += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                        "<button data-product-index=" + j + " onclick='deleteProduct("+ j +")'>Delete item</button></div></div>";
                    } else 
                    {
                    strSearchResult += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                    "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " onclick='buy(this)'>Buy</button></div></div>";
                    }
                }
            }
        }
        if (strSearchResult == "")
        {
            strSearchResult = '<img class = "st-no-search-result" src = ./img/noSearchResults.jpg>';
            $(".st-content").html("");
            $(".st-shopping-cart").html(strSearchResult);
        } else
        {
            $(".st-content").html(strSearchResult);
        }


    }
}

$("#username").keypress(function (event) 
{
    if (event.which == 13) 
    {
        $("#secondName").focus();
    }
});

$("#secondName").keypress(function (event) 
{
    if (event.which == 13) 
    {
        checkLogInCredentials();
    }
});

function setCookie() 
{
    var date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = "username=" + intUserID + ";" + expires + ";path=/";
}

function getCookie() 
{
    var name = "username" + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') 
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) 
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie() 
{
    var date = new Date();
    date.setTime(date.getTime());
    var expires = "expires=" + date.toUTCString();
    document.cookie = "username=" + intUserID + ";" + expires + ";path=/";
}

function toast(message, time) 
{
    let element = $("div#st-toast")[0];
    element.className = "show";
    setTimeout(function () 
    { element.className = element.className.replace("show", ""); }, time);
    $("div#st-toast").html(message);
}

function getCategories()

{
    $.ajax({
        url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        success: function(objResponse)
        {
            categories = objResponse.value;
            getProducts();
        },
        error: function()
        {
            alert('Something went wrong, please try again.');
        }                       
    });
}

function getProducts()
{
    $.ajax({
        url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        success: function(objResponse)
        {
            products = objResponse.value;
            onPageLoad();
        },
        error: function()
        {
            alert('Something went wrong, please try again.');
        }                   
    });
}

function getProducts()
{
    $.ajax({
        url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        success: function(objResponse)
        {
            products = objResponse.value;
            getEmployees();
        },
        error: function()
        {
            alert('Something went wrong, please try again.');
        }                   
    });
}

function getEmployees() {
    $.ajax({
        url: 'https://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json',
        type: 'GET',
        dataType: 'json',
        timeout: 15000,
        success: function (objResponse) 
        {
            arrEmployees = objResponse.value;
            arrBoughtProducts = JSON.parse(localStorage.getItem("arrBoughtProducts"));
            if (arrBoughtProducts == null) 
            {
                arrBoughtProducts= [[]];
                for (let i = 0; i < arrEmployees.length; i++) 
                {
                    arrBoughtProducts[i] = new Array();
                    for (let j = 0; j < products.length; j++) 
                    {
                        arrBoughtProducts[i][products[j].ProductID] = 0;
                    }
                }
            }
            onPageLoad();
        },
        error: function () {
            alert('Something went wrong, please try again.');
        }
    });
}

function onPageLoad() 
{
    strAdminContent = "";
    boolDoOnce = true;
    strCategories = "";
    strContent = "";
    for (var i = 0; i < categories.length; i++) 
    {
        strCategories += '<option value ="' + categories[i].CategoryID + '">' + categories[i].CategoryName + '</option>';
        arrCategories[i + 1] = "";
        for (var j = 0; j < products.length; j++) 
        {
            if (products[j] != null)
            {
                if (i + 1 == products[j].CategoryID) 
                {
                    arrCategories[products[j].CategoryID] += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                    "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " onclick='buy(this)'>Buy</button></div></div>";
                }
                if (boolDoOnce) 
                {
                    strContent += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br> ${products[j].ProductName} <br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                        "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " onclick='buy(this)'>Buy</button></div></div>";
                    strAdminContent += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                    "<button data-product-index=" + j + " onclick='deleteProduct("+ j +")'>Delete item</button></div></div>";
                }
            }
        }
        boolDoOnce = false;
    }
    strAdminContent += "<div class = 'st-product st-addContainer' onclick = 'addNewProductMenu()'> <div class = 'st-image'><img src = ./img/addProduct.png></div>Add new product</div>";
    for (var i = 0; i < arrCategories.length; i++)
    {
        if (arrCategories[i] == "") 
        {
            arrCategories[i] = "<img class = 'st-empty' src = './img/empty.jpg'>";
        }
    }

    strCategories += "</select>";
    arrCategories[0] = strContent;
    intChossenCategorie = 0;
    $('div.st-categories').html("<select onchange ='onCategoryChange(this)' class='form-control'><option value = '0'> All categories </option>" + strCategories);
    $('div.st-content').html(strContent);
    $('div.st-shopping-cart').html("");
    if(!$.isNumeric(intUserID))
    {
        intUserID = getCookie();
        
    }
    if (intUserID != "") 
        {
            if (intUserID == -1)
        {
          $('div.st-categories').html("");
        } 
            checkLogInCredentials();
        } 
    updateQuickPreview();
}