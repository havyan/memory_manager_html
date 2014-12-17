// JQuery load
(function() {
	can.Control('MainPanel', {}, {
		init : function(element, options) {
			this.initHeader(element.find('.header'), options.data);
			this.initSummary(element.find('.summary'), options.data.summary);
			this.initBoundaryCheck(element.find('.boundary-check'), options.data.boundarycheck);
			this.initError(element.find('.error'), options.data.errptr);
			this.initMemoryLeak(element.find('.memory-leak'), options.data.memleak);
			this.initMemoryConsume(element.find('.memory-consume'), options.data.memconsume);
			// options.data.errptr, "Memory Consume");
			this.initEvents();
		},

		initEvents : function() {
			$('.hide_button').click(function(e) {
				var $e = $(e.currentTarget);
				var isHide = $e.hasClass("section_hide");
				var refElement = $($e.parent().parent()).children('.section_content');
				if (!isHide) {
					refElement.hide();
				} else {
					refElement.show();
				}
				$e.toggleClass("section_hide");
			});
		},

		initMemoryLeak : function(element, data) {
			this.createSection(element, "Memory Leaks");
			element.find('.section_content').html(can.view('ejs/memory_leak.ejs', data));
		},

		initMemoryConsume : function(element, data) {
			this.createSection(element, "Memory Consumes");
			element.find('.section_content').html(can.view('ejs/memory_consume.ejs', data));
			var memoryConsumes = $.isArray(data) ? data : [ data ];
			$.each(memoryConsumes, function(index, memoryConsume) {
				var total = memoryConsume.total;
				var sections = $.isArray(total.section) ? total.section : [ total.section ];
				var pieData = [];
				$.each(sections, function(sectionIndex, section) {
					pieData.push([ 'Index ' + sectionIndex, parseInt(section.percentage) ]);
				});
				element.find('.memory-consume-section-total-pie[index=' + index + ']').highcharts({
					title : {
						text : 'Memory Consume Total'
					},
					credits : {
						enabled : false
					},
					series : [ {
						type : 'pie',
						name : 'Memory Consume Total',
						data : pieData
					} ]
				});
				var count = memoryConsume.count;
				var sections = $.isArray(count.section) ? count.section : [ count.section ];
				var pieData = [];
				$.each(sections, function(sectionIndex, section) {
					pieData.push([ 'Index ' + sectionIndex, parseInt(section.percentage) ]);
				});
				element.find('.memory-consume-section-count-pie[index=' + index + ']').highcharts({
					title : {
						text : 'Memory Consume Count'
					},
					credits : {
						enabled : false
					},
					series : [ {
						type : 'pie',
						name : 'Memory Consume Count',
						data : pieData
					} ]
				});
			});
		},

		initBoundaryCheck : function(element, data) {
			this.createSection(element, "Boundary Checks");
			element.find('.section_content').html(can.view('ejs/boundary_check.ejs', data));
		},

		initError : function(element, data) {
			this.createSection(element, "Errors");
			element.find('.section_content').html(can.view('ejs/errptr.ejs', data));
		},

		initHeader : function(element, data) {
			this.createSection(element, "Header");
			var header = {
				"Date Time" : data.datetime,
				"Version" : data.ver,
				"Debug" : data.debug,
				"Execute File Name" : data.exefilename,
				"Execute directory" : data.exedir,
				"Init Result" : data.initresult
			};
			element.find('.section_content').html(can.view('ejs/name_value.ejs', {
				data : header
			}));
		},

		initSummary : function(element, summary) {
			this.createSection(element, "Summarys");
			element.find('.section_content').html(can.view('ejs/summary.ejs', summary));
			var summarys=$.isArray(summary)?summary: [summary];
			$.each(summarys, function(index, summary) {
				var successful = parseInt(parseInt(summary.mgrmemory.allocatesucccount)
						/ (parseInt(summary.mgrmemory.allocatesucccount) + parseInt(summary.mgrmemory.allocatefailcount)) * 100);
				var fail = 100 - successful;
				element.find('.summary-pie[index=' + index +'] .manage-pie').highcharts({
					title : {
						text : 'Allocated Count'
					},
					credits : {
						enabled : false
					},
					series : [ {
						type : 'pie',
						name : 'Allocated Count',
						data : [ [ 'Succsessful', successful ], [ 'Fail', fail ] ]
					} ]
				});
	
				successful = parseInt(parseInt(summary.rawmemory.allocatesucccount)
						/ (parseInt(summary.rawmemory.allocatesucccount) + parseInt(summary.rawmemory.allocatefailcount)) * 100);
				fail = 100 - successful;
				element.find('.summary-pie[index=' + index +'] .raw-pie').highcharts({
					title : {
						text : 'Raw Count'
					},
					plotOptions : {
						pie : {
							colors : [ '#4D740F', '#D31F30' ]
						}
					},
					credits : {
						enabled : false
					},
					series : [ {
						type : 'pie',
						name : 'Raw Count',
						data : [ [ 'Succsessful', successful ], [ 'Fail', fail ] ]
					} ]
				});
	
				var dataSizeData = [], maxUsedBlocksSize = [], maxUsedBlocksCount = [];
				$.each(summary.pool, function(index, e) {
					dataSizeData.push([ parseInt(e.index), parseInt(e.datasize) ]);
					maxUsedBlocksSize.push([ parseInt(e.index), parseInt(e.maxusedblkssize) ]);
					maxUsedBlocksCount.push([ parseInt(e.index), parseInt(e.maxusedblkscount) ]);
				});
	
				$('.summary .data-size-line[index=' + index + ']').highcharts({
					chart : {
						type : 'line'
					},
					title : {
						text : 'Data Size Line',
					},
					yAxis : {
						title : {
							text : 'Data Size'
						}
					},
					credits : {
						enabled : false
					},
					plotOptions : {
						line : {
							marker : {
								enabled : false
							}
						}
					},
					series : [ {
						name : 'Data Size',
						data : dataSizeData
					}, {
						name : 'Max Used Blocks Count',
						data : maxUsedBlocksCount
					}, {
						name : 'Max Used Blocks Size',
						data : maxUsedBlocksSize
					} ]
				});
			});
		},

		createSection : function(element, title, level) {
			element.html(can.view('ejs/collapsed_section.ejs', {
				title : title,
				level : level ? level : 1
			}));
		}
	});

	var openFile = function() {
		var fileName = $('.file-name').val();
		$.get('data/' + fileName + '?' + Date.now(), function(data) {
			var json = $.xml2json(data);
			var main = $('.main').empty().html(can.view('ejs/main.ejs'));
			new MainPanel(main, {
				data : json.exmemmgr
			});
		});
	};
	$(document).ready(function() {
		openFile();
		$('.open-file').click(function() {
			openFile();
		});
	});
})();
