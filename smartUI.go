// Copyright 2010 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"html/template"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"regexp"
	"log"
	"database/sql"
    _ "github.com/go-sql-driver/mysql"
)


type ScpInfo struct {
	Scope string
	DeviceClass string
	Vendor string
	Total int
	Used int
	Avail int
	Unavail int
	Deactivated int
	Offered int
	TotalDynamic int
	TotalReserved int
}


type AllInfo struct {
	Mode string
	//web send the json named DhcpStauts
	DhcpStatus []ScpInfo
}


func smartUiHandler(w http.ResponseWriter, r *http.Request, title string) {
	log.Println("come to " + title+".html")
	err := sr_tmplt.ExecuteTemplate(w, title+".html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func applyHandler(w http.ResponseWriter, r *http.Request, title string) {
	log.Println("come to " + title+".html")
    rcvd, _:= ioutil.ReadAll(r.Body)  
    r.Body.Close()  
    fmt.Printf("%s\n", rcvd)
    // b := []byte(`{"Mode":"BALANCED","Policy":[
    // 	{"Scope": "80.6.6.32 255.255.255.224", "DeviceClass": "stb", "Vendor": "arris"},
    // 	{"Scope": "80.6.6.64 255.255.255.224", "DeviceClass": "host", "Vendor": "cisco"},
    // 	{"Scope": "80.6.6.96 255.255.255.224", "DeviceClass": "cm", "Vendor": "sa"}
    // 	]}`)

    var cfg AllInfo
    err := json.Unmarshal(rcvd, &cfg)
	fmt.Printf("%s\n", cfg)

	if err != nil {
		log.Println(err.Error())
		return
	}

	db, err := sql.Open("mysql", "root:cisco123!@/testdb")

	if err != nil {
		panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}
	defer db.Close()

	// Open doesn't open a connection. Validate DSN data:
	err = db.Ping()
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	
	result, err := db.Exec("update DhcpMethod set method=?" , cfg.Mode)
	if err != nil {
		panic(err.Error()) 
	}
	log.Println(result)

	for _, scpItr := range cfg.DhcpStatus {
		result, err := db.Exec("update DhcpScopes set cfg_deviceclass=?, cfg_vendor=? where scope=?",
			scpItr.DeviceClass, scpItr.Vendor, scpItr.Scope)
		if err != nil {
			panic(err.Error()) 
		}

		log.Println(result)
	}

	// p := &Page{Title: title, Body: result}
	// err := p.save()
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// } else {

	// }

}

func updateHandler(w http.ResponseWriter, r *http.Request, title string) {
	log.Println("come to " + title+".html")

	db, err := sql.Open("mysql", "root:cisco123!@/testdb")

	if err != nil {
	panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}
	defer db.Close()

	// Open doesn't open a connection. Validate DSN data:
	err = db.Ping()
	if err != nil {
	panic(err.Error()) // proper error handling instead of panic in your app
	}


	var resSlice  AllInfo
 	
 	var method string
    err1 := db.QueryRow("SELECT * from DhcpMethod").Scan(&method)
    if err1!= nil {
        return 
    }
    resSlice.Mode = method
    fmt.Printf("%s\n", resSlice.Mode)

	rows, err := db.Query("select * from DhcpScopes")
	if err != nil {
	    log.Fatal(err)
	}

	for rows.Next() {
	    var name, dc, vdr string
	    var total, used, ava, unava, deactive, offer, dyn, rsrvd int
	    if err := rows.Scan(&name, &total, &used, &ava, &unava, &deactive, &offer, &dyn, &rsrvd, &dc, &vdr); err != nil {
	        log.Fatal(err)
	    }
	    fmt.Printf("%s %s %s %d %d %d %d %d %d %d %d\n", name, dc, vdr, total, used, ava, unava, deactive, offer, dyn, rsrvd)
	    scp := ScpInfo{name, dc, vdr, total, used, ava, unava, deactive, offer, dyn, rsrvd}
	    resSlice.DhcpStatus = append(resSlice.DhcpStatus, scp)
	}
	if err := rows.Err(); err != nil {
	    log.Fatal(err)
	}
	js_Scp, err := json.Marshal(resSlice)
	// log.Println(js_Scp)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    // fmt.Fprintf(w, string(response))
    // json.NewEncoder(w).Encode(response)
    // io.WriteString(w, string(response))
    w.Write(js_Scp)

}


var sr_tmplt = template.Must(template.ParseFiles("index.html"))


var validPath = regexp.MustCompile("^/(edit|save|view|smartui)/([a-zA-Z0-9]+)$")

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			log.Println("failed to validPath")
			http.NotFound(w, r)
			return
		}
		fn(w, r, m[2])
	}
}


func main() {
	http.HandleFunc("/smartui/index", makeHandler(smartUiHandler))
	http.HandleFunc("/smartui/apply", makeHandler(applyHandler))
	http.HandleFunc("/smartui/update", makeHandler(updateHandler))
	http.Handle("/smartui/public/", http.StripPrefix("/smartui/public/", http.FileServer(http.Dir("public"))))
	
	http.ListenAndServe(":8090", nil)
}
