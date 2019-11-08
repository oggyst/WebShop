let arrCategories = [];
let boolLogedIn = false;
let intUserID;
let strChossenUser;
let dataProducts;
let strCategories;
let strBoughtProducts = [];
function buy (x)
{
	if (boolLogedIn)
	{
		strBoughtProducts[strBoughtProducts.length] = intUserID;
		for (var j = 0; j < dataProducts.value.length; j++)
		{
			if (dataProducts.value[j].ProductID == x)
			{
			strBoughtProducts[strBoughtProducts.length] = dataProducts.value[j].ProductName;
			strBoughtProducts[strBoughtProducts.length] = dataProducts.value[j].UnitPrice;
			}
		}
		strBoughtProducts[strBoughtProducts.length] = document.getElementById("st-quantity" + (x)).value;
	}
	else
	{
		window.alert ("Please login first");
	}
		
}
function shopingCart () 
{
	let intTotalProduct, intTotalCart = 0;
	let strShopingCart = '<h1> Currently in your shoping cart is: </h1>';
	for(var i = 0; i < strBoughtProducts.length;i+=4)
	{ 
		intTotalProduct = 0;
		if (intUserID == strBoughtProducts[i])
		{
		intTotalProduct = strBoughtProducts[i+2] * strBoughtProducts[i+3];
		strShopingCart += '<div class = "st-product">' + strBoughtProducts[i+1] + '</br>' + Math.floor(strBoughtProducts[i+3]) + ' units, total: ' + Math.floor(intTotalProduct)+ ' </div>';
		}
		intTotalCart += intTotalProduct;
	}
	if (strShopingCart != '<h1> Currently in your shoping cart is: </h1>')
	{
		document.getElementById("st-select").innerHTML = "";
		strShopingCart += '<div class = "st-back" onclick="goBack()"> Back </div><div class = "st-total">Total cost is: ' + Math.floor(intTotalCart) + '€';
		document.getElementById("st-content").innerHTML = (strShopingCart);
	}
}
function goBack ()
{
	document.getElementById("st-content").innerHTML = '<div id ="st-select"></div><div id = "st-content></div>';
	 document.getElementById("st-select").innerHTML = strCategories;
	 document.getElementById("st-content").innerHTML = arrCategories[arrCategories.length-1];
}
function onChange(x) {
	
		document.getElementById("st-content").innerHTML = (arrCategories[x.value]);
}
function closeForm ()
{
	document.getElementById("st-login-form").style.display = "none";
}
function login ()
{
	if(document.getElementById("st-login-form").style.display == "block")
	{
		closeForm();
	} else 
	{
	document.getElementById("st-login-form").style.display = "block";
	}
	if (boolLogedIn) 
	{
		document.getElementById("st-login-form").innerHTML = ('<input type="button" value="Profile" onclick="info()">' +
		'<input type="button" value="log out" onclick="logOut()">')	
	}
}
function logOut()
{
	strChossenUser = "";
	if(document.getElementById("st-login-form").style.display == "block")
	{
		closeForm();
	} else 
	{
	document.getElementById("st-login-form").style.display = "block";
	}
}
function info()
{
	window.alert(strChossenUser);
}
function search ()
{
	if (document.getElementById("search-button").value == "")
		{
		 document.getElementById("st-content").innerHTML = arrCategories[arrCategories.length-1];
		} else
		{
		let strSearchResult = '';
		let strName = "";
		console.log(document.getElementById("search-button").value);
		for (var j = 0; j < dataProducts.value.length; j++)
		{
			strName = dataProducts.value[j].ProductName;
			if(strName.includes(document.getElementById("search-button").value))
			{
				strSearchResult += '<div class = "st-product">' + dataProducts.value[j].ProductName + '<br>' + Math.floor(dataProducts.value[j].UnitPrice) + '€ <div class = "st-details">' +
				dataProducts.value[j].QuantityPerUnit + '<input type="number" id="st-quantity'+ dataProducts.value[j].ProductID +'"><button onclick ="buy('+ dataProducts.value[j].ProductID +')">Buy</button></div></div>';
			}
			document.getElementById("st-content").innerHTML = strSearchResult;
		}
	}
}

function checkInfo ()
{
	let strUsername = document.getElementById("username").value;
	let strSecondName = document.getElementById("secondName").value;
	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Employees?$format=json')
		.then((resp) => resp.json())
		.then(function (data) {
			for (var i = 0;i < data.value.length; i++)
			{
				if (data.value[i].FirstName === strUsername && data.value[i].LastName == strSecondName)
				{
					boolLogedIn = true;
					document.getElementById("st-name").innerHTML = ('Welcome ' + data.value[i].FirstName);
					intUserID = i;
					strChossenUser = "";
					strChossenUser += 'From ' +  data.value[i].Address;
					strChossenUser +=  ' , ' + data.value[i].Country + ' , ';
					strChossenUser +=  data.value[i].City;
					login();
				}
			}
			if (!boolLogedIn)
			document.getElementById("st-incorrect").innerHTML=("Wrong credentials");
		});
}

function start() {
	
	let strContent = "";
	let boolDoOnce = true;
	
	fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json')
		.then((resp) => resp.json())
		.then(function (data) {
			fetch('https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json')
				.then((resp2) => resp2.json())
				.then(function (products) {
					dataProducts = products;
					strCategories = "";
					strCategories += '<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="'+ (data.value.length+1) + '">All categories</option>';
					for (var i = 0; i < data.value.length; i++) {
						strCategories += '<option value = "' + data.value[i].CategoryID + '">' + data.value[i].CategoryName + '</option>';
					}	
					
					strCategories += '</select>'
					document.getElementById("st-select").innerHTML = (strCategories);
					strContent = "";
					for (var i = 1; i < data.value.length + 1; i++) {
						arrCategories[i] = "";
						for (var j = 0; j < products.value.length; j++) {
							if (i == products.value[j].CategoryID) {
								arrCategories[i] += '<div class = "st-product">' + products.value[j].ProductName + '<br>' + Math.floor(products.value[j].UnitPrice) + '€ <div class = "st-details">' +
									products.value[j].QuantityPerUnit + '<input type="number" id="st-quantity'+ products.value[j].ProductID +'"><button onclick ="buy('+ products.value[j].ProductID +')">Buy</button></div></div>';
							}
							if (boolDoOnce) {
								strContent += '<div class = "st-product" id = " ' + products.value[j].ProductID + '">' + products.value[j].ProductName + '<br>' + Math.floor(products.value[j].UnitPrice) + '€ <div class = "st-details">Per unit: ' +
									products.value[j].QuantityPerUnit + '<input type="number" id="st-quantity'+ products.value[j].ProductID +'"><button onclick ="buy('+ products.value[j].ProductID +')">Buy</button></div> </div>';
							}
						}
						arrCategories[(data.value.length+1)] = strContent;
						boolDoOnce = false;
					}
					document.getElementById("st-content").innerHTML = (arrCategories[(data.value.length+1)]);
				})
				.catch(function (error) {
					console.log(error);
				});

		})
		.catch(function (error) {
			console.log(error);
		});

}
