"use strict";

var enums = enums || {};

enums.orderStatus = {
	1: "Unauthorized",
	2: "Pending Acknowledgement", //1
	5: "Pending shipment", //2 stage
	6: "Failed",
	7: "Delivered",
	8: "User Canceled",
	9: "Refund Requested",
	10: "Refund Error",
	12: "Refunded",
	15: "Shipped", 
	16: "Return Pending",
	17: "Return Requested",
	18: "Returned",
	19: "Error",
	20: "Closed"
 },


 enums.orderItemStatus = {
	1: "Unauthorized",
	2: "Pending Acknowledgement",
	5: "Pending shipment",
	6: "Failed",
	7: "Delivered",
	8: "User Canceled",
	9: "Refund Requested",
	10: "Refund Error",
	12: "Refunded",
	15: "Shipped",
	16: "Return Pending",
	17: "Return Requested",
	18: "Returned",
	19: "Error",
	20: "Closed"
 },

 enums.paymentStatus = {
 	1: "Initial state",
 	2: "Authorized",
 	3: "Refund"
 },

 enums.orderAction = {
 	Cancel: "Cancel",
 	Accept:"Accept",
 	Reject:"Reject",
 	TrackShipment: "Track Shipment",
 	MarkUndelivered: "Mark as Undeliverable",
 	MarkDelivered: "Mark as Deliverable",
 	EnterAWB : "Enter AWB",
 	ReturnRequested: "Return Requested",
 	Returned : "Returned"
 },

 enums.productStatus = {
 	0: "Inactive",
 	1: "Active"
 },

 enums.productInStockStatus = {
 	0: "Out Of Stock",
 	1: "In Stock"
 },

 enums.productInventory = {
 	0: "Self", // non managed stock
 	1: "Paytm" // managed stock
 },

 enums.promocodeType = {
 	discount: "Discount",
 	cashback: "Cashback",
 	freebie: "FreeBie",
 	log: "Luck Draw",
 	freeShip: "Free Shipping"
 },

 enums.promocodeApplicable = {
 	1 : "Cart Level",
 	2 : "Product Level"
 },

 enums.commisionBearer = {
 	1 : "Merchant",
 	0 : "PAYTM"
 },

 enums.promoStatus = {
 	0: "Inactive",
 	1: "Active"
 },

 enums.courierStatus = {
 	0: "Inactive",
 	1: "Active"
 }




 