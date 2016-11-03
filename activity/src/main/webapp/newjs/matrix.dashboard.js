$(document).ready(function(){
	// === Prepare peity charts === //
	maruti.peity();	
	// === Prepare the chart data ===/
	var sin = [], cos = [];
	  $.ajax({
          type:"GET",
          dataType:"json",
          url:"survey/income?format=jsonp&cb=?",
          success:function(data) {
                 if(data.resultCode == '0') {
                      var object=data.object;
                      var income="";
                      var cap_income="";
                      var year="";
                      var maxyear=0;
                      var ticketyear=[];
                      var i=0;
                      $.each(object, function(t, arraydata){
 
                    	  sin.push([arraydata.income_year, arraydata.income]); //第二个参数是显示的数据
                          cos.push([arraydata.income_year, arraydata.cap_income]);	
                          income=arraydata.income;
                          cap_income=arraydata.cap_income;
                          year=arraydata.income_year;
                          ticketyear.push([year, year+"年"]);
						});
                      $("#income").html(income);
                      $("#cap_income").html(cap_income);
                      $("#year1").html(year+"年");
                      $("#year2").html(year+"年");
                      maxyear=parseInt(year)+1;
                      
                  	// === Make chart === //
                      var plot = $.plot($(".chart"),
                             [{ data: sin, label: "应收", color: "#ee7951"}, { data: cos, label: "实收",color: "#4fb9f0" } ], {
                                 series: {
                                     lines: { show: true },
                                     points: { show: true }
                                 },
                                 grid: { hoverable: true, clickable: true },
                                 xaxis: { ticks: ticketyear, min: 2010, max: maxyear },   //指定固定的显示内容
                                 yaxis: { ticks: 10, min: 0 }    //在y轴方向显示6个刻度，此时显示内容由 flot 根据所给的数据自动判断
                  		   });
                      console.log(ticketyear);
                 }
          }
       });

	// === Point hover in chart === //
    var previousPoint = null;
    $(".chart").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                $('#tooltip').fadeOut(200,function(){
					$(this).remove();
				});
                var x = item.datapoint[0],
					y = item.datapoint[1].toFixed(2);
                maruti.flot_tooltip(item.pageX, item.pageY, x + "年" + item.series.label + "：" + y);//hover浮层显示内容
            }
        } else {
			$('#tooltip').fadeOut(200,function(){
					$(this).remove();
				});
            previousPoint = null;           
        }   
    });	
	
    // === Calendar === //    
    var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	
	$('.calendar').fullCalendar({
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		},
		editable: true,
		events: [
			{
				title: 'All day event',
				start: new Date(y, m, 1)
			},
			{
				title: 'Long event',
				start: new Date(y, m, 5),
				end: new Date(y, m, 8)
			},
			{
				id: 999,
				title: 'Repeating event',
				start: new Date(y, m, 2, 16, 0),
				end: new Date(y, m, 3, 18, 0),
				allDay: false
			},
			{
				id: 999,
				title: 'Repeating event',
				start: new Date(y, m, 9, 16, 0),
				end: new Date(y, m, 10, 18, 0),
				allDay: false
			},
			{
				title: 'Lunch',
				start: new Date(y, m, 14, 12, 0),
				end: new Date(y, m, 15, 14, 0),
				allDay: false
			},
			{
				title: 'Birthday PARTY',
				start: new Date(y, m, 18),
				end: new Date(y, m, 20),
				allDay: false
			},
			{
				title: 'Click for Google',
				start: new Date(y, m, 27),
				end: new Date(y, m, 29),
				url: 'http://www.google.com'
			}
		]
	});
});


maruti = {
		// === Peity charts === //
		peity: function(){		
			$.fn.peity.defaults.line = {
				strokeWidth: 1,
				delimeter: ",",
				height: 24,
				max: null,
				min: 0,
				width: 50
			};
			$.fn.peity.defaults.bar = {
				delimeter: ",",
				height: 24,
				max: null,
				min: 0,
				width: 50
			};
			$(".peity_line_good span").peity("line", {
				colour: "#57a532",
				strokeColour: "#459D1C"
			});
			$(".peity_line_bad span").peity("line", {
				colour: "#FFC4C7",
				strokeColour: "#BA1E20"
			});	
			$(".peity_line_neutral span").peity("line", {
				colour: "#CCCCCC",
				strokeColour: "#757575"
			});
			$(".peity_bar_good span").peity("bar", {
				colour: "#459D1C"
			});
			$(".peity_bar_bad span").peity("bar", {
				colour: "#BA1E20"
			});	
			$(".peity_bar_neutral span").peity("bar", {
				colour: "#4fb9f0"
			});
		},

		// === Tooltip for flot charts === //
		flot_tooltip: function(x, y, contents) {
			
			$('<div id="tooltip">' + contents + '</div>').css( {
				top: y + 5,
				left: x + 5
			}).appendTo("body").fadeIn(200);
		}
}
