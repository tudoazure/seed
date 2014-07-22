"use strict";

var constants = constants || {};

var url 

constants.Url = {
	MerchantList: ChatPanelUser.apiUrl + "merchants",
	MerchantDetails: ChatPanelUser.apiUrl + "merchants",
	OrderList: ChatPanelUser.apiUrl + "merchants",
	MerchantCommission: ChatPanelUser.apiUrl + "merchant/",
	MerchantCreate : ChatPanelUser.apiUrl + "merchants/",
	PromocodeList: ChatPanelUser.apiUrl + "admin/promocode.json",
	StorefrontList:ChatPanelUser.apiUrl + "storefront",
	CourierList:ChatPanelUser.apiUrl + "merchant/shippers",
	ShippingRule :ChatPanelUser.apiUrl + "merchant/shippingrule",

	//Category Url
	CategoryUrl: ChatPanelUser.apiUrl + "category",
	AllVerticalUrl: ChatPanelUser.apiUrl + "vertical/all",
	VerticalFIlterUrl: ChatPanelUser.apiUrl + "vertical/",
	CategoryFIlterUrl: ChatPanelUser.apiUrl + "filters/",
	CategorySaveFilter : ChatPanelUser.apiUrl + "Category/{categoryId}/filters",

	//promocode url 
	CreatePromo: ChatPanelUser.apiUrl + "admin/promo",
	GetStoreFrontList : ChatPanelUser.apiUrl + "storefront/5165/list",
	GetPlatformsList : ChatPanelUser.apiUrl + "admin/promocode/platforms",
	GetBrandsList : ChatPanelUser.apiUrl + "brand/all",
	GetCategoryTree: ChatPanelUser.apiUrl + "categorytree/all?depth=4",
	PromoUpload : ChatPanelUser.apiUrl + "admin/promo/upload",
	GetSkusList: ChatPanelUser.apiUrl + "catalog.json",
	UpdatePromo: ChatPanelUser.apiUrl + "admin/promocode/",

	BargainPromo: ChatPanelUser.apiUrl + "admin/promocode/bargain",

	//Catalog URl 
	ProductList : ChatPanelUser.apiUrl + "merchant/{merchantId}/catalog.json",
	ProductCsv : ChatPanelUser.apiUrl + "merchant/{merchantId}/catalog.csv",
	ProductCRUD: ChatPanelUser.apiUrl + "merchant/{merchantId}/product/",
	GetCategory : ChatPanelUser.apiUrl + "merchant/{merchantId}/catalog/cagtegory.json", // to revert merchantID
	UpdateInventory: ChatPanelUser.apiUrl + "merchant/{merchantId}/product/inventory.json",
	DeleteResource: ChatPanelUser.apiUrl + "merchant/{merchantId}/product/resource/",
	UploadProductCsv: ChatPanelUser.apiUrl + "merchant/{merchantId}/product.csv",
	UploadResource: ChatPanelUser.apiUrl + "merchant/{merchantId}/resource",
	AssociateResource: ChatPanelUser.apiUrl + "merchant/{merchantId}/product/resource.json",
	BulkDownloadCsvFormat : ChatPanelUser.apiUrl + "merchant/{merchantId}/category/{categoryId}/products.csv",
	BulkUploadCsvFormat : ChatPanelUser.apiUrl + "merchant/{merchantId}/category/products.csv",
	CreateGroup: ChatPanelUser.apiUrl + "product/complex",
	productTags: ChatPanelUser.apiUrl + "product/tags",

	//Order Url 
	OrdersList : ChatPanelUser.apiUrl + "admin/orders.json",
	// OrdersList : ChatPanelUser.apiUrl + "merchant/{merchantId}/orders.json",
	// OrderCsv : ChatPanelUser.apiUrl + "merchant/{merchantId}/orders.csv?",
	OrderCsv : ChatPanelUser.apiUrl + "admin/orders.csv?",
	TrackFulfillment : ChatPanelUser.apiUrl + "merchant/{merchantId}/fulfillment/{0}/track",
	UpdateFulfillment : ChatPanelUser.apiUrl + "merchant/{merchantId}/fulfillment/update/",
	AckFulfillment: ChatPanelUser.apiUrl + "merchant/{merchantId}/fulfillment/ack/",
	CreateFulfillment : ChatPanelUser.apiUrl + "merchant/{merchantId}/fulfillment/create/",
	BulkCreateFulfillment : ChatPanelUser.apiUrl + "merchant/{merchantId}/fulfillment/bulkcreate.csv",
	GetItemHistory: ChatPanelUser.apiUrl + "admin/order/{order_id}/history?order_item_id=",
	CancelOrderItem : ChatPanelUser.apiUrl + "merchant/{merchantId}/order/{orderId}/item/{itemId}/cancel",

	//Chat Prod repo
	// ChatHistory : "https://c.paytm.com/one97/get-user-conversation/",
	// ChatConnect : "https://c.paytm.com/accounts/connect/",
	// chatUserDetails : "https://c.paytm.com/cm/get-details/",
	// chatPing : "https://c.paytm.com/cm/ping/",
	// chatAddContact : "https://c.paytm.com/cm/get-details/",
	// chatGetAllConversation : "https://c.paytm.com/messages/get-all-conversations/",
	// chatServerURl : "c.paytm.com",

	//chat staging url
	ChatHistory : "https://chat-staging.paytm.com/one97/get-user-conversation/",
	ChatConnect : "https://chat-staging.paytm.com/accounts/connect/",
	chatUserDetails : "https://chat-staging.paytm.com/cm/get-details/",
	chatPing : "https://chat-staging.paytm.com/cm/ping/",
	chatAddContact : "https://chat-staging.paytm.com/cm/get-details/",
	chatGetAllConversation : "https://chat-staging.paytm.com/messages/get-all-conversations/",
	chatServerURl : "chat-staging.paytm.com",

	//Chat
	// ChatHistory : "https://cs.plustxt.com/one97/get-user-conversation/",
	// ChatConnect : "https://cs.plustxt.com/accounts/connect/",
	// chatUserDetails : "https://cs.plustxt.com/cm/get-details/",
	// chatPing : "https://cs.plustxt.com/cm/ping/",
	// chatAddContact : "https://cs.plustxt.com/cm/get-details/",
	// chatGetAllConversation : "https://cs.plustxt.com/messages/get-all-conversations/",
	// chatServerURl : "cs.plustxt.com",

};
constants.merchantPanelUrl = {
	OrderList : ChatPanelUser.apiUrl + "merchant/"+ ChatPanelUser.merchantId +"/orders.json",
	OrderCsv : ChatPanelUser.apiUrl + "merchant/"+ ChatPanelUser.merchantId +"/orders.csv?",
	TrackFulfillment : ChatPanelUser.apiUrl + "merchant/"+ ChatPanelUser.merchantId+"/fulfillment/{0}/track",
	UpdateFulfillment : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/fulfillment/update/",
	AckFulfillment: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/fulfillment/ack/",
	CreateFulfillment : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/fulfillment/create/",
	CourierList:ChatPanelUser.apiUrl + "merchant/shippers",
	BulkCreateFulfillment : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/fulfillment/bulkcreate.csv",

	ProductList : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/catalog.json", //to revert merchantId 
	ProductCsv : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/catalog.csv",
	ProductCRUD: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/product/",
	GetCategory : ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/catalog/cagtegory.json", // to revert merchantID
	UpdateInventory: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/product/inventory.json",
	DeleteResource: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/product/resource/",
	UploadProductCsv: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/product.csv",
	UploadResource: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/resource",
	AssociateResource: ChatPanelUser.apiUrl + "merchant/"+ChatPanelUser.merchantId+"/product/resource.json"
}
