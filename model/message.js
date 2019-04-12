var config = require('../config');
var CMessageObj = function() {
    return {
        "Name": "car",
        "Version": "1.0",
        "Method": "调用方法",
        "Args": ["参数1", "参数2"]
    }
};




function CMessageOY(name, version, fcn, args) {
    var msg = new CMessageObj();
    msg.Name = name;
    msg.Version = version;
    msg.Method = fcn;
    msg.Args = args;
    return msg;
}



function CMessage(Name, Version, Method, Args) {
    this.Name = Name;
    this.Version = Version;
    this.Method = Method;
    this.Args = Args;
    if ('undefined' == typeof CMessage._initialized) {
        CMessage.prototype.setName = function(n) {
            this.Name = n;
        }
        CMMessage.prototype.setVersion = function(v) {
            this.Version = v;
        }
        CMessage.prototype.setMethod = function(m) {
            this.Method = m;
        }

        CMessage.prototype.setArgs = function(a) {
            this.Args = a;
        }
    }
    CMessage._initialized = true;
}




exports.CMessageOY = CMessageOY;
