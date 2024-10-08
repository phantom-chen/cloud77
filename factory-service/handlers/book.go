package handlers

import (
	"factory/models"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func getBooks() []models.Book {
	book1 := models.Book{Id: "001", Name: "Golang Tutorial", Price: 10.0}
	book2 := models.Book{Id: "002", Name: "Nodejs Reference", Price: 20.0}
	books := []models.Book{book1, book2}

	return books
}

func BooksHandler(c *gin.Context) {
	fmt.Println("books controller")

	fmt.Println(c.Request.URL.RawQuery)
	fmt.Println(c.Request.URL)

	price := c.DefaultQuery("price", "100")
	fmt.Println(price)

	name := c.DefaultQuery("name", "unknown")
	fmt.Println(name)

	c.Writer.Header().Set("X-Response-Custom", time.Now().Format("2006-01-02 11:11:11"))
	c.Writer.Header().Set("foo", "bar")

	books := getBooks()
	c.JSON(200, books)
}

func BookHandler(c *gin.Context) {
	fmt.Println("book handler")
	fmt.Println(c.Request.URL.Path)
	fmt.Println(c.Request.Method)
	fmt.Println(c.Request.URL.RawPath)
	fmt.Println(c.Request.URL.RawQuery)

	id := c.Param("id")
	fmt.Printf("book id is %s\n", id)
	// response header
	c.Writer.Header().Set("X-Response-Custom", time.Now().Format("2006-01-02 11:11:11"))
	c.Writer.Header().Set("foo", "bar")

	// response body
	c.JSON(200, gin.H{
		"id":     "001",
		"name":   "golang tutorial",
		"price":  999,
		"rating": 4.5,
		"stars":  9999,
	})
}

// func bookHandler1(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.Header().Set("foo", "bar1")
// 	w.Header().Add("foo", "bar2")

// 	w.WriteHeader(200)

// 	a := strings.SplitN(r.URL.Path, "/", 3)
// 	fmt.Println(len(a))
// 	for _, v := range a {
// 		fmt.Println(v)
// 	}
// 	fmt.Println(a)

// 	book_id := a[2]
// 	fmt.Println(book_id)
// 	io.WriteString(w, time.Now().Format("2006-01-02 11:11:11"))
// }

// func booksHandler(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.Header().Set("foo", "bar1")
// 	w.WriteHeader(200)

// 	ids, ok := r.URL.Query()["id"]
// 	if ok {
// 		fmt.Printf("book id is %s\n", ids[0])
// 	}

// 	books := getBooks()
// 	d, err := json.Marshal(&books)
// 	if err != nil {
// 		fmt.Println(err.Error())
// 	}

// 	if r.Method == "POST" {
// 		bd, err := ioutil.ReadAll(r.Body)
// 		if err != nil {
// 			log.Fatal(err)
// 		} else {
// 			fmt.Println(string(bd))
// 		}
// 		w.Write(d)
// 	} else {
// 		fmt.Fprintf(w, `{"book1":"hello"}`)
// 		w.Write(d)
// 	}
// }
