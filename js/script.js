let arrCategories = [];
let boolLogedIn = false;
let intUserID;
let strChossenUser;
let intChossenCategorie;
let dataProducts;
let boolAddingNew = false;
let strCategories;
let arrBoughtProducts = [];
let arrProducts = [];
let strContent = "";
let boolNeedLoading = true;
let intCounter = 0;
let boolPageLoaded = false;

function buy(element) 
{
	var productId = element.dataset.productId,
		productName = element.dataset.productName,
		unitPrice = element.dataset.unitPrice;
	if (boolLogedIn && document.getElementById("st-quantity" + (productId)).value != null) 
	{
		arrBoughtProducts[arrBoughtProducts.length] = intUserID;
		arrBoughtProducts[arrBoughtProducts.length] = productName;
		arrBoughtProducts[arrBoughtProducts.length] = unitPrice;
		arrBoughtProducts[arrBoughtProducts.length] = document.getElementById("st-quantity" + (productId)).value;
		window.alert("You sucessfully added product to cart.");
	}
	else if (document.getElementById("st-quantity" + (productId)).value == null) {
		window.alert("Select quanity first.");
	}
	else if (!boolLogedIn) 
	{
		window.alert("Please login first");
	}
	localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));

}
function remove(x) 
{
	let arrTemporary = [];
	for (var i = 0; i < arrBoughtProducts.length; i++) 
	{
		if (i >= x && i < x + 4) 
		{
		} else 
		{
			arrTemporary[arrTemporary.length] = arrBoughtProducts[i];
		}
	}
	arrBoughtProducts = arrTemporary;
	if (arrBoughtProducts.length == 1 && arrBoughtProducts[0] == 0) 
	{
		arrBoughtProducts = [];
	}
	localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
	if (arrBoughtProducts.length == 0) 
	{
		goBack();
		arrBoughtProducts = [];
	} else
		shopingCart();
}
function shopingCart() 
{
	if (intUserID == null) 
	{
		window.alert("Please log in first.");
	}
	else {
		let intTotalProduct, intTotalCart = 0;
		let strShopingCart = '<h1> Currently in your shoping cart is: </h1>';
		for (var i = 0; i < arrBoughtProducts.length; i += 4) 
		{
			intTotalProduct = 0;
			if (intUserID == arrBoughtProducts[i]) 
			{
				intTotalProduct = arrBoughtProducts[i + 2] * arrBoughtProducts[i + 3];
				strShopingCart += '<div class = "st-product">' + arrBoughtProducts[i + 1] + '</br>' + Math.floor(arrBoughtProducts[i + 3]) + ' units, total: ' + Math.floor(intTotalProduct) +
					'</br> <button id = "st-remove" onclick ="remove(' + i + ')">Remove</button> </div>';
			}
			intTotalCart += intTotalProduct;
		}
		if (strShopingCart != '<h1> Currently in your shoping cart is: </h1>') 
		{
			document.getElementById("st-select").innerHTML = '<div id = "st-categories"> </div>';
			strShopingCart += '<div class = "st-back" onclick="goBack()"> Back </div><div class = "st-total">Total cost is: ' + Math.floor(intTotalCart) + '€';
			document.getElementById("st-content").innerHTML = (strShopingCart);
		} else if (intUserID != null) 
		{
			window.alert("You haven't add anything to your cart");
		}
	}
}
function goBack() 
{
	document.getElementById("st-content").innerHTML = '<div id ="st-select"></div><div id = "st-content></div>';
	document.getElementById("st-select").innerHTML = ('<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="0">All categories</option>' + strCategories);
	document.getElementById("st-content").innerHTML = arrCategories[0];
}

function onChange(x) 
{
	if (!boolAddingNew) 
	{
		document.getElementById("st-content").innerHTML = (arrCategories[x.value]);
		intChossenCategorie = x.value;
	}
}

function closeForm() 
{
	document.getElementById("st-login-form").style.display = "none";
}

function login() 
{
	if (document.getElementById("st-login-form").style.display == "block") {
		closeForm();
	} else 
	{
		document.getElementById("st-login-form").style.display = "block";
	}
}

function logOut() 
{
	strChossenUser = "";
	intUserID = null;
	boolLogedIn = false;
	deleteCookie();
	document.getElementById("st-name").innerHTML = ("Account");
	if (document.getElementById("st-login-form").style.display == "block") 
	{
		closeForm();
	} else 
	{
		document.getElementById("st-login-form").style.display = "block";
	}
	document.getElementById("st-no-user").style.display = "block";
	document.getElementById("st-with-user").style.display = "none";
	goBack();
}

