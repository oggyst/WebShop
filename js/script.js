let arrCategories = [];
let boolLogedIn = false;
let intUserID;
let strChossenUser;
let intChossenCategorie;
let dataProducts;
let boolAddingNew = false;
let strCategories;
let arrBoughtProducts = [];

function buy(x) {
	if (boolLogedIn && document.getElementById("st-quantity" + (x)).value != 0) {
		arrBoughtProducts[arrBoughtProducts.length] = intUserID;
		for (var j = 0; j < dataProducts.value.length; j++) {
			if (dataProducts.value[j].ProductID == x) {
				arrBoughtProducts[arrBoughtProducts.length] = dataProducts.value[j].ProductName;
				arrBoughtProducts[arrBoughtProducts.length] = dataProducts.value[j].UnitPrice;
			}
		}
		arrBoughtProducts[arrBoughtProducts.length] = document.getElementById("st-quantity" + (x)).value;
	}
	else if (document.getElementById("st-quantity" + (x)).value == 0)
	{
		window.alert("Select quanity first.");
	}
	else {
		window.alert("Please login first");
	}
	localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
}
function remove(x)
{
	let arrTemporary = [];
	for (var i = 0; i < arrBoughtProducts.length;i++)
	{
		// console.log (x);
		if (i >= x  && i < x + 4)
		{
			// arrBoughtProducts[i+3] = arrBoughtProducts [i+3] - document.getElementById("quanity" + i).value;
			console.log (arrBoughtProducts [i+3]);
		} else
		{
			arrTemporary[arrTemporary.length]=arrBoughtProducts[i];
		}
	}
	arrBoughtProducts = arrTemporary;	
	localStorage.setItem("arrBoughtProducts", JSON.stringify(arrBoughtProducts));
	if (arrBoughtProducts.length == 0)
	{
		goBack();
	} else
	shopingCart();
}
function shopingCart() {
	if (intUserID == null) {
		window.alert("Please log in first.");
	}
	else {
		let intTotalProduct, intTotalCart = 0;
		let strShopingCart = '<h1> Currently in your shoping cart is: </h1>';
		for (var i = 0; i < arrBoughtProducts.length; i += 4) {
			intTotalProduct = 0;
			if (intUserID == arrBoughtProducts[i]) {
				intTotalProduct = arrBoughtProducts[i + 2] * arrBoughtProducts[i + 3];
				strShopingCart += '<div class = "st-product">' + arrBoughtProducts[i + 1] + '</br>' + Math.floor(arrBoughtProducts[i + 3]) + ' units, total: ' + Math.floor(intTotalProduct) +
					'</br> <button id = "st-remove" onclick ="remove(' + i + ')">Remove</button> </div>';
			}
			intTotalCart += intTotalProduct;
		}
		if (strShopingCart != '<h1> Currently in your shoping cart is: </h1>') {
			document.getElementById("st-select").innerHTML = "";
			strShopingCart += '<div class = "st-back" onclick="goBack()"> Back </div><div class = "st-total">Total cost is: ' + Math.floor(intTotalCart) + '€';
			document.getElementById("st-content").innerHTML = (strShopingCart);
		} else if (intUserID != null) {
			window.alert("You haven't add anything to your cart");
		}
	}
}
function goBack() {
	document.getElementById("st-content").innerHTML = '<div id ="st-select"></div><div id = "st-content></div>';
	document.getElementById("st-select").innerHTML = ('<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="0">All categories</option>' + strCategories);
	document.getElementById("st-content").innerHTML = arrCategories[arrCategories.length - 1];
}

function onChange(x) {
	if (!boolAddingNew)
	{
	document.getElementById("st-content").innerHTML = (arrCategories[x.value]);
	intChossenCategorie = x.value;
	}
}

function closeForm() {
	document.getElementById("st-login-form").style.display = "none";
}

function login() {
	if (document.getElementById("st-login-form").style.display == "block") {
		closeForm();
	} else {
		document.getElementById("st-login-form").style.display = "block";
	}
}

function logOut() {
	strChossenUser = "";
	intUserID = "";
	deleteCookie();
	document.getElementById("st-name").innerHTML = ("Account");
	if (document.getElementById("st-login-form").style.display == "block") {
		closeForm();
	} else {
		document.getElementById("st-login-form").style.display = "block";
	}
	document.getElementById("st-no-user").style.display = "block";
	document.getElementById("st-with-user").style.display = "none";
	goBack();
}

function info() {
	window.alert(strChossenUser);
	closeForm();
}

function search() {
	if (document.getElementById("search-button").value == "") {
		document.getElementById("st-content").innerHTML = arrCategories[intChossenCategorie];
	} else {
		let strSearchResult = '';
		let strName = "";
		for (var j = 0; j < dataProducts.value.length; j++) {
			strName = dataProducts.value[j].ProductName;
			if (strName.toUpperCase().includes(document.getElementById("search-button").value.toUpperCase())) {
				strSearchResult += '<div class = "st-product">' + dataProducts.value[j].ProductName + '<br>' + Math.floor(dataProducts.value[j].UnitPrice) + '€ <div class = "st-details">' +
					dataProducts.value[j].QuantityPerUnit + '<input type="number" id="st-quantity' + dataProducts.value[j].ProductID + '"><button onclick ="buy(' + dataProducts.value[j].ProductID + ')">Buy</button></div></div>';
			}
			document.getElementById("st-content").innerHTML = strSearchResult;
		}
	}
}

