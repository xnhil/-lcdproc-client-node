
var net = require('net');
var events = require("events");
var sys = require("sys");

function screen(name){
  var self = this;
  self.screen_name = name
  this.socket.write("screen_add screen\n");
  this.socket.write("screen_set screen name {screen}\n");
  this.socket.write("screen_set screen heartbeat on\n");
  this.socket.write("screen_set screen priority 2\n");
  this.socket.write("screen_set screen backlight on\n");
}
function widget(name) {
  this.socket.write("widget_add screen " + name + " string\n");
}
function widget_val(name, x, y,value) {
  this.socket.write("widget_set screen " + name + " " + x + " " + y + " {" + value +"}\n");
}
function menu_item(menu, id, type, name, options) {
	var option_string = '';
	
	for(var option in options) {
		option_string += ' -' + option + ' ' + options[option];
	}
	
	var cmd =  'menu_add_item {' + menu + '} ' + id + ' ' + type + ' {' + name + '}' + option_string + "\n";
	console.log(cmd);
	this.socket.write(cmd);
}
function menu_item_set(menu, id, options) {
	var option_string = '';
	
	for(var option in options) {
		option_string += ' -' + option + ' ' + options[option];
	}
	
	var cmd = 'menu_set_item ' + menu + ' ' + id + option_string + "\n";
	console.log(cmd);
	this.socket.write(cmd);
}
function menu_set(menu) {
	var cmd = 'menu_set_main {' + menu + '}' + "\n";
	console.log(cmd);
	this.socket.write(cmd);
}
function menu_goto(menu) {
	var cmd = 'menu_goto {' + menu + '}' + "\n";
	console.log(cmd);
	this.socket.write(cmd);
}
function client_set(name) {
	var cmd = 'client_set -name {' + name + '}' + "\n";
	console.log(cmd);
	this.socket.write(cmd);
}

function init() {
  var self = this;
  this.socket = new net.Socket();
  this.socket.connect(this.host, this.port, function() {
    this.write("hello\n");
    self.emit('init');
  });
    

  this.socket.on('data', function(d) {
//	  console.log(d);
    data_str = d.toString();
	data = data_str.split("\n");
//	  console.log(d,data_str);
	for(data_str of data) {
    params = data_str.split(' ');
    if (params[0] == 'connect')
    {
      for (i=1;i< params.length;i++)
      {
        if (params[i - 1] == 'wid')
        {
          self.width = params[i];
        }
        if (params[i - 1] == 'hgt')
        {
          self.height = params[i];
        }
      }
      self.socket.write("client_set name {NODEJS}\n");
      self.emit('ready');
	} else if (data_str.length > 0) {
//		console.log([data_str[data_str.length-1], data_str[data_str.length-2], data_str[data_str.length-3], data_str[data_str.length-4], data_str[data_str.length-5]]);
		self.emit('data', {response: params[0], raw: data_str, params: params});
	}
//		  console.log(params);
	}
  });
}

exports.LcdClient = function( p_host, p_port) {
  this.width=0;
  this.height= 0;
  this.host= p_host;
  this.port= p_port;
  this.socket= null;
  this.init= init;
  this.screen = screen;
  this.widget = widget;
  this.widget_val = widget_val;
  this.menu_item = menu_item;
  this.menu_item_set = menu_item_set;
  this.menu_set = menu_set;
  this.menu_goto = menu_goto;
  this.client_set = client_set;
};
sys.inherits(exports.LcdClient, events.EventEmitter);