function info() 
{
	window.alert(strChossenUser);
	closeForm();
}

function search()
{
	if (document.getElementById("search-button").value == undefined) 
	{
		document.getElementById("st-content").innerHTML = arrCategories[intChossenCategorie];
	} else 
	{
		let strSearchResult = '';
		let strName = "";
		for (var j = 0; j < dataProducts.value.length; j++) 
		{
			strName = dataProducts.value[j].ProductName;
			if (strName.toUpperCase().includes(document.getElementById("search-button").value.toUpperCase())) 
			{
				strSearchResult += '<div class = "st-product">' + dataProducts.value[j].ProductName + '<br>' + Math.floor(dataProducts.value[j].UnitPrice) + '€ <div class = "st-details">' +
					dataProducts.value[j].QuantityPerUnit + '<input type="number" id="st-quantity' + dataProducts.value[j].ProductID + '"><button onclick ="buy(' + dataProducts.value[j].ProductID + ',' +
					dataProducts.value[j].ProductName + ', ' + dataProducts.value[j].UnitPrice + ')">Buy</button></div></div>';
			}
			document.getElementById("st-content").innerHTML = strSearchResult;
		}
	}
}

function checkInfo() 
{
	let strUsername = document.getElementById("username").value;
	let strSecondName = document.getElementById("secondName").value;
	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json')
		.then((resp) => resp.json())
		.then(function (data) 
		{

			if (intUserID != null) 
			{
				document.getElementById("st-name").innerHTML = ('Welcome ' + data.value[intUserID].FirstName);
				strChossenUser = "";
				strChossenUser += 'From ' + data.value[intUserID].Address;
				strChossenUser += ' , ' + data.value[intUserID].Country + ' , ';
				strChossenUser += data.value[intUserID].City;
				boolLogedIn = true;
			} else 
			{
				for (var i = 0; i < data.value.length; i++) 
				{
					if (data.value[i].FirstName === strUsername && data.value[i].LastName == strSecondName) 
					{
						boolLogedIn = true;
						document.getElementById("st-name").innerHTML = ('Welcome ' + data.value[i].FirstName);
						intUserID = i;
						strChossenUser = "";
						strChossenUser += 'From ' + data.value[i].Address;
						strChossenUser += ' , ' + data.value[i].Country + ' , ';
						strChossenUser += data.value[i].City;
						login();
					}
				}
				if (document.getElementById("st-loged-in").checked) 
				{
					setCookie();
				}
			}
			if (!boolLogedIn)
			{
				document.getElementById("st-incorrect").innerHTML = ("Wrong credentials");
			}
			else 
			{

				document.getElementById("st-no-user").style.display = "none";
				document.getElementById("st-with-user").style.display = "block";
			}
		});
}

function setCookie() 
{
	var d = new Date();
	d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
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
	var d = new Date();
	d.setTime(d.getTime());
	var expires = "expires=" + d.toUTCString();
	document.cookie = "username=" + intUserID + ";" + expires + ";path=/";
}

function dropMenu() 
{
	if (document.getElementById("st-drop-menu").style.display == "block") {
		document.getElementById("st-drop-menu").style.display = "none";
	} else 
	{
		document.getElementById("st-drop-menu").style.display = "block";
	}
}

