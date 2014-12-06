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
				var sections = $.isArray(memoryConsume.section) ? memoryConsume.section : [ memoryConsume.section ];
				var pieData = [];
				$.each(sections, function(sectionIndex, section) {
					pieData.push([ 'Index ' + sectionIndex, parseInt(section.percentage) ]);
				});
				element.find('.memory-consume-section-pie[index=' + index + ']').highcharts({
					title : {
						text : 'Memory Consume'
					},
					credits : {
						enabled : false
					},
					series : [ {
						type : 'pie',
						name : 'Memory Consume',
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
			this.createSection(element, "Summary");
			element.find('.section_content').html(can.view('ejs/summary.ejs', summary));
			var manageMemory = {
				"Max Memory Consuption" : summary.mgrmemory.maxmemconsumption,
				"Allocated Succsessful Count" : summary.mgrmemory.allocatesucccount,
				"Allocated Fail Count" : summary.mgrmemory.allocatefailcount,
				"Deallocated Count" : summary.mgrmemory.deallocatecount,
				"Allocated Succsessful Size" : summary.mgrmemory.allocatesuccsize,
				"Allocated Fail Size" : summary.mgrmemory.allocatefailsize,
			};
			element.find('.manage-memory-content').html(can.view('ejs/name_value.ejs', {
				data : manageMemory
			}));
			var rawMemory = {
				"Allocated Succsessful Count" : summary.rawmemory.allocatesucccount,
				"Allocated Fail Count" : summary.rawmemory.allocatefailcount,
				"Deallocated Count" : summary.rawmemory.deallocatecount,
				"Allocated Succsessful Size" : summary.rawmemory.allocatesuccsize,
				"Allocated Fail Size" : summary.rawmemory.allocatefailsize,
			};
			element.find('.raw-memory-content').html(can.view('ejs/name_value.ejs', {
				data : rawMemory
			}));
			var successful = parseInt(parseInt(summary.mgrmemory.allocatesucccount)
					/ (parseInt(summary.mgrmemory.allocatesucccount) + parseInt(summary.mgrmemory.allocatefailcount)) * 100);
			var fail = 100 - successful;
			element.find('.summary-pie .manage-pie').highcharts({
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
			element.find('.summary-pie .raw-pie').highcharts({
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

			$('.summary .data-size-line').highcharts({
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
		$.get('data/' + fileName, function(data) {
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
