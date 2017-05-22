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

type Page struct {
	Title string
	Body  []byte
}


type CnrStatusSlice struct {
	DhcpStatus []CnrStatus
}

type CnrStatus struct {
	Scope string
	Total int
	Used int
	DeviceClass string
	Vendor string
}


func (p *Page) save() error {
	filename := p.Title + ".txt"
	return ioutil.WriteFile(filename, p.Body, 0600)
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		http.Redirect(w, r, "/edit/"+title, http.StatusFound)
		return
	}
	renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	renderTemplate(w, "edit", p)
}

func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	body := r.FormValue("body")
	p := &Page{Title: title, Body: []byte(body)}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, r, "/view/"+title, http.StatusFound)
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
    result, _:= ioutil.ReadAll(r.Body)  
    r.Body.Close()  
    fmt.Printf("%s\n", result)
	p := &Page{Title: title, Body: result}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else {

	}

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

	rows, err := db.Query("select * from DhcpScopes")
	if err != nil {
	    log.Fatal(err)
	}

	var resSlice  CnrStatusSlice
	for rows.Next() {
	    var name, dc, vdr string
	    var total, used, ava int
	    if err := rows.Scan(&name, &total, &used, &ava, &dc, &vdr); err != nil {
	        log.Fatal(err)
	    }
	    fmt.Printf("%s %s %s %d %d\n", name, dc, vdr, total, used)
	    scp := CnrStatus{name, total, used, dc, vdr}
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

var templates = template.Must(template.ParseFiles("edit.html", "view.html"))
var sr_tmplt = template.Must(template.ParseFiles("index.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

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
	// http.HandleFunc("/view/", makeHandler(viewHandler))
	// http.HandleFunc("/edit/", makeHandler(editHandler))
	// http.HandleFunc("/save/", makeHandler(saveHandler))

	http.HandleFunc("/smartui/index", makeHandler(smartUiHandler))
	http.HandleFunc("/smartui/apply", makeHandler(applyHandler))
	http.HandleFunc("/smartui/update", makeHandler(updateHandler))
	http.Handle("/smartui/public/", http.StripPrefix("/smartui/public/", http.FileServer(http.Dir("public"))))
	
	http.ListenAndServe(":8090", nil)
}
