let arrCategories = [];
let boolLogedIn = false;
let strChossenUser;
let arrBoughtProducts = [[]];
function buy (x)
{
	if (boolLogedIn)
	{
		arrBoughtProducts[strChossenUser][x] = document.getElementById("st-quantity" + x).value
	}
	else
	{
		window.alert ("Please login first");
	}
		
}
function shopingCart () 
{

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
function info()
{
	window.alert(strChossenUser);
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
				.then(function (data2) {
					strContent += '<select onchange = "onChange(this)" id ="st-categories" name = "categories"><option value="'+ (data.value.length+1) + '">All categories</option>';
					for (var i = 0; i < data.value.length; i++) {
						strContent += '<option value = "' + data.value[i].CategoryID + '">' + data.value[i].CategoryName + '</option>';
					}	
					
					strContent += '</select>'
					document.getElementById("st-select").innerHTML = (strContent);
					strContent = "";
					for (var i = 1; i < data.value.length + 1; i++) {
						arrCategories[i] = "";
						for (var j = 0; j < data2.value.length; j++) {
							if (i == data2.value[j].CategoryID) {
								arrCategories[i] += '<div class = "st-product">' + data2.value[j].ProductName + '<br>' + Math.floor(data2.value[j].UnitPrice) + '€ <div class = "st-details">' +
									data2.value[j].QuantityPerUnit + '<input type="number" id="st-quantity'+ data2.value[j].ProductID +'"><button onclick ="buy('+ data2.value[j].ProductID +')">Buy</button></div></div>';
							}
							if (boolDoOnce) {
								strContent += '<div class = "st-product" id = " ' + data2.value[j].ProductID + '">' + data2.value[j].ProductName + '<br>' + Math.floor(data2.value[j].UnitPrice) + '€ <div class = "st-details">Per unit: ' +
									data2.value[j].QuantityPerUnit + '<input type="number" id="st-quantity'+ data2.value[j].ProductID +'"><button onclick ="buy('+ data2.value[j].ProductID +')">Buy</button></div> </div>';
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