function addProductMenu() 
{
	dropMenu();
	for (var i = 0; i < arrCategories.length; i++);
	boolAddingNew = true;
	document.getElementById("st-select").innerHTML = '';
	document.getElementById("st-content").innerHTML = ('<div class = "st-new-product"><input type="text" placeholder = "Insert product name" id="product-name">'
		+ '<input type="number" placeholder = "Cost of product" id= "price"></input><select onchange = "onChange(this)" id ="st-categories" name = "categories">' + strCategories +
		'<input type = "button" value ="Add product" class = "st-add" onclick="addProduct()"><input type = "button" value ="Return" class = "st-add" onclick="goBack()"></div></div>')
}
function addProduct() 
{
	let strProductName = document.getElementById("product-name").value;
	let intCost = document.getElementById("price").value;
	if (strProductName == "" || intCost == 0) 
	{
		window.alert("Insert all values");
	} else 
	{
		if (arrProducts.length == 0) 
		{
			arrProducts[arrProducts.length] = (dataProducts.value.length + arrProducts.length + 1);
		} else 
		{
			for (var i = 0; arrProducts.length > i; i += 4) 
			{
				x = arrProducts[i];
			}
			arrProducts[arrProducts.length] = (x + 1);
		}
		arrProducts[arrProducts.length] = strProductName;
		arrProducts[arrProducts.length] = intCost;
		arrProducts[arrProducts.length] = Math.floor(document.getElementById("st-categories").value);
		arrCategories[Math.floor(document.getElementById("st-categories").value)] += "<div class = 'st-product'>" + strProductName + "<br>" + Math.floor(intCost) + "€ <div class = 'st-details'><input type='number' id='st-quantity"
			+ (dataProducts.value.length + arrProducts.length + 1) + "'><button data-product-id=" + (dataProducts.value.length + arrProducts.length + 1) + " data-product-name=\"" +
			strProductName + "\" data-unit-price=" + intCost + " onclick='buy(this)'>Buy</button></div></div>";
		localStorage.setItem("arrProducts", JSON.stringify(arrProducts));

		arrCategories[0] += "<div class = 'st-product'>" + strProductName + "<br>" + Math.floor(intCost) + "€ <div class = 'st-details'><input type='number' id='st-quantity"
			+ (dataProducts.value.length + arrProducts.length + 1) + "'><button data-product-id=" + (dataProducts.value.length + arrProducts.length + 1) + " data-product-name=\"" +
			strProductName + "\" data-unit-price=" + intCost + " onclick='buy(this)'>Buy</button></div></div>";
		boolAddingNew = false;
		goBack();
	}
}

function update() 
{
	arrProducts = JSON.parse(localStorage.getItem("arrProducts"));
	if (arrProducts != null) 
	{
		for (var i = 0; i < arrProducts.length; i += 4) 
		{
			arrCategories[i + 3] += "<div class = 'st-product'>" + arrProducts[i + 1] + "<br>" + Math.floor(arrProducts[i + 2]) + "€ <div class = 'st-details'><input type='number' id='st-quantity"
				+ arrProducts[i] + "'><button data-product-id=" + arrProducts[i] + " data-product-name=\"" +
				arrProducts[i + 1] + "\" data-unit-price=" + arrProducts[i + 2] + " onclick='buy(this)'>Buy</button></div></div>";
			arrCategories[0] += "<div class = 'st-product'>" + arrProducts[i + 1] + "<br>" + Math.floor(arrProducts[i + 2]) + "€ <div class = 'st-details'><input type='number' id='st-quantity"
				+ arrProducts[i] + "'><button data-product-id=" + arrProducts[i] + " data-product-name=\"" +
				arrProducts[i + 1] + "\" data-unit-price=" + arrProducts[i + 2] + " onclick='buy(this)'>Buy</button></div></div>";
			strContent += "<div class = 'st-product'>" + arrProducts[i + 1] + "<br>" + Math.floor(arrProducts[i + 2]) + "€ <div class = 'st-details'><input type='number' id='st-quantity"
				+ arrProducts[i] + "'><button data-product-id=" + arrProducts[i] + " data-product-name=\"" +
				arrProducts[i + 1] + "\" data-unit-price=" + arrProducts[i + 2] + " onclick='buy(this)'>Buy</button></div></div>";
		}
	} else
		arrProducts = [];
	return arrProducts[length];
}

function removeProduct() 
{

	let arrRemoveProduct = [];
	dropMenu();

	arrRemoveProduct[0] = '<select id = "removeMenu">';
	for (var i = 0; i < dataProducts.value.length; i++) 
	{
		if (dataProducts.value[i] != null)
			arrRemoveProduct[dataProducts.value[i].ProductID] = '<option value = ' + dataProducts.value[i].ProductID + '>' + dataProducts.value[i].ProductName + '</option>';
	}
	for (var i = 0; i < arrProducts.length; i += 4) 
	{
		arrRemoveProduct[arrProducts[i]] = '<option  value = ' + arrProducts[i] + '>' + arrProducts[i + 1] + '</option>';
	}
	arrRemoveProduct[arrRemoveProduct.length] = "</select>";
	document.getElementById("st-categories").style.display = "none";
	document.getElementById("st-content").innerHTML = "Chosse item you wanna remove:" + arrRemoveProduct + '<button type = "button" onclick = "deleteProduct()"> Remove </button><input type = "button" value ="Return" class = "st-add" onclick="goBack()">';
}

