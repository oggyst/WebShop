let strCategories = "<select onchange ='onCategoryChange(this)' class='form-control'><option value = '0'> All categories </option>";
let arrCategories = [];
let intUserID;
let boolLogedIn = false;
let intChossenCategorie;
let strContent = "";
let products;
let categories;
boolDoOnce = true;
function onCategoryChange(categoryID) {
    $('div.st-content').html(arrCategories[categoryID.value]);
    intChossenCategorie = categoryID.value;
}

function checkLogInCredentials() 
{

    let strUsername = $("#username").val();
    let strSecondName = $("#secondName").val();
    fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json')
        .then((resp) => resp.json())
        .then(function (data) {
            if (intUserID != "") {
                if (intUserID >= 0) {
                    boolLogedIn = true;
                    strChossenUser = "";
                    strChossenUser += 'From ' + data.value[intUserID].Address;
                    strChossenUser += ' , ' + data.value[intUserID].Country + ' , ';
                    strChossenUser += data.value[intUserID].City;
                    toast("Welcome back " + data.value[intUserID].FirstName, 3000);
                    $("#modalLoginForm").modal('hide');
                    $("p#st-incorrect-credentials").html("");
                    $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown'> " + data.value[intUserID].FirstName + "<br>" + data.value[intUserID].LastName +
                        "<div class = 'dropdown-content'><a href = '#'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark'><i class='fas fa-shopping-cart'></i></button>");
                } else {
                    intUserID = -1;
                    strChossenUser = "You are loged in as page administrator";
                    boolLogedIn = true;
                    $("p#st-incorrect-credentials").html("");
                    $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown'> Welcome <br> admin" +
                        "<div class = 'dropdown-content'><a href = '#'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark'><i class='fas fa-shopping-cart'></i></button>");
                }
            } else
                for (var i = 0; i < data.value.length; i++) 
                {
                    if (data.value[i].FirstName === strUsername && data.value[i].LastName == strSecondName) 
                    {
                        boolLogedIn = true;
                        intUserID = i;
                        strChossenUser = "";
                        strChossenUser += 'From ' + data.value[i].Address;
                        strChossenUser += ' , ' + data.value[i].Country + ' , ';
                        strChossenUser += data.value[i].City;
                        toast("Welcome back " + strUsername, 3000);
                        $("#modalLoginForm").modal('hide');
                        $("p#st-incorrect-credentials").html("");
                        $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown'> " + data.value[intUserID].FirstName + "<br>" + data.value[intUserID].LastName +
                            "<div class = 'dropdown-content'><a href = '#'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark'><i class='fas fa-shopping-cart'></i></button>");
                    } else if (strUsername == "admin" && strSecondName == "admin") 
                    {
                        intUserID = -1;
                        strChossenUser = "You are loged in as page administrator";
                        boolLogedIn = true;
                        $("#modalLoginForm").modal('hide');
                        $("p#st-incorrect-credentials").html("");
                        $("div.st-account").html("<button class = 'st-withUser btn btn-secondary navbar-dark bg-dark dropdown'> Welcome <br> admin" +
                            "<div class = 'dropdown-content'><a href = '#'> User info </a><a onclick = 'logOut()' href = '#'>Sign out</a></button><button class = 'st-cart btn btn-secondary navbar-dark bg-dark'><i class='fas fa-shopping-cart'></i></button>");
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

        });
}

function logOut() 
{
    intUserID = "";
    deleteCookie();
    $('div.st-account').html("<button class = 'btn btn-secondary navbar-dark bg-dark' type = 'button' data-toggle='modal' data-target='#modalLoginForm'" +
        "aria-haspopup='true' aria-expanded = 'false'><i class = 'fas fa-user'></i></button>");
}

function search() {
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
                if (strName.toUpperCase().includes($("#search-button").val().toUpperCase())) 
                {
                    strSearchResult += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                        "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=" +
                        products[j].ProductName + " data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
                }
            }
        }
        $(".st-content").html(strSearchResult);

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

function fetchData() 
{
    $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json", function (data) 
    {
        categories = data.value;
    });
    $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json", function (data) 
    {
        products = data.value;

    });
}
function onPageLoad() 
{
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
                    arrCategories[products[j].CategoryID] += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg><br></div>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                        "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=\"" +
                        products[j].ProductName + "\" data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
                }
                if (boolDoOnce) 
                {
                    strContent += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
                        "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=" +
                        products[j].ProductName + " data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
                }
            }
        }
        boolDoOnce = false;
    }
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
    $('div.st-categories').html(strCategories);
    $('div.st-content').html(strContent);
    intUserID = getCookie();
    if (intUserID != "") 
    {
        checkLogInCredentials();
        console.log(intUserID);
    }
    // $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json", function (data) {
    //     categories = data.value;
    //     $.get("https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json", function (data) {
    //         products = data.value;
    //         for (var i = 0; i < categories.length; i++) 
    //         {
    //             strCategories += '<option value ="' + categories[i].CategoryID + '">' + categories[i].CategoryName + '</option>';
    //             arrCategories[i + 1] = "";
    //             for (var j = 0; j < products.length; j++) 
    //             {
    //                 if (products[j] != null)
    //                 {
    //                     if (i + 1 == products[j].CategoryID) 
    //                     {
    //                         arrCategories[products[j].CategoryID] += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg><br></div>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
    //                             "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=\"" +
    //                             products[j].ProductName + "\" data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
    //                     }
    //                     if (boolDoOnce) 
    //                     {
    //                         strContent += "<div class = 'st-product'> <div class = 'st-image'><img src = ./img/sample.jpg></div><br>" + products[j].ProductName + "<br>" + Math.floor(products[j].UnitPrice) + "€ <div class = 'st-details'>" +
    //                             "<input type='number' class = 'st-buy-button' min = '1' id='st-quantity" + products[j].ProductID + "'><button data-product-id=" + products[j].ProductID + " data-product-name=" +
    //                             products[j].ProductName + " data-unit-price=" + products[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
    //                     }
    //                 }
    //             }
    //             boolDoOnce = false;
    //         }
    //         for (var i = 0; i < arrCategories.length; i++)
    //         {
    //             if (arrCategories[i] == "") 
    //             {
    //                 arrCategories[i] = "<img class = 'st-empty' src = './img/empty.jpg'>";
    //             }
    //         }
    //         strCategories += "</select>";
    //         arrCategories[0] = strContent;
    //         intChossenCategorie = 0;
    //         $('div.st-categories').html(strCategories);
    //         $('div.st-content').html(strContent);
    //         intUserID = getCookie();
    //         if (intUserID != "") 
    //         {
    //             checkLogInCredentials();
    //             console.log(intUserID);
    //         }
    //     });
    // });
}