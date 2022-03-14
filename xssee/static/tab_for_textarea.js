//截获了Tab按键，其他的textarea框不进行此配置
//下面的代码就是为了实现这个功能，原理很简单，采用上一行的缩进就行
//只要在html中插入脚本调用set_tab_indent_for_textareas()函数就可以了
//注1：需要jQuery支持，如果不喜欢jQuery改成裸javascript也很方便的
//兼容firefox和IE！

/*------selection operations-------*/
function insertAtCursor(obj, txt) {
	obj.focus();
	//IE support
	if (document.selection) {
		sel = document.selection.createRange();
		sel.text = txt;
	}
	//MOZILLA/NETSCAPE support
	else {
		var startPos = obj.selectionStart;
		var scrollTop = obj.scrollTop;
		var endPos = obj.selectionEnd;
		obj.value = obj.value.substring(0, startPos) + txt + obj.value.substring(endPos, obj.value.length);
		startPos += txt.length;
		obj.setSelectionRange(startPos, startPos);
		obj.scrollTop = scrollTop;
	}
}
function getCaretPos(ctrl) {
	var caretPos = 0;
	if (document.selection) {
		// IE Support
		var range = document.selection.createRange();
		// We'll use this as a 'dummy'
		var stored_range = range.duplicate();
		// Select all text
		stored_range.moveToElementText(ctrl);
		// Now move 'dummy' end point to end point of original range
		stored_range.setEndPoint('EndToEnd', range);
		// Now we can calculate start and end points
		ctrl.selectionStart = stored_range.text.length - range.text.length;
		ctrl.selectionEnd = ctrl.selectionStart + range.text.length;
		caretPos = ctrl.selectionStart;
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		// Firefox support
		caretPos = ctrl.selectionStart;
	return (caretPos);
}

function getCurrentLineBlanks(obj) {
	var pos = getCaretPos(obj);
	var str = obj.value;
	var i = pos - 1;
	while (i >= 0) {
		if (str.charAt(i) == '\n')
			break;
		i--;
	}
	i++;
	var blanks = "";
	while (i < str.length) {
		var c = str.charAt(i);
		if (c == ' ' || c == '\t')
			blanks += c;
		else
			break;
		i++;
	}
	return blanks;
}

function set_tab_indent_for_textareas(obj) {
	/* set all the tab indent for all the text areas */
	obj.each(function() {
		$(this).keydown(function(eve) {
			if (eve.target != this) return;
			if (eve.keyCode == 13)
				last_blanks = getCurrentLineBlanks(this);
			else if (eve.keyCode == 9) {
				eve.preventDefault();
				insertAtCursor(this, "    ");
				this.returnValue = false;
			}
		}).keyup(function(eve) {
			if (eve.target == this && eve.keyCode == 13)
				insertAtCursor(this, last_blanks);
		});
	});
}
