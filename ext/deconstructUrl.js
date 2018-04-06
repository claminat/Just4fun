//http://en.wikipedia.org/wiki/URI_scheme
/*
 foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose
 \_/   \_______________/ \_________/ \__/            \___/ \_/ \______________________/ \__/
 |           |               |       |                |    |            |                |
 |       userinfo         hostname  port              |    |          query          fragment
 |    \________________________________/\_____________|____|/ \__/         \__/
 |                    |                          |    |    |    |           |
 scheme              authority                    path   |    |    interpretable as keys
 name   \_______________________________________________|____|/       \____/     \_____/
 |                         |                          |    |          |           |
 |                 hierarchical part                  |    |    interpretable as values
 |                                                    |    |
 |            path               interpretable as filename |
 |   ___________|____________                              |
 / \ /                        \                             |
 urn:example:animal:ferret:nose               interpretable as extension

 scheme
 name  userinfo  hostname       query
 _|__   ___|__   ____|____   _____|_____
 /    \ /      \ /         \ /           \
 mailto:username@example.com?subject=Topic

 */

function deconstructURL(url) {
	//console.log("deconstructURL; URL = "+url)
	if (url == undefined || url == null) {
		//console.log("NO URL")
		return
	}
	//returns {filename, hostname...}

	///////////////////////////////////////////////////

	//remove /// and // and stuff before them

	var where = url.indexOf('///')
	if (where > -1 && where < 8) {//where < 8 guards against 7de1c4d4.amy.gs/url/http://news.yahoo.com/comics/top.jpg
		url = url.slice(where + 3)
	} else {
		where = url.indexOf('//')
		if (where > -1 && where < 8) {
			url = url.slice(where + 2)
		}
	}
	//console.log('url = ', url)

	///////////////////////////

	//hostname
	urlSplit = url.split("/")
	//console.log("urlSplit = ",urlSplit)
	var userPassHostPort = urlSplit[0]
	//console.log("userPassHostPort = ", userPassHostPort)
	var tempSplit = userPassHostPort.split("@")
	var hostnamePort = tempSplit[tempSplit.length - 1]
	//console.log("hostnamePort = ", hostnamePort)
	var tempSplit = hostnamePort.split(":")
	var hostname = tempSplit[0]
	if (hostname.indexOf("www.") == 0) {
		//remove www.
		hostname = hostname.slice(4)
	}
	//console.log("hostname = ", hostname)

	var filenameAndQuery = urlSplit[urlSplit.length - 1]
	if (filenameAndQuery.indexOf("?") > 0) {//has query
		var tempSplit = filenameAndQuery.split("?")
		var filename = tempSplit[0]
		var query = tempSplit[1]
	} else {
		var filename = filenameAndQuery
		var query = ""
	}

	//extension
	if (filename.indexOf(".") >= 0) {
		//has dot
		var tempSplit = filename.split(".")
		var fileExt = tempSplit[tempSplit.length - 1]
		var filename = filename.slice(0, filename.length - fileExt.length - 1)
	} else {
		//has no dot
		var fileExt = ""
		var filename = filename
	}

	if (urlSplit.length > 2) {//more than just host and filename

		//var firstDir = " " + urlSplit[3] + " "
		//var lastDir = " " + urlSplit[urlSplit.length-2] + " "
		var firstDir = urlSplit[1]
		var lastDir = urlSplit[urlSplit.length - 2]
		/*
		if (lastDir == firstDir) {
		lastDir = ""
		}
		*/
		//dirs = urlSplit[1] to urlSplit[urlSplit.length-2]
		var dirs = ""//"" or " "
		if (lastDir == "" || lastDir == firstDir) {
			dirs = firstDir
		} else {
			dirs = dirs + urlSplit[1]//1st part after hostname
			if (urlSplit.length > 2) {
				for (var i = 2; i <= urlSplit.length - 2; i++) {//last part just before filename
					dirs = dirs + " " + urlSplit[i]
				}
			}
		}
	} else {
		var dirs = "";
		var firstDir = "";
		var lastDir = ""
	}
	//console.log("dirs = ", dirs)

	return {
		hostname : hostname,
		dirs : dirs,
		firstDir : firstDir,
		lastDir : lastDir,
		filename : filename,
		fileExt : fileExt,
		query : query
	}

}

