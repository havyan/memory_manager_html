/**
 * New node file
 */
this.fn = (function(_CONTEXT, _VIEW) {
	with (_VIEW) {
		with (_CONTEXT) {
			var ___v1ew = [];
			___v1ew.push("<div class=\"name-value-panel\">\n    <table class=\"table table-hover table-striped\">\n        ");
			___v1ew.push(can.view.txt(0, 'table', 0, this, function() {
				var ___v1ew = [];
				for ( var name in this.data) {
					___v1ew.push("\n        <tr>\n            <td class='name'> ");
					___v1ew.push(can.view.txt(1, 'td', 0, this, function() {
						return name
					}));
					___v1ew.push(": </td>\n            <td class='value'> ");
					___v1ew.push(can.view.txt(1, 'td', 0, this, function() {
						return this.data[name]
					}));
					___v1ew.push(" </td>\n        </tr>\n        ");
				}
				;
				return ___v1ew.join('')
			}));
			___v1ew.push("\n    </table>\n</div>");
			;
			return ___v1ew.join('')
		}
	}
});
// # sourceURL=ejs_name_value_ejs.js
