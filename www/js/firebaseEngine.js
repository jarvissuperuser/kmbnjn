/**
 * =>>USAGE
 * @function setdata = place data in database
 *  @param path => /path/to/data
 *  @param key => unique data key
 *  @param value => value of key(can be JSON Object)
 * @function getdata = get data in database 
 *  @param callBack => function execute on completion on async opp
 * @function callBackList = data in database 
 *  @param s => snapshot
 *  @return fbOp.res => JSON || array of results
 * 
 * @example 
 * fbOp.init();     //run once
 * fbOp.signin(); //signs in anonymously
 * fbOp.getData(/path/to/users,fbOp.callBackList);  
 * // results example fbOp.res => [{name:"user1",data:{first:"Bafana",last:"Zulu",dob:"2017-03-07"}},
 *                                {name:"user2",data:{first:"Basetsana",last:"Zulu",dob:"2012-05-08"}}]
 * 
 * <script type="text/javascript" src="js/firebase.js"></script>
*/

var fbOp;
fbOp = {
    res: null,
    init: function () {
        // Initialize Firebase
        // Enable Anon Authentication and email auth
        var config = {
            apiKey: "AIzaSyDOYJ_VDrQH-2llTHvFPVYX1JLL8E-ucfk",
            authDomain: "siyakhomba-2017.firebaseapp.com",
            databaseURL: "https://siyakhomba-2017.firebaseio.com",
            projectId: "siyakhomba-2017",
            storageBucket: "siyakhomba-2017.appspot.com",
            messagingSenderId: "641722530457"
        };
        firebase.initializeApp(config);
    },
    signin: function(){
        var user = firebase.auth().currentUser;
        if (user){}
        else{
            firebase.auth().signInAnonymously().catch(function(ex){
                alert("exception :: " + ex.message);
            });
        }
    },
    setData: function (path, key, value) {
        var dbRec = firebase.database().ref(path);
        dbRec.child(key).set(value);
    },
    getData: function (path, callBack) {
        var getdb = firebase.database().ref(path);
        getdb.once('value').then(callBack);
    },
    callBackList: function (s) {
        fbOp.res = [];
        var cnt = 0;
        s.forEach(function (child) {
            var tmp = [];
            tmp['name'] = child.key;
            tmp['data'] = child.val();
            fbOp.res.push(tmp);
        });
    },
    callBackSingle: function (s) {
        fbOp.res = s.val();
    }
};