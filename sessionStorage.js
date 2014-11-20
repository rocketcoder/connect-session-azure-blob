//Implimented from https://github.com/expressjs/session
//                 https://github.com/tj/connect-redis

//TODO : needs to chache the get and throttle the set

var azure = require("azure-storage");

function azureSessionStoreFactory(session) {
    var Store = session.Store;
    function AzureSessionStore(options) {
        this.config = options;
        this.blobService = azure.createBlobService(options.storageAccountKey);
        options = options || {};
        Store.call(this, options);
    }
    AzureSessionStore.prototype.__proto__ = Store.prototype
    
    var azureSessionPrototype = AzureSessionStore.prototype;
    azureSessionPrototype.get = function (sid, callback) {
        var self = this;
        self.blobService.getBlobToText('websessions', sid, function (err, result) {
            if (err) {
                callback(err, null);
            } 
            else {
                callback(null, JSON.parse(result));
            }
        });
    }
    
    azureSessionPrototype.set = function (sid, session, callback) {
       var self = this;
        self.blobService.createBlockBlobFromText('websessions', sid, JSON.stringify(session), function (err, results) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, session);
            }
        });
    }
    
    azureSessionPrototype.destroy = function (sid, callback) {
        var self = this;
        self.blobService.deleteBlobIfExists('websessions', sid , function (err) {
            if (err) {
                callbak(err, null);
            }
            else {
                callbak();
            }
        });
    }
    
    return AzureSessionStore;
}

module.exports = azureSessionStoreFactory;