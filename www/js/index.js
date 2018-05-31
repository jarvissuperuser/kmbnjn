// next is to do a jquery ajax call

var app = {
    db: null,
	geo: 0,
	gcode: {},
	ts: {},
	routeIdx: 0,
	ready: false,
	extern:"http://10.42.0.1/siyakhomba/",
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('deviceready',this.onDeviceReady,false);
    },
    // deviceready Event Handler111
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        db.init();
		document.addEventListener("online",app.ol,false);
		rb.ldg();
		//navigator.geolocation.getCurrentPosition(app.onSuccess,app.onError);
		if (navigator.geolocation){}
		else
			alert("no Nav");
//        app.receivedEvent('deviceready');
        
    },
    ol:function(){
    	if (navigator.connection.type === Connection.NONE)alert("not online");
    },
    onSuccess :function(pos){
    	console.log(pos);
		app.ready = true;	
    },

	onError: function(error){
		alert("err:" + error.message);
	},

    onBtnClick:function(){
        this.onDeviceReady();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
    ,
	outBound:function(submition,data){
		var data = {
			submit:submition,
			data:data
		};
		data.data["submit"] = data.submit;
		$.post(app.extern,data.data,function(resp){
			alert(resp);
		});
	}
};
var db = {
	createDB: function () {
		app.db.transaction(function (tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS routePairs (" +
							"idx integer  not null," +
							"point1 varchar(50)," +
							"point2 varchar(50)," +
							"description varchar(200)," +
							"primary key(idx))");
			tx.executeSql("CREATE TABLE IF NOT EXISTS points(" +
							"idx integer," +
							"lng varchar(10)," +
							"lat varchar(10)," +
							"route integer," +
							"type varchar(2)," +
							"primary key(idx))");
			tx.executeSql("CREATE TABLE IF NOT EXISTS dest(" +
							"idx integer not null," +
							"lng varchar(10)," +
							"lat varchar(10)," +
							"route integer," +
							"description varchar(100)," +
							"primary key(idx))");
		}, function (err) {
			alert(err);
		});
	},
	init:function(){

		try
		{
            app.db = openDatabase("loc", "1.0", "loc_db", 2000000);
			app.geo = navigator.geolocation.watchPosition(app.onSuccess,
							app.onError, {timeout: 7000, enableHighAccuracy: true});
			db.createDB();
			$('#pnt_1').attr("placeholder", "Starting Point");
			$('#pnt_2').attr("placeholder", "Ending Point");
			rb.routeLoader();
		} catch (ex)
		{
			alert(ex.message);
		}
	}
};

