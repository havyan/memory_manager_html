// JQuery load
(function() {
    can.Control('Components.NameValuePanel', {}, {
        init : function(element, options) {
            element.html(can.view('ejs/name_value.ejs', options));
        }
    });
})();