function checkInfo() {
	let strUsername = document.getElementById("username").value;
	let strSecondName = document.getElementById("secondName").value;
	console.log(document.getElementById("st-loged-in").checked);
	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json')
		.then((resp) => resp.json())
		.then(function (data) {

			if (intUserID != '') {
				document.getElementById("st-name").innerHTML = ('Welcome ' + data.value[intUserID].FirstName);
				strChossenUser = "";
				strChossenUser += 'From ' + data.value[intUserID].Address;
				strChossenUser += ' , ' + data.value[intUserID].Country + ' , ';
				strChossenUser += data.value[intUserID].City;
				boolLogedIn = true;
			} else {
				for (var i = 0; i < data.value.length; i++) {
					if (data.value[i].FirstName === strUsername && data.value[i].LastName == strSecondName) {
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
				if(document.getElementById("st-loged-in").checked)
				{
				setCookie();
				}
			}
			if (!boolLogedIn) {
				document.getElementById("st-incorrect").innerHTML = ("Wrong credentials");
			}
			else {
				
				document.getElementById("st-no-user").style.display = "none";
				document.getElementById("st-with-user").style.display = "block";
			}
		});
}

function setCookie() {
	var d = new Date();
	d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = "username=" + intUserID + ";" + expires + ";path=/";
}

function getCookie() {
	var name = "username" + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function deleteCookie() {
	var d = new Date();
	d.setTime(d.getTime());
	var expires = "expires=" + d.toUTCString();
	document.cookie = "username=" + intUserID + ";" + expires + ";path=/";
}

function dropMenu()
{
	if (document.getElementById("st-drop-menu").style.display == "block")
	{
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
	console.log(dataProducts);
	document.getElementById("st-select").innerHTML = '';
	document.getElementById("st-content").innerHTML = ('<div class = "st-new-product"><input type="text" placeholder = "Insert product name" id="product-name">'
	+'<input type="number" placeholder = "Cost of product" id= "price"></input><select onchange = "onChange(this)" id ="st-categories" name = "categories">' + strCategories + 
	'<input type = "button" value ="add" onclick="addProduct()"></div>')
}
function addProduct()
{
	let strProductName = document.getElementById("product-name").value;
	let intCost = document.getElementById("price").value;
	if(strProductName == "" || intCost == 0)
	{
		window.alert ("Insert all values");
	} else
	{
		dataProducts.value[dataProducts.length].ProductID = dataProducts.length;
		dataProducts[dataProducts.length].ProductName = strProductName;
		dataProducts[dataProducts.length].UnitPrice = intCost;
	}
	
	console.log (strProductName + intCost);
}

function start() {
	
	let strContent = "";
	let boolDoOnce = true;
	intUserID = getCookie();

	arrBoughtProducts = JSON.parse(localStorage.getItem("arrBoughtProducts"));
	if (arrBoughtProducts == null) {
		arrBoughtProducts = [];
	}


	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json')
		.then((resp) => resp.json())
		.then(function (data) {
			fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json')
				.then((resp2) => resp2.json())
				.then(function (products) {
					dataProducts = products;
					console.log(dataProducts);
					strCategories = "";
					// strCategories += '<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="0">All categories</option>';
					for (var i = 0; i < data.value.length; i++) {
						strCategories += '<option value = "' + data.value[i].CategoryID + '">' + data.value[i].CategoryName + '</option>';
					}

					strCategories += '</select>'
					document.getElementById("st-select").innerHTML = ('<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="0">All categories</option>' + strCategories);
					strContent = "";
					for (var i = 1; i < data.value.length + 1; i++) {
						arrCategories[i] = "";
						for (var j = 0; j < products.value.length; j++) {
							if (i == products.value[j].CategoryID) {
								arrCategories[i] += '<div class = "st-product">' + products.value[j].ProductName + '<br>' + Math.floor(products.value[j].UnitPrice) + '€ <div class = "st-details">' +
									products.value[j].QuantityPerUnit + '<input type="number" id="st-quantity' + products.value[j].ProductID + '"><button onclick ="buy(' + products.value[j].ProductID + ')">Buy</button></div></div>';
							}
							if (boolDoOnce) {
								strContent += '<div class = "st-product" id = " ' + products.value[j].ProductID + '">' + products.value[j].ProductName + '<br>' + Math.floor(products.value[j].UnitPrice) + '€ <div class = "st-details">Per unit: ' +
									products.value[j].QuantityPerUnit + '<input type="number" id="st-quantity' + products.value[j].ProductID + '"><button onclick ="buy(' + products.value[j].ProductID + ')">Buy</button></div> </div>';
							}
						}
						arrCategories[(0)] = strContent;
						boolDoOnce = false;
					}
					if (intUserID != "") {
						checkInfo();
					}
					document.getElementById("st-content").innerHTML = (arrCategories[(0)]);
				})
				.catch(function (error) {
					console.log(error);
				});

		})
		.catch(function (error) {
			console.log(error);
		});
	if (!boolLogedIn) {
		document.getElementById("st-with-user").style.display = "none";
	} else {
		document.getElementById("st-no-user").style.display = "none"
	}
}