var rb = {
	stt: function () {
		if ($("#pnt_1").val().length > 0 && $("#pnt_2").val().length > 0 && app.ready) {
			var query = "INSERT INTO routePairs (point1,point2) VALUES ('" +
							$("#pnt_1").val() + "','" + $("#pnt_2").val() + "') ;";
			app.db.transaction(function (tx) {
				tx.executeSql("select * from routePairs where point1 = '" + $("#pnt_1").val() +
								"' and point2 = '" + $("#pnt_2").val() + "'", [], function (tx, rx) {
					//alert(JSON.stringify(rx.rows.item(0)));
					document.querySelector("#begin").innerText = $("#pnt_1").val() + " to "
									+ $("#pnt_2").val();
					if (rx.rows.length === 0) {
						tx.executeSql(query, [], null, function (err) {
							alert(JSON.stringify(err));
						});
						tx.executeSql("select * from routePairs where point1 = '" + $("#pnt_1").val() +
										"' and point2 = '" + $("#pnt_2").val() + "'", [], function (tx, rx) {
							app.routeIdx = rx.rows.item(0).idx;
							$.mobile.changePage("#routebuild");
						}, function (err) {
							alert(JSON.stringify(err));
						});
					} else {
						app.routeIdx = rx.rows.item(0).idx;
						$.mobile.changePage("#routebuild");
						console.log("what");
					}
				});
			});
		} else {

			if ($("#pnt_1").val().length === 0) {
				$("#pp").popup("open");
				setTimeout(function () {
					$("#pp").popup("close");
					setTimeout(function () {
						$("#pnt_1").focus();
					}, 100);
				}, 1000);

			} else if ($("#pnt_2").val().length === 0) {
				$("#pp").popup("open");
				setTimeout(function () {
					$("#pp").popup("close");
					setTimeout(function () {
						$("#pnt_2").focus();
					}, 100);
				}, 1000);
			} else if (!app.ready) {
				$.mobile.loading("show", {
					text: "GPS: warming up",
					textVisible: true
				});
				var si = setInterval(function () {
					if (app.ready) {
						clearInterval(si);
						$.mobile.loading('hide');
						go(null,"#routebuild");
						document.querySelector("#begin").innerText = $("#pnt_1").val()
										+ " to "
										+ $("#pnt_2").val();
					}else{
						app.onDeviceReady();
					}
				}, 1000);
			}
		}
	},
	rec: function () {
		if (app.routeIdx !== 0)
			app.db.transaction(function (tx) {
				tx.executeSql("INSERT INTO points(lng,lat,ROUTE)" +
								" VALUES ('" + app.gcode.longitude + "','" + app.gcode.latitude
								+ "','" + app.routeIdx + "')");

			}, function (er) {
				alert(JSON.stringify(er) + er.message);
			});
	},
	importRoute:function(routeIdx){
		var data ={data:{submit:"get_route"}};
		data.data["route_index"] = routeIdx; 
		$.post(app.extern,data.data,function(resp){
			try{
				var inbound = JSON.parse(resp);
				if (inbound.index !== undefined){
					
				}
			}catch(ex){}
		});
	},
	ldg: function () {
		navigator.geolocation.clearWatch(app.geo);
		app.geo = navigator.geolocation.watchPosition(app.onSuccess,
						app.onError, {timeout: 15000,
							enableHighAccuracy: false});
	},
	qryf: function () {
		var q = $("#query").val();

		app.db.transaction(function (tx) {
			tx.executeSql(q, [], function (tx, rx) {
				var rs = [];
				alert(q);
				for (var a = 0; a < rx.rows.length; a++) {
					rs.push(rx.rows.item(a));
				}
				$("#result").val(JSON.stringify(rs));
			}, function (er) {
				$('#result').val("err" + JSON.stringify(er) + er);
			});
		});
	},
	texport: function () {
		var a = app.routeIdx;
		$("#result").val("route index:" + a);
		var qry = "SELECT * FROM routePairs WHERE idx=" + a;
		var qp = "SELECT lng,lat FROM points WHERE route =" + a;
		var dataj = [];
		var dataf = {data: null, route: null};
		app.db.transaction(function (tx) {
			tx.executeSql(qry, [], function (tx, rx) {
				//alert(rx.rows.length);
				dataf.route = rx.rows.item(0).point1 + "_to_"
								+ rx.rows.item(0).point2;
				tx.executeSql(qp, [], function (tx, rx) {
					//
					if (rx.rows.length > 0) {

						for (var bxc = 0; bxc < rx.rows.length; bxc++) {
							dataj.push(rx.rows.item(bxc));
						}
					}
					dataf.data = dataj;
					window.location = ("whatsapp://send?text=" + JSON.stringify(dataf));
				});

			});
		});
	},
	rexp: function (a) {
		$("#result").val("route index:" + a);
		var qry = "SELECT * FROM routePairs WHERE idx=" + a;
		var qp = "SELECT lng,lat FROM points WHERE route =" + a;
		var dataj = [];
		var dataf = {data: null, route: null};
		app.db.transaction(function (tx) {
			tx.executeSql(qry, [], function (tx, rx) {
				//alert(rx.rows.length);
				dataf.route = rx.rows.item(0).point1 + "_to_"
								+ rx.rows.item(0).point2;
				tx.executeSql(qp, [], function (tx, rx) {
					//
					if (rx.rows.length > 0) {

						for (var bxc = 0; bxc < rx.rows.length; bxc++) {
							dataj.push(rx.rows.item(bxc));
						}
					}
					dataf.data = dataj;
					window.location = ("whatsapp://send?text=" + JSON.stringify(dataf));
				});

			});
		});

	},
	routeLoader: function () {

		var qry = "SELECT * FROM routePairs ORDER BY  point1 desc, point2 desc";
		app.db.transaction(function (tx) {
			tx.executeSql(qry, [], function (tx, rx) {
				$("#routes").empty();
				if (rx.rows.length > 0) {
					for (var a = 0; a < rx.rows.length; a++) {
						var btn = "<button class='ui-btn' onclick='rb.rexp(" + rx.rows.item(a).idx + ")'>" +
										rx.rows.item(a).point1 + "_" + rx.rows.item(a).point2 + " </button>";
						$("#routes").append(btn);
					}
				} else {

				}
			});
		});
	}
};