"use strict";

var constants = constants || {};

constants.common = {
	LeftNav_EL_ID : "#leftNav",
	Header_EL_ID : "#headerBar",
	TabContent_EL_ID : "#tabContent",
	MerchantTab : '#merchant',
	CatalogTab : '#catalogue',
	StorefrontTab : '#storefront',
	PromocodeTab : '#promocode',
	BargainChatTab : '#bargainChat',
	BargainAgentTab : '#bargain',
	ReportTab : "#reports",
	OrderTab: '#orders',
	PaymentTab : "#payments",
	SelectedClass : 'selectedClass'
};

constants.promocode = {
	PromoGrid_Template : '#promocode-template',
	PromoRow_Template : '#promocodeRow-template',
	Promocode_TBL : '#promocodeTable'
};

constants.storefront ={
	StorefrontId : 5165,
	Storefront_Tabs : "#storefront-template",
	Storefront_Tabs_AppView : "#appViewTab",
	Storefront_Tabs_Lists : "#listsTab",
	Storefront_Tabs_Category: "#categoriesTab",
	Storefront_Tabs_GlobalSetting : "#globalSettingsTab",
	AppView_NonRowTemplate : "#appViewNonRow-template",
	AppView_RowTemplate : "#appViewRow-template",
};

constants.catalog = {
	ProductGrid_TBL : "#productTable",
	ProductRow_Template : "#productRow-template",
	SKU_TAB: '#skusTab',
	GROUP_TAB: '#groupsTab'
},

constants.bargainAgent = {
	Grid_Template : "#bargainAgent-template",
	GridRow_Template : "#agentRow-template"
},

constants.paymentTab = {
	PaymentSummary_Template : "#paymentSummary-template" 
}