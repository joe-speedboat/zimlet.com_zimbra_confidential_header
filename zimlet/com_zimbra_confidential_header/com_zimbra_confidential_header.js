// Constructor
function com_zimbra_confidential_header_HandlerObject() {
   this.defaultSensitivity = ''; // Default sensitivity value
   this.composeViewId = ''; // ID of the current compose view
}

com_zimbra_confidential_header_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_confidential_header_HandlerObject.prototype.constructor = com_zimbra_confidential_header_HandlerObject;

com_zimbra_confidential_header_HandlerObject.prototype.toString = function() {
   return "com_zimbra_confidential_header_HandlerObject";
};

var ConfHeaderZimlet = com_zimbra_confidential_header_HandlerObject;

/**
 * Initialize the Zimlet.
 */
ConfHeaderZimlet.prototype.init = function() {
   AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this._applyRequestHeaders)});
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_confidential_header').handlerObject;
   if (!zimletInstance.sensitivity) {
      zimletInstance.sensitivity = [];
   }
};

/**
 * Apply the Sensitivity header to the mail request headers.
 */
ConfHeaderZimlet.prototype._applyRequestHeaders = function() {   
   ZmMailMsg.requestHeaders["Sensitivity"] = "Sensitivity";
};

/**
 * Handle the display of the Confidential/Sensitivity Header in the message view.
 * @param {ZmMailMsg} msg - The message object.
 * @param {ZmMailMsg} oldMsg - The previous message object.
 * @param {ZmMailMsgView} msgView - The message view object.
 */
ConfHeaderZimlet.prototype.onMsgView = function (msg, oldMsg, msgView) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_confidential_header').handlerObject;
   try {
      var infoBarDiv = document.getElementById(msgView._infoBarId);      
      if (infoBarDiv) {
         if (msg.attrs) {
            if (msg.attrs['Sensitivity']) {
               var z = document.createElement('div');
               switch (msg.attrs['Sensitivity']) {
                  case 'Personal':
                     z.innerText = zimletInstance.getMessage('ConfHeaderZimlet_Personal');
                     break;
                  case 'Private':
                     z.innerText = zimletInstance.getMessage('ConfHeaderZimlet_Private');
                     break;
                  default:
                     z.innerText = zimletInstance.getMessage('ConfHeaderZimlet_CompanyConfidential');
               }
               z.className = 'ConfHeaderZimlet-infobar';
               infoBarDiv.insertBefore(z, infoBarDiv.firstChild);
            }
         }
      }
   } catch (err) {
      console.log(err);
   }
};

/**
 * Initialize the toolbar and add the sensitivity button for compose views.
 * @param {ZmApp} app - The Zimbra application object.
 * @param {ZmToolbar} toolbar - The toolbar object.
 * @param {ZmController} controller - The controller object.
 * @param {string} viewId - The ID of the current view.
 */
ConfHeaderZimlet.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
   // Get the zimlet instance
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_confidential_header').handlerObject;

   // Disable DETACH_COMPOSE operation
   toolbar.enable(ZmOperation.DETACH_COMPOSE, false);

   // Check if the current view is a compose view
   if (viewId.indexOf("COMPOSE") >= 0) {
      // Reset sensitivity header when a new compose view is opened
      zimletInstance.composeViewId = viewId;
      zimletInstance.resetSensitivity();

      // Check if the sensitivity button is already defined
      if (toolbar.getButton('SENSITIVITY')) {
         // Button already defined, return
         return;
      }

      // Create the sensitivity options menu
      var menu = new ZmPopupMenu(toolbar);
      var menuItemNormal = menu.createMenuItem(Dwt.getNextId(), {image: "Blank_16", text: zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionNormal')});
      var menuItemConfidential = menu.createMenuItem(Dwt.getNextId(), {image: "Blank_16", text: zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionConfidential')});
      var menuItemPrivate = menu.createMenuItem(Dwt.getNextId(), {image: "Blank_16", text: zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionPrivate')});
      var menuItemPersonal = menu.createMenuItem(Dwt.getNextId(), {image: "Blank_16", text: zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionPersonal')});
      menuItemNormal.addSelectionListener(new AjxListener(this, this._selectSensitivity, ["", zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionNormal'), toolbar]));
      menuItemConfidential.addSelectionListener(new AjxListener(this, this._selectSensitivity, ["Company-Confidential", zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionConfidential'), toolbar]));
      menuItemPrivate.addSelectionListener(new AjxListener(this, this._selectSensitivity, ["Private", zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionPrivate'), toolbar]));
      menuItemPersonal.addSelectionListener(new AjxListener(this, this._selectSensitivity, ["Personal", zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionPersonal'), toolbar]));

      // Create the sensitivity button
      var buttonArgs = {
         text: zimletInstance.getMessage('ConfHeaderZimlet_sensitivityBtn'),
         index: 1,
         showImageInToolbar: false,
         showTextInToolbar: true,
         menu: menu
      };
      var button = toolbar.createOp("SENSITIVITY", buttonArgs);

      // Store button in Zimlet instance for future use
      zimletInstance.sensitivityButton = button;
   }
};

/**
 * Handle the selection of a sensitivity option.
 * @param {string} sensitivity - The selected sensitivity value.
 * @param {string} displayText - The display text of the selected option.
 * @param {ZmToolbar} toolbar - The toolbar object.
 */
ConfHeaderZimlet.prototype._selectSensitivity = function(sensitivity, displayText, toolbar) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_confidential_header').handlerObject;
   zimletInstance.sensitivity[zimletInstance.composeViewId] = sensitivity;
   // Update button text
   if (zimletInstance.sensitivityButton) {
      zimletInstance.sensitivityButton.setText(displayText);
   }
};

/**
 * Reset the sensitivity value when a compose view is closed.
 */
ConfHeaderZimlet.prototype.resetSensitivity = function() {
   var zimletInstance = this;
   var composeViewId = zimletInstance.composeViewId;
   if (zimletInstance.sensitivity && zimletInstance.sensitivity[composeViewId]) {
      zimletInstance.sensitivity[composeViewId] = zimletInstance.defaultSensitivity;
      if (zimletInstance.sensitivityButton) {
         zimletInstance.sensitivityButton.setText(zimletInstance.getMessage('ConfHeaderZimlet_sensitivityOptionNormal'));
      }
   }
};

/**
 * Add the Sensitivity header to the custom mime headers.
 * @param {array} customHeaders - The custom mime headers array.
 */
ConfHeaderZimlet.prototype.addCustomMimeHeaders = function(customHeaders) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_confidential_header').handlerObject;
   var composeViewId = zimletInstance.composeViewId;
   if (zimletInstance.sensitivity && zimletInstance.sensitivity[composeViewId]) {
      var controller = appCtxt.getCurrentController();
      var sensitivity = zimletInstance.sensitivity[composeViewId];
      switch (sensitivity) {
         case 'Personal':
            customHeaders.push({name: "Sensitivity", _content: 'Personal'});
            break;
         case 'Private':
            customHeaders.push({name: "Sensitivity", _content: 'Private'});
            break;
         case 'Company-Confidential':
            customHeaders.push({name: "Sensitivity", _content: 'Company-Confidential'});
            break;
         default:
            customHeaders.push({name: "Sensitivity", _content: 'Normal'});
      }
      zimletInstance.resetSensitivity();
   }
};

