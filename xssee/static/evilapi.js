(function(){
	var EA = {};
	
	EA.code = (function(){
		var Code = {};
		
		Code.encode = function(str,jinzhi,left,right,digit){
			left= left || "";
			right= right || "";
			digit= digit || 0;
			var ret = "",bu=0;
			for(i=0;i<str.length;i++){
				s = str.charCodeAt(i).toString(jinzhi);
				bu = digit-String(s).length+1;
				if(bu<1) bu=0;
				ret += left+new Array(bu).join("0")+s+right;
			}
			return ret;
		};
		Code.decode = function(str,jinzhi,for_split,for_replace){
			if(for_replace){
				var re = new RegExp(for_replace,"g");
				str = str.replace(re,'');
			}
			var arr_s = str.split(for_split);
			var ret = '';
			for(i=0;i<arr_s.length;i++){
				if(arr_s[i])
					ret += String.fromCharCode(parseInt(arr_s[i],jinzhi));
			}
			return ret;
		};
		
		//加密
		Code.str2bin = function(str,left,right,digit){
			return Code.encode(str,2,left,right,digit);
		};
		Code.str2oct = function(str,left,right,digit){
			return Code.encode(str,8,left,right,digit);
		};
		Code.str2dec = function(str,left,right,digit){
			return Code.encode(str,10,left,right,digit);
		};
		Code.str2hex = function(str,left,right,digit){
			return Code.encode(str,16,left,right,digit);
		};
		
		//解密
		Code.bin2str = function(str,for_split,for_replace){
			return Code.decode(str,2,for_split,for_replace);
		};
		Code.oct2str = function(str,for_split,for_replace){
			return Code.decode(str,8,for_split,for_replace);
		};
		Code.dec2str = function(str,for_split,for_replace){
			return Code.decode(str,10,for_split,for_replace);
		};
		Code.hex2str = function(str,for_split,for_replace){
			return Code.decode(str,16,for_split,for_replace);
		};
		//htmlencode
		Code.htmlencode = function(str){
			return str.replace(/&/g,'&amp;')
				.replace(/\"/g,'&quot;')
				.replace(/</g,'&lt;')
				.replace(/>/g,'&gt;')
				.replace(/ /g,'&nbsp;');
		};
		//htmldecode
		Code.htmldecode = function(str){
			return str.replace(/&amp;/g,'&').
				replace(/&quot;/g,'\"').
				replace(/&lt;/g,'<').
				replace(/&gt;/g,'>').
				replace(/&nbsp;/g,' ');
		};
		return Code;
	})();
	
	EA.encrypt = (function(){
		var Encrypt = {};
		
		//base64encode && base64decode
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
										  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
										  -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
										  58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
										  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
										  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
										  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
										  -1, -1);

		var base64encode = function (str){
			var out, i, len;
			var c1, c2, c3;
			len = str.length;
			i = 0;
			out = "";
			while (i < len){
				c1 = str.charCodeAt(i++) & 0xff;
				if (i == len){
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt((c1 & 0x3) << 4);
					out += "==";
					break;
				}
				c2 = str.charCodeAt(i++);
				if (i == len){
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
					out += base64EncodeChars.charAt((c2 & 0xF) << 2);
					out += "=";
					break;
				}
				c3 = str.charCodeAt(i++);
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
				out += base64EncodeChars.charAt(c3 & 0x3F);
			}
			return out;
		}

		var base64decode = function(str){
			var c1, c2, c3, c4;
			var i, len, out;
			len = str.length;
			i = 0;
			out = "";
			while (i < len){
				do{
					c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
				} while (i < len && c1 == -1);
				if (c1 == -1)
					break;
				do{
					c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
				} while (i < len && c2 == -1);
				if (c2 == -1)
					break;
				out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
				do{
					c3 = str.charCodeAt(i++) & 0xff;
					if (c3 == 61)
						return out;
					c3 = base64DecodeChars[c3];
				} while (i < len && c3 == -1);
				if (c3 == -1)
					break;
				out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
				do{
					c4 = str.charCodeAt(i++) & 0xff;
					if (c4 == 61)
						return out;
					c4 = base64DecodeChars[c4];
				} while (i < len && c4 == -1);
				if (c4 == -1)
					break;
				out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
			}
			return out;
		}

		var utf16to8 = function (str){
			var out, i, len, c;
			out = "";
			len = str.length;
			for (i = 0; i < len; i++){
				c = str.charCodeAt(i);
				if ((c >= 0x0001) && (c <= 0x007F)){
					out += str.charAt(i);
				}else if (c > 0x07FF){
					out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
					out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				}else{
					out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
					out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
				}
			}
			return out;
		}

		var utf8to16 = function (str){
			var out, i, len, c;
			var char2, char3;
			out = "";
			len = str.length;
			i = 0;
			while (i < len){
				c = str.charCodeAt(i++);
				switch (c >> 4){
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
						out += str.charAt(i - 1);
						break;
					case 12:
					case 13:
						char2 = str.charCodeAt(i++);
						out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
						break;
					case 14:
						char2 = str.charCodeAt(i++);
						char3 = str.charCodeAt(i++);
						out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6)
													   | ((char3 & 0x3F) << 0));
						break;
					}
				}
			return out;
		}
		Encrypt.base64_encode = function(str){
			return base64encode(utf16to8(str));
		};
		Encrypt.base64_decode = function(str){
			return utf8to16(base64decode(str));
		};
		//utf7_encode和utf7_decode攫取和更改至hackvector
		//http://hackvertor.co.uk/public
		var tocharcodes = function(code,params){
			if(params[0] == "''") {
				var splitChar = "";
			} else {
				var splitChar = new RegExp(params[0],'g');
			}
			if(params[1] == "','") {
				var joinChar = ',';                
			} else {
				var joinChar = params[1];                
			}
			code = code.split(splitChar);
			for(var i=0;i<code.length;i++) {
				code[i] = code[i].charCodeAt();
			}
			code.join(joinChar);
			return code.toString();
		}
		var zerofill = function(code,params){
			len=parseInt(params[0]);
			if(len > 10000 || len < 0) {
				len = 0;
			}
			code = code + '';
			while(len > code.length) {
				code = '0' + code;
			}
			return code;
		}
		var repeat = function(code,params){
			return Array(parseInt(params[0])+1).join(code);
		}
		Encrypt.utf7_encode = function(str,chars) {
			var outputstring = str.replace(/\+/g,'+-');
			return outputstring.replace(new RegExp('([^'+chars+']+)','g'), function($1) {
				var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				var tmp_codes1 = tocharcodes($1,Array('',','));
				var codes = tmp_codes1.split(',');
				code = '';
				var len = codes.length;
				for(var i=0; i<len;i++) {
					var strchar = parseInt(codes[i]);
					var tmp_codes2 = zerofill(strchar.toString(2),[16]);
					code += tmp_codes2;                    
				}
				var sixBits = [];
				for(var i=0;i<code.length;i+=6) {
					sixBits.push(code.substr(i, 6));
				}                
				if(sixBits[sixBits.length-1].length < 6) {
					var tmp_codes3 = repeat('0',[6-sixBits[sixBits.length-1].length]);
					sixBits[sixBits.length-1] = sixBits[sixBits.length-1] + tmp_codes3; 
				}   
				base64chars = base64chars.split('');
				for(var i = 0;i<sixBits.length;i++) {
					sixBits[i] = base64chars[parseInt(sixBits[i],2)];
				}    
				return '+' + sixBits.join('') + '-';        
			});     
		}
		Encrypt.utf7_decode = function(str) {    
			return str.replace(/(\+[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/]+-)/g, function($1) {
				var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				var sixBits = [];
				var code = $1;
				var decoded = '';
				code = code.replace(/^\+|-$/g, '').split("");
				for(var i=0; i<code.length;i++) {
					var tmp_codes1 = base64chars.indexOf(code[i]).toString(2);
					decoded += zerofill(tmp_codes1,[6]);
				}
				var sixteenBits = Array();
				for(var i=0;i<decoded.length;i+=16) {
					sixteenBits.push(decoded.substr(i,16));
				}
				decoded = '';
				for(var i=0;i<sixteenBits.length;i++) {
					strchar = sixteenBits[i];
					if(strchar.length < 16) {
						if(strchar.length > 4 || strchar.match(/[^0]/) ) {
							return 'Invalid UTF-7';
						}
					} else {
						decoded += String.fromCharCode(parseInt(strchar,2));
					}
				}
				return decoded;
			});
		}
		
		Encrypt.exescape = function(str){
			//escape加强加密
			var _a,_b;var _c="";
			for(var i=0;i<str.length;i++){
				_a=str.charCodeAt(i);
				_b=_a<256?"%":"%u";//u不可以大写
				_b=_a<16?"%0":_b;
				_c+=_b+_a.toString(16).toUpperCase();//大小写皆可.toLowerCase()
			}
			return _c;
		}
		
		/*
			本编码来自于http://utf-8.jp/public/jjencode.html
			版权归Yosuke HASEGAWA所有。
		*/
		Encrypt.jjencode = function(str){
			var jjencode = function( gv, text ){
				var r="";
				var n;
				var t;
				var b=[ "___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$", ];
				var s = "";
				for( var i = 0; i < text.length; i++ ){
					n = text.charCodeAt( i );
					if( n == 0x22 || n == 0x5c ){
						s += "\\\\\\" + text.charAt( i ).toString(16);
					}else if( (0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ){
						s += text.charAt( i );
					}else if( (0x30 <= n && n <= 0x39 ) || (0x61 <= n && n <= 0x66 ) ){
						if( s ) r += "\"" + s +"\"+";
						r += gv + "." + b[ n < 0x40 ? n - 0x30 : n - 0x57 ] + "+";
						s="";
					}else if( n == 0x6c ){ // 'l'
						if( s ) r += "\"" + s + "\"+";
						r += "(![]+\"\")[" + gv + "._$_]+";
						s = "";
					}else if( n == 0x6f ){ // 'o'
						if( s ) r += "\"" + s + "\"+";
						r += gv + "._$+";
						s = "";
					}else if( n == 0x74 ){ // 'u'
						if( s ) r += "\"" + s + "\"+";
						r += gv + ".__+";
						s = "";
					}else if( n == 0x75 ){ // 'u'
						if( s ) r += "\"" + s + "\"+";
						r += gv + "._+";
						s = "";
					}else if( n < 128 ){
						if( s ) r += "\"" + s;
						else r += "\"";
						r += "\\\\\"+" + n.toString( 8 ).replace( /[0-7]/g, function(c){ return gv + "."+b[ c ]+"+" } );
						s = "";
					}else{
						if( s ) r += "\"" + s;
						else r += "\"";
						r += "\\\\\"+" + gv + "._+" + n.toString(16).replace( /[0-9a-f]/gi, function(c){ return gv + "."+b[parseInt(c,16)]+"+"} );
						s = "";
					}
				}
				if( s ){r += "\"" + s + "\"+";}

				r = 
				gv + "=~[];" + 
				gv + "={___:++" + gv +",$$$$:(![]+\"\")["+gv+"],__$:++"+gv+",$_$_:(![]+\"\")["+gv+"],_$_:++"+
				gv+",$_$$:({}+\"\")["+gv+"],$$_$:("+gv+"["+gv+"]+\"\")["+gv+"],_$$:++"+gv+",$$$_:(!\"\"+\"\")["+
				gv+"],$__:++"+gv+",$_$:++"+gv+",$$__:({}+\"\")["+gv+"],$$_:++"+gv+",$$$:++"+gv+",$___:++"+gv+",$__$:++"+gv+"};"+
				gv+".$_="+
				"("+gv+".$_="+gv+"+\"\")["+gv+".$_$]+"+
				"("+gv+"._$="+gv+".$_["+gv+".__$])+"+
				"("+gv+".$$=("+gv+".$+\"\")["+gv+".__$])+"+
				"((!"+gv+")+\"\")["+gv+"._$$]+"+
				"("+gv+".__="+gv+".$_["+gv+".$$_])+"+
				"("+gv+".$=(!\"\"+\"\")["+gv+".__$])+"+
				"("+gv+"._=(!\"\"+\"\")["+gv+"._$_])+"+
				gv+".$_["+gv+".$_$]+"+
				gv+".__+"+
				gv+"._$+"+
				gv+".$;"+
				gv+".$$="+
				gv+".$+"+
				"(!\"\"+\"\")["+gv+"._$$]+"+
				gv+".__+"+
				gv+"._+"+
				gv+".$+"+
				gv+".$$;"+
				gv+".$=("+gv+".___)["+gv+".$_]["+gv+".$_];"+
				gv+".$("+gv+".$("+gv+".$$+\"\\\"\"+" + r + "\"\\\"\")())();";
				
				return r;
			}
			return jjencode("$",str);
		};
		
		Encrypt.jjdecode = function(str, key){
			if(!key) key = "$";
			var ret_str = "";
			var jjdecode = function(str){ ret_str = str; };
			
			var tmp_str = str.replace(key+"."+key+"("+key+"."+key+"("
										,"jjdecode("+key+"."+key+"(")
							.replace("())()","())");
			tmp_str = tmp_str.replace(/\$/g,"xxyy");
			tmp_str = "(function(){"+tmp_str+"})();";
			eval(tmp_str);
			
			return ret_str;
		}
		
		return Encrypt;
	})();
	
	EA.hash = (function(){
		var Hash = {};
		
		Hash.md5 = (function(){
			/*
			 * Crypto-JS v2.3.0
			 * http://code.google.com/p/crypto-js/
			 * Copyright (c) 2011, Jeff Mott. All rights reserved.
			 * http://code.google.com/p/crypto-js/wiki/License
			 */
			if(typeof Crypto=="undefined"||!Crypto.util)(function(){var n=window.Crypto={},o=n.util={rotl:function(g,i){return g<<i|g>>>32-i},rotr:function(g,i){return g<<32-i|g>>>i},endian:function(g){if(g.constructor==Number)return o.rotl(g,8)&16711935|o.rotl(g,24)&4278255360;for(var i=0;i<g.length;i++)g[i]=o.endian(g[i]);return g},randomBytes:function(g){for(var i=[];g>0;g--)i.push(Math.floor(Math.random()*256));return i},bytesToWords:function(g){for(var i=[],h=0,a=0;h<g.length;h++,a+=8)i[a>>>5]|=g[h]<<24-
			a%32;return i},wordsToBytes:function(g){for(var i=[],h=0;h<g.length*32;h+=8)i.push(g[h>>>5]>>>24-h%32&255);return i},bytesToHex:function(g){for(var i=[],h=0;h<g.length;h++){i.push((g[h]>>>4).toString(16));i.push((g[h]&15).toString(16))}return i.join("")},hexToBytes:function(g){for(var i=[],h=0;h<g.length;h+=2)i.push(parseInt(g.substr(h,2),16));return i},bytesToBase64:function(g){if(typeof btoa=="function")return btoa(p.bytesToString(g));for(var i=[],h=0;h<g.length;h+=3)for(var a=g[h]<<16|g[h+1]<<
			8|g[h+2],b=0;b<4;b++)h*8+b*6<=g.length*8?i.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>6*(3-b)&63)):i.push("=");return i.join("")},base64ToBytes:function(g){if(typeof atob=="function")return p.stringToBytes(atob(g));g=g.replace(/[^A-Z0-9+\/]/ig,"");for(var i=[],h=0,a=0;h<g.length;a=++h%4)a!=0&&i.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(g.charAt(h-1))&Math.pow(2,-2*a+8)-1)<<a*2|"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(g.charAt(h))>>>
			6-a*2);return i}};n=n.charenc={};n.UTF8={stringToBytes:function(g){return p.stringToBytes(unescape(encodeURIComponent(g)))},bytesToString:function(g){return decodeURIComponent(escape(p.bytesToString(g)))}};var p=n.Binary={stringToBytes:function(g){for(var i=[],h=0;h<g.length;h++)i.push(g.charCodeAt(h)&255);return i},bytesToString:function(g){for(var i=[],h=0;h<g.length;h++)i.push(String.fromCharCode(g[h]));return i.join("")}}})();
			(function(){var n=Crypto,o=n.util,p=n.charenc,g=p.UTF8,i=p.Binary,h=n.MD5=function(a,b){var j=o.wordsToBytes(h._md5(a));return b&&b.asBytes?j:b&&b.asString?i.bytesToString(j):o.bytesToHex(j)};h._md5=function(a){if(a.constructor==String)a=g.stringToBytes(a);var b=o.bytesToWords(a),j=a.length*8;a=1732584193;for(var d=-271733879,e=-1732584194,c=271733878,f=0;f<b.length;f++)b[f]=(b[f]<<8|b[f]>>>24)&16711935|(b[f]<<24|b[f]>>>8)&4278255360;b[j>>>5]|=128<<j%32;b[(j+64>>>9<<4)+14]=j;j=h._ff;var k=h._gg,l=
			h._hh,m=h._ii;for(f=0;f<b.length;f+=16){var q=a,r=d,s=e,t=c;a=j(a,d,e,c,b[f+0],7,-680876936);c=j(c,a,d,e,b[f+1],12,-389564586);e=j(e,c,a,d,b[f+2],17,606105819);d=j(d,e,c,a,b[f+3],22,-1044525330);a=j(a,d,e,c,b[f+4],7,-176418897);c=j(c,a,d,e,b[f+5],12,1200080426);e=j(e,c,a,d,b[f+6],17,-1473231341);d=j(d,e,c,a,b[f+7],22,-45705983);a=j(a,d,e,c,b[f+8],7,1770035416);c=j(c,a,d,e,b[f+9],12,-1958414417);e=j(e,c,a,d,b[f+10],17,-42063);d=j(d,e,c,a,b[f+11],22,-1990404162);a=j(a,d,e,c,b[f+12],7,1804603682);c=
			j(c,a,d,e,b[f+13],12,-40341101);e=j(e,c,a,d,b[f+14],17,-1502002290);d=j(d,e,c,a,b[f+15],22,1236535329);a=k(a,d,e,c,b[f+1],5,-165796510);c=k(c,a,d,e,b[f+6],9,-1069501632);e=k(e,c,a,d,b[f+11],14,643717713);d=k(d,e,c,a,b[f+0],20,-373897302);a=k(a,d,e,c,b[f+5],5,-701558691);c=k(c,a,d,e,b[f+10],9,38016083);e=k(e,c,a,d,b[f+15],14,-660478335);d=k(d,e,c,a,b[f+4],20,-405537848);a=k(a,d,e,c,b[f+9],5,568446438);c=k(c,a,d,e,b[f+14],9,-1019803690);e=k(e,c,a,d,b[f+3],14,-187363961);d=k(d,e,c,a,b[f+8],20,1163531501);
			a=k(a,d,e,c,b[f+13],5,-1444681467);c=k(c,a,d,e,b[f+2],9,-51403784);e=k(e,c,a,d,b[f+7],14,1735328473);d=k(d,e,c,a,b[f+12],20,-1926607734);a=l(a,d,e,c,b[f+5],4,-378558);c=l(c,a,d,e,b[f+8],11,-2022574463);e=l(e,c,a,d,b[f+11],16,1839030562);d=l(d,e,c,a,b[f+14],23,-35309556);a=l(a,d,e,c,b[f+1],4,-1530992060);c=l(c,a,d,e,b[f+4],11,1272893353);e=l(e,c,a,d,b[f+7],16,-155497632);d=l(d,e,c,a,b[f+10],23,-1094730640);a=l(a,d,e,c,b[f+13],4,681279174);c=l(c,a,d,e,b[f+0],11,-358537222);e=l(e,c,a,d,b[f+3],16,-722521979);
			d=l(d,e,c,a,b[f+6],23,76029189);a=l(a,d,e,c,b[f+9],4,-640364487);c=l(c,a,d,e,b[f+12],11,-421815835);e=l(e,c,a,d,b[f+15],16,530742520);d=l(d,e,c,a,b[f+2],23,-995338651);a=m(a,d,e,c,b[f+0],6,-198630844);c=m(c,a,d,e,b[f+7],10,1126891415);e=m(e,c,a,d,b[f+14],15,-1416354905);d=m(d,e,c,a,b[f+5],21,-57434055);a=m(a,d,e,c,b[f+12],6,1700485571);c=m(c,a,d,e,b[f+3],10,-1894986606);e=m(e,c,a,d,b[f+10],15,-1051523);d=m(d,e,c,a,b[f+1],21,-2054922799);a=m(a,d,e,c,b[f+8],6,1873313359);c=m(c,a,d,e,b[f+15],10,-30611744);
			e=m(e,c,a,d,b[f+6],15,-1560198380);d=m(d,e,c,a,b[f+13],21,1309151649);a=m(a,d,e,c,b[f+4],6,-145523070);c=m(c,a,d,e,b[f+11],10,-1120210379);e=m(e,c,a,d,b[f+2],15,718787259);d=m(d,e,c,a,b[f+9],21,-343485551);a=a+q>>>0;d=d+r>>>0;e=e+s>>>0;c=c+t>>>0}return o.endian([a,d,e,c])};h._ff=function(a,b,j,d,e,c,f){a=a+(b&j|~b&d)+(e>>>0)+f;return(a<<c|a>>>32-c)+b};h._gg=function(a,b,j,d,e,c,f){a=a+(b&d|j&~d)+(e>>>0)+f;return(a<<c|a>>>32-c)+b};h._hh=function(a,b,j,d,e,c,f){a=a+(b^j^d)+(e>>>0)+f;return(a<<c|a>>>
			32-c)+b};h._ii=function(a,b,j,d,e,c,f){a=a+(j^(b|~d))+(e>>>0)+f;return(a<<c|a>>>32-c)+b};h._blocksize=16;h._digestsize=16})();
			return Crypto.MD5;
		})();
		
		Hash.sha1 = (function(){
			/*
			 * Crypto-JS v2.3.0
			 * http://code.google.com/p/crypto-js/
			 * Copyright (c) 2011, Jeff Mott. All rights reserved.
			 * http://code.google.com/p/crypto-js/wiki/License
			 */
			if(typeof Crypto=="undefined"||!Crypto.util)(function(){var k=window.Crypto={},l=k.util={rotl:function(a,c){return a<<c|a>>>32-c},rotr:function(a,c){return a<<32-c|a>>>c},endian:function(a){if(a.constructor==Number)return l.rotl(a,8)&16711935|l.rotl(a,24)&4278255360;for(var c=0;c<a.length;c++)a[c]=l.endian(a[c]);return a},randomBytes:function(a){for(var c=[];a>0;a--)c.push(Math.floor(Math.random()*256));return c},bytesToWords:function(a){for(var c=[],b=0,d=0;b<a.length;b++,d+=8)c[d>>>5]|=a[b]<<24-
			d%32;return c},wordsToBytes:function(a){for(var c=[],b=0;b<a.length*32;b+=8)c.push(a[b>>>5]>>>24-b%32&255);return c},bytesToHex:function(a){for(var c=[],b=0;b<a.length;b++){c.push((a[b]>>>4).toString(16));c.push((a[b]&15).toString(16))}return c.join("")},hexToBytes:function(a){for(var c=[],b=0;b<a.length;b+=2)c.push(parseInt(a.substr(b,2),16));return c},bytesToBase64:function(a){if(typeof btoa=="function")return btoa(m.bytesToString(a));for(var c=[],b=0;b<a.length;b+=3)for(var d=a[b]<<16|a[b+1]<<
			8|a[b+2],e=0;e<4;e++)b*8+e*6<=a.length*8?c.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d>>>6*(3-e)&63)):c.push("=");return c.join("")},base64ToBytes:function(a){if(typeof atob=="function")return m.stringToBytes(atob(a));a=a.replace(/[^A-Z0-9+\/]/ig,"");for(var c=[],b=0,d=0;b<a.length;d=++b%4)d!=0&&c.push(("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b-1))&Math.pow(2,-2*d+8)-1)<<d*2|"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(b))>>>
			6-d*2);return c}};k=k.charenc={};k.UTF8={stringToBytes:function(a){return m.stringToBytes(unescape(encodeURIComponent(a)))},bytesToString:function(a){return decodeURIComponent(escape(m.bytesToString(a)))}};var m=k.Binary={stringToBytes:function(a){for(var c=[],b=0;b<a.length;b++)c.push(a.charCodeAt(b)&255);return c},bytesToString:function(a){for(var c=[],b=0;b<a.length;b++)c.push(String.fromCharCode(a[b]));return c.join("")}}})();
			(function(){var k=Crypto,l=k.util,m=k.charenc,a=m.UTF8,c=m.Binary,b=k.SHA1=function(d,e){var g=l.wordsToBytes(b._sha1(d));return e&&e.asBytes?g:e&&e.asString?c.bytesToString(g):l.bytesToHex(g)};b._sha1=function(d){if(d.constructor==String)d=a.stringToBytes(d);var e=l.bytesToWords(d),g=d.length*8;d=[];var n=1732584193,h=-271733879,i=-1732584194,j=271733878,o=-1009589776;e[g>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+15]=g;for(g=0;g<e.length;g+=16){for(var q=n,r=h,s=i,t=j,u=o,f=0;f<80;f++){if(f<16)d[f]=e[g+
			f];else{var p=d[f-3]^d[f-8]^d[f-14]^d[f-16];d[f]=p<<1|p>>>31}p=(n<<5|n>>>27)+o+(d[f]>>>0)+(f<20?(h&i|~h&j)+1518500249:f<40?(h^i^j)+1859775393:f<60?(h&i|h&j|i&j)-1894007588:(h^i^j)-899497514);o=j;j=i;i=h<<30|h>>>2;h=n;n=p}n+=q;h+=r;i+=s;j+=t;o+=u}return[n,h,i,j,o]};b._blocksize=16;b._digestsize=20})();
			return Crypto.SHA1;
		})();
		
		return Hash;
	})();
	
	EA.string = (function(){
		var Str = {};
		//小写转大写
		Str.upper = function(str,stepBy){
			if(typeof(stepBy) == "number"){
				var len = str.length;
				var stepN = 0;
				var newstr = "";
				for(var i=0; i<len; i++){
					if(stepN == 0) newstr += str.charAt(i).toUpperCase();
					else newstr += str.charAt(i);
					if(stepN < stepBy) stepN++;
					else stepN = 0;
				}
				return newstr;
			}
			return str.toUpperCase();
		};
		//大写转小写
		Str.lower = function(str,stepBy){
			if(typeof(stepBy) == "number"){
				var len = str.length;
				var stepN = 0;
				var newstr = "";
				for(var i=0; i<len; i++){
					if(stepN == 0) newstr += str.charAt(i).toLowerCase();
					else newstr += str.charAt(i);
					if(stepN < stepBy) stepN++;
					else stepN = 0;
				}
				return newstr;
			}
			return str.toLowerCase();
		};
		//全角转半角
		Str.banjiao = function(str,stepBy){
			if(typeof(stepBy) != "number") stepBy = 0;
			
			var len = str.length;
			var stepN = 0;
			var newstr = "";
			var _a = "";
			for(var i=0; i<len; i++){
				if(stepN == 0){
					//转换
					_a = str.charCodeAt(i);
					_a = (_a>0xff00 && _a<0xff5f) ? _a-0xfee0 : _a;
					_a = (_a==0x3000) ? 0x20 : _a;
					newstr += String.fromCharCode(_a);
				}else newstr += str.charAt(i);
				
				if(stepN < stepBy) stepN++;
				else stepN = 0;
			}
			return newstr;	
		};
		//半角转全角
		Str.quanjiao = function(str,stepBy){
			if(typeof(stepBy) != "number") stepBy = 0;
			
			var len = str.length;
			var stepN = 0;
			var newstr = "";
			var _a = "";
			for(var i=0; i<len; i++){
				if(stepN == 0){
					//转换
					_a = str.charCodeAt(i);
					_a = (_a>0x20 && _a<0x7f) ? _a+0xfee0 : _a;
					_a = (_a==0x20) ? 0x3000 : _a;
					newstr += String.fromCharCode(_a);
				}else newstr += str.charAt(i);
				
				if(stepN < stepBy) stepN++;
				else stepN = 0;
			}
			return newstr;	
		};
		//left
		Str.left = function(str,len){
			return str.substr(0,len);
		};
		//right
		Str.right = function(str,len){
			return str.substr(str.length-len,len);
		};
		//trim
		Str.trim = function(str){
			return str.replace(/^[\s]+/,"").replace(/[\s]+$/,"");
		};
		//trimline
		Str.trimline = function(str){
			var arr = str.split(/[\r\n]+/g);
			var newstr = "";
			for(var i in arr){
				newstr += Str.trim(arr[i]) + "\r\n";
			}
			return newstr;
		};
		//统计字符数
		Str.wlen = function(str){
			var len = str.length;
			var arr = str.match(/[^\x00-\x80]/ig);
			if(arr!=null) len += arr.length;
			return len;
		};
		//去除空格和tab，以及回车
		Str.nospace = function(str, doEnter){
			if(typeof(doEnter)=="boolean")
				if(doEnter) return str.replace(/\s/g,'');
			return str.replace(/[\x09\x20]+/g,'');
		};
		//合并多个tab、空格到一个
		Str.spaceannex = function(str){
			return str.replace(/[\x20\x09]+/g,' ');
		};
		//去除回车
		Str.noenter = function(str){
			return str.replace(/[\r\n]+/g,' ');
		};
		//回车修复
		Str.fixenter = function(str){
			return str.replace(/[\r\n]+/g,"\r\n");
		};
		//添加数据到每一行
		Str.addtoline = function(str,lstr,rstr){
			if(typeof(lstr)!="string") lstr = "";
			if(typeof(rstr)!="string") rstr = "";
			str = str.replace(/[\r\n]/g,rstr+"\r\n"+lstr);
			return str.substring(rstr.length, str.length - lstr.length);
		};
		//从每一行减去
		Str.subfromline = function(str,lstr,rstr){
			if(typeof(lstr)!="string") lstr = "";
			if(typeof(rstr)!="string") rstr = "";
			var arr = str.split("\n");
			var newstr = "";
			var llen = lstr.length;
			var rlen = rstr.length;
			for(var i in arr){
				arr[i] = arr[i].replace("\r","");
				newstr += arr[i].substring(llen, arr[i].length - rlen) + "\r\n";
			}
			return newstr;
		};
		//replace
		Str.replace = function(str,ori,tar,diff){
			var re = new RegExp(ori,"g");
			if(diff==true) re = new RegExp(ori,"gi");
			return str.replace(re,tar);
		};
		
		Str.addslashes = function(str){
			str = str.replace(/\\/g,"\\\\").replace(/\"/g,"\\\"").replace(/\'/g,"\\\'");
			return str;
		}
		
		Str.stripslashes = function(str){
			str = str.replace(/\\\\/g,"\\").replace(/\\\"/g,"\"").replace(/\\\'/g,"\'");
			return str;
		}
		
		return Str;
	})();
	
	
	
	return (window.EA = EA);
})();