function deleteProduct() 
{
	let idToRemove = document.getElementById('removeMenu').value;
	if (idToRemove < dataProducts.value.length) 
	{
		for (i = 0; i < dataProducts.value.length; i++) 
		{
			if (dataProducts.value[i] != null)
			{
				if (dataProducts.value[i].ProductID == (idToRemove)) 
				{
					dataProducts.value[i] = null;
				}
			}
		}
	} else 
	{
		arrTemporary = [];
		for (i = 0; i < arrProducts.length; i += 4) 
		{
			if (idToRemove == arrProducts[i]) 
			{
				
			} else 
			{
				arrTemporary[arrTemporary.length] = arrProducts[i]
				arrTemporary[arrTemporary.length] = arrProducts[i + 1]
				arrTemporary[arrTemporary.length] = arrProducts[i + 2]
				arrTemporary[arrTemporary.length] = arrProducts[i + 3]
			}
		}
		arrProducts = arrTemporary;
		localStorage.setItem("arrProducts", JSON.stringify(arrProducts));
	}
	start();
	goBack();
}
function start() 
{
	let boolDoOnce = true;
	arrBoughtProducts = JSON.parse(localStorage.getItem("arrBoughtProducts"));
	if (arrBoughtProducts == null) 
	{
		arrBoughtProducts = [];
	}
	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json')
		.then((resp) => resp.json())
		.then(function (data) {
			fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json')
				.then((resp2) => resp2.json())
				.then(function (products) 
				{
					if (boolNeedLoading == true) 
					{
						dataProducts = products;
						boolNeedLoading = false;
					}
					strCategories = "";
					for (var i = 0; i < data.value.length; i++) 
					{
						strCategories += '<option value = "' + data.value[i].CategoryID + '">' + data.value[i].CategoryName + '</option>';
					}

					strCategories += '</select>'
					document.getElementById("st-select").innerHTML = ('<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="0">All categories</option>' + strCategories);
					strContent = "";
					for (var i = 1; i < data.value.length + 1; i++) 
					{
						arrCategories[i] = "";
						for (var j = 0; j < dataProducts.value.length; j++) 
						{
							if (dataProducts.value[j] != null) 
							{
								if (i == dataProducts.value[j].CategoryID) 
								{
									arrCategories[i] += "<div class = 'st-product'>" + dataProducts.value[j].ProductName + "<br>" + Math.floor(dataProducts.value[j].UnitPrice) + "€ <div class = 'st-details'>" +
										dataProducts.value[j].QuantityPerUnit + "<input type='number' id='st-quantity" + dataProducts.value[j].ProductID + "'><button data-product-id=" + dataProducts.value[j].ProductID + " data-product-name=\"" +
										dataProducts.value[j].ProductName + "\" data-unit-price=" + dataProducts.value[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
								}

								if (boolDoOnce) 
								{
									strContent += "<div class = 'st-product'>" + dataProducts.value[j].ProductName + "<br>" + Math.floor(dataProducts.value[j].UnitPrice) + "€ <div class = 'st-details'>" +
										dataProducts.value[j].QuantityPerUnit + "<input type='number' id='st-quantity" + dataProducts.value[j].ProductID + "'><button data-product-id=" + dataProducts.value[j].ProductID + " data-product-name=\"" +
										dataProducts.value[j].ProductName + "\" data-unit-price=" + dataProducts.value[j].UnitPrice + " onclick='buy(this)'>Buy</button></div></div>";
								}
							}
						}
						arrCategories[0] = strContent;
						boolDoOnce = false;
					}
					if(!boolLogedIn)
					{
					intUserID = getCookie();
					
					if (intUserID != "") 
						{
							checkInfo();
						} else 
						{
							intUserID = null;
						}
				}
					update();
					document.getElementById("st-content").innerHTML = (arrCategories[0]);
				})
				.catch(function (error) 
				{
					console.log(error);
				});

		})
		.catch(function (error) 
		{
			console.log(error);
		});
	if (!boolLogedIn) 
	{
		document.getElementById("st-with-user").style.display = "none";
	} else 
	{
		document.getElementById("st-no-user").style.display = "none"
	}
	boolPageLoaded = true;
}
